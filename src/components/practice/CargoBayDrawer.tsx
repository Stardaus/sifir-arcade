import React, { useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { SifirFactor } from '../../types/sifir';
import { CartoonEqualGroups } from './CartoonEqualGroups';
import { audioEngine } from '../../services/audioEngine';

interface CargoBayDrawerProps {
  readonly isOpen: boolean;
  readonly factorA: SifirFactor;
  readonly factorB: SifirFactor;
  readonly onClose: () => void;
}

export const CargoBayDrawer: React.FC<CargoBayDrawerProps> = ({
  isOpen,
  factorA,
  factorB,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    audioEngine.playKeyClick();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-arcade-chassis/80 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Cargo Bay Visual Inspection"
    >
      <div
        className="w-full max-w-lg bg-arcade-surface border-t-2 sm:border-2 border-arcade-cyan rounded-t-3xl sm:rounded-3xl p-4 sm:p-5 shadow-arcade-glow space-y-3 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-arcade-groove pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-arcade-cyan/20 text-arcade-cyan border border-arcade-cyan/40">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-display font-black text-sm text-arcade-cyan tracking-wider uppercase">
                Cargo Bay Inspection
              </h3>
              <p className="text-[11px] font-mono text-arcade-cream/60">
                Visual pod group verification: {factorA} × {factorB}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="px-3 py-1.5 rounded-xl bg-arcade-groove hover:bg-arcade-magenta/20 border border-arcade-border hover:border-arcade-magenta/40 text-arcade-cream hover:text-arcade-magenta font-mono text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            aria-label="Close Cargo Bay"
          >
            <X className="w-3.5 h-3.5" />
            <span>CLOSE</span>
          </button>
        </div>

        {/* Visual Model Container */}
        <div className="pt-1">
          <CartoonEqualGroups factorA={factorA} factorB={factorB} />
        </div>
      </div>
    </div>
  );
};
