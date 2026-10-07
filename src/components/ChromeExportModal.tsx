import React, { useState, useEffect } from 'react';
import { Download, Chrome, Check, X, FileCode, Smartphone, Laptop, Sparkles } from 'lucide-react';
import { ThemeConfig } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
}

export const ChromeExportModal: React.FC<Props> = ({ isOpen, onClose, theme }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      alert('In Google Chrome, tap the 3 dots menu (⋮) and select "Install app" or "Add to Home Screen" to install TableTally!');
    }
  };

  const handleDownloadStandaloneHTML = () => {
    // Generates a self-contained, offline-ready HTML+CSS+JS file that runs directly in Google Chrome
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TableTally - Friendship Bill Splitter (Chrome Offline)</title>
  <style>
    :root {
      --primary: #ea580c;
      --bg: #faf6f0;
      --card: #ffffff;
      --text: #1e293b;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); padding: 20px; max-width: 680px; margin: 0 auto; min-height: 100vh; }
    .card { background: var(--card); border-radius: 24px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.08); }
    h1 { font-size: 24px; font-weight: 900; color: #ea580c; display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .bill-input { width: 100%; font-size: 32px; font-weight: 900; padding: 12px; border: 2px solid #ea580c; border-radius: 16px; margin: 12px 0; }
    .btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
    .btn { padding: 10px 16px; border-radius: 12px; border: 1px solid #cbd5e1; background: #f8fafc; font-weight: bold; cursor: pointer; font-size: 13px; }
    .btn.active, .btn-primary { background: #ea580c; color: white; border-color: #ea580c; }
    .result-box { background: rgba(234, 88, 12, 0.1); border: 2px solid rgba(234, 88, 12, 0.3); padding: 18px; border-radius: 18px; text-align: center; }
    .result-val { font-size: 36px; font-weight: 900; color: #ea580c; }
    .friend-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🍽️ TableTally · Google Chrome Standalone</h1>
    <p style="font-size: 13px; color: #64748b; margin-bottom: 16px;">Runs 100% offline in Google Chrome! Supports India (₹) and world currencies.</p>
    
    <label style="font-size: 12px; font-weight: 800; text-transform: uppercase;">Total Restaurant Bill:</label>
    <div style="display:flex; align-items:center; gap: 8px;">
      <select id="curr" class="btn" onchange="calc()" style="padding:12px; font-size:16px;">
        <option value="₹">🇮🇳 INR (₹)</option>
        <option value="$">🇺🇸 USD ($)</option>
        <option value="€">🇪🇺 EUR (€)</option>
        <option value="£">🇬🇧 GBP (£)</option>
        <option value="AED">🇦🇪 AED</option>
      </select>
      <input type="number" id="bill" class="bill-input" value="1800" oninput="calc()" placeholder="0.00" />
    </div>

    <label style="font-size: 12px; font-weight: 800;">Friends at Table: <span id="friendCount" style="color:#ea580c;">4</span></label>
    <div class="btn-row" style="margin-top: 6px;">
      <button class="btn" onclick="setFriends(2)">2 Friends</button>
      <button class="btn" onclick="setFriends(3)">3 Friends</button>
      <button class="btn active" id="f4" onclick="setFriends(4)">4 Friends</button>
      <button class="btn" onclick="setFriends(5)">5 Friends</button>
      <button class="btn" onclick="setFriends(6)">6 Friends</button>
    </div>

    <label style="font-size: 12px; font-weight: 800;">Tip / Gratuity:</label>
    <div class="btn-row" style="margin-top: 6px;">
      <button class="btn" onclick="setTip(0)">0%</button>
      <button class="btn active" id="t10" onclick="setTip(10)">10%</button>
      <button class="btn" onclick="setTip(15)">15%</button>
      <button class="btn" onclick="setTip(18)">18%</button>
      <button class="btn" onclick="setTip(20)">20%</button>
    </div>
  </div>

  <div class="card result-box">
    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase;">Each Friend Pays</div>
    <div id="eachPay" class="result-val">₹495.00</div>
    <div id="grandTotal" style="font-size: 14px; font-weight: bold; color: #475569; margin-top: 6px;">Total with Tip: ₹1,980.00</div>
  </div>

  <div class="card">
    <h3 style="font-size: 14px; font-weight: 800; margin-bottom: 8px;">Breakdown:</h3>
    <div id="friendsList"></div>
  </div>

  <script>
    let friends = 4;
    let tipPercent = 10;
    const names = ['Aarav', 'Diya', 'Rohan', 'Ananya', 'Kavya', 'Vikram'];

    function setFriends(n) { friends = n; document.getElementById('friendCount').innerText = n; calc(); }
    function setTip(t) { tipPercent = t; calc(); }

    function calc() {
      const b = parseFloat(document.getElementById('bill').value) || 0;
      const sym = document.getElementById('curr').value;
      const tipAmount = (b * tipPercent) / 100;
      const total = b + tipAmount;
      const each = friends > 0 ? (total / friends) : 0;

      document.getElementById('eachPay').innerText = sym + each.toFixed(2);
      document.getElementById('grandTotal').innerText = 'Total with Tip (' + tipPercent + '%): ' + sym + total.toFixed(2);

      let html = '';
      for(let i=0; i<friends; i++) {
        const name = names[i] || ('Friend ' + (i+1));
        html += '<div class="friend-row"><span>👤 ' + name + '</span><span style="color:#ea580c;">' + sym + each.toFixed(2) + '</span></div>';
      }
      document.getElementById('friendsList').innerHTML = html;
    }
    calc();
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table-tally-chrome.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg p-5 md:p-6 rounded-3xl border shadow-2xl relative ${theme.cardBg} transition-all space-y-5`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Chrome className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">Run in Google Chrome</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                PWA installation &amp; standalone HTML/CSS/JS export
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-300 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Chrome Web App Install */}
        <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <Chrome className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Install Directly in Google Chrome</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
              PWA Ready
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            TableTally is fully configured with a Web App Manifest and offline icons. You can install it on your Chrome browser for 1-click access anytime!
          </p>

          <button
            type="button"
            onClick={handleInstallPWA}
            className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-98"
          >
            <Chrome className="w-4 h-4 text-white" />
            <span>Install / Add to Google Chrome</span>
          </button>
        </div>

        {/* 2. Download Standalone HTML file */}
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-indigo-500" />
              <span>Standalone HTML, CSS &amp; JS File</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
              Offline File
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Download a self-contained <code className="text-amber-600 font-bold">table-tally-chrome.html</code> file with complete CSS, HTML &amp; JS. You can save it to your computer or phone and double-click to open in Google Chrome anytime!
          </p>

          <button
            type="button"
            onClick={handleDownloadStandaloneHTML}
            className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Downloaded! (table-tally-chrome.html)</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Download Standalone HTML File</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Chrome Instructions */}
        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 pt-1">
          <div className="font-bold text-slate-700 dark:text-slate-300">How to use on Google Chrome:</div>
          <div className="flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-amber-500" />
            <span><strong>Desktop Chrome:</strong> Click the install icon in the URL bar (⊕) or bookmark the page.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-amber-500" />
            <span><strong>Android Chrome:</strong> Tap Chrome menu (⋮) &gt; "Add to Home screen".</span>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-transform active:scale-95 cursor-pointer ${theme.accentBg}`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
