import React from 'react';
import { Eye, ListOrdered } from 'lucide-react';
import { SifirFactor } from '../../types/sifir';
import { audioEngine } from '../../services/audioEngine';

interface PracticeHudRibbonProps {
  readonly factorA: SifirFactor;
  readonly factorB: SifirFactor;
  readonly isTrackVisible: boolean;
  readonly onToggleTrack: () => void;
  readonly onOpenCargoBay: () => void;
}

export const PracticeHudRibbon: React.FC<PracticeHudRibbonProps> = ({
  factorA,
  factorB,
  isTrackVisible,
  onToggleTrack,
  onOpenCargoBay,
}) => {
  const handleOpenBay = () => {
    audioEngine.playKeyClick();
    onOpenCargoBay();
  };

  const handleToggleTrack = () => {
    audioEngine.playKeyClick();
    onToggleTrack();
  };

  return (
    <div className="flex items-center justify-between gap-2 p-1.5 bg-arcade-groove/80 border border-arcade-border rounded-xl">
      {/* Cargo Bay Launch Button */}
      <button
        type="button"
        onClick={handleOpenBay}
        className="flex-1 py-1.5 px-2.5 rounded-lg bg-arcade-cyan/15 hover:bg-arcade-cyan/25 border border-arcade-cyan/40 text-arcade-cyan font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
      >
        <Eye className="w-3.5 h-3.5 text-arcade-cyan" />
        <span>🛸 Cargo Bay ({factorA}×{factorB})</span>
      </button>

      {/* Skip Track Toggle Button */}
      <button
        type="button"
        onClick={handleToggleTrack}
        className={`py-1.5 px-3 rounded-lg border font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
          isTrackVisible
            ? 'bg-arcade-amber/20 border-arcade-amber/50 text-arcade-amber'
            : 'bg-arcade-surface border-arcade-border text-arcade-cream/60 hover:text-arcade-cream'
        }`}
        aria-pressed={isTrackVisible}
      >
        <ListOrdered className="w-3.5 h-3.5" />
        <span>Track</span>
      </button>
    </div>
  );
};
