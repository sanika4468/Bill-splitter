import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Share2, QrCode as QrIcon, Smartphone } from 'lucide-react';
import { BillState, CalculationResult, ThemeConfig } from '../types';
import { encodeBillToUrl } from '../utils/storage';
import { generateTextSummary, shareSummary } from '../utils/share';

interface Props {
  billState: BillState;
  result: CalculationResult;
  theme: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<Props> = ({
  billState,
  result,
  theme,
  isOpen,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const url = encodeBillToUrl(billState);
    setShareUrl(url);

    // Render QR Code onto canvas
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: 220,
          margin: 1.5,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (err) => {
          if (err) console.error('Failed to render QR Code', err);
        }
      );
    }
  }, [isOpen, billState]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyText = async () => {
    try {
      const text = generateTextSummary(billState, result);
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    const res = await shareSummary(billState, result, shareUrl);
    if (res.method === 'clipboard') {
      setShareFeedback('Summary copied to clipboard!');
      setTimeout(() => setShareFeedback(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md p-5 md:p-6 rounded-3xl border shadow-2xl relative ${theme.cardBg} transition-all`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-300 cursor-pointer"
          aria-label="Close share dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <div className="inline-flex p-2.5 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mb-2">
            <QrIcon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black tracking-tight">Scan or Share Bill</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Friends at the dinner table can scan this QR code with their phone camera!
          </p>
        </div>

        {/* QR Code Canvas */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 shadow-inner mx-auto mb-4 w-fit">
          <canvas ref={canvasRef} className="rounded-lg max-w-full" />
          <span className="text-[11px] text-slate-600 font-bold mt-2 flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-amber-600" /> Point phone camera to open bill
          </span>
        </div>

        {shareFeedback && (
          <div className="mb-3 text-xs p-2 rounded-lg bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30 text-center font-bold">
            {shareFeedback}
          </div>
        )}

        {/* Action Buttons with High-Contrast Visible Text */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md bg-amber-600 hover:bg-amber-700 text-white transition-transform active:scale-98 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-white" />
            <span className="text-white font-bold">Share via WhatsApp / Messages</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="py-2.5 px-3 rounded-xl text-xs font-bold border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  <span className="font-bold">Copy Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className="py-2.5 px-3 rounded-xl text-xs font-bold border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Text Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  <span className="font-bold">Copy Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
