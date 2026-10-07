import { ThemeConfig, ThemeColor, ThemeMode } from '../types';

export function getThemeConfig(mode: ThemeMode, color: ThemeColor): ThemeConfig {
  const isDark = mode === 'dark';

  const colorPalettes: Record<
    ThemeColor,
    {
      name: string;
      emoji: string;
      lightBg: string;
      darkBg: string;
      accentBg: string;
      accentText: string;
      badgeBgLight: string;
      badgeBgDark: string;
    }
  > = {
    amber: {
      name: 'Warm Bistro',
      emoji: '🍷',
      lightBg: 'bg-[#faf6f0]',
      darkBg: 'bg-[#121214]',
      accentBg: 'bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-600/20',
      accentText: isDark ? 'text-amber-400' : 'text-amber-700',
      badgeBgLight: 'bg-amber-100 text-amber-900 font-bold',
      badgeBgDark: 'bg-amber-950/80 border border-amber-800 text-amber-300 font-bold',
    },
    blue: {
      name: 'Ocean Slate',
      emoji: '🌊',
      lightBg: 'bg-slate-100',
      darkBg: 'bg-[#0b1120]',
      accentBg: 'bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20',
      accentText: isDark ? 'text-blue-400' : 'text-blue-700',
      badgeBgLight: 'bg-blue-100 text-blue-900 font-bold',
      badgeBgDark: 'bg-blue-950/80 border border-blue-800 text-blue-300 font-bold',
    },
    emerald: {
      name: 'Fresh Matcha',
      emoji: '🍵',
      lightBg: 'bg-[#f3f7f4]',
      darkBg: 'bg-[#0c1813]',
      accentBg: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20',
      accentText: isDark ? 'text-emerald-400' : 'text-emerald-700',
      badgeBgLight: 'bg-emerald-100 text-emerald-900 font-bold',
      badgeBgDark: 'bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold',
    },
    orange: {
      name: 'Tuscan Sunset',
      emoji: '🌅',
      lightBg: 'bg-[#fff5ee]',
      darkBg: 'bg-[#18110e]',
      accentBg: 'bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-md shadow-orange-600/20',
      accentText: isDark ? 'text-orange-400' : 'text-orange-700',
      badgeBgLight: 'bg-orange-100 text-orange-900 font-bold',
      badgeBgDark: 'bg-orange-950/80 border border-orange-800 text-orange-300 font-bold',
    },
    purple: {
      name: 'Royal Grape',
      emoji: '🍇',
      lightBg: 'bg-[#f8f5fd]',
      darkBg: 'bg-[#140e24]',
      accentBg: 'bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20',
      accentText: isDark ? 'text-purple-400' : 'text-purple-700',
      badgeBgLight: 'bg-purple-100 text-purple-900 font-bold',
      badgeBgDark: 'bg-purple-950/80 border border-purple-800 text-purple-300 font-bold',
    },
    fuchsia: {
      name: 'Neon Diner',
      emoji: '⚡',
      lightBg: 'bg-[#fdf2f8]',
      darkBg: 'bg-[#190a20]',
      accentBg: 'bg-pink-600 hover:bg-pink-700 text-white font-bold shadow-md shadow-pink-600/20',
      accentText: isDark ? 'text-pink-400' : 'text-pink-700',
      badgeBgLight: 'bg-pink-100 text-pink-900 font-bold',
      badgeBgDark: 'bg-pink-950/80 border border-pink-800 text-pink-300 font-bold',
    },
  };

  const pal = colorPalettes[color] || colorPalettes.amber;

  if (isDark) {
    return {
      id: `${mode}-${color}`,
      name: `${pal.name} (Dark)`,
      emoji: pal.emoji,
      isDark: true,
      bgClass: `${pal.darkBg} text-slate-100`,
      cardBg: 'bg-[#1c2230]/90 text-slate-100 border-slate-700/80 shadow-xl shadow-black/40',
      surfaceBg: 'bg-slate-800/80 border-slate-700 text-slate-100',
      textColor: 'text-slate-100',
      textMuted: 'text-slate-400',
      accentBg: pal.accentBg,
      accentText: pal.accentText,
      borderColor: 'border-slate-700',
      badgeBg: pal.badgeBgDark,
    };
  }

  return {
    id: `${mode}-${color}`,
    name: `${pal.name} (Light)`,
    emoji: pal.emoji,
    isDark: false,
    bgClass: `${pal.lightBg} text-slate-900`,
    cardBg: 'bg-white text-slate-900 border-slate-200/90 shadow-md shadow-slate-900/5',
    surfaceBg: 'bg-slate-100/90 border-slate-200 text-slate-900',
    textColor: 'text-slate-900',
    textMuted: 'text-slate-600',
    accentBg: pal.accentBg,
    accentText: pal.accentText,
    borderColor: 'border-slate-200',
    badgeBg: pal.badgeBgLight,
  };
}
