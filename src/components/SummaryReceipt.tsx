import React, { useState } from 'react';
import {
  QrCode,
  Copy,
  Check,
  BookmarkPlus,
  ArrowRight,
  Receipt,
  Users,
  Chrome,
} from 'lucide-react';
import { BillState, CalculationResult, ThemeConfig } from '../types';
import { formatMoney } from '../utils/currency';
import { generateTextSummary } from '../utils/share';
import { DoodleReceipt, DoodleCheers, DoodlePizza } from './DoodleIcons';

interface Props {
  billState: BillState;
  result: CalculationResult;
  theme: ThemeConfig;
  onOpenShareModal: () => void;
  onSaveToHistory: () => void;
  onOpenChromeModal: () => void;
  onOpenGoogleDriveModal?: () => void;
}

export const SummaryReceipt: React.FC<Props> = ({
  billState,
  result,
  theme,
  onOpenShareModal,
  onSaveToHistory,
  onOpenChromeModal,
  onOpenGoogleDriveModal,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [savedHistory, setSavedHistory] = useState(false);

  const cur = billState.currencyCode || 'INR';

  const handleCopyText = async () => {
    try {
      const text = generateTextSummary(billState, result);
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2200);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  };

  const handleHistoryClick = () => {
    onSaveToHistory();
    setSavedHistory(true);
    setTimeout(() => setSavedHistory(false), 2500);
  };

  const payer = billState.payerMemberId
    ? billState.members.find((m) => m.id === billState.payerMemberId)
    : null;

  const count = billState.members.length;
  const avgPay = count > 0 ? result.grandTotal / count : 0;

  return (
    <div className={`p-5 md:p-6 rounded-3xl border transition-all ${theme.cardBg} space-y-5 relative overflow-hidden`}>
      {/* Attractive Decorative Doodles in Corner */}
      <div className="absolute top-2 right-2 opacity-12 pointer-events-none text-amber-600 dark:text-amber-400 rotate-6">
        <DoodleReceipt size={56} />
      </div>

      {/* Step 3 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-black tracking-tight flex items-center gap-1.5">
            <span>Step 3: Settlement Summary</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
              Ready to Pay
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Clear summary of how much each friend owes in {cur}
          </p>
        </div>

        {/* Action Buttons with High-Contrast, Visible Text */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Share QR Button */}
          <button
            type="button"
            onClick={onOpenShareModal}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer ${theme.accentBg}`}
          >
            <QrCode className="w-4 h-4 text-white" />
            <span className="text-white font-bold">Share QR</span>
          </button>

          {/* Copy WhatsApp Button */}
          <button
            type="button"
            onClick={handleCopyText}
            className="px-3 py-2 rounded-xl text-xs font-bold border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                <span className="font-bold">Copy Text</span>
              </>
            )}
          </button>

          {/* Save History Button */}
          <button
            type="button"
            onClick={handleHistoryClick}
            className="px-3 py-2 rounded-xl text-xs font-bold border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Save dinner to history"
          >
            {savedHistory ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Saved!</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                <span className="font-bold">Save</span>
              </>
            )}
          </button>

          {/* Chrome / HTML Export Button */}
          <button
            type="button"
            onClick={onOpenChromeModal}
            className="px-3 py-2 rounded-xl text-xs font-bold border-2 border-amber-400/80 bg-amber-500/10 text-amber-800 dark:text-amber-200 hover:bg-amber-500/20 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Run on Google Chrome & download HTML/CSS/JS"
          >
            <Chrome className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="font-bold">Chrome App</span>
          </button>

          {/* Google Drive Cloud Backup Button */}
          {onOpenGoogleDriveModal && (
            <button
              type="button"
              onClick={onOpenGoogleDriveModal}
              className="px-3 py-2 rounded-xl text-xs font-bold border-2 border-blue-400/80 bg-blue-500/10 text-blue-800 dark:text-blue-200 hover:bg-blue-500/20 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Save bill & receipt to Google Drive"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44C.4 49.9 0 51.45 0 53h27.5z" fill="#00ac47"/>
                <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15z" fill="#ea4335"/>
                <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.95 0H34.35c-1.55 0-3.1.4-4.45 1.2z" fill="#00832d"/>
                <path d="m59.8 53-16.15-28H16.15l13.75 23.8 2.3 4.2h27.6z" fill="#2684fc"/>
                <path d="M73.4 26.5 60.7 4.5c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28h27.5c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
              </svg>
              <span className="font-bold">Google Drive</span>
            </button>
          )}
        </div>
      </div>

      {/* Prominent Grand Total & Each Person Highlight Card */}
      <div className="p-4.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/10 border-2 border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
            <span>Each Person Pays</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-amber-600 dark:text-amber-400 tabular-nums">
            {formatMoney(avgPay, cur)}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-300">
            Split equally across {count} friends (incl. tip &amp; tax)
          </div>
        </div>

        <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-amber-500/30 pt-2 sm:pt-0 sm:pl-4">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Total Dinner Bill</div>
          <div className="text-xl sm:text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
            {formatMoney(result.grandTotal, cur)}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Bill: {formatMoney(result.subtotal, cur)} + Tip: {formatMoney(result.totalTipAmount, cur)}
          </div>
        </div>
      </div>

      {/* Settlement Section (if someone paid the restaurant with card) */}
      {payer && result.settlements.length > 0 && (
        <div className="p-3.5 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-200">
              💳 Settle up with {payer.name} (Card Payer)
            </span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              {payer.name} paid {formatMoney(result.grandTotal, cur)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {result.settlements.map((s) => (
              <div
                key={s.fromMemberId}
                className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-emerald-500/30 font-bold"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-800 dark:text-slate-100">{s.fromMemberName}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-400">{s.toMemberName}</span>
                </div>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold tabular-nums">
                  {formatMoney(s.amount, cur)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-Friend Breakdown Cards */}
      <div className="space-y-2.5">
        <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Friend-by-Friend Breakdown
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {result.memberBreakdowns.map((mb) => (
            <div
              key={mb.member.id}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center shrink-0"
                    style={{ backgroundColor: mb.member.avatarColor }}
                  >
                    {mb.member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {mb.member.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {mb.member.useCustomTip ? `Custom ${mb.tipPercentUsed}% tip` : `${mb.tipPercentUsed}% tip`}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black font-mono text-amber-600 dark:text-amber-400 tabular-nums">
                    {formatMoney(mb.finalTotal, cur)}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400">Total owed</div>
                </div>
              </div>

              {/* Detail row */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                <span>Bill: {formatMoney(mb.itemSubtotal, cur)}</span>
                <span>Tip: {formatMoney(mb.tipShare, cur)}</span>
                {mb.taxShare > 0 && <span>Tax: {formatMoney(mb.taxShare, cur)}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
