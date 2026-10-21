import React, { useState } from 'react';
import { Language, Theme, User, ShopConfig } from '../types';
import { translations } from '../i18n/translations';
import {
  Menu,
  X,
  Store,
  Globe,
  Sun,
  Moon,
  Monitor,
  LogOut,
  Building2,
  MessageCircle,
  Volume2,
  VolumeX,
  Zap,
  ExternalLink
} from 'lucide-react';
import { sound } from '../services/sound';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  onOpenShopSettingsModal: () => void;
  onOpenVercelModal: () => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  shopConfig: ShopConfig;
  onSendWhatsapp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onOpenShopSettingsModal,
  onOpenVercelModal,
  currentLanguage,
  onLanguageChange,
  currentTheme,
  onThemeChange,
  shopConfig,
  onSendWhatsapp,
}) => {
  const t = translations[currentLanguage];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(!sound.enabled);

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setIsMuted(!sound.enabled);
  };

  const handleOpenMenu = () => {
    sound.playTap();
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    sound.playTap();
    setIsMenuOpen(false);
  };

  const isTelugu = currentLanguage === 'te';

  return (
    <>
      {/* Top Header Line: Single button in top-left, Name in the middle, clean top-right */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
          <div className="grid grid-cols-3 items-center">
            
            {/* Top-Left: The ONE single button in the top header line */}
            <div className="flex justify-start items-center">
              <button
                type="button"
                onClick={handleOpenMenu}
                title="Menu & All Controls"
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-extrabold text-xs sm:text-sm border-2 border-emerald-300 dark:border-emerald-800 shadow-sm tap-spring cursor-pointer"
              >
                <Menu className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-black tracking-wide hidden sm:inline">
                  {isTelugu ? "మెనూ & సెట్టింగ్స్" : "Menu & Options"}
                </span>
                <span className="font-black tracking-wide sm:hidden">
                  {isTelugu ? "మెనూ" : "Menu"}
                </span>
              </button>
            </div>

            {/* Middle of the Web Page: Store Name in the Middle */}
            <div className="text-center flex flex-col items-center justify-center">
              <h1 className="font-black text-base sm:text-xl md:text-2xl text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-1.5 sm:gap-2 leading-tight">
                <Store className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="capitalize">{shopConfig.name}</span>
              </h1>
              <span className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Daily Register &bull; రోజువారీ బహీఖాతా
              </span>
            </div>

            {/* Top-Right: Intentionally empty spacer to keep store name dead center */}
            <div className="flex justify-end items-center" aria-hidden="true">
              {/* Spacer */}
            </div>

          </div>
        </div>
      </header>

      {/* Slide-over Drawer Modal opened from the Single Top-Left Button */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-start bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
          <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between overflow-y-auto gpu-accelerated">
            
            <div className="space-y-4">
              
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-black text-base text-slate-900 dark:text-white capitalize">
                      {shopConfig.name}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {isTelugu ? "దుకాణ నిర్వహణ & ఎంపికలు" : "Store Controls & Options"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseMenu}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 tap-spring cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Option 1: DIRECT OPTION TO HOST IN VERCEL */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-black text-white shadow-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 1155 1000">
                        <path d="m577.3 0 577.4 1000H0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-black text-xs text-white">
                        {isTelugu ? "Vercel లో హోస్ట్ చేయండి" : "Host on Vercel"}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-semibold">
                        {isTelugu ? "1-క్లిక్ లైవ్ వెబ్‌సైట్" : "1-Click Direct Deployment"}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-slate-300">
                    vercel.json ready
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseMenu();
                      onOpenVercelModal();
                    }}
                    className="w-full py-2 px-2.5 rounded-xl bg-white hover:bg-slate-100 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 tap-spring cursor-pointer shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{isTelugu ? "హోస్టింగ్ సెటప్" : "Vercel Guide"}</span>
                  </button>

                  <a
                    href="https://vercel.com/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.playTap()}
                    className="w-full py-2 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs flex items-center justify-center gap-1 tap-spring cursor-pointer shadow-sm"
                  >
                    <span>{isTelugu ? "నేరుగా డిప్లాయ్" : "Deploy Live"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Option 2: WhatsApp Report Dispatch */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseMenu();
                    onSendWhatsapp();
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs sm:text-sm shadow-md tap-spring cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>
                      {isTelugu ? "వాట్సాప్‌కు నివేదిక పంపండి" : "Send Report to WhatsApp"}
                    </span>
                  </div>
                  <span className="text-xs font-mono bg-black/20 px-2 py-0.5 rounded-lg">
                    6380412552
                  </span>
                </button>
              </div>

              {/* Option 3: Multi-Language Switcher (English / Telugu only) */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span>Language / భాష</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      onLanguageChange('en');
                    }}
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
                    onClick={() => {
                      sound.playTap();
                      onLanguageChange('te');
                    }}
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

              {/* Option 4: Theme Switcher (Light / Dark / System) */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Color Theme / రంగు థీమ్</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      onThemeChange('light');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 tap-spring cursor-pointer ${
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
                    onClick={() => {
                      sound.playTap();
                      onThemeChange('dark');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 tap-spring cursor-pointer ${
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
                    onClick={() => {
                      sound.playTap();
                      onThemeChange('system');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 tap-spring cursor-pointer ${
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

              {/* Option 5: Sound Effects Toggle */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-500" />
                  )}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {isTelugu ? "బటన్ శబ్దాలు (Audio Sounds)" : "165Hz Sound Effects"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleSound}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold tap-spring cursor-pointer ${
                    !isMuted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {!isMuted ? "ON" : "MUTE"}
                </button>
              </div>

              {/* Option 6: Shop Settings Modal Trigger */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseMenu();
                    onOpenShopSettingsModal();
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-xs tap-spring cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>
                      {isTelugu ? "షాప్ వివరాలు & ఫోన్ నంబర్ మార్పు" : "Edit Shop Profile & Phone"}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">&rsaquo;</span>
                </button>
              </div>

            </div>

            {/* Bottom Section: User Profile & Logout */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                    {user.displayName}
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={() => {
                  handleCloseMenu();
                  onLogout();
                }}
                className="w-full py-3 px-4 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 dark:text-red-400 font-bold text-xs sm:text-sm border border-red-200 dark:border-red-900/60 flex items-center justify-center gap-2 tap-spring cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.logout}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
