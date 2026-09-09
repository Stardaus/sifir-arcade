import React, { useState } from 'react';
import { Volume2, RotateCw, Sparkles } from 'lucide-react';
import { SifirFactor } from '../../types/sifir';
import { voiceEngine } from '../../services/voiceEngine';
import { audioEngine } from '../../services/audioEngine';
import { Modal } from '../common/Modal';
import { TactileButton } from '../common/TactileButton';

interface GemArrayVisualizerProps {
  readonly isOpen: boolean;
  readonly factorA: SifirFactor;
  readonly factorB: SifirFactor;
  readonly onClose: () => void;
  readonly onLaunchDrill?: (factorA: SifirFactor, factorB: SifirFactor) => void;
}

export const GemArrayVisualizer: React.FC<GemArrayVisualizerProps> = ({
  isOpen,
  factorA,
  factorB,
  onClose,
  onLaunchDrill,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDecomposition, setShowDecomposition] = useState(false);

  const currentRows = isFlipped ? factorB : factorA;
  const currentCols = isFlipped ? factorA : factorB;
  const product = factorA * factorB;

  const repeatedAddition = Array.from({ length: currentRows }, () => currentCols).join(' + ');

  const canDeconstruct = currentCols > 5;
  const splitA = 5;
  const splitB = currentCols - 5;

  const handleToggleFlip = () => {
    audioEngine.playKeyClick();
    setIsFlipped((prev) => !prev);
  };

  const handleToggleDeconstruction = () => {
    audioEngine.playKeyClick();
    setShowDecomposition((prev) => !prev);
  };

  const handleSpeak = () => {
    voiceEngine.speakEquation(currentRows, currentCols, product);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sifir Visual Inspector" maxWidth="lg">
      <div className="space-y-4">
        {/* Main Equation Card */}
        <div className="p-4 bg-arcade-chassis border-2 border-arcade-border rounded-2xl text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <span className="font-display font-black text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-arcade-amber via-arcade-cyan to-arcade-green font-mono">
              {currentRows} × {currentCols} = {product}
            </span>
            <button
              type="button"
              onClick={handleSpeak}
              className="p-2.5 bg-arcade-groove hover:bg-arcade-border text-arcade-cyan rounded-xl border border-arcade-cyan/30 transition"
              title="Pronounce Equation"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleToggleFlip}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-arcade-groove hover:bg-arcade-border text-arcade-cyan font-mono text-xs font-bold rounded-lg border border-arcade-cyan/40 transition"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Flip Commutative ({currentRows}×{currentCols} ⇄ {currentCols}×{currentRows})
            </button>

            {canDeconstruct && (
              <button
                type="button"
                onClick={handleToggleDeconstruction}
                className={`inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-bold rounded-lg border transition ${
                  showDecomposition
                    ? 'bg-arcade-magenta text-white border-arcade-magenta'
                    : 'bg-arcade-groove text-arcade-cream/80 border-arcade-border hover:text-arcade-cream'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {showDecomposition ? 'Hide Friendly Split' : 'Show Friendly Split (5 + N)'}
              </button>
            )}
          </div>

          <p className="text-xs font-mono text-arcade-cream/70">
            Repeated Addition: <span className="text-arcade-amber font-bold">{repeatedAddition} = {product}</span>
          </p>
        </div>

        {/* Distributive Friendly Decomposition Banner */}
        {showDecomposition && canDeconstruct && (
          <div className="p-3 bg-arcade-surface border-2 border-arcade-magenta/40 rounded-xl space-y-1 text-center font-mono">
            <div className="text-xs font-bold text-arcade-magenta uppercase tracking-wider">
              Distributive Split Strategy
            </div>
            <div className="text-sm font-bold text-arcade-cream">
              {currentRows} × {currentCols} = ({currentRows} × 5) + ({currentRows} × {splitB})
            </div>
            <div className="text-xs text-arcade-amber">
              = {currentRows * 5} + {currentRows * splitB} = <span className="text-arcade-green font-bold">{product}</span>
            </div>
          </div>
        )}

        {/* Visual Array Grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-arcade-cyan">
              Visual Grouping ({currentRows} rows of {currentCols})
            </span>
            <span className="text-xs font-mono text-arcade-cream/50">
              Total Items: {product}
            </span>
          </div>

          <div className="p-4 bg-arcade-chassis/80 border-2 border-arcade-border rounded-2xl overflow-x-auto max-h-56">
            <div className="flex flex-col gap-2 items-center min-w-max mx-auto">
              {Array.from({ length: currentRows }).map((_, rowIdx) => (
                <div key={rowIdx} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-arcade-cream/40 w-5 text-right">
                    #{rowIdx + 1}
                  </span>
                  <div className="flex gap-1.5 p-1 bg-arcade-groove/60 rounded-xl border border-arcade-border/50">
                    {Array.from({ length: currentCols }).map((_, colIdx) => {
                      const isSplitB = showDecomposition && colIdx >= splitA;
                      return (
                        <span
                          key={colIdx}
                          className={`w-6 h-6 flex items-center justify-center text-sm transform transition hover:scale-125 select-none ${
                            isSplitB ? 'filter hue-rotate-90' : ''
                          }`}
                          title={`Item ${rowIdx * currentCols + colIdx + 1}`}
                        >
                          {isSplitB ? '🔶' : '💎'}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Footers */}
        <div className="flex gap-3 pt-1">
          <TactileButton variant="neutral" size="md" fullWidth onClick={onClose}>
            Close
          </TactileButton>
          {onLaunchDrill && (
            <TactileButton
              variant="green"
              size="md"
              fullWidth
              onClick={() => {
                onClose();
                onLaunchDrill(currentRows, currentCols);
              }}
            >
              Practice Sifir {currentRows}
            </TactileButton>
          )}
        </div>
      </div>
    </Modal>
  );
};
