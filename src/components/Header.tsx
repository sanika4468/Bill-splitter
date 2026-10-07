import React, { useEffect, useState } from 'react';
import { Sun, Moon, Palette, History, RotateCcw, Share2, Sparkles, Chrome, Cloud } from 'lucide-react';
import { User } from 'firebase/auth';
import { ThemeConfig, ThemeMode, ThemeColor } from '../types';

interface Props {
  theme: ThemeConfig;
  themeMode: ThemeMode;
  driveUser: User | null;
  onToggleThemeMode: () => void;
  onOpenColorModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenShareModal: () => void;
  onOpenChromeModal: () => void;
  onOpenGoogleDriveModal: () => void;
  onResetBill: () => void;
}

export const Header: React.FC<Props> = ({
  theme,
  themeMode,
  driveUser,
  onToggleThemeMode,
  onOpenColorModal,
  onOpenHistoryModal,
  onOpenShareModal,
  onOpenChromeModal,
  onOpenGoogleDriveModal,
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

          {/* Google Drive Button */}
          <button
            type="button"
            onClick={onOpenGoogleDriveModal}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs transition-colors cursor-pointer"
            title="Save and load bills with Google Drive"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44C.4 49.9 0 51.45 0 53h27.5z" fill="#00ac47"/>
              <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15z" fill="#ea4335"/>
              <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.95 0H34.35c-1.55 0-3.1.4-4.45 1.2z" fill="#00832d"/>
              <path d="m59.8 53-16.15-28H16.15l13.75 23.8 2.3 4.2h27.6z" fill="#2684fc"/>
              <path d="M73.4 26.5 60.7 4.5c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28h27.5c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
            <span className="hidden sm:inline">Drive</span>
            {driveUser && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" title="Connected to Google Drive" />
            )}
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
