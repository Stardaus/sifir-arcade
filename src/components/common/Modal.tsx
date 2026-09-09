import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  readonly isOpen: boolean;
  readonly title?: string;
  readonly onClose: () => void;
  readonly children: React.ReactNode;
  readonly maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const MAX_WIDTHS = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full ${MAX_WIDTHS[maxWidth]} bg-arcade-surface border-3 border-arcade-border rounded-3xl shadow-2xl overflow-hidden p-6 relative animate-in zoom-in-95 duration-150`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-arcade-groove">
          {title ? (
            <h2 className="text-xl font-display font-bold text-arcade-amber tracking-wide">
              {title}
            </h2>
          ) : <div />}
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-arcade-cream/60 hover:text-arcade-cream hover:bg-arcade-groove rounded-full transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
};
