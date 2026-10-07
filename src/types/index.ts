export type ThemeMode = 'light' | 'dark';
export type ThemeColor = 'amber' | 'blue' | 'emerald' | 'orange' | 'purple' | 'fuchsia';

export interface ThemeConfig {
  id: string;
  name: string;
  emoji: string;
  isDark: boolean;
  bgClass: string;
  cardBg: string;
  surfaceBg: string;
  textColor: string;
  textMuted: string;
  accentBg: string;
  accentText: string;
  borderColor: string;
  badgeBg: string;
}

export interface Member {
  id: string;
  name: string;
  avatarColor: string;
  customTipPercent?: number;
  useCustomTip: boolean;
}

export interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  assignedMemberIds: string[]; // empty means split evenly across all members
  category?: 'drink' | 'appetizer' | 'main' | 'dessert' | 'other';
}

export interface MemberBreakdown {
  member: Member;
  itemSubtotal: number;
  taxShare: number;
  tipPercentUsed: number;
  tipShare: number;
  rawTotal: number;
  finalTotal: number;
  assignedItems: { name: string; sharePrice: number }[];
  netBalance: number;
}

export interface CalculationResult {
  subtotal: number;
  taxAmount: number;
  effectiveTaxRate: number;
  totalTipAmount: number;
  grandTotal: number;
  roundingDelta: number;
  memberBreakdowns: MemberBreakdown[];
  settlements: {
    fromMemberId: string;
    fromMemberName: string;
    toMemberId: string;
    toMemberName: string;
    amount: number;
  }[];
}

export type RoundingMode = 'none' | 'dollar' | 'half_dollar';
export type TaxInputMode = 'none' | 'percent' | 'fixed';

export interface BillState {
  title: string;
  // Multi-country currency support (India INR, USA USD, etc.)
  currencyCode: string;
  // Total Bill customizable directly by user!
  totalBillAmount: number;
  billCalculationMode: 'direct_total' | 'itemized';
  taxMode: TaxInputMode;
  taxPercent: number;
  taxFixedAmount: number;
  groupTipPercent: number;
  tipIncludedInTotal: boolean;
  roundingMode: RoundingMode;
  payerMemberId: string | null;
  members: Member[];
  items: BillItem[];
  createdAt: number;
}

export interface DinnerHistoryItem {
  id: string;
  title: string;
  timestamp: number;
  memberCount: number;
  grandTotal: number;
  tipTotal: number;
  currencyCode: string;
  billState: BillState;
}

export interface AnimationSettings {
  enabled: boolean;
  style: 'doodles' | 'emojis';
  density: 'low' | 'medium' | 'high';
  speed: 'slow' | 'normal' | 'fast';
}
