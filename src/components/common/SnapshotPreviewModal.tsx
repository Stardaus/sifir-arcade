import React, { useState, useEffect } from 'react';
import { Share2, Copy, Download, MessageSquare, Check, Sparkles } from 'lucide-react';
import { Modal } from './Modal';
import { TactileButton } from './TactileButton';
import {
  canShareFiles,
  dispatchNativeShare,
  copyImageToClipboard,
  getWhatsAppShareUrl,
  triggerBlobDownload,
} from '../../services/socialShareService.ts';

interface SnapshotPreviewModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly imageBlob: Blob | null;
  readonly defaultCaption: string;
  readonly title: string;
  readonly filename?: string;
}

export const SnapshotPreviewModal: React.FC<SnapshotPreviewModalProps> = ({
  isOpen,
  onClose,
  imageBlob,
  defaultCaption,
  title,
  filename = 'sifir_progress_snapshot.png',
}) => {
  const [caption, setCaption] = useState(defaultCaption);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCaption(defaultCaption);
  }, [defaultCaption]);

  useEffect(() => {
    if (!imageBlob) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageBlob);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageBlob]);

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const showTemporaryFeedback = (msg: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFeedback(msg);
    timerRef.current = setTimeout(() => {
      setFeedback(null);
      timerRef.current = null;
    }, 3500);
  };

  const handleShare = async () => {
    if (!imageBlob) return;

    const file = new File([imageBlob], filename, { type: 'image/png' });
    if (canShareFiles()) {
      const shared = await dispatchNativeShare({ file, title, text: caption });
      if (shared) {
        showTemporaryFeedback('Shared successfully!');
        return;
      }
    }

    // Fallback: Copy image to clipboard and open WhatsApp Web with caption
    await copyImageToClipboard(imageBlob);
    window.open(getWhatsAppShareUrl(caption), '_blank');
    showTemporaryFeedback('Image copied to clipboard & WhatsApp opened!');
  };

  const handleCopy = async () => {
    if (!imageBlob) return;
    const success = await copyImageToClipboard(imageBlob);
    if (success) {
      setCopied(true);
      showTemporaryFeedback('Snapshot copied to clipboard! Paste directly into WhatsApp.');
      setTimeout(() => setCopied(false), 2500);
    } else {
      showTemporaryFeedback('Clipboard copy unsupported on this browser. Try Download!');
    }
  };

  const handleDownload = () => {
    if (!imageBlob) return;
    triggerBlobDownload(imageBlob, filename);
    showTemporaryFeedback('Snapshot image downloaded!');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="lg">
      <div className="space-y-4 max-h-[82vh] overflow-y-auto pr-1">
        {/* Card Graphic Preview */}
        <div className="relative w-full aspect-square max-w-[340px] mx-auto bg-arcade-chassis rounded-2xl border-2 border-arcade-cyan/50 shadow-arcade-md overflow-hidden flex items-center justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Progress Snapshot Preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-arcade-cyan animate-pulse">
              <Sparkles className="w-8 h-8 animate-spin" />
              <span className="font-mono text-xs">Generating Snapshot...</span>
            </div>
          )}
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div className="p-2.5 bg-arcade-green/15 border border-arcade-green/40 rounded-xl text-center text-xs font-mono text-arcade-green flex items-center justify-center gap-2 animate-in fade-in duration-150">
            <Check className="w-4 h-4" />
            <span>{feedback}</span>
          </div>
        )}

        {/* WhatsApp Message Caption Editor */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-arcade-cream/70 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-arcade-amber" />
            <span>WhatsApp Caption (Editable)</span>
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            className="w-full p-2.5 bg-arcade-chassis border border-arcade-border rounded-xl text-arcade-cream font-mono text-xs focus:border-arcade-cyan focus:outline-none resize-none"
            placeholder="Write a message to accompany your snapshot..."
          />
        </div>

        {/* Action Hub */}
        <div className="space-y-2 pt-1">
          <TactileButton
            variant="green"
            size="md"
            fullWidth
            onClick={handleShare}
            disabled={!imageBlob}
            className="flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share via WhatsApp</span>
          </TactileButton>

          <div className="grid grid-cols-2 gap-2">
            <TactileButton
              variant="cyan"
              size="sm"
              fullWidth
              onClick={handleCopy}
              disabled={!imageBlob}
              className="flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Image'}</span>
            </TactileButton>

            <TactileButton
              variant="neutral"
              size="sm"
              fullWidth
              onClick={handleDownload}
              disabled={!imageBlob}
              className="flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </TactileButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};
