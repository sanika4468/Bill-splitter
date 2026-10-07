import React, { useEffect, useState } from 'react';
import { Sun, Moon, Palette, History, RotateCcw, Share2, Sparkles, Chrome } from 'lucide-react';
import { ThemeConfig, ThemeMode, ThemeColor } from '../types';

interface Props {
  theme: ThemeConfig;
  themeMode: ThemeMode;
  onToggleThemeMode: () => void;
  onOpenColorModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenShareModal: () => void;
  onOpenChromeModal: () => void;
  onResetBill: () => void;
}

export const Header: React.FC<Props> = ({
  theme,
  themeMode,
  onToggleThemeMode,
  onOpenColorModal,
  onOpenHistoryModal,
  onOpenShareModal,
  onOpenChromeModal,
  onResetBill,
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 h-15 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-xl">
            🍽️
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-1.5">
              <span>TableTally</span>
              <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                Offline Ready
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden xs:block">
              Fast friendship bill &amp; tip splitter
            </p>
          </div>
        </div>

        {/* Quick Controls */}
        <div className="flex items-center gap-2">
          {/* Light / Dark Mode Direct Toggle Button */}
          <button
            type="button"
            onClick={onToggleThemeMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs transition-colors cursor-pointer"
            title={themeMode === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {themeMode === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Theme Colors Button */}
          <button
            type="button"
            onClick={onOpenColorModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs transition-colors cursor-pointer"
            title="Customize theme color & food animation"
          >
            <Palette className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Colors</span>
          </button>

          {/* Chrome Access Button */}
          <button
            type="button"
            onClick={onOpenChromeModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs transition-colors cursor-pointer"
            title="Run on Google Chrome & download HTML/CSS/JS file"
          >
            <Chrome className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Chrome</span>
          </button>

          {/* Dinner History Button */}
          <button
            type="button"
            onClick={onOpenHistoryModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs transition-colors cursor-pointer"
            title="View past bill logs"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* Share QR Code Button */}
          <button
            type="button"
            onClick={onOpenShareModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-transform active:scale-95 cursor-pointer ${theme.accentBg}`}
          >
            <Share2 className="w-3.5 h-3.5 text-white" />
            <span className="text-white font-bold">Share QR</span>
          </button>

          {/* Reset Bill Button */}
          <button
            type="button"
            onClick={onResetBill}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset bill"
            aria-label="Reset bill"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
