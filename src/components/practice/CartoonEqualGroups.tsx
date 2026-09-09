import React, { useState } from 'react';
import { SifirFactor } from '../../types/sifir';
import { audioEngine } from '../../services/audioEngine';
import { CARTOON_THEMES, getOfflineCargoPodSvg, getOfflineGemSvg } from '../../services/cartoonAssetService';

interface CartoonEqualGroupsProps {
  readonly factorA: SifirFactor;
  readonly factorB: SifirFactor;
  readonly avatarSeed?: string;
}

export const CartoonEqualGroups: React.FC<CartoonEqualGroupsProps> = ({
  factorA,
  factorB,
  avatarSeed = 'ArcadePilot',
}) => {
  const [activePodIdx, setActivePodIdx] = useState<number | null>(null);
  const theme = CARTOON_THEMES.cosmicBot;
  const robotUrl = theme.getRobotUrl(`${avatarSeed}-${factorB}`);
  const fallbackPodSvg = getOfflineCargoPodSvg('#00F5D4');
  const gemSvg = getOfflineGemSvg('#FFB703');

  const handlePodClick = (idx: number) => {
    setActivePodIdx(idx);
    audioEngine.playKeyClick();
  };

  return (
    <div className="w-full bg-arcade-surface/90 border-2 border-arcade-border rounded-3xl p-4 sm:p-5 space-y-4 shadow-arcade-md">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-arcade-groove pb-3">
        <div className="flex items-center gap-3">
          <img
            src={robotUrl}
            alt="Captain Bot"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = fallbackPodSvg;
            }}
            className="w-10 h-10 rounded-xl bg-arcade-groove border border-arcade-cyan/40 p-1"
          />
          <div>
            <h4 className="font-display font-black text-sm text-arcade-cyan uppercase tracking-wider">
              Pilot Cargo Fleet: {factorA} Pods × {factorB} Gems
            </h4>
            <p className="text-xs text-arcade-cream/60 font-mono">
              Tap any pod to verify repeated addition ({Array.from({ length: factorA }, () => factorB).join(' + ')})
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 bg-arcade-amber/15 text-arcade-amber border border-arcade-amber/30 rounded-xl">
          Total: {factorA * factorB}
        </span>
      </div>

      {/* Cargo Pods Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
        {Array.from({ length: factorA }).map((_, podIdx) => {
          const isSelected = activePodIdx === podIdx;
          const runningCount = (podIdx + 1) * factorB;

          return (
            <button
              key={podIdx}
              type="button"
              onClick={() => handlePodClick(podIdx)}
              className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-arcade-cyan/15 border-arcade-cyan scale-105 shadow-arcade-sm'
                  : 'bg-arcade-groove/80 border-arcade-border hover:border-arcade-cyan/50 hover:bg-arcade-groove'
              }`}
            >
              {/* Pod Badge */}
              <div className="flex items-center justify-between w-full text-[10px] font-mono font-bold">
                <span className="text-arcade-cyan">Pod #{podIdx + 1}</span>
                <span className="text-arcade-amber font-bold">+{factorB} (={runningCount})</span>
              </div>

              {/* Items in Pod */}
              <div className="flex flex-wrap items-center justify-center gap-1 p-1.5 bg-arcade-chassis/80 rounded-xl w-full min-h-[36px]">
                {Array.from({ length: factorB }).map((__, itemIdx) => (
                  <img
                    key={itemIdx}
                    src={gemSvg}
                    alt="Gem"
                    className="w-4 h-4 transform transition-transform hover:scale-125"
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
