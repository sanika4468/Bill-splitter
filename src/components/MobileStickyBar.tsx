import React from 'react';
import { QrCode, ArrowDown } from 'lucide-react';
import { CalculationResult, ThemeConfig } from '../types';
import { formatMoney } from '../utils/currency';

interface Props {
  result: CalculationResult;
  theme: ThemeConfig;
  onOpenShareModal: () => void;
  onScrollToSummary: () => void;
  memberCount: number;
  currencyCode: string;
}

export const MobileStickyBar: React.FC<Props> = ({
  result,
  theme,
  onOpenShareModal,
  onScrollToSummary,
  memberCount,
  currencyCode,
}) => {
  const avgPerPerson = memberCount > 0 ? result.grandTotal / memberCount : 0;

  return (
    <aside
      aria-label="Mobile Bill Summary"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-2.5 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200/80 dark:border-stone-800 shadow-xl"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div onClick={onScrollToSummary} className="cursor-pointer">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black font-mono tabular-nums text-amber-600 dark:text-amber-400">
              {formatMoney(result.grandTotal, currencyCode)}
            </span>
            <span className="text-[11px] opacity-65 font-medium">
              (~{formatMoney(avgPerPerson, currencyCode)}/ea)
            </span>
          </div>
          <div className="text-[10px] opacity-60 flex items-center gap-0.5">
            <span>Tap for breakdown</span>
            <ArrowDown className="w-2.5 h-2.5" />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onScrollToSummary}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 active:scale-95 transition-transform"
          >
            Summary
          </button>

          <button
            type="button"
            onClick={onOpenShareModal}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-transform ${theme.accentBg}`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Code</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
