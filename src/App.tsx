import React, { useState, useEffect, useMemo } from 'react';
import {
  BillState,
  BillItem,
  Member,
  ThemeMode,
  ThemeColor,
  AnimationSettings,
  DinnerHistoryItem,
} from './types';
import { calculateBill } from './utils/calculator';
import {
  loadActiveBill,
  saveActiveBill,
  loadThemeMode,
  saveThemeMode,
  loadThemeColor,
  saveThemeColor,
  loadAnimationSettings,
  saveAnimationSettings,
  getDinnerHistory,
  saveDinnerToHistory,
  clearDinnerHistory,
  DEFAULT_BILL_STATE,
} from './utils/storage';
import { getThemeConfig } from './utils/themes';
import { BackgroundFoodAnimation } from './components/BackgroundFoodAnimation';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { BillAndFriendsCard } from './components/BillAndFriendsCard';
import { GamifiedTipCalculator } from './components/GamifiedTipCalculator';
import { SummaryReceipt } from './components/SummaryReceipt';
import { ItemsManager } from './components/ItemsManager';
import { ShareModal } from './components/ShareModal';
import { ThemeSelector } from './components/ThemeSelector';
import { HistoryDrawer } from './components/HistoryDrawer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { ChromeExportModal } from './components/ChromeExportModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { initAuth } from './utils/firebaseAuth';
import { User } from 'firebase/auth';

export default function App() {
  // 1. State
  const [billState, setBillState] = useState<BillState>(() => loadActiveBill());
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => loadThemeMode());
  const [themeColor, setThemeColor] = useState<ThemeColor>(() => loadThemeColor());
  const [animationSettings, setAnimationSettings] = useState<AnimationSettings>(() =>
    loadAnimationSettings()
  );
  const [history, setHistory] = useState<DinnerHistoryItem[]>(() => getDinnerHistory());

  // UI state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isChromeModalOpen, setIsChromeModalOpen] = useState(false);
  const [isGoogleDriveModalOpen, setIsGoogleDriveModalOpen] = useState(false);
  const [driveUser, setDriveUser] = useState<User | null>(null);
  const [isItemsOpen, setIsItemsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Monitor Google Drive authentication state
  useEffect(() => {
    const unsub = initAuth(
      (user) => setDriveUser(user),
      () => setDriveUser(null)
    );
    return () => unsub();
  }, []);

  // Compute active theme
  const currentTheme = useMemo(
    () => getThemeConfig(themeMode, themeColor),
    [themeMode, themeColor]
  );

  // Auto-save bill state (Req 9: Persistence on reload)
  useEffect(() => {
    saveActiveBill(billState);
  }, [billState]);

  // Sync body class & dark class on html
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.body.className = `${currentTheme.bgClass} antialiased transition-colors duration-200`;
  }, [themeMode, currentTheme]);

  // Handle URL share hash on load
  useEffect(() => {
    if (window.location.hash.includes('share=')) {
      setToastMessage('🎉 Shared friendship bill loaded from QR / Link!');
      setTimeout(() => setToastMessage(null), 3500);
    }
  }, []);

  // 2. Calculations
  const result = useMemo(() => {
    return calculateBill(billState);
  }, [billState]);

  const handleUpdateBill = (updates: Partial<BillState>) => {
    setBillState((prev) => ({ ...prev, ...updates }));
  };

  const handleToggleThemeMode = () => {
    const nextMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
    saveThemeMode(nextMode);
  };

  const handleSelectThemeColor = (color: ThemeColor) => {
    setThemeColor(color);
    saveThemeColor(color);
  };

  const handleUpdateAnimation = (updates: Partial<AnimationSettings>) => {
    setAnimationSettings((prev) => {
      const next = { ...prev, ...updates };
      saveAnimationSettings(next);
      return next;
    });
  };

  // Member management
  const handleAddMember = (name: string, avatarColor: string) => {
    const newMember: Member = {
      id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      avatarColor,
      useCustomTip: false,
    };
    setBillState((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }));
  };

  const handleRemoveMember = (id: string) => {
    setBillState((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id),
      payerMemberId: prev.payerMemberId === id ? null : prev.payerMemberId,
      items: prev.items.map((item) => ({
        ...item,
        assignedMemberIds: item.assignedMemberIds.filter((mId) => mId !== id),
      })),
    }));
  };

  const handleUpdateMember = (id: string, updates: Partial<Member>) => {
    setBillState((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  };

  // Items management
  const handleAddItem = (item: Omit<BillItem, 'id'>) => {
    const newItem: BillItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setBillState((prev) => {
      const nextItems = [newItem, ...prev.items];
      // Sync totalBillAmount if in itemized mode
      const totalFromItems = nextItems.reduce(
        (sum, it) => sum + it.price * it.quantity,
        0
      );
      return {
        ...prev,
        items: nextItems,
        totalBillAmount: totalFromItems,
      };
    });
  };

  const handleUpdateItem = (id: string, updates: Partial<BillItem>) => {
    setBillState((prev) => {
      const nextItems = prev.items.map((it) => (it.id === id ? { ...it, ...updates } : it));
      const totalFromItems = nextItems.reduce(
        (sum, it) => sum + it.price * it.quantity,
        0
      );
      return {
        ...prev,
        items: nextItems,
        totalBillAmount: totalFromItems,
      };
    });
  };

  const handleRemoveItem = (id: string) => {
    setBillState((prev) => {
      const nextItems = prev.items.filter((it) => it.id !== id);
      const totalFromItems = nextItems.reduce(
        (sum, it) => sum + it.price * it.quantity,
        0
      );
      return {
        ...prev,
        items: nextItems,
        totalBillAmount: totalFromItems,
      };
    });
  };

  // History
  const handleSaveToHistory = () => {
    const historyItem: DinnerHistoryItem = {
      id: `hist_${Date.now()}`,
      title: billState.title,
      timestamp: Date.now(),
      memberCount: billState.members.length,
      grandTotal: result.grandTotal,
      tipTotal: result.totalTipAmount,
      currencyCode: billState.currencyCode || 'INR',
      billState: { ...billState },
    };
    const updated = saveDinnerToHistory(historyItem);
    setHistory(updated);
    setToastMessage('✅ Dinner saved to history log!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLoadHistory = (item: DinnerHistoryItem) => {
    setBillState({
      ...item.billState,
      createdAt: Date.now(),
    });
    setToastMessage(`📖 Loaded "${item.title}" from history`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResetBill = () => {
    if (window.confirm('Reset this dinner bill to $120 default?')) {
      setBillState({
        ...DEFAULT_BILL_STATE,
        title: 'Friendship Dinner',
        createdAt: Date.now(),
      });
      window.location.hash = '';
      setToastMessage('Bill reset to new dinner');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const count = billState.members.length;
  const perPersonEstimate = count > 0 ? result.grandTotal / count : 0;

  return (
    <div className={`min-h-screen relative flex flex-col font-sans transition-colors duration-200 ${currentTheme.bgClass}`}>
      {/* Background Animated Food Backdrop */}
      <BackgroundFoodAnimation settings={animationSettings} themeId={themeColor} />

      {/* Top Header with Light/Dark Mode switch */}
      <Header
        theme={currentTheme}
        themeMode={themeMode}
        driveUser={driveUser}
        onToggleThemeMode={handleToggleThemeMode}
        onOpenColorModal={() => setIsThemeModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenChromeModal={() => setIsChromeModalOpen(true)}
        onOpenGoogleDriveModal={() => setIsGoogleDriveModalOpen(true)}
        onResetBill={handleResetBill}
      />

      {/* Toast Banner */}
      {toastMessage && (
        <aside
          aria-label="Notification"
          className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-2xl border border-slate-700 animate-in fade-in duration-200"
        >
          {toastMessage}
        </aside>
      )}

      {/* Main Content: Clean, Simple, Intuitive 3-Step Flow */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 pb-24 md:pb-12 z-10 space-y-6">
        {/* Hero Banner with Food Feast and Mascot */}
        <HeroBanner theme={currentTheme} memberCount={billState.members.length} />

        {/* Step 1: Customizable Total Bill & Friends */}
        <section aria-label="Step 1: Bill and Friends">
          <BillAndFriendsCard
            billState={billState}
            onChange={handleUpdateBill}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
            onUpdateMember={handleUpdateMember}
            theme={currentTheme}
            perPersonEstimate={perPersonEstimate}
          />
        </section>

        {/* Step 2: Tip Calculator & Generosity Meter */}
        <section aria-label="Step 2: Tip Calculator">
          <GamifiedTipCalculator
            billState={billState}
            onChange={handleUpdateBill}
            onUpdateMember={handleUpdateMember}
            theme={currentTheme}
            estimatedTipAmount={result.totalTipAmount}
          />
        </section>

        {/* Step 3: Clear Settlement Summary */}
        <section aria-label="Step 3: Settlement Summary">
          <SummaryReceipt
            billState={billState}
            result={result}
            theme={currentTheme}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onSaveToHistory={handleSaveToHistory}
            onOpenChromeModal={() => setIsChromeModalOpen(true)}
            onOpenGoogleDriveModal={() => setIsGoogleDriveModalOpen(true)}
          />
        </section>

        {/* Optional: Itemized Dishes Accordion */}
        <section aria-label="Optional itemized dishes">
          <ItemsManager
            items={billState.items}
            members={billState.members}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
            theme={currentTheme}
            isOpen={isItemsOpen}
            onToggleOpen={() => setIsItemsOpen(!isItemsOpen)}
          />
        </section>
      </main>

      {/* Mobile Sticky Settlement Bar */}
      <MobileStickyBar
        result={result}
        theme={currentTheme}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onScrollToSummary={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
        memberCount={billState.members.length}
        currencyCode={billState.currencyCode}
      />

      {/* Modals */}
      <ShareModal
        billState={billState}
        result={result}
        theme={currentTheme}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <ChromeExportModal
        isOpen={isChromeModalOpen}
        onClose={() => setIsChromeModalOpen(false)}
        theme={currentTheme}
      />

      <ThemeSelector
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        themeMode={themeMode}
        onSelectThemeMode={(m) => {
          setThemeMode(m);
          saveThemeMode(m);
        }}
        themeColor={themeColor}
        onSelectThemeColor={handleSelectThemeColor}
        animationSettings={animationSettings}
        onUpdateAnimationSettings={handleUpdateAnimation}
        currentTheme={currentTheme}
      />

      <HistoryDrawer
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onLoadHistory={handleLoadHistory}
        onClearHistory={() => {
          clearDinnerHistory();
          setHistory([]);
        }}
        theme={currentTheme}
      />

      <GoogleDriveModal
        isOpen={isGoogleDriveModalOpen}
        onClose={() => setIsGoogleDriveModalOpen(false)}
        theme={currentTheme}
        currentBill={billState}
        calculationResult={result}
        onLoadBill={(loaded) => setBillState(loaded)}
        onShowToast={(msg) => {
          setToastMessage(msg);
          setTimeout(() => setToastMessage(null), 3500);
        }}
      />
    </div>
  );
}
