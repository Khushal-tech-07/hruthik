import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import {
  Smartphone,
  Banknote,
  RotateCcw,
  Split,
  CheckCircle2,
  Delete,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../services/sound';

interface TransactionFormProps {
  currentLanguage: Language;
  onAddTransaction: (data: {
    description: string;
    gpayAmount: number;
    cashAmount: number;
  }) => void;
}

// Visual Indian Currency Note Presets
const CURRENCY_NOTES = [
  { value: 10, label: '₹10', bg: 'bg-amber-700/90 text-amber-50 hover:bg-amber-800 border-amber-600', ring: 'ring-amber-500' },
  { value: 20, label: '₹20', bg: 'bg-lime-700/90 text-lime-50 hover:bg-lime-800 border-lime-600', ring: 'ring-lime-500' },
  { value: 50, label: '₹50', bg: 'bg-cyan-600/90 text-cyan-50 hover:bg-cyan-700 border-cyan-500', ring: 'ring-cyan-400' },
  { value: 100, label: '₹100', bg: 'bg-purple-600/90 text-purple-50 hover:bg-purple-700 border-purple-500', ring: 'ring-purple-400' },
  { value: 200, label: '₹200', bg: 'bg-orange-600/90 text-orange-50 hover:bg-orange-700 border-orange-500', ring: 'ring-orange-400' },
  { value: 500, label: '₹500', bg: 'bg-emerald-700/90 text-emerald-50 hover:bg-emerald-800 border-emerald-600', ring: 'ring-emerald-500' },
];

export const TransactionForm: React.FC<TransactionFormProps> = ({
  currentLanguage,
  onAddTransaction,
}) => {
  const t = translations[currentLanguage];

  // Active Amount on the visual register
  const [amountStr, setAmountStr] = useState<string>('0');
  // Payment Type: 'cash' | 'gpay' | 'split'
  const [paymentMode, setPaymentMode] = useState<'cash' | 'gpay' | 'split'>('cash');
  // Optional note/description (can be typed or left empty)
  const [description, setDescription] = useState<string>('');
  const [isSoundMuted, setIsSoundMuted] = useState(!sound.enabled);
  const [justAddedAnim, setJustAddedAnim] = useState(false);

  const numAmount = parseFloat(amountStr) || 0;

  // Split calculation
  const [splitGpayStr, setSplitGpayStr] = useState<string>('0');
  const [splitCashStr, setSplitCashStr] = useState<string>('0');

  // Handle Numpad Button Clicks
  const handleKeypadPress = (val: string) => {
    sound.playTap();
    if (amountStr === '0') {
      if (val === '00' || val === '0') return;
      setAmountStr(val);
    } else {
      if (amountStr.length >= 7) return; // Prevent unreasonable digits
      setAmountStr(amountStr + val);
    }
  };

  const handleBackspace = () => {
    sound.playTap();
    if (amountStr.length <= 1) {
      setAmountStr('0');
    } else {
      setAmountStr(amountStr.slice(0, -1));
    }
  };

  const handleClear = () => {
    sound.playTap();
    setAmountStr('0');
    setSplitGpayStr('0');
    setSplitCashStr('0');
  };

  // Add Currency Note (+10, +50, +100, etc.)
  const handleAddNote = (val: number) => {
    sound.playNote();
    const current = parseFloat(amountStr) || 0;
    const next = current + val;
    setAmountStr(next.toString());

    // Trigger visual bump
    setJustAddedAnim(true);
    setTimeout(() => setJustAddedAnim(false), 200);
  };

  // Switch Payment Mode
  const handleSelectMode = (mode: 'cash' | 'gpay' | 'split') => {
    sound.playTap();
    setPaymentMode(mode);
    if (mode === 'split') {
      const half = Math.round((numAmount / 2) * 100) / 100;
      setSplitGpayStr(half.toString());
      setSplitCashStr((numAmount - half).toString());
    }
  };

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setIsSoundMuted(!sound.enabled);
  };

  // Submit Sale
  const handleSubmitSale = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (numAmount <= 0) {
      sound.playTap();
      return;
    }

    let finalGpay = 0;
    let finalCash = 0;

    if (paymentMode === 'cash') {
      finalCash = numAmount;
    } else if (paymentMode === 'gpay') {
      finalGpay = numAmount;
    } else {
      // Split
      finalGpay = parseFloat(splitGpayStr) || (numAmount / 2);
      finalCash = parseFloat(splitCashStr) || (numAmount - finalGpay);
    }

    onAddTransaction({
      description: description.trim() || (paymentMode === 'gpay' ? 'G-Pay Sale' : paymentMode === 'cash' ? 'Cash Sale' : 'Split Sale'),
      gpayAmount: finalGpay,
      cashAmount: finalCash,
    });

    // Play physical cash register chime
    sound.playSuccess();

    // Voice announcement (kid & uneducated friendly)
    if (!isSoundMuted) {
      const langVoiceMap: Record<Language, string> = {
        en: 'en-IN',
        te: 'te-IN'
      };
      sound.speakText(`₹${numAmount} Saved`, langVoiceMap[currentLanguage]);
    }

    // High performance particle burst
    try {
      confetti({
        particleCount: 36,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
        disableForReducedMotion: false,
      });
    } catch {
      // Ignore
    }

    // Reset register
    setAmountStr('0');
    setDescription('');
    setSplitGpayStr('0');
    setSplitCashStr('0');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden gpu-accelerated transition-all duration-150">
      
      {/* Top Banner: Big Visual Display of Current Bill */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-6 border-b border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Billing Register
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              title={isSoundMuted ? "Unmute Sounds" : "Mute Sounds"}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 tap-spring cursor-pointer"
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              type="button"
              onClick={handleClear}
              title="Clear Amount"
              className="px-2.5 py-1 text-xs font-bold rounded-xl bg-slate-800/80 hover:bg-red-950/80 hover:text-red-300 text-slate-300 border border-slate-700 tap-spring cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
              Reset
            </button>
          </div>
        </div>

        {/* Big Giant Rupee Counter */}
        <div className="text-center py-2 sm:py-3">
          <div className="text-xs uppercase font-semibold text-slate-400 mb-1">
            Total Amount to Collect
          </div>
          <div
            className={`font-mono font-black text-4xl sm:text-6xl tracking-tight text-white flex items-center justify-center transition-transform duration-100 ${
              justAddedAnim ? 'scale-105 text-emerald-400' : ''
            }`}
          >
            <span className="text-emerald-400 mr-2 text-3xl sm:text-5xl font-sans">₹</span>
            <span>{numAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Currency Note Quick Add Chips (Authentic Indian Note Visuals) */}
        <div className="mt-4 pt-3 border-t border-slate-700/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5 justify-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tap Notes to Add Money (నోట్లు నొక్కండి):</span>
          </div>
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2 max-w-lg mx-auto">
            {CURRENCY_NOTES.map((note) => (
              <button
                key={note.value}
                type="button"
                onClick={() => handleAddNote(note.value)}
                className={`py-2 px-1 rounded-xl font-black text-xs sm:text-sm shadow-md border tap-spring cursor-pointer flex flex-col items-center justify-center ${note.bg}`}
              >
                <span>+{note.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        
        {/* Step 1: Giant Payment Mode Chooser (Zero-confusion large buttons) */}
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 text-center">
            How Did Customer Pay? (ఎలా చెల్లించారు?)
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xl mx-auto">
            
            {/* Mode 1: Hand Cash (Green) */}
            <button
              type="button"
              onClick={() => handleSelectMode('cash')}
              className={`p-3 sm:p-4 rounded-2xl border-3 flex flex-col items-center justify-center gap-1.5 tap-spring cursor-pointer transition-all ${
                paymentMode === 'cash'
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/30 scale-102 ring-4 ring-emerald-300 dark:ring-emerald-950 font-black'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80 font-bold hover:bg-emerald-100'
              }`}
            >
              <div className="p-2 rounded-xl bg-white/20">
                <Banknote className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <span className="text-sm sm:text-base">💵 Hand Cash</span>
              <span className="text-[10px] opacity-90 font-medium">నగదు / Cash</span>
            </button>

            {/* Mode 2: G-Pay (Blue) */}
            <button
              type="button"
              onClick={() => handleSelectMode('gpay')}
              className={`p-3 sm:p-4 rounded-2xl border-3 flex flex-col items-center justify-center gap-1.5 tap-spring cursor-pointer transition-all ${
                paymentMode === 'gpay'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-lg shadow-blue-600/30 scale-102 ring-4 ring-blue-300 dark:ring-blue-950 font-black'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/80 font-bold hover:bg-blue-100'
              }`}
            >
              <div className="p-2 rounded-xl bg-white/20">
                <Smartphone className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <span className="text-sm sm:text-base">📱 G-Pay (UPI)</span>
              <span className="text-[10px] opacity-90 font-medium">గూగుల్ పే / UPI</span>
            </button>

            {/* Mode 3: Split (Both) */}
            <button
              type="button"
              onClick={() => handleSelectMode('split')}
              className={`p-3 sm:p-4 rounded-2xl border-3 flex flex-col items-center justify-center gap-1.5 tap-spring cursor-pointer transition-all ${
                paymentMode === 'split'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-500/30 scale-102 ring-4 ring-amber-300 dark:ring-amber-950 font-black'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80 font-bold hover:bg-amber-100'
              }`}
            >
              <div className="p-2 rounded-xl bg-white/20">
                <Split className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <span className="text-sm sm:text-base">⚖️ Split (Both)</span>
              <span className="text-[10px] opacity-90 font-medium">సగం సగం / Split</span>
            </button>

          </div>
        </div>

        {/* If Split Mode: Quick inputs for G-Pay and Cash parts */}
        {paymentMode === 'split' && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 max-w-xl mx-auto space-y-3">
            <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center justify-between">
              <span>Split Details:</span>
              <button
                type="button"
                onClick={() => {
                  const half = Math.round((numAmount / 2) * 100) / 100;
                  setSplitGpayStr(half.toString());
                  setSplitCashStr((numAmount - half).toString());
                }}
                className="px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 text-[11px] font-bold tap-spring"
              >
                Split 50 / 50
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-blue-200">
                <span className="text-[11px] font-bold text-blue-600 block mb-1">📱 G-Pay Amount:</span>
                <div className="flex items-center text-lg font-mono font-bold">
                  <span className="mr-1 text-slate-400">₹</span>
                  <input
                    type="number"
                    value={splitGpayStr}
                    onChange={(e) => {
                      const g = parseFloat(e.target.value) || 0;
                      setSplitGpayStr(e.target.value);
                      setSplitCashStr(Math.max(0, numAmount - g).toString());
                    }}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-600 block mb-1">💵 Cash Amount:</span>
                <div className="flex items-center text-lg font-mono font-bold">
                  <span className="mr-1 text-slate-400">₹</span>
                  <input
                    type="number"
                    value={splitCashStr}
                    onChange={(e) => {
                      const c = parseFloat(e.target.value) || 0;
                      setSplitCashStr(e.target.value);
                      setSplitGpayStr(Math.max(0, numAmount - c).toString());
                    }}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: On-Screen Tactile Keypad (Anyone, kid or elder, can tap) */}
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeypadPress(digit)}
                className="py-3.5 sm:py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-mono font-black text-xl sm:text-2xl border border-slate-200 dark:border-slate-700 shadow-xs tap-spring cursor-pointer select-none"
              >
                {digit}
              </button>
            ))}

            {/* Backspace Button */}
            <button
              type="button"
              onClick={handleBackspace}
              title="Delete single digit"
              className="py-3.5 sm:py-4 rounded-2xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-600 dark:text-red-400 font-bold text-lg border border-red-200 dark:border-red-900 shadow-xs tap-spring cursor-pointer flex items-center justify-center"
            >
              <Delete className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Optional Note / Customer Name (Not required) */}
        <div className="max-w-md mx-auto">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional Note (e.g. Ramesh, Milk, Rice) / விருப்ப குறிப்பு"
            className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Step 3: Massive Green SAVE Button */}
        <div className="max-w-md mx-auto pt-1">
          <button
            type="button"
            onClick={() => handleSubmitSale()}
            disabled={numAmount <= 0}
            className={`w-full py-4 sm:py-5 px-6 rounded-2xl font-black text-lg sm:text-2xl text-white shadow-xl flex items-center justify-center gap-3 tap-spring cursor-pointer transition-all ${
              numAmount > 0
                ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/30 scale-101 ring-4 ring-emerald-300 dark:ring-emerald-900 active:scale-97'
                : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
            <span>SAVE SALE &bull; ₹{numAmount.toLocaleString('en-IN')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
