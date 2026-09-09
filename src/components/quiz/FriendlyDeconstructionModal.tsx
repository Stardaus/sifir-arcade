import React from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';
import { SifirFactor } from '../../types/sifir';
import { decomposeFact } from '../../services/masteryEngine';
import { Modal } from '../common/Modal';
import { TactileButton } from '../common/TactileButton';

interface FriendlyDeconstructionModalProps {
  readonly isOpen: boolean;
  readonly factorA: SifirFactor;
  readonly factorB: SifirFactor;
  readonly onAcknowledge: () => void;
}

export const FriendlyDeconstructionModal: React.FC<FriendlyDeconstructionModalProps> = ({
  isOpen,
  factorA,
  factorB,
  onAcknowledge,
}) => {
  const decomp = decomposeFact(factorA, factorB);

  return (
    <Modal isOpen={isOpen} onClose={onAcknowledge} title="Friendly Deconstruction" maxWidth="md">
      <div className="space-y-4">
        {/* Header Alert */}
        <div className="p-3 bg-arcade-magenta/15 border-2 border-arcade-magenta/40 rounded-xl text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-arcade-magenta font-mono font-bold text-xs uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            Adaptive Strategy Breakdown
          </div>
          <div className="font-display font-black text-2xl text-arcade-cream font-mono">
            {factorA} × {factorB} = <span className="text-arcade-cyan">{decomp.totalProduct}</span>
          </div>
          <p className="text-xs text-arcade-cream/70 font-mono">
            Big multiplications are easier when split into friendly facts!
          </p>
        </div>

        {/* Step-by-Step Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
          {/* Sub-fact 1 */}
          <div className="p-3 bg-arcade-surface border-2 border-arcade-cyan/40 rounded-xl space-y-2 text-center">
            <div className="text-xs text-arcade-cyan font-bold uppercase tracking-wide">
              Step 1: Friendly Base
            </div>
            <div className="text-lg font-black text-arcade-cyan">
              {decomp.fixedFactor} × {decomp.part1} = {decomp.subProduct1}
            </div>
            <div className="flex justify-center gap-1 text-sm select-none">
              {Array.from({ length: Math.min(decomp.part1, 6) }).map((_, idx) => (
                <span key={idx}>💎</span>
              ))}
            </div>
          </div>

          {/* Sub-fact 2 */}
          <div className="p-3 bg-arcade-surface border-2 border-arcade-amber/40 rounded-xl space-y-2 text-center">
            <div className="text-xs text-arcade-amber font-bold uppercase tracking-wide">
              Step 2: Remaining Part
            </div>
            <div className="text-lg font-black text-arcade-amber">
              {decomp.fixedFactor} × {decomp.part2} = {decomp.subProduct2}
            </div>
            <div className="flex justify-center gap-1 text-sm select-none">
              {Array.from({ length: Math.min(decomp.part2, 6) }).map((_, idx) => (
                <span key={idx}>🔶</span>
              ))}
            </div>
          </div>
        </div>

        {/* Synthesis Banner */}
        <div className="p-3 bg-arcade-chassis border-2 border-arcade-border rounded-xl text-center font-mono space-y-1">
          <div className="text-xs text-arcade-cream/60">Combine Both Steps:</div>
          <div className="text-base font-black text-arcade-green">
            {decomp.subProduct1} + {decomp.subProduct2} = {decomp.totalProduct}
          </div>
          <div className="text-xs text-arcade-cream/50">
            This question has been re-queued so you can conquer it!
          </div>
        </div>

        {/* Acknowledge Button */}
        <div className="pt-1">
          <TactileButton
            variant="cyan"
            size="lg"
            fullWidth
            onClick={onAcknowledge}
            className="flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Got It! Re-queue Fact
          </TactileButton>
        </div>
      </div>
    </Modal>
  );
};
