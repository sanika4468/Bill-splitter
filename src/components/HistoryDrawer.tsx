import React from 'react';
import { X, History, RotateCcw, Trash2, Calendar, Users } from 'lucide-react';
import { DinnerHistoryItem, ThemeConfig } from '../types';
import { formatMoney } from '../utils/currency';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  history: DinnerHistoryItem[];
  onLoadHistory: (item: DinnerHistoryItem) => void;
  onClearHistory: () => void;
  theme: ThemeConfig;
}

export const HistoryDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  history,
  onLoadHistory,
  onClearHistory,
  theme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md h-full p-5 flex flex-col border-l shadow-2xl relative ${theme.cardBg} transition-all overflow-hidden`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <h3 className="text-base font-bold tracking-tight">Dinner History Log</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Past settlements &amp; tip calculations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-300 cursor-pointer"
            aria-label="Close history"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          {history.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500 text-xs">
              <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-bold text-sm">No dinner history yet</p>
              <p className="mt-1">
                Settled dinners will be saved here when you click "Save" in the summary!
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500 transition-all flex flex-col gap-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold truncate text-slate-800 dark:text-slate-100">
                    {item.title}
                  </span>
                  <span className="text-sm font-mono font-black text-amber-600 dark:text-amber-400 tabular-nums">
                    {formatMoney(item.grandTotal, item.currencyCode || 'INR')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{item.memberCount} friends</span>
                  </span>
                  <span>Tip: {formatMoney(item.tipTotal, item.currencyCode || 'INR')}</span>
                </div>

                {/* Restore Button */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadHistory(item);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-white" />
                    <span className="text-white font-bold">Load Bill</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {history.length > 0 && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">{history.length} saved records</span>
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-bold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
