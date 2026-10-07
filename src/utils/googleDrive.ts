import { BillState, CalculationResult } from '../types';
import { getAccessToken } from './firebaseAuth';
import { formatCurrencyByCode } from './currency';

export interface DriveBillFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  modifiedTime: string;
  size?: string;
  webViewLink?: string;
  title?: string;
  grandTotal?: number;
  currencyCode?: string;
  membersCount?: number;
}

const FOLDER_NAME = 'TableTally Bills';

/**
 * Helper to ensure a dedicated folder exists in user's Google Drive
 */
export async function getOrCreateFolder(): Promise<string> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive. Please sign in first.');

  // Check if folder exists
  const query = encodeURIComponent(`name = '${FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!searchRes.ok) {
    const errData = await searchRes.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Failed to search Google Drive folders (${searchRes.status})`);
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Saved Friendship Bills and Receipts from TableTally',
    }),
  });

  if (!createRes.ok) {
    const errData = await createRes.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Failed to create folder in Google Drive (${createRes.status})`);
  }

  const newFolder = await createRes.json();
  return newFolder.id;
}

/**
 * Generate formatted text receipt suitable for Google Drive storage
 */
export function generateDriveReceiptText(billState: BillState, result: CalculationResult): string {
  const dateStr = new Date().toLocaleString();
  const curr = billState.currencyCode || 'USD';

  let txt = `========================================\n`;
  txt += `       TABLETALLY BILL BREAKDOWN        \n`;
  txt += `========================================\n\n`;
  txt += `Dinner / Event: ${billState.title}\n`;
  txt += `Date: ${dateStr}\n`;
  txt += `Total Friends: ${billState.members.length}\n`;
  txt += `Grand Total: ${formatCurrencyByCode(result.grandTotal, curr)}\n\n`;
  txt += `----------------------------------------\n`;
  txt += `COST BREAKDOWN:\n`;
  txt += `----------------------------------------\n`;
  txt += `• Subtotal: ${formatCurrencyByCode(result.subtotal, curr)}\n`;
  if (result.taxAmount > 0) {
    txt += `• Tax: ${formatCurrencyByCode(result.taxAmount, curr)} (${result.effectiveTaxRate.toFixed(1)}%)\n`;
  }
  if (result.totalTipAmount > 0) {
    txt += `• Tip / Gratuity: ${formatCurrencyByCode(result.totalTipAmount, curr)}\n`;
  }
  txt += `• Final Total: ${formatCurrencyByCode(result.grandTotal, curr)}\n\n`;

  txt += `----------------------------------------\n`;
  txt += `PER PERSON SHARE:\n`;
  txt += `----------------------------------------\n`;
  result.memberBreakdowns.forEach((mb) => {
    txt += `👤 ${mb.member.name}: ${formatCurrencyByCode(mb.finalTotal, curr)}\n`;
    if (mb.assignedItems && mb.assignedItems.length > 0) {
      mb.assignedItems.forEach((it) => {
        txt += `   - ${it.name}: ${formatCurrencyByCode(it.sharePrice, curr)}\n`;
      });
    }
    if (mb.taxShare > 0) {
      txt += `   - Tax: ${formatCurrencyByCode(mb.taxShare, curr)}\n`;
    }
    if (mb.tipShare > 0) {
      txt += `   - Tip: ${formatCurrencyByCode(mb.tipShare, curr)}\n`;
    }
  });

  if (result.settlements && result.settlements.length > 0) {
    txt += `\n----------------------------------------\n`;
    txt += `SETTLEMENT TRANSFERS:\n`;
    txt += `----------------------------------------\n`;
    result.settlements.forEach((s) => {
      txt += `💸 ${s.fromMemberName} pays ${s.toMemberName}: ${formatCurrencyByCode(s.amount, curr)}\n`;
    });
  }

  txt += `\n========================================\n`;
  txt += `Saved with TableTally Bill Splitter\n`;
  txt += `========================================\n`;
  return txt;
}

/**
 * Save current bill state & receipt to Google Drive
 */
export async function saveBillToGoogleDrive(
  billState: BillState,
  result: CalculationResult
): Promise<{ jsonFileId: string; receiptFileId: string; webViewLink?: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive. Please sign in first.');

  const folderId = await getOrCreateFolder();
  const safeTitle = billState.title.trim().replace(/[^a-zA-Z0-9_\- ]/g, '_') || 'Dinner_Bill';
  const timestamp = new Date().toISOString().slice(0, 10);
  const boundary = '-------TableTallyDriveUploadBoundary' + Math.random().toString(36).substring(2);

  // 1. Upload JSON backup data
  const jsonMetadata = {
    name: `TableTally_${safeTitle}_${timestamp}.json`,
    mimeType: 'application/json',
    parents: [folderId],
    description: `TableTally Backup: ${billState.title}`,
    properties: {
      app: 'TableTally',
      billTitle: billState.title,
      grandTotal: result.grandTotal.toString(),
      currencyCode: billState.currencyCode,
      membersCount: billState.members.length.toString(),
      timestamp: Date.now().toString(),
    },
  };

  const payload = JSON.stringify({
    version: 1,
    savedAt: new Date().toISOString(),
    billState,
    summary: {
      grandTotal: result.grandTotal,
      currencyCode: billState.currencyCode,
      subtotal: result.subtotal,
      taxAmount: result.taxAmount,
      totalTipAmount: result.totalTipAmount,
    },
  }, null, 2);

  const multipartBody =
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(jsonMetadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: application/json\r\n\r\n` +
    `${payload}\r\n` +
    `--${boundary}--`;

  const jsonUploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
    }
  );

  if (!jsonUploadRes.ok) {
    const err = await jsonUploadRes.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to save bill to Google Drive (${jsonUploadRes.status})`);
  }

  const jsonUploadedData = await jsonUploadRes.json();

  // 2. Also save readable text receipt
  const receiptTxt = generateDriveReceiptText(billState, result);
  const receiptMetadata = {
    name: `Receipt_${safeTitle}_${timestamp}.txt`,
    mimeType: 'text/plain',
    parents: [folderId],
    description: `Readable receipt for ${billState.title}`,
  };

  const boundaryTxt = '-------TableTallyTxtBoundary' + Math.random().toString(36).substring(2);
  const multipartTxtBody =
    `--${boundaryTxt}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(receiptMetadata)}\r\n` +
    `--${boundaryTxt}\r\n` +
    `Content-Type: text/plain; charset=UTF-8\r\n\r\n` +
    `${receiptTxt}\r\n` +
    `--${boundaryTxt}--`;

  const txtUploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundaryTxt}`,
      },
      body: multipartTxtBody,
    }
  );

  let receiptFileId = '';
  if (txtUploadRes.ok) {
    const txtData = await txtUploadRes.json();
    receiptFileId = txtData.id;
  }

  return {
    jsonFileId: jsonUploadedData.id,
    receiptFileId,
    webViewLink: jsonUploadedData.webViewLink,
  };
}

/**
 * List saved TableTally bills from Google Drive
 */
export async function listDriveBills(): Promise<DriveBillFile[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive. Please sign in first.');

  const query = encodeURIComponent(`name contains 'TableTally_' and mimeType = 'application/json' and trashed = false`);
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&orderBy=modifiedTime desc&pageSize=30&fields=files(id,name,mimeType,createdTime,modifiedTime,size,webViewLink,properties)`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to fetch bills from Google Drive (${res.status})`);
  }

  const data = await res.json();
  const files: DriveBillFile[] = (data.files || []).map((f: any) => ({
    id: f.id,
    name: f.name,
    mimeType: f.mimeType,
    createdTime: f.createdTime,
    modifiedTime: f.modifiedTime,
    size: f.size,
    webViewLink: f.webViewLink,
    title: f.properties?.billTitle || f.name.replace(/^TableTally_/, '').replace(/\.json$/, '').replace(/_/g, ' '),
    grandTotal: f.properties?.grandTotal ? parseFloat(f.properties.grandTotal) : undefined,
    currencyCode: f.properties?.currencyCode || 'USD',
    membersCount: f.properties?.membersCount ? parseInt(f.properties.membersCount, 10) : undefined,
  }));

  return files;
}

/**
 * Load bill data from Google Drive file
 */
export async function loadBillFromGoogleDrive(fileId: string): Promise<BillState> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive. Please sign in first.');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to load bill file from Google Drive (${res.status})`);
  }

  const data = await res.json();
  if (data.billState) {
    return data.billState;
  }
  // If the file itself is a raw BillState
  if (data.title && (data.members || data.totalBillAmount !== undefined)) {
    return data as BillState;
  }
  throw new Error('Invalid bill format found in the selected Google Drive file.');
}

/**
 * Delete a file from Google Drive.
 * WARNING: The caller MUST always display a user confirmation dialog before calling this!
 */
export async function deleteBillFromGoogleDrive(fileId: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive. Please sign in first.');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to delete file from Google Drive (${res.status})`);
  }
}
