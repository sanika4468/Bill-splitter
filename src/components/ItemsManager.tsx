import React, { useState } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import { BillItem, Member, ThemeConfig } from '../types';

interface Props {
  items: BillItem[];
  members: Member[];
  onAddItem: (item: Omit<BillItem, 'id'>) => void;
  onUpdateItem: (id: string, updates: Partial<BillItem>) => void;
  onRemoveItem: (id: string) => void;
  theme: ThemeConfig;
  isOpen: boolean;
  onToggleOpen: () => void;
}

const CATEGORIES: { id: BillItem['category']; label: string; icon: string }[] = [
  { id: 'appetizer', label: 'Starter', icon: '🥗' },
  { id: 'main', label: 'Main', icon: '🍝' },
  { id: 'drink', label: 'Drink', icon: '🍹' },
  { id: 'dessert', label: 'Dessert', icon: '🍰' },
  { id: 'other', label: 'Other', icon: '🍽️' },
];

export const ItemsManager: React.FC<Props> = ({
  items,
  members,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  theme,
  isOpen,
  onToggleOpen,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [category, setCategory] = useState<BillItem['category']>('main');
  const [assignedMemberIds, setAssignedMemberIds] = useState<string[]>([]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const p = parseFloat(price);
    if (isNaN(p) || p <= 0) return;

    onAddItem({
      name: name.trim() || `Item ${items.length + 1}`,
      price: p,
      quantity: Math.max(1, quantity),
      category,
      assignedMemberIds,
    });

    setName('');
    setPrice('');
    setQuantity(1);
    setAssignedMemberIds([]);
  };

  const toggleAssignee = (memberId: string) => {
    if (assignedMemberIds.length === 0) {
      setAssignedMemberIds([memberId]);
    } else if (assignedMemberIds.includes(memberId)) {
      setAssignedMemberIds(assignedMemberIds.filter((id) => id !== memberId));
    } else {
      setAssignedMemberIds([...assignedMemberIds, memberId]);
    }
  };

  const handleToggleItemMember = (item: BillItem, memberId: string) => {
    let current = item.assignedMemberIds;
    if (current.length === 0) {
      const allIds = members.map((m) => m.id);
      current = allIds.filter((id) => id !== memberId);
    } else if (current.includes(memberId)) {
      current = current.filter((id) => id !== memberId);
    } else {
      current = [...current, memberId];
    }
    onUpdateItem(item.id, { assignedMemberIds: current });
  };

  return (
    <div className={`rounded-3xl border transition-all ${theme.cardBg} overflow-hidden`}>
      {/* Accordion Header */}
      <div
        onClick={onToggleOpen}
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-500/5 transition-colors"
      >
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black tracking-tight">
              Optional: Itemize Individual Dishes
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
              {items.length} dishes
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isOpen
              ? 'Click to collapse dish items list'
              : 'Want to assign who ate what? Click to expand itemized list.'}
          </p>
        </div>

        <button
          type="button"
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs"
        >
          {isOpen ? 'Close Dishes' : 'Expand Dishes'}
        </button>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className="p-5 pt-0 border-t border-slate-200 dark:border-slate-800 space-y-4">
          {/* Add Item Form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-6 flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600">
                <span className="text-sm">
                  {CATEGORIES.find((c) => c.id === category)?.icon || '🍽️'}
                </span>
                <input
                  type="text"
                  placeholder="Dish or drink name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-3 flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600">
                <span className="text-xs font-bold text-slate-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-transparent text-xs font-mono font-bold focus:outline-hidden tabular-nums"
                  required
                />
              </div>

              <div className="sm:col-span-3 flex items-center justify-between bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600">
                <span className="text-xs font-bold text-slate-500">Qty:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="font-mono text-xs font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Assignment Buttons - High Contrast, Clear Text */}
            <div className="flex items-center justify-between gap-2 flex-wrap pt-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Shared by:
                </span>
                {/* Everyone button with bright, visible colors */}
                <button
                  type="button"
                  onClick={() => setAssignedMemberIds([])}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    assignedMemberIds.length === 0
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600'
                  }`}
                >
                  All Friends
                </button>

                {members.map((m) => {
                  const isAssigned =
                    assignedMemberIds.length > 0 && assignedMemberIds.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleAssignee(m.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                        isAssigned
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: m.avatarColor }}
                      />
                      <span>{m.name}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4 text-white" />
                <span className="text-white font-bold">Add Item</span>
              </button>
            </div>
          </form>

          {/* Items List */}
          <div className="space-y-2">
            {items.map((item) => {
              const isSplitAll =
                item.assignedMemberIds.length === 0 ||
                item.assignedMemberIds.length === members.length;
              const lineTotal = item.price * item.quantity;
              const splitCount = isSplitAll ? members.length : item.assignedMemberIds.length;
              const costPerPerson = splitCount > 0 ? lineTotal / splitCount : lineTotal;

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] font-mono px-1 rounded bg-slate-100 dark:bg-slate-800">
                          x{item.quantity}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono font-bold">
                      ${lineTotal.toFixed(2)} (${costPerPerson.toFixed(2)}/ea)
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Clear high contrast buttons */}
                    <button
                      type="button"
                      onClick={() => onUpdateItem(item.id, { assignedMemberIds: [] })}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                        isSplitAll
                          ? 'bg-amber-600 text-white font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      All
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
