import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  X,
  Cloud,
  Upload,
  Download,
  Trash2,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  LogOut,
  FolderOpen,
  Calendar,
} from 'lucide-react';
import { BillState, CalculationResult, ThemeConfig } from '../types';
import { formatCurrencyByCode } from '../utils/currency';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
} from '../utils/firebaseAuth';
import {
  saveBillToGoogleDrive,
  listDriveBills,
  loadBillFromGoogleDrive,
  deleteBillFromGoogleDrive,
  DriveBillFile,
} from '../utils/googleDrive';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  currentBill: BillState;
  calculationResult: CalculationResult;
  onLoadBill: (loadedBill: BillState) => void;
  onShowToast: (msg: string) => void;
}

export const GoogleDriveModal: React.FC<Props> = ({
  isOpen,
  onClose,
  theme,
  currentBill,
  calculationResult,
  onLoadBill,
  onShowToast,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [savedFiles, setSavedFiles] = useState<DriveBillFile[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Destructive delete confirmation modal state
  const [fileToDelete, setFileToDelete] = useState<DriveBillFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
        setErrorMsg(null);
      },
      () => {
        setCurrentUser(null);
        setSavedFiles([]);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch list of files from Drive
  const fetchDriveFiles = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) return;

    setIsLoadingList(true);
    setErrorMsg(null);
    try {
      const files = await listDriveBills();
      setSavedFiles(files);
    } catch (err: any) {
      console.error('Error fetching drive bills:', err);
      setErrorMsg(err.message || 'Failed to fetch files from Google Drive.');
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  // When modal opens and user is logged in, refresh files
  useEffect(() => {
    if (isOpen && currentUser) {
      fetchDriveFiles();
    }
  }, [isOpen, currentUser, fetchDriveFiles]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        onShowToast(`Connected to Google Drive as ${result.user.displayName || result.user.email}`);
        await fetchDriveFiles();
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setErrorMsg(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setSavedFiles([]);
      onShowToast('Signed out of Google Drive');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign out.');
    }
  };

  const handleSaveCurrentBill = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const uploadResult = await saveBillToGoogleDrive(currentBill, calculationResult);
      setSuccessMsg(`Successfully saved "${currentBill.title}" to Google Drive folder!`);
      onShowToast(`Saved "${currentBill.title}" to Google Drive!`);
      await fetchDriveFiles();
    } catch (err: any) {
      console.error('Drive save error:', err);
      setErrorMsg(err.message || 'Failed to save bill to Google Drive.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadFile = async (file: DriveBillFile) => {
    setErrorMsg(null);
    try {
      const loaded = await loadBillFromGoogleDrive(file.id);
      onLoadBill(loaded);
      onShowToast(`Loaded "${loaded.title || file.title}" from Google Drive!`);
      onClose();
    } catch (err: any) {
      console.error('Load error:', err);
      setErrorMsg(err.message || 'Could not load bill from Google Drive.');
    }
  };

  // User confirmed destructive deletion
  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);
    setErrorMsg(null);
    try {
      await deleteBillFromGoogleDrive(fileToDelete.id);
      setSavedFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      onShowToast(`Deleted "${fileToDelete.title || fileToDelete.name}" from Google Drive.`);
      setFileToDelete(null);
    } catch (err: any) {
      console.error('Delete error:', err);
      setErrorMsg(err.message || 'Failed to delete file from Google Drive.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center p-2 border border-amber-500/20 shadow-sm">
              <svg className="w-6 h-6" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44C.4 49.9 0 51.45 0 53h27.5z" fill="#00ac47"/>
                <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15z" fill="#ea4335"/>
                <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.95 0H34.35c-1.55 0-3.1.4-4.45 1.2z" fill="#00832d"/>
                <path d="m59.8 53-16.15-28H16.15l13.75 23.8 2.3 4.2h27.6z" fill="#2684fc"/>
                <path d="M73.4 26.5 60.7 4.5c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28h27.5c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                <span>Google Drive Backup</span>
                {currentUser && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    Connected
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Save bills, sync receipts &amp; reload anytime from Google Drive
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Notification Banners */}
          {errorMsg && (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <div className="flex-1 font-medium">{errorMsg}</div>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="text-rose-500 hover:text-rose-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
              <div className="flex-1 font-medium">{successMsg}</div>
              <button
                type="button"
                onClick={() => setSuccessMsg(null)}
                className="text-emerald-500 hover:text-emerald-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* User Auth Section */}
          {!currentUser ? (
            <div className="p-6 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                <Cloud className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Connect your Google Account
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-5">
                Sign in to save this friendship bill to your Google Drive in a dedicated{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  "TableTally Bills"
                </span>{' '}
                folder and access your history anywhere.
              </p>

              {/* Official Google Sign-In Material Button */}
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isAuthenticating}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 border border-slate-300 dark:border-slate-600 hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-750 font-semibold text-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                )}
                <span>{isAuthenticating ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Connected User Card */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Google User'}
                      className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-600 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{currentUser.displayName || 'Google User'}</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {currentUser.email}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sign out</span>
                </button>
              </div>

              {/* Action: Save Current Bill to Drive */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">📝</span>
                    <h5 className="font-black text-sm text-slate-800 dark:text-slate-100">
                      Current Bill: {currentBill.title}
                    </h5>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Total:{' '}
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {formatCurrencyByCode(calculationResult.grandTotal, currentBill.currencyCode)}
                    </span>{' '}
                    • {currentBill.members.length} friends
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveCurrentBill}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{isSaving ? 'Uploading to Drive...' : 'Save to Google Drive'}</span>
                </button>
              </div>

              {/* Saved Bills List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <FolderOpen className="w-4 h-4 text-amber-500" />
                    <span>Saved in Google Drive</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                      {savedFiles.length}
                    </span>
                  </h5>
                  <button
                    type="button"
                    onClick={fetchDriveFiles}
                    disabled={isLoadingList}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingList ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                {isLoadingList ? (
                  <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
                    <span className="text-xs">Searching your Google Drive...</span>
                  </div>
                ) : savedFiles.length === 0 ? (
                  <div className="py-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                    No saved bills found in Google Drive yet. Click "Save to Google Drive" above to create your first backup!
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {savedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 hover:border-amber-500/40 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="truncate">{file.title || file.name}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            {file.grandTotal !== undefined && (
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {formatCurrencyByCode(file.grandTotal, file.currencyCode || 'USD')}
                              </span>
                            )}
                            {file.membersCount !== undefined && (
                              <span className="flex items-center gap-0.5">
                                <Users className="w-3 h-3" /> {file.membersCount}
                              </span>
                            )}
                            <span className="flex items-center gap-0.5">
                              <Calendar className="w-3 h-3" />{' '}
                              {new Date(file.modifiedTime).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              title="Open in Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleLoadFile(file)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold text-xs transition-colors cursor-pointer"
                            title="Load bill into calculator"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Load</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setFileToDelete(file)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                            title="Delete file from Google Drive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Encrypted &amp; securely stored on your private Drive
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 font-semibold cursor-pointer text-slate-700 dark:text-slate-300"
          >
            Done
          </button>
        </div>
      </div>

      {/* MANDATORY User Confirmation Dialog for Destructive Operations */}
      {fileToDelete && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 animate-fadeIn"
          onClick={() => setFileToDelete(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 p-6 shadow-2xl text-slate-900 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100">
              Delete file from Google Drive?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Are you sure you want to permanently delete{' '}
              <span className="font-bold text-slate-700 dark:text-slate-200">
                "{fileToDelete.title || fileToDelete.name}"
              </span>{' '}
              from your Google Drive? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
