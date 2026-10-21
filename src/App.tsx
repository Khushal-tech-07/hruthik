import React, { useState, useEffect, useMemo } from 'react';
import { Language, Theme, User, Transaction, ShopConfig } from './types';
import {
  getPersistedUser,
  signOutUser,
  subscribeToAuth,
  subscribeToUserTransactions,
  saveTransactionToFirestore,
  deleteTransactionFromFirestore
} from './services/firebase';
import { downloadDailySalesReport, sendReportToWhatsApp } from './services/pdfGenerator';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { TransactionForm } from './components/TransactionForm';
import { TransactionsTable } from './components/TransactionsTable';
import { ShopSettingsModal } from './components/ShopSettingsModal';
import { VercelDeployModal } from './components/VercelDeployModal';

// Storage Keys
const STORAGE_THEME = 'hruthik_kirana_theme';
const STORAGE_LANG = 'hruthik_kirana_language';
const STORAGE_TRANSACTIONS = 'hruthik_kirana_transactions_v2';
const STORAGE_SHOP_CONFIG = 'hruthik_kirana_shop_config_v2';

const DEFAULT_SHOP_CONFIG: ShopConfig = {
  name: 'Hruthik Kirana Store',
  ownerName: 'Hruthik',
  phone: '+91 6380412552',
  whatsappNumber: '6380412552',
  address: 'Bazaar Main Road, Market Area',
  currencySymbol: '₹',
};

export default function App() {
  // 1. Language State (English & Telugu only)
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_LANG);
    return saved === 'te' ? 'te' : 'en';
  });

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem(STORAGE_LANG, lang);
  };

  // 2. Theme State (Light / Dark / System)
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_THEME);
    return (saved as Theme) || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isDark =
        currentTheme === 'dark' || (currentTheme === 'system' && mediaQuery.matches);
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();
    localStorage.setItem(STORAGE_THEME, currentTheme);

    const listener = () => {
      if (currentTheme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [currentTheme]);

  // 3. Real-time Firebase Authentication State
  const [user, setUser] = useState<User | null>(() => getPersistedUser());

  useEffect(() => {
    // Subscribe to real-time auth changes from Firebase
    const unsubscribeAuth = subscribeToAuth((updatedUser) => {
      setUser(updatedUser);
    });
    return () => unsubscribeAuth();
  }, []);

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
  };

  // 4. Shop Configuration State
  const [shopConfig, setShopConfig] = useState<ShopConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SHOP_CONFIG);
      return saved ? JSON.parse(saved) : DEFAULT_SHOP_CONFIG;
    } catch {
      return DEFAULT_SHOP_CONFIG;
    }
  });

  const handleSaveShopConfig = (cfg: ShopConfig) => {
    setShopConfig(cfg);
    localStorage.setItem(STORAGE_SHOP_CONFIG, JSON.stringify(cfg));
  };

  // 5. Date selection for viewing/exporting
  const todayIso = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayIso);

  // 6. Transactions State (Synced in Real-Time with Firestore when logged in)
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TRANSACTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Real-time Firestore sync when authenticated
  useEffect(() => {
    if (!user || user.isDemo) return;

    const unsubscribeTx = subscribeToUserTransactions(user.uid, (remoteTransactions) => {
      setAllTransactions(remoteTransactions);
      localStorage.setItem(STORAGE_TRANSACTIONS, JSON.stringify(remoteTransactions));
    });

    return () => unsubscribeTx();
  }, [user]);

  // Local storage backup persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_TRANSACTIONS, JSON.stringify(allTransactions));
  }, [allTransactions]);

  // Filter transactions for the selected date
  const dateTransactions = useMemo(() => {
    return allTransactions
      .filter((tx) => tx.dateStr === selectedDate)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [allTransactions, selectedDate]);

  // 7. Modals State
  const [isShopSettingsOpen, setIsShopSettingsOpen] = useState(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);

  // Handlers for Transactions
  const handleAddTransaction = async (data: {
    description: string;
    gpayAmount: number;
    cashAmount: number;
  }) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const newTx: Transaction = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now(),
      dateStr,
      timeStr,
      description: data.description,
      gpayAmount: data.gpayAmount,
      cashAmount: data.cashAmount,
      totalAmount: data.gpayAmount + data.cashAmount,
    };

    // Update state immediately for instant feedback
    setAllTransactions((prev) => [newTx, ...prev]);

    // Sync to Firestore in real-time if user is logged in with Firebase
    if (user && !user.isDemo) {
      try {
        await saveTransactionToFirestore(user.uid, newTx);
      } catch (err) {
        console.warn("Failed to sync transaction to Firestore:", err);
      }
    }

    if (selectedDate !== dateStr) {
      setSelectedDate(dateStr);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    setAllTransactions((prev) => prev.filter((tx) => tx.id !== id));

    if (user && !user.isDemo) {
      try {
        await deleteTransactionFromFirestore(user.uid, id);
      } catch (err) {
        console.warn("Failed to delete transaction from Firestore:", err);
      }
    }
  };

  const handleClearDayData = async () => {
    const toDelete = allTransactions.filter((tx) => tx.dateStr === selectedDate);
    setAllTransactions((prev) => prev.filter((tx) => tx.dateStr !== selectedDate));

    if (user && !user.isDemo) {
      for (const tx of toDelete) {
        try {
          await deleteTransactionFromFirestore(user.uid, tx.id);
        } catch (err) {
          console.warn("Error clearing day transaction:", err);
        }
      }
    }
  };

  // Download PDF Report locally
  const handleDownloadPdf = () => {
    if (!user) return;
    downloadDailySalesReport({
      transactions: dateTransactions,
      user,
      shopConfig,
      selectedDate,
    });
  };

  // Send Daily Report & PDF to WhatsApp (6380412552)
  const handleSendWhatsapp = () => {
    if (!user) return;
    sendReportToWhatsApp({
      transactions: dateTransactions,
      user,
      shopConfig,
      selectedDate,
    });
  };

  // If not logged in, render the Google Login Screen
  if (!user) {
    return (
      <LoginScreen
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}
        shopName={shopConfig.name}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* 1. Navbar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        onOpenShopSettingsModal={() => setIsShopSettingsOpen(true)}
        onOpenVercelModal={() => setIsVercelModalOpen(true)}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        shopConfig={shopConfig}
        onSendWhatsapp={handleSendWhatsapp}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-6 space-y-6">
        
        {/* 2. Live Summary Cards (G-Pay, Hand Cash, Grand Total) & WhatsApp Action */}
        <SummaryCards
          transactions={dateTransactions}
          currentLanguage={currentLanguage}
          onDownloadPdf={handleDownloadPdf}
          onSendWhatsapp={handleSendWhatsapp}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          whatsappNumber={shopConfig.whatsappNumber}
        />

        {/* 3. Transaction Entry Form (Simple G-Pay & Cash Fast Entry) */}
        <TransactionForm
          currentLanguage={currentLanguage}
          onAddTransaction={handleAddTransaction}
        />

        {/* 4. Transactions Table */}
        <TransactionsTable
          transactions={dateTransactions}
          currentLanguage={currentLanguage}
          onDeleteTransaction={handleDeleteTransaction}
          onClearDayData={handleClearDayData}
          onDownloadPdf={handleDownloadPdf}
          onSendWhatsapp={handleSendWhatsapp}
          whatsappNumber={shopConfig.whatsappNumber}
        />

      </main>

      {/* Shop Profile Settings Modal */}
      <ShopSettingsModal
        isOpen={isShopSettingsOpen}
        onClose={() => setIsShopSettingsOpen(false)}
        shopConfig={shopConfig}
        onSaveShopConfig={handleSaveShopConfig}
        currentLanguage={currentLanguage}
      />

      {/* Vercel Deploy & Hosting Modal */}
      <VercelDeployModal
        isOpen={isVercelModalOpen}
        onClose={() => setIsVercelModalOpen(false)}
        currentLanguage={currentLanguage}
      />

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-center gap-3 mb-2">
          <p>
            <strong className="text-slate-700 dark:text-slate-300">{shopConfig.name}</strong> &bull; {shopConfig.ownerName} &bull; Realtime Firebase Sync
          </p>
          <button
            type="button"
            onClick={() => setIsVercelModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 hover:bg-black text-white text-[11px] font-bold shadow-xs tap-spring cursor-pointer"
          >
            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 1155 1000">
              <path d="m577.3 0 577.4 1000H0z" />
            </svg>
            <span>Host on Vercel ▲</span>
          </button>
        </div>
        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
          Amounts in INR (₹) &bull; Automatic WhatsApp Dispatch to {shopConfig.whatsappNumber}
        </p>
      </footer>
    </div>
  );
}
