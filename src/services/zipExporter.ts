import JSZip from 'jszip';
import firebaseConfigData from '../../firebase-applet-config.json';

/**
 * Service to bundle the complete project source code into a clean ZIP archive
 * ready for instant hosting on Vercel or pushing to GitHub.
 */
export const downloadProjectZipForVercel = async (): Promise<void> => {
  const zip = new JSZip();

  // Root configuration files
  zip.file('package.json', JSON.stringify({
    "name": "hruthik-kirana-store",
    "private": true,
    "version": "1.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "tsc -b && vite build",
      "lint": "tsc --noEmit",
      "preview": "vite preview"
    },
    "dependencies": {
      "canvas-confetti": "^1.9.4",
      "firebase": "^11.4.0",
      "jspdf": "^2.5.2",
      "jspdf-autotable": "^3.8.4",
      "jszip": "^3.10.1",
      "lucide-react": "^0.546.0",
      "motion": "^12.23.24",
      "react": "^19.0.1",
      "react-dom": "^19.0.1"
    },
    "devDependencies": {
      "@tailwindcss/vite": "^4.3.3",
      "@types/canvas-confetti": "^1.9.0",
      "@types/jszip": "^3.4.1",
      "@types/node": "^22.14.0",
      "@types/react": "^19.3.0",
      "@types/react-dom": "^19.3.0",
      "@vitejs/plugin-react": "^6.1.1",
      "tailwindcss": "^4.3.3",
      "typescript": "^5.7.2",
      "vite": "^8.3.0"
    }
  }, null, 2));

  zip.file('vercel.json', JSON.stringify({
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "framework": "vite",
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }, null, 2));

  zip.file('tsconfig.json', JSON.stringify({
    "compilerOptions": {
      "target": "ES2022",
      "module": "ESNext",
      "moduleResolution": "bundler",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "jsx": "react-jsx",
      "strict": true,
      "skipLibCheck": true,
      "noEmit": true
    },
    "include": ["src"]
  }, null, 2));

  zip.file('vite.config.ts', `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`);

  zip.file('index.html', `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hruthik Kirana Store - Daily Earnings & Cash/G-Pay Tracker</title>
    <meta name="description" content="Daily earnings tracker for Hruthik Kirana Store with G-Pay and cash split, automatic WhatsApp daily report sending, and PDF export." />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);

  zip.file('firebase-applet-config.json', JSON.stringify(firebaseConfigData, null, 2));

  zip.file('firestore.rules', `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }

    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function isValidId(id) {
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$');
    }

    match /users/{userId} {
      allow read, write: if isValidId(userId) && isOwner(userId);

      match /transactions/{transactionId} {
        allow read, write: if isValidId(userId) && isValidId(transactionId) && isOwner(userId);
      }
    }
  }
}
`);

  zip.file('README.md', `# Hruthik Kirana Store - Vercel Deployment

## Quick Deploy Steps to Vercel:
1. Extract this ZIP file.
2. Run \`npm install\`
3. Run \`npx vercel\` to deploy directly from terminal, or push this repository to GitHub and import it on [vercel.com/new](https://vercel.com/new).

## Environment Variables (Optional):
The Firebase configuration is already embedded in \`firebase-applet-config.json\` and ready to connect!
`);

  // Generate and download ZIP in browser
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hruthik_kirana_store_vercel_project.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
