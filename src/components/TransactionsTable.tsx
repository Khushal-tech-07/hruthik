import React, { useState } from 'react';
import { Transaction, Language } from '../types';
import { translations } from '../i18n/translations';
import {
  Search,
  Trash2,
  FileDown,
  AlertTriangle,
  Receipt,
  Smartphone,
  Banknote,
  Split,
  Clock,
  Share2
} from 'lucide-react';

interface TransactionsTableProps {
  transactions: Transaction[];
  currentLanguage: Language;
  onDeleteTransaction: (id: string) => void;
  onClearDayData: () => void;
  onDownloadPdf: () => void;
  onSendWhatsapp: () => void;
  whatsappNumber: string;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  currentLanguage,
  onDeleteTransaction,
  onClearDayData,
  onDownloadPdf,
  onSendWhatsapp,
  whatsappNumber,
}) => {
  const t = translations[currentLanguage];
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'gpay' | 'cash' | 'split'>('all');
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  const filteredTransactions = transactions.filter((tx) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchDesc = tx.description.toLowerCase().includes(q);
      const matchAmount = tx.totalAmount.toString().includes(q);
      if (!matchDesc && !matchAmount) return false;
    }

    if (paymentFilter === 'gpay') {
      return tx.gpayAmount > 0 && tx.cashAmount === 0;
    }
    if (paymentFilter === 'cash') {
      return tx.cashAmount > 0 && tx.gpayAmount === 0;
    }
    if (paymentFilter === 'split') {
      return tx.gpayAmount > 0 && tx.cashAmount > 0;
    }

    return true;
  });

  const visibleGpay = filteredTransactions.reduce((acc, t) => acc + (t.gpayAmount || 0), 0);
  const visibleCash = filteredTransactions.reduce((acc, t) => acc + (t.cashAmount || 0), 0);
  const visibleTotal = visibleGpay + visibleCash;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
      
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {t.transactionsList}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {filteredTransactions.length} of {transactions.length} entries shown
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={onSendWhatsapp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-xs tap-spring cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp ({whatsappNumber || '6380412552'})</span>
            </button>

            <button
              type="button"
              onClick={onDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs tap-spring cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{t.downloadPdf}</span>
            </button>

            {transactions.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 tap-spring cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.clearDayData}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls: Search & Chips */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setPaymentFilter('all')}
              className={`px-2.5 py-1.5 text-xs rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                paymentFilter === 'all'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {t.allPayments}
            </button>
            <button
              type="button"
              onClick={() => setPaymentFilter('gpay')}
              className={`px-2.5 py-1.5 text-xs rounded-lg font-semibold whitespace-nowrap flex items-center gap-1 transition-colors cursor-pointer ${
                paymentFilter === 'gpay'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              {t.gpayOnly}
            </button>
            <button
              type="button"
              onClick={() => setPaymentFilter('cash')}
              className={`px-2.5 py-1.5 text-xs rounded-lg font-semibold whitespace-nowrap flex items-center gap-1 transition-colors cursor-pointer ${
                paymentFilter === 'cash'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <Banknote className="w-3 h-3" />
              {t.cashOnly}
            </button>
            <button
              type="button"
              onClick={() => setPaymentFilter('split')}
              className={`px-2.5 py-1.5 text-xs rounded-lg font-semibold whitespace-nowrap flex items-center gap-1 transition-colors cursor-pointer ${
                paymentFilter === 'split'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
              }`}
            >
              <Split className="w-3 h-3" />
              {t.splitOnly}
            </button>
          </div>
        </div>

      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4 w-28">{t.time}</th>
              <th className="py-3 px-4">{t.description}</th>
              <th className="py-3 px-4 text-right w-36 text-blue-700 dark:text-blue-400">G-Pay (₹)</th>
              <th className="py-3 px-4 text-right w-36 text-emerald-700 dark:text-emerald-400">Hand Cash (₹)</th>
              <th className="py-3 px-4 text-right w-36 font-bold text-slate-900 dark:text-white">Total (₹)</th>
              <th className="py-3 px-4 text-center w-20">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 px-4 text-slate-400 dark:text-slate-500">
                  <Receipt className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-medium">{t.noTransactions}</p>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {tx.timeStr}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {tx.description}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-blue-600 dark:text-blue-400">
                    {tx.gpayAmount > 0 ? `₹${tx.gpayAmount.toFixed(2)}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {tx.cashAmount > 0 ? `₹${tx.cashAmount.toFixed(2)}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-900 dark:text-white text-sm">
                    ₹{tx.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onDeleteTransaction(tx.id)}
                      title={t.delete}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {filteredTransactions.length > 0 && (
            <tfoot className="bg-slate-100 dark:bg-slate-800/90 font-bold border-t-2 border-slate-300 dark:border-slate-700">
              <tr>
                <td colSpan={2} className="py-3 px-4 text-slate-800 dark:text-slate-200">
                  {t.total} ({filteredTransactions.length} bills)
                </td>
                <td className="py-3 px-4 text-right font-mono text-blue-700 dark:text-blue-300">
                  ₹{visibleGpay.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right font-mono text-emerald-700 dark:text-emerald-300">
                  ₹{visibleCash.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-900 dark:text-white text-sm font-extrabold">
                  ₹{visibleTotal.toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Mobile Rows */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-10 px-4 text-slate-400">
            <Receipt className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-xs">{t.noTransactions}</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div key={tx.id} className="p-3.5 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {tx.description}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {tx.timeStr}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-extrabold text-base text-slate-900 dark:text-white">
                    ₹{tx.totalAmount.toFixed(2)}
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteTransaction(tx.id)}
                    className="text-slate-400 hover:text-red-500 p-1 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 inline" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100 dark:border-slate-800/80 font-mono">
                <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Smartphone className="w-3 h-3" />
                  G-Pay: ₹{tx.gpayAmount.toFixed(2)}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Banknote className="w-3 h-3" />
                  Cash: ₹{tx.cashAmount.toFixed(2)}
                </span>
              </div>
            </div>
          ))
        )}

        {filteredTransactions.length > 0 && (
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 text-xs font-bold space-y-1">
            <div className="flex justify-between">
              <span>{t.total} ({filteredTransactions.length} bills):</span>
              <span className="font-mono text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                ₹{visibleTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>G-Pay: ₹{visibleGpay.toFixed(2)}</span>
              <span>Cash: ₹{visibleCash.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="p-2.5 rounded-full bg-red-100 dark:bg-red-950/60">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {t.clearDayData}
                </h3>
                <p className="text-xs text-slate-500">Irreversible Action</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              {t.clearDayConfirm}
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearDayData();
                  setShowClearConfirmModal(false);
                }}
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
