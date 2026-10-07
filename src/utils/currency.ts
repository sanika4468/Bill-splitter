export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  country: string;
  flag: string;
  locale: string;
  decimalDigits: number;
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    country: 'India',
    flag: '🇮🇳',
    locale: 'en-IN',
    decimalDigits: 2,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    country: 'United States',
    flag: '🇺🇸',
    locale: 'en-US',
    decimalDigits: 2,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    country: 'European Union',
    flag: '🇪🇺',
    locale: 'de-DE',
    decimalDigits: 2,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    country: 'United Kingdom',
    flag: '🇬🇧',
    locale: 'en-GB',
    decimalDigits: 2,
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    name: 'UAE Dirham',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    locale: 'ar-AE',
    decimalDigits: 2,
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    country: 'Canada',
    flag: '🇨🇦',
    locale: 'en-CA',
    decimalDigits: 2,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    country: 'Australia',
    flag: '🇦🇺',
    locale: 'en-AU',
    decimalDigits: 2,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    country: 'Japan',
    flag: '🇯🇵',
    locale: 'ja-JP',
    decimalDigits: 0,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    country: 'Singapore',
    flag: '🇸🇬',
    locale: 'en-SG',
    decimalDigits: 2,
  },
};

export const DEFAULT_CURRENCY = 'INR'; // Support India prominently!

export function formatMoney(amount: number, currencyCode: string = DEFAULT_CURRENCY): string {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const validAmount = isNaN(amount) ? 0 : amount;

  try {
    return new Intl.NumberFormat(curr.locale, {
      style: 'currency',
      currency: curr.code,
      minimumFractionDigits: curr.decimalDigits,
      maximumFractionDigits: curr.decimalDigits,
    }).format(validAmount);
  } catch {
    return `${curr.symbol}${validAmount.toFixed(curr.decimalDigits)}`;
  }
}

export const formatCurrencyByCode = formatMoney;
