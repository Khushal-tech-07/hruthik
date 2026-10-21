import React, { useState } from 'react';
import { X, ExternalLink, Check, Copy, Terminal, Zap, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { sound } from '../services/sound';

interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
}) => {
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const vercelConfigJson = JSON.stringify(
    {
      buildCommand: "npm run build",
      outputDirectory: "dist",
      framework: "vite",
      rewrites: [
        {
          source: "/(.*)",
          destination: "/index.html"
        }
      ]
    },
    null,
    2
  );

  const envSample = `# Environment variables for Vercel (for real-time Google Firebase)
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""`;

  const handleCopyCli = () => {
    sound.playTap();
    navigator.clipboard.writeText("npx vercel --prod");
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleCopyConfig = () => {
    sound.playTap();
    navigator.clipboard.writeText(vercelConfigJson);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const handleCopyEnv = () => {
    sound.playTap();
    navigator.clipboard.writeText(envSample);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const isTelugu = currentLanguage === 'te';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-md">
              {/* Official Vercel Logo Triangle */}
              <svg className="w-6 h-6 fill-current" viewBox="0 0 1155 1000">
                <path d="m577.3 0 577.4 1000H0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{isTelugu ? "Vercel లో హోస్ట్ చేయండి" : "Host on Vercel"}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Ready
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isTelugu
                  ? "మీ కిరాణా యాప్‌ను ఉచితంగా Vercel లో ప్రపంచవ్యాప్తంగా లైవ్ చేయండి"
                  : "Deploy your grocery app live on Vercel with zero configuration"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 tap-spring cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action Button: Direct Deploy to Vercel */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-black text-white shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-current" />
              {isTelugu ? "తక్షణ ప్రత్యక్ష డిప్లాయ్" : "Instant 1-Click Option"}
            </span>
            <span className="text-[11px] text-slate-300 font-mono">vercel.com</span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            {isTelugu
              ? "కింది బటన్ నొక్కడం ద్వారా Vercel డాష్‌బోర్డ్ తెరవబడుతుంది. మీరు మీ GitHub అకౌంట్‌ను లింక్ చేసి ఒకే క్లిక్‌తో హోస్ట్ చేయవచ్చు."
              : "Click below to go directly to Vercel's Import page. Import your repository or deploy in seconds with automatic Vite builds."}
          </p>

          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playTap()}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-black font-black text-sm tracking-wide shadow-md transition-transform hover:scale-[1.01] active:scale-[0.98] tap-spring cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 1155 1000">
              <path d="m577.3 0 577.4 1000H0z" />
            </svg>
            <span>{isTelugu ? "Vercel కి వెళ్లి నేరుగా హోస్ట్ చేయండి 🚀" : "Deploy Directly on Vercel 🚀"}</span>
            <ExternalLink className="w-4 h-4 text-slate-600" />
          </a>
        </div>

        {/* Deployment Steps */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isTelugu ? "సులభమైన విధానం (3 దశలు)" : "How to Host in 3 Quick Steps"}
          </h3>

          <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">
                  {isTelugu ? "GitHub లేదా కోడ్ పుష్ చేయండి" : "Push your code or connect GitHub"}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  {isTelugu
                    ? "మీ ప్రాజెక్ట్‌ను GitHub లో అప్‌లోడ్ చేయండి లేదా Vercel CLI ఉపయోగించండి."
                    : "Upload this repository to GitHub, GitLab, or use the Vercel CLI."}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">
                  {isTelugu ? "ఆటోమేటిక్ బిల్డ్ సెట్టింగ్స్" : "Automatic Build Settings"}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Framework: <strong className="text-slate-700 dark:text-slate-200">Vite</strong> &bull; Output Directory: <strong className="text-slate-700 dark:text-slate-200">dist</strong>. 
                  (ప్రాజెక్ట్‌లో <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">vercel.json</code> ముందే సిద్ధం చేయబడింది)
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">
                  {isTelugu ? "లైవ్ వెబ్‌సైట్ రెడీ!" : "Instant Live URL!"}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  {isTelugu
                    ? "Vercel మీకు https://your-store.vercel.app అనే ఉచిత లైవ్ లింక్ ఇస్తుంది. మొబైల్ మరియు కంప్యూటర్ లో వేగంగా పనిచేస్తుంది."
                    : "Vercel automatically gives you a secure https://...vercel.app domain with global CDN and SSL."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CLI Quick Command */}
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-500" />
              {isTelugu ? "టర్మినల్ / CLI ద్వారా డిప్లాయ్" : "One-command CLI Deploy"}
            </span>
            <button
              type="button"
              onClick={handleCopyCli}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 tap-spring cursor-pointer"
            >
              {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCli ? "Copied!" : "Copy Command"}</span>
            </button>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto flex items-center justify-between">
            <span>npx vercel --prod</span>
          </div>
        </div>

        {/* vercel.json verification badge */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>vercel.json</strong> {isTelugu ? "ఫైల్ ఇప్పటికే ప్రాజెక్ట్‌లో సరిగ్గా కాన్ఫిగర్ చేయబడింది." : "is fully configured and tested in your project root."}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyConfig}
            className="text-xs font-bold underline cursor-pointer shrink-0 ml-2"
          >
            {copiedConfig ? "Copied!" : "Copy JSON"}
          </button>
        </div>

        {/* Close Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs tap-spring cursor-pointer"
          >
            {isTelugu ? "మూసివేయి" : "Close"}
          </button>
        </div>

      </div>
    </div>
  );
};
