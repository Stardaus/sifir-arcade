import React from 'react';
import { SifirFactor } from '../../types/sifir';
import { audioEngine } from '../../services/audioEngine';

interface SkipCountingStripProps {
  readonly targetTable: SifirFactor;
  readonly currentStep: number;
  readonly onStepSelect?: (step: number) => void;
}

export const SkipCountingStrip: React.FC<SkipCountingStripProps> = ({
  targetTable,
  currentStep,
  onStepSelect,
}) => {
  const steps = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="w-full bg-arcade-surface border border-arcade-border rounded-2xl p-2.5 space-y-1.5 shadow-arcade-sm">
      <div className="flex items-center justify-between text-[11px] font-mono font-bold">
        <span className="text-arcade-amber uppercase tracking-wider">
          Skip-Counting Track (+{targetTable})
        </span>
        <span className="text-arcade-cyan">
          Step {currentStep} / 12
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {steps.map((step) => {
          const product = step * targetTable;
          const isCurrent = step === currentStep;
          const isPassed = step < currentStep;

          return (
            <button
              key={step}
              type="button"
              onClick={() => {
                audioEngine.playKeyClick();
                onStepSelect?.(step);
              }}
              className={`flex-shrink-0 px-2.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-arcade-amber text-arcade-chassis shadow-keycap-amber scale-105'
                  : isPassed
                  ? 'bg-arcade-green/20 text-arcade-green border border-arcade-green/40'
                  : 'bg-arcade-groove text-arcade-cream/60 border border-arcade-border/50 hover:bg-arcade-border'
              }`}
              title={`${step} × ${targetTable} = ${product}`}
            >
              <div className="text-[9px] opacity-75">{step}×</div>
              <div>{product}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
