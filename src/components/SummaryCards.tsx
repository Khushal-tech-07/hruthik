import React from 'react';
import { Language, Transaction } from '../types';
import { translations } from '../i18n/translations';
import { Smartphone, Banknote, IndianRupee, FileDown, ReceiptText, Calendar, MessageCircle } from 'lucide-react';
import { sound } from '../services/sound';

interface SummaryCardsProps {
  transactions: Transaction[];
  currentLanguage: Language;
  onDownloadPdf: () => void;
  onSendWhatsapp: () => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  whatsappNumber: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  transactions,
  currentLanguage,
  onDownloadPdf,
  onSendWhatsapp,
  selectedDate,
  onDateChange,
  whatsappNumber,
}) => {
  const t = translations[currentLanguage];

  const totalGpay = transactions.reduce((acc, t) => acc + (t.gpayAmount || 0), 0);
  const totalCash = transactions.reduce((acc, t) => acc + (t.cashAmount || 0), 0);
  const grandTotal = totalGpay + totalCash;
  const count = transactions.length;

  const gpayPercentage = grandTotal > 0 ? Math.round((totalGpay / grandTotal) * 100) : 0;
  const cashPercentage = grandTotal > 0 ? 100 - gpayPercentage : 0;
  const avgBill = count > 0 ? (grandTotal / count).toFixed(0) : '0';

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  const handleWhatsappClick = () => {
    sound.playTap();
    onSendWhatsapp();
  };

  const handlePdfClick = () => {
    sound.playTap();
    onDownloadPdf();
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Date & Giant WhatsApp Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
        
        {/* Date Selector */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
              Viewing Sales For:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="text-sm sm:text-base font-extrabold bg-transparent border-0 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-0 cursor-pointer"
              />
              {isToday && (
                <span className="text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                  Today
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Big Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Giant WhatsApp Button */}
          <button
            type="button"
            onClick={handleWhatsappClick}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2.5 px-5 py-3 text-sm sm:text-base font-black rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-green-500/25 tap-spring cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Send to WhatsApp ({whatsappNumber || '6380412552'})</span>
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handlePdfClick}
            title={t.downloadPdf}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 tap-spring cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Daily PDF</span>
          </button>
        </div>
      </div>

      {/* 3 Prominent Metric Cards (Ultra-High Contrast, Big Digits) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        
        {/* Card 1: G-Pay (Blue) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-white dark:to-slate-900 p-5 border-3 border-blue-400/60 dark:border-blue-700/60 shadow-md tap-spring">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" />
                📱 {t.gpayEarnings}
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-blue-950 dark:text-blue-100 tracking-tight">
                  ₹{totalGpay.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
              <Smartphone className="w-6 h-6" />
            </div>
          </div>
          
          <div className="mt-3 flex items-center justify-between text-xs text-blue-800/80 dark:text-blue-300 pt-2 border-t border-blue-100 dark:border-blue-900/60 font-bold">
            <span>Online / QR</span>
            <span>{gpayPercentage}% share</span>
          </div>
        </div>

        {/* Card 2: Hand Cash (Green) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white dark:to-slate-900 p-5 border-3 border-emerald-400/60 dark:border-emerald-700/60 shadow-md tap-spring">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Banknote className="w-4 h-4" />
                💵 {t.cashEarnings}
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-950 dark:text-emerald-100 tracking-tight">
                  ₹{totalCash.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
              <Banknote className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-emerald-800/80 dark:text-emerald-300 pt-2 border-t border-emerald-100 dark:border-emerald-900/60 font-bold">
            <span>Cash Notes</span>
            <span>{cashPercentage}% share</span>
          </div>
        </div>

        {/* Card 3: Grand Total Today (Amber / Gold) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-white dark:to-slate-900 p-5 border-3 border-amber-400/70 dark:border-amber-700/70 shadow-md tap-spring">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4" />
                💰 {t.grandTotal}
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-amber-950 dark:text-amber-100 tracking-tight">
                  ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30 font-black">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 pt-2 border-t border-amber-100 dark:border-amber-900/60 font-bold">
            <span className="flex items-center gap-1">
              <ReceiptText className="w-3.5 h-3.5" />
              {count} {t.totalSalesCount}
            </span>
            <span>{t.avgBill}: ₹{avgBill}</span>
          </div>
        </div>

      </div>

      {/* Split Ratio Bar */}
      {grandTotal > 0 && (
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs font-bold">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              📱 G-Pay: ₹{totalGpay.toFixed(0)} ({gpayPercentage}%)
            </span>
            <span className="text-slate-400 text-[11px] font-medium">Split Ratio</span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              💵 Cash: ₹{totalCash.toFixed(0)} ({cashPercentage}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex p-0.5">
            <div
              style={{ width: `${gpayPercentage}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-l-full transition-all duration-300"
            />
            <div
              style={{ width: `${cashPercentage}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-r-full transition-all duration-300"
            />
          </div>
        </div>
      )}
    </div>
  );
};
