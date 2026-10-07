import React, { useState } from 'react';
import { Users, Plus, Minus, CreditCard, Trash2, Edit3, Globe } from 'lucide-react';
import { BillState, Member, ThemeConfig } from '../types';
import { CURRENCIES, CurrencyConfig } from '../utils/currency';
import { DoodleChai, DoodlePizza, DoodleSamosa, DoodleBurger, DoodleReceipt } from './DoodleIcons';
import spreadImg from '../assets/images/gourmet_table_spread_1791392946799.jpg';

interface Props {
  billState: BillState;
  onChange: (updates: Partial<BillState>) => void;
  onAddMember: (name: string, color: string) => void;
  onRemoveMember: (id: string) => void;
  onUpdateMember: (id: string, updates: Partial<Member>) => void;
  theme: ThemeConfig;
  perPersonEstimate: number;
}

const PALETTE = [
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#14B8A6', // Teal
];

export const BillAndFriendsCard: React.FC<Props> = ({
  billState,
  onChange,
  onAddMember,
  onRemoveMember,
  onUpdateMember,
  theme,
  perPersonEstimate,
}) => {
  const [newFriendName, setNewFriendName] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const { totalBillAmount, members, payerMemberId, title, currencyCode } = billState;
  const currentCurrency: CurrencyConfig = CURRENCIES[currencyCode] || CURRENCIES.INR;

  const handleAddFriend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = newFriendName.trim() || `Friend ${members.length + 1}`;
    const color = PALETTE[members.length % PALETTE.length];
    onAddMember(name, color);
    setNewFriendName('');
  };

  const handleQuickAdjust = (delta: number) => {
    const next = Math.max(0, Math.round((totalBillAmount + delta) * 100) / 100);
    onChange({ totalBillAmount: next });
  };

  // Adjust increments based on currency (e.g. INR is typically higher numbers like +100, +500)
  const isHighDenomination = currentCurrency.code === 'INR' || currentCurrency.code === 'JPY';
  const quickIncrements = isHighDenomination ? [+100, +250, +500, -100] : [+10, +25, +50, -10];

  return (
    <div className={`p-5 md:p-6 rounded-3xl border transition-all ${theme.cardBg} space-y-5 relative overflow-hidden`}>
      {/* Attractive Background Doodles Decoration */}
      <div className="absolute -top-3 -right-3 opacity-15 pointer-events-none text-amber-600 dark:text-amber-400 rotate-12">
        <DoodlePizza size={72} />
      </div>
      <div className="absolute bottom-2 right-4 opacity-12 pointer-events-none text-amber-600 dark:text-amber-400 -rotate-12">
        <DoodleChai size={54} />
      </div>

      {/* Card Header with Editable Title & Currency Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-500/30 shadow-xs shrink-0 hidden xs:block bg-amber-500/10">
            <img
              src={spreadImg}
              onError={(e) => {
                e.currentTarget.src = '/images/food-spread.jpg';
              }}
              alt="Gourmet Dining Spread"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => onChange({ title: e.target.value })}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  autoFocus
                  className="text-lg font-black bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-amber-500 focus:outline-hidden"
                />
              ) : (
                <div
                  onClick={() => setIsEditingTitle(true)}
                  className="text-lg font-black tracking-tight flex items-center gap-1.5 cursor-pointer hover:opacity-80"
                  title="Click to edit dinner title"
                >
                  <span>{title}</span>
                  <Edit3 className="w-3.5 h-3.5 opacity-50 text-slate-500" />
                </div>
              )}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
              Step 1: Write total bill &amp; friends
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Currency:</span>
          <select
            value={currencyCode}
            onChange={(e) => onChange({ currencyCode: e.target.value })}
            className="px-2.5 py-1 rounded-xl text-xs font-bold border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-amber-500 cursor-pointer shadow-xs"
          >
            {Object.values(CURRENCIES).map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.flag} {curr.code} ({curr.symbol}) - {curr.country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Customizable Total Bill Input Box */}
      <div className="p-4 md:p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{currentCurrency.flag}</span>
              <label
                htmlFor="total-bill-input"
                className="block text-xs font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-200"
              >
                Total Restaurant Bill Amount ({currentCurrency.name})
              </label>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Type the exact bill from your receipt or check in {currentCurrency.symbol} {currentCurrency.code}:
            </p>
          </div>

          {/* Large Visible Bill Input */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border-2 border-amber-500 shadow-sm">
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mr-1.5 font-mono">
                {currentCurrency.symbol}
              </span>
              <input
                id="total-bill-input"
                type="number"
                step={currentCurrency.decimalDigits === 0 ? '1' : '0.01'}
                min="0"
                value={totalBillAmount === 0 ? '' : totalBillAmount}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChange({ totalBillAmount: isNaN(val) ? 0 : Math.max(0, val) });
                }}
                placeholder="0.00"
                className="w-36 sm:w-48 text-2xl sm:text-3xl font-black font-mono tracking-tight bg-transparent focus:outline-hidden text-slate-900 dark:text-white tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Quick Amount Adjustment Buttons */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            Quick adjust ({currentCurrency.symbol}):
          </span>
          {quickIncrements.map((adj) => (
            <button
              key={adj}
              type="button"
              onClick={() => handleQuickAdjust(adj)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {adj > 0 ? `+${currentCurrency.symbol}${adj}` : `${currentCurrency.symbol}${adj}`}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onChange({ totalBillAmount: 0 })}
            className="px-2.5 py-1 text-xs font-bold rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 transition-colors ml-auto cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Friends at Table Counter & Management */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold">Friends at the Table ({members.length})</span>
          </div>

          {/* Quick Plus / Minus Member Counter */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-xl border border-slate-300 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                if (members.length > 1) {
                  onRemoveMember(members[members.length - 1].id);
                }
              }}
              disabled={members.length <= 1}
              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30 cursor-pointer shadow-xs"
              title="Remove friend"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="text-xs font-mono font-bold px-2 tabular-nums">
              {members.length} {members.length === 1 ? 'person' : 'people'}
            </span>

            <button
              type="button"
              onClick={() => {
                const name = `Friend ${members.length + 1}`;
                const color = PALETTE[members.length % PALETTE.length];
                onAddMember(name, color);
              }}
              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer shadow-xs"
              title="Add friend"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Add Friend Form */}
        <form onSubmit={handleAddFriend} className="flex gap-2">
          <input
            type="text"
            placeholder="Type friend's name (e.g. Aarav, Diya, Alex)..."
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl text-xs font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-hidden focus:border-amber-500 placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span className="text-white font-bold">Add Friend</span>
          </button>
        </form>

        {/* Friend Tags List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {members.map((m) => {
            const isPayer = payerMemberId === m.id;
            return (
              <div
                key={m.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                  isPayer
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: m.avatarColor }}
                  >
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold truncate text-slate-800 dark:text-slate-100">
                    {m.name}
                  </span>
                  {isPayer && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-600 text-white shrink-0">
                      Card Payer
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Mark as card payer button */}
                  <button
                    type="button"
                    onClick={() => onChange({ payerMemberId: isPayer ? null : m.id })}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                      isPayer
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                    title={isPayer ? 'Unset payer' : `Mark ${m.name} as who paid the bill`}
                  >
                    <CreditCard className="w-3 h-3" />
                    <span>{isPayer ? 'Paid' : 'Paid?'}</span>
                  </button>

                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveMember(m.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      title="Remove friend"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
