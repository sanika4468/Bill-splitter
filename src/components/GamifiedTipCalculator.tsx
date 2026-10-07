import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Dices, Sparkles, Percent, Receipt } from 'lucide-react';
import { BillState, Member, ThemeConfig } from '../types';
import { formatMoney } from '../utils/currency';
import { DoodleCheers } from './DoodleIcons';

const TOAST_IMG = '/src/assets/images/celebration_toast_cheers_1791392962517.jpg';

interface Props {
  billState: BillState;
  onChange: (updates: Partial<BillState>) => void;
  onUpdateMember: (id: string, updates: Partial<Member>) => void;
  theme: ThemeConfig;
  estimatedTipAmount: number;
}

const KARMA_TIERS = [
  { min: 0, max: 5, title: 'No Tip', badge: 'Zero', icon: '🪙', praise: 'Split bill as-is with no gratuity.' },
  { min: 6, max: 12, title: 'Thrifty Guest', badge: 'Basic', icon: '🪙', praise: 'Basic etiquette. Servers appreciate a little boost!' },
  { min: 13, max: 16, title: 'Good Guest', badge: 'Courteous', icon: '🤝', praise: 'Solid appreciation for good service.' },
  { min: 17, max: 19, title: 'Friendly Foodie', badge: 'Great Vibe', icon: '🍕', praise: 'The staff loved serving your group!' },
  { min: 20, max: 24, title: 'Shift Hero', badge: 'Superstar', icon: '🦸‍♂️', praise: 'Generosity unlocked! You made their whole evening.' },
  { min: 25, max: 100, title: 'Dining Saint', badge: 'Legendary', icon: '👑', praise: 'Standing ovation from the restaurant kitchen!' },
];

export const GamifiedTipCalculator: React.FC<Props> = ({
  billState,
  onChange,
  onUpdateMember,
  theme,
  estimatedTipAmount,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rouletteMessage, setRouletteMessage] = useState<string | null>(null);
  const [showIndividualTips, setShowIndividualTips] = useState(false);

  const { groupTipPercent, tipIncludedInTotal, taxMode, taxPercent, members } = billState;

  const currentTier =
    KARMA_TIERS.find((t) => groupTipPercent >= t.min && groupTipPercent <= t.max) ||
    KARMA_TIERS[KARMA_TIERS.length - 1];

  const presets = [0, 10, 15, 18, 20, 25];

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#3B82F6'],
      });
    } catch {
      // fallback
    }
  };

  const handlePresetClick = (p: number) => {
    onChange({ groupTipPercent: p, tipIncludedInTotal: false });
    if (p >= 20) {
      fireConfetti();
    }
  };

  const spinRoulette = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setRouletteMessage('Spinning the Generosity Wheel...');

    const luckyTips = [18, 20, 22, 25, 30];
    let counter = 0;
    const interval = setInterval(() => {
      const temp = luckyTips[Math.floor(Math.random() * luckyTips.length)];
      onChange({ groupTipPercent: temp, tipIncludedInTotal: false });
      counter++;
      if (counter > 7) {
        clearInterval(interval);
        const finalChoice = luckyTips[Math.floor(Math.random() * luckyTips.length)];
        onChange({ groupTipPercent: finalChoice, tipIncludedInTotal: false });
        setIsSpinning(false);
        setRouletteMessage(`🎉 Wheel landed on ${finalChoice}%! Great table karma!`);
        fireConfetti();
      }
    }, 110);
  };

  return (
    <div className={`p-5 md:p-6 rounded-3xl border transition-all ${theme.cardBg} space-y-4 relative overflow-hidden`}>
      {/* Decorative doodle */}
      <div className="absolute top-2 right-24 opacity-10 pointer-events-none text-amber-600 dark:text-amber-400">
        <DoodleCheers size={48} />
      </div>
      {/* Step Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl overflow-hidden border border-amber-500/30 shadow-xs shrink-0 hidden xs:block">
            <img
              src={TOAST_IMG}
              alt="Celebration Toast Cheers"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              {currentTier.icon}
            </span>
            <div>
              <h3 className="text-sm font-bold tracking-tight flex items-center gap-1.5">
                <span>Step 2: Tip &amp; Gratuity</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300">
                  {currentTier.title}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{currentTier.praise}</p>
            </div>
          </div>
        </div>

        {/* Tip Wheel Button */}
        <button
          type="button"
          onClick={spinRoulette}
          disabled={isSpinning}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200 border border-amber-500/40 active:scale-95 transition-transform cursor-pointer"
          title="Spin generosity wheel"
        >
          <Dices className={`w-3.5 h-3.5 text-amber-600 dark:text-amber-400 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{isSpinning ? 'Spinning...' : 'Tip Wheel'}</span>
        </button>
      </div>

      {rouletteMessage && (
        <div className="text-xs p-2.5 rounded-xl bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30 font-bold text-center">
          {rouletteMessage}
        </div>
      )}

      {/* Preset Tip Buttons with High Contrast & Clear Text */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Select Tip Percentage:
          </span>
          <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300">
            {groupTipPercent}% (~{formatMoney(estimatedTipAmount, billState.currencyCode)})
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {presets.map((p) => {
            const isActive = groupTipPercent === p && !tipIncludedInTotal;
            return (
              <button
                key={p}
                type="button"
                onClick={() => handlePresetClick(p)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 scale-102 ring-2 ring-amber-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span className="text-sm font-black">{p}%</span>
                <span className="text-[10px] font-semibold opacity-85">
                  {p === 0 ? 'No Tip' : p >= 25 ? '👑 Saint' : p >= 20 ? '⭐ Hero' : p >= 18 ? '👍 Great' : 'Good'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Slider & Tax Row */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Custom Tip Slider */}
        <div className="flex items-center gap-2 flex-1">
          <span className="font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
            Custom %:
          </span>
          <input
            type="range"
            min={0}
            max={35}
            value={groupTipPercent}
            onChange={(e) => onChange({ groupTipPercent: Number(e.target.value), tipIncludedInTotal: false })}
            className="w-full accent-amber-600 cursor-pointer"
          />
          <input
            type="number"
            min={0}
            max={100}
            value={groupTipPercent}
            onChange={(e) => onChange({ groupTipPercent: Math.max(0, Number(e.target.value)), tipIncludedInTotal: false })}
            className="w-14 px-2 py-1 text-center font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
          <span className="font-bold">%</span>
        </div>

        {/* Tax Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <Receipt className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-bold text-slate-700 dark:text-slate-300">Sales Tax:</span>
          <button
            type="button"
            onClick={() => onChange({ taxMode: taxMode === 'none' ? 'percent' : 'none' })}
            className={`px-2.5 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
              taxMode === 'percent'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
            }`}
          >
            {taxMode === 'percent' ? `+${taxPercent}% Tax` : 'No Extra Tax'}
          </button>
        </div>
      </div>

      {/* Toggle Custom Tip Per Person */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setShowIndividualTips(!showIndividualTips)}
          className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Percent className="w-3.5 h-3.5" />
          <span>
            {showIndividualTips
              ? 'Hide individual custom tips'
              : 'Different friends want to tip different percentages? (Click here)'}
          </span>
        </button>

        {showIndividualTips && (
          <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Set individual tip percentage for each friend:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                      style={{ backgroundColor: m.avatarColor }}
                    >
                      {m.name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold">{m.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={m.useCustomTip ? m.customTipPercent ?? groupTipPercent : groupTipPercent}
                      onChange={(e) =>
                        onUpdateMember(m.id, {
                          useCustomTip: true,
                          customTipPercent: Math.max(0, Number(e.target.value)),
                        })
                      }
                      className="w-12 px-1.5 py-0.5 text-center text-xs font-mono font-bold rounded border border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white"
                    />
                    <span className="text-xs font-bold">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
