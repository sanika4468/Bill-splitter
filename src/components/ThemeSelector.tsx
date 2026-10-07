import React from 'react';
import { Palette, Sun, Moon, Sparkles, Check, X, Brush, Smile } from 'lucide-react';
import { AnimationSettings, ThemeColor, ThemeConfig, ThemeMode } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
  onSelectThemeMode: (mode: ThemeMode) => void;
  themeColor: ThemeColor;
  onSelectThemeColor: (color: ThemeColor) => void;
  animationSettings: AnimationSettings;
  onUpdateAnimationSettings: (settings: Partial<AnimationSettings>) => void;
  currentTheme: ThemeConfig;
}

const COLOR_OPTIONS: { id: ThemeColor; name: string; emoji: string; hex: string }[] = [
  { id: 'amber', name: 'Warm Bistro', emoji: '🍷', hex: '#d97706' },
  { id: 'blue', name: 'Ocean Slate', emoji: '🌊', hex: '#2563eb' },
  { id: 'emerald', name: 'Fresh Matcha', emoji: '🍵', hex: '#059669' },
  { id: 'orange', name: 'Tuscan Sunset', emoji: '🌅', hex: '#ea580c' },
  { id: 'purple', name: 'Royal Grape', emoji: '🍇', hex: '#9333ea' },
  { id: 'fuchsia', name: 'Neon Diner', emoji: '⚡', hex: '#db2777' },
];

export const ThemeSelector: React.FC<Props> = ({
  isOpen,
  onClose,
  themeMode,
  onSelectThemeMode,
  themeColor,
  onSelectThemeColor,
  animationSettings,
  onUpdateAnimationSettings,
  currentTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg p-5 md:p-6 rounded-3xl border shadow-2xl relative ${currentTheme.cardBg} transition-all space-y-5`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-base font-bold tracking-tight">Theme &amp; Visual Settings</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Light theme, Dark theme &amp; attractive food doodles
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-300 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Light vs Dark Theme Selection */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 block">
            Display Mode
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onSelectThemeMode('light')}
              className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                themeMode === 'light'
                  ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm'
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>☀️ Light Theme</span>
              {themeMode === 'light' && <Check className="w-4 h-4 text-amber-600" />}
            </button>

            <button
              type="button"
              onClick={() => onSelectThemeMode('dark')}
              className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                themeMode === 'dark'
                  ? 'border-amber-500 bg-slate-800 text-white shadow-sm'
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>🌙 Dark Theme</span>
              {themeMode === 'dark' && <Check className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* 2. Color Palette Accent Selection */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 block">
            Color Accent Flavor
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {COLOR_OPTIONS.map((c) => {
              const isSelected = themeColor === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectThemeColor(c.id)}
                  className={`p-2.5 rounded-xl border-2 text-left flex items-center justify-between font-bold text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-white shadow-xs shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="truncate">{c.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Floating Food Background Animation & Doodles Style */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Background Animation</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Charming hand-drawn doodles or food emojis
              </p>
            </div>

            <button
              type="button"
              onClick={() => onUpdateAnimationSettings({ enabled: !animationSettings.enabled })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                animationSettings.enabled ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              role="switch"
              aria-checked={animationSettings.enabled}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  animationSettings.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {animationSettings.enabled && (
            <div className="space-y-2.5 pt-1">
              {/* Doodle vs Emoji Style selector */}
              <div>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Art Style:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateAnimationSettings({ style: 'doodles' })}
                    className={`py-2 px-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      animationSettings.style === 'doodles'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Brush className="w-3.5 h-3.5 text-amber-600" />
                    <span>🎨 Hand-Drawn Doodles</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateAnimationSettings({ style: 'emojis' })}
                    className={`py-2 px-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      animationSettings.style === 'emojis'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Smile className="w-3.5 h-3.5 text-amber-600" />
                    <span>🍕 Food Emojis</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Density:
                  </span>
                  <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-bold">
                    {(['low', 'medium', 'high'] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => onUpdateAnimationSettings({ density: d })}
                        className={`flex-1 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                          animationSettings.density === d
                            ? 'bg-amber-600 text-white shadow-xs font-black'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Speed:
                  </span>
                  <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-bold">
                    {(['slow', 'normal', 'fast'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => onUpdateAnimationSettings({ speed: s })}
                        className={`flex-1 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                          animationSettings.speed === s
                            ? 'bg-amber-600 text-white shadow-xs font-black'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Done Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-transform active:scale-95 cursor-pointer ${currentTheme.accentBg}`}
          >
            Apply &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
