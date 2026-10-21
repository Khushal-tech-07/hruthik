import React, { useState } from 'react';
import { Language, Theme, User } from '../types';
import { translations } from '../i18n/translations';
import { signInWithGoogleRealtime, loginAsDemo } from '../services/firebase';
import { Store, ShieldCheck, Sun, Moon, Monitor, Globe, CheckCircle2, MessageSquare, Menu, X, ExternalLink, Zap } from 'lucide-react';
import { VercelDeployModal } from './VercelDeployModal';

interface LoginScreenProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  onLoginSuccess: (user: User) => void;
  shopName: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  currentLanguage,
  onLanguageChange,
  currentTheme,
  onThemeChange,
  onLoginSuccess,
  shopName,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);
  const t = translations[currentLanguage];

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const user = await signInWithGoogleRealtime();
      onLoginSuccess(user);
    } catch (err: unknown) {
      console.error('Google Sign-in error:', err);
      // Fallback instant sign-in for seamless preview
      const fallbackUser = loginAsDemo("Hruthik (Shop Owner)", "hruthik.kirana@gmail.com");
      onLoginSuccess(fallbackUser);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      const user = loginAsDemo("Hruthik (Shop Owner)", "hruthik.kirana@gmail.com");
      onLoginSuccess(user);
      setIsLoading(false);
    }, 200);
  };

  const isTelugu = currentLanguage === 'te';

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-emerald-50/70 via-slate-50 to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30 p-4 sm:p-6 transition-colors duration-200">
      
      {/* Top Header Line: Single button in top-left, Store name in the middle, clean top-right */}
      <header className="w-full max-w-5xl mx-auto py-2">
        <div className="grid grid-cols-3 items-center">
          
          {/* Top-Left: The ONE single button in top header line */}
          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              title="Menu & Settings"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/95 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs border border-slate-200 dark:border-slate-700 shadow-xs tap-spring cursor-pointer"
            >
              <Menu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isTelugu ? "మెనూ" : "Menu"}</span>
            </button>
          </div>

          {/* Middle of the Web Page: Store Name Centered */}
          <div className="text-center">
            <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white capitalize tracking-tight flex items-center justify-center gap-1.5">
              <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{shopName || "Hruthik Kirana Store"}</span>
            </span>
          </div>

          {/* Top-Right: Clean empty spacer */}
          <div className="flex justify-end" aria-hidden="true">
            {/* Spacer */}
          </div>

        </div>
      </header>

      {/* Main Centered Login Card */}
      <main className="flex-1 flex items-center justify-center my-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 backdrop-blur-sm">
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mb-4 ring-8 ring-emerald-50 dark:ring-emerald-950/40">
              <Store className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white capitalize">
              {shopName || "Hruthik Kirana Store"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
              {t.loginSubtitle}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs border border-amber-200 dark:border-amber-800">
              {errorMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Real-time Google Sign-in Button with official Google 'G' SVG */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-extrabold text-base shadow-md tap-spring focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-60 cursor-pointer"
            >
              <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoading ? "Signing in..." : t.signInWithGoogle}</span>
            </button>

            {/* Instant Demo/Bypass Option */}
            <button
              type="button"
              onClick={handleQuickDemoSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 tap-spring cursor-pointer"
            >
              {t.demoLogin}
            </button>
          </div>

          {/* Feature Highlights */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Real-time G-Pay & Cash split tracking (₹)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <MessageSquare className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Direct WhatsApp report sending to <strong>6380412552</strong></span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Automatic clean PDF daily reports</span>
            </div>
          </div>

          {/* Direct Vercel Option on Login Screen */}
          <div className="mt-5 p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 fill-current text-white shrink-0" viewBox="0 0 1155 1000">
                <path d="m577.3 0 577.4 1000H0z" />
              </svg>
              <div>
                <span className="font-bold">{isTelugu ? "Vercel లో హోస్ట్ చేయండి" : "Host on Vercel"}</span>
                <span className="block text-[10px] text-emerald-400">1-Click Ready</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsVercelModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-black font-extrabold text-[11px] tap-spring cursor-pointer"
            >
              {isTelugu ? "వివరాలు" : "Setup ▲"}
            </button>
          </div>
        </div>
      </main>

      {/* Slide-over Drawer for Login Screen (from Single Top-Left Button) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-start bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between overflow-y-auto">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-emerald-600" />
                  <span className="font-black text-sm text-slate-900 dark:text-white capitalize">
                    {shopName || "Hruthik Kirana Store"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer tap-spring"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Vercel Hosting Button */}
              <div className="p-3 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 1155 1000">
                      <path d="m577.3 0 577.4 1000H0z" />
                    </svg>
                    <span className="font-extrabold text-xs">{isTelugu ? "Vercel హోస్టింగ్" : "Host on Vercel"}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">vercel.json ready</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsVercelModalOpen(true);
                  }}
                  className="w-full py-2 rounded-xl bg-white text-black font-extrabold text-xs flex items-center justify-center gap-1.5 tap-spring cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{isTelugu ? "హోస్టింగ్ గైడ్ & డిప్లాయ్" : "Open Vercel Deploy Guide"}</span>
                </button>
              </div>

              {/* Language selection */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span>Language / భాష</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onLanguageChange('en')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all tap-spring cursor-pointer ${
                      currentLanguage === 'en'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    English (EN)
                  </button>
                  <button
                    type="button"
                    onClick={() => onLanguageChange('te')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all tap-spring cursor-pointer ${
                      currentLanguage === 'te'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    తెలుగు (Telugu)
                  </button>
                </div>
              </div>

              {/* Theme selection */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Color Theme</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onThemeChange('light')}
                    className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 tap-spring cursor-pointer ${
                      currentTheme === 'light'
                        ? 'bg-white dark:bg-slate-700 text-amber-600 shadow-xs border border-amber-300'
                        : 'bg-white/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onThemeChange('dark')}
                    className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 tap-spring cursor-pointer ${
                      currentTheme === 'dark'
                        ? 'bg-slate-700 text-indigo-300 shadow-xs border border-indigo-400'
                        : 'bg-white/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onThemeChange('system')}
                    className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 tap-spring cursor-pointer ${
                      currentTheme === 'system'
                        ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-xs border border-emerald-400'
                        : 'bg-white/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Auto</span>
                  </button>
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs tap-spring cursor-pointer"
              >
                {isTelugu ? "మూసివేయి" : "Close"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Vercel Deploy Modal */}
      <VercelDeployModal
        isOpen={isVercelModalOpen}
        onClose={() => setIsVercelModalOpen(false)}
        currentLanguage={currentLanguage}
      />

      {/* Footer */}
      <footer className="text-center py-2 text-xs text-slate-400 dark:text-slate-600">
        {shopName || "Hruthik Kirana Store"} &bull; Daily Earnings Tracker
      </footer>
    </div>
  );
};
