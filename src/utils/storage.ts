import {
  BillState,
  DinnerHistoryItem,
  ThemeMode,
  ThemeColor,
  AnimationSettings,
} from '../types';
import { DEFAULT_CURRENCY } from './currency';

const STORAGE_KEY_BILL = 'table_tally_active_bill';
const STORAGE_KEY_THEME_MODE = 'table_tally_theme_mode';
const STORAGE_KEY_THEME_COLOR = 'table_tally_theme_color';
const STORAGE_KEY_HISTORY = 'table_tally_history';
const STORAGE_KEY_ANIMATION = 'table_tally_animation';

export const DEFAULT_BILL_STATE: BillState = {
  title: 'Friendship Dinner',
  currencyCode: DEFAULT_CURRENCY, // Default to INR ₹
  totalBillAmount: 1800, // ₹1,800 dinner bill default
  billCalculationMode: 'direct_total',
  taxMode: 'none',
  taxPercent: 5.0, // Standard 5% GST in India
  taxFixedAmount: 90,
  groupTipPercent: 10,
  tipIncludedInTotal: false,
  roundingMode: 'none',
  payerMemberId: 'm1',
  members: [
    { id: 'm1', name: 'Aarav', avatarColor: '#F59E0B', useCustomTip: false },
    { id: 'm2', name: 'Diya', avatarColor: '#10B981', useCustomTip: false },
    { id: 'm3', name: 'Rohan', avatarColor: '#6366F1', useCustomTip: false },
    { id: 'm4', name: 'Ananya', avatarColor: '#EC4899', useCustomTip: false },
  ],
  items: [
    {
      id: 'i1',
      name: 'Paneer Tikka & Naan',
      price: 650,
      quantity: 1,
      assignedMemberIds: [],
      category: 'main',
    },
    {
      id: 'i2',
      name: 'Masala Dosa & Starters',
      price: 450,
      quantity: 1,
      assignedMemberIds: [],
      category: 'appetizer',
    },
    {
      id: 'i3',
      name: 'Special Chai & Drinks',
      price: 320,
      quantity: 1,
      assignedMemberIds: [],
      category: 'drink',
    },
    {
      id: 'i4',
      name: 'Gulab Jamun & Desserts',
      price: 380,
      quantity: 1,
      assignedMemberIds: [],
      category: 'dessert',
    },
  ],
  createdAt: Date.now(),
};

export const DEFAULT_ANIMATION_SETTINGS: AnimationSettings = {
  enabled: true,
  style: 'doodles', // Beautiful doodles enabled by default!
  density: 'medium',
  speed: 'normal',
};

// URL Compression / Serialization
export function encodeBillToUrl(state: BillState): string {
  try {
    const compact = {
      t: state.title,
      cur: state.currencyCode,
      b: state.totalBillAmount,
      cm: state.billCalculationMode,
      tm: state.taxMode,
      tp: state.taxPercent,
      tfa: state.taxFixedAmount,
      gtp: state.groupTipPercent,
      tit: state.tipIncludedInTotal ? 1 : 0,
      rm: state.roundingMode,
      pId: state.payerMemberId,
      m: state.members.map((m) => ({
        i: m.id,
        n: m.name,
        c: m.avatarColor,
        u: m.useCustomTip ? 1 : 0,
        tp: m.customTipPercent,
      })),
      it: state.items.map((i) => ({
        i: i.id,
        n: i.name,
        p: i.price,
        q: i.quantity,
        a: i.assignedMemberIds,
        c: i.category,
      })),
    };
    const jsonStr = JSON.stringify(compact);
    const b64 = btoa(encodeURIComponent(jsonStr));
    const url = new URL(window.location.href);
    url.hash = `share=${b64}`;
    return url.toString();
  } catch (err) {
    console.error('Failed to encode bill state', err);
    return window.location.href;
  }
}

export function decodeBillFromUrl(): BillState | null {
  try {
    const hash = window.location.hash;
    if (!hash.includes('share=')) return null;

    const b64 = hash.split('share=')[1]?.split('&')[0];
    if (!b64) return null;

    const jsonStr = decodeURIComponent(atob(b64));
    const c = JSON.parse(jsonStr);

    return {
      title: c.t || 'Shared Friendship Dinner',
      currencyCode: c.cur || DEFAULT_CURRENCY,
      totalBillAmount: Number(c.b) || 1800,
      billCalculationMode: c.cm || 'direct_total',
      taxMode: c.tm || 'none',
      taxPercent: Number(c.tp) || 5.0,
      taxFixedAmount: Number(c.tfa) || 0,
      groupTipPercent: Number(c.gtp) || 10,
      tipIncludedInTotal: Boolean(c.tit),
      roundingMode: c.rm || 'none',
      payerMemberId: c.pId || null,
      members: Array.isArray(c.m)
        ? c.m.map((m: any) => ({
            id: m.i,
            name: m.n,
            avatarColor: m.c,
            useCustomTip: Boolean(m.u),
            customTipPercent: m.tp !== undefined ? Number(m.tp) : undefined,
          }))
        : DEFAULT_BILL_STATE.members,
      items: Array.isArray(c.it)
        ? c.it.map((i: any) => ({
            id: i.i,
            name: i.n,
            price: Number(i.p) || 0,
            quantity: Number(i.q) || 1,
            assignedMemberIds: Array.isArray(i.a) ? i.a : [],
            category: i.c || 'other',
          }))
        : DEFAULT_BILL_STATE.items,
      createdAt: Date.now(),
    };
  } catch (err) {
    console.warn('Failed to parse bill from URL', err);
    return null;
  }
}

export function saveActiveBill(state: BillState): void {
  try {
    localStorage.setItem(STORAGE_KEY_BILL, JSON.stringify(state));
  } catch (err) {
    console.warn('LocalStorage save failed', err);
  }
}

export function loadActiveBill(): BillState {
  const fromUrl = decodeBillFromUrl();
  if (fromUrl) {
    return fromUrl;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY_BILL);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_BILL_STATE,
        ...parsed,
        currencyCode: parsed.currencyCode || DEFAULT_CURRENCY,
        totalBillAmount:
          parsed.totalBillAmount !== undefined
            ? Number(parsed.totalBillAmount)
            : parsed.quickSubtotal !== undefined
            ? Number(parsed.quickSubtotal)
            : 1800,
      };
    }
  } catch (err) {
    console.warn('Failed to parse active bill from localStorage', err);
  }

  return DEFAULT_BILL_STATE;
}

export function saveThemeMode(mode: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEY_THEME_MODE, mode);
  } catch (e) {
    console.warn(e);
  }
}

export function loadThemeMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_THEME_MODE) as ThemeMode;
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) {
    console.warn(e);
  }
  return 'light';
}

export function saveThemeColor(color: ThemeColor): void {
  try {
    localStorage.setItem(STORAGE_KEY_THEME_COLOR, color);
  } catch (e) {
    console.warn(e);
  }
}

export function loadThemeColor(): ThemeColor {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_THEME_COLOR) as ThemeColor;
    if (['amber', 'blue', 'emerald', 'orange', 'purple', 'fuchsia'].includes(saved)) {
      return saved;
    }
  } catch (e) {
    console.warn(e);
  }
  return 'amber';
}

export function saveAnimationSettings(settings: AnimationSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_ANIMATION, JSON.stringify(settings));
  } catch (e) {
    console.warn(e);
  }
}

export function loadAnimationSettings(): AnimationSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ANIMATION);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_ANIMATION_SETTINGS,
        ...parsed,
        style: parsed.style || 'doodles',
      };
    }
  } catch (e) {
    console.warn(e);
  }
  return DEFAULT_ANIMATION_SETTINGS;
}

export function getDinnerHistory(): DinnerHistoryItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn(e);
  }
  return [];
}

export function saveDinnerToHistory(historyItem: DinnerHistoryItem): DinnerHistoryItem[] {
  try {
    const existing = getDinnerHistory();
    const updated = [historyItem, ...existing.filter((h) => h.id !== historyItem.id)].slice(0, 30);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn(e);
    return [];
  }
}

export function clearDinnerHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch (e) {
    console.warn(e);
  }
}
