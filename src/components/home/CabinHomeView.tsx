import React from 'react';
import { Grid, Sparkles, Zap, Shield, BookOpen, Target, Compass } from 'lucide-react';
import { LearnerProfile } from '../../types/profile';
import { ActiveScreen, MasteryMap, SifirFactor } from '../../types/sifir';
import { TactileButton } from '../common/TactileButton';

interface CabinHomeViewProps {
  readonly profile: LearnerProfile;
  readonly masteryMap?: MasteryMap;
  readonly onSelectMode: (screen: ActiveScreen, table?: SifirFactor) => void;
}

function getTelemetryStats(masteryMap?: MasteryMap): {
  masteredCount: number;
  weakCount: number;
  recommendedTable: SifirFactor;
} {
  if (!masteryMap) {
    return { masteredCount: 0, weakCount: 0, recommendedTable: 2 };
  }

  let mastered = 0;
  let weak = 0;
  const tableMastery: Record<number, number> = {};
  for (let r = 1; r <= 12; r++) tableMastery[r] = 0;

  for (const [key, fact] of Object.entries(masteryMap)) {
    if (fact.status === 'MASTERED') {
      mastered += 1;
      const factorA = parseInt(key.split('x')[0], 10);
      if (tableMastery[factorA] !== undefined) {
        tableMastery[factorA] += 1;
      }
    } else if (fact.status === 'LEARNING' || fact.averageLatencyMs > 3000) {
      weak += 1;
    }
  }

  let recommended: SifirFactor = 2;
  for (let t = 1; t <= 12; t++) {
    if (tableMastery[t] < 12) {
      recommended = t as SifirFactor;
      break;
    }
  }

  return { masteredCount: mastered, weakCount: weak, recommendedTable: recommended };
}

export const CabinHomeView: React.FC<CabinHomeViewProps> = ({
  profile,
  masteryMap,
  onSelectMode,
}) => {
  const { masteredCount, weakCount, recommendedTable } = getTelemetryStats(masteryMap);

  const modes = [
    {
      id: 'EXPLORE_MATRIX' as ActiveScreen,
      title: '12 × 12 Sifir Matrix',
      description: 'Explore dynamic area canvases, commutative mirrors, and visual arrays.',
      icon: <Grid className="w-5 h-5 sm:w-6 sm:h-6" />,
      badgeText: `${masteredCount}/144 Mastered`,
      badgeIcon: <Compass className="w-3.5 h-3.5" />,
      buttonText: 'Explore',
      variant: 'cyan' as const,
      colorClasses: 'text-arcade-cyan bg-arcade-cyan/15 border-arcade-cyan/40',
      action: () => onSelectMode('EXPLORE_MATRIX'),
    },
    {
      id: 'STEP_PRACTICE' as ActiveScreen,
      title: 'Step Practice',
      description: 'Master tables 1–12 with cartoon cargo pods and skip tracks.',
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />,
      badgeText: `Mission: Sifir ${recommendedTable}`,
      buttonText: `Sifir ${recommendedTable}`,
      variant: 'amber' as const,
      colorClasses: 'text-arcade-amber bg-arcade-amber/15 border-arcade-amber/40',
      action: () => onSelectMode('STEP_PRACTICE', recommendedTable),
    },
    {
      id: 'SMART_QUIZ' as ActiveScreen,
      title: 'Weak-Spot Drill',
      description: 'Target lock diagnostics, adaptive deconstruction, and re-queuing.',
      icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
      badgeText: weakCount > 0 ? `${weakCount} Weak Spots` : 'Calibrated',
      badgeIcon: <Target className="w-3.5 h-3.5" />,
      buttonText: 'Drill',
      variant: 'magenta' as const,
      colorClasses: 'text-arcade-magenta bg-arcade-magenta/15 border-arcade-magenta/40',
      action: () => onSelectMode('SMART_QUIZ'),
    },
    {
      id: 'SPEED_RUSH' as ActiveScreen,
      title: '60s Speed Rush',
      description: 'Arcade overdrive fever mode and +2s time surges under pressure.',
      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
      badgeText: 'Overdrive Active',
      buttonText: 'Rush',
      variant: 'green' as const,
      colorClasses: 'text-arcade-green bg-arcade-green/15 border-arcade-green/40',
      action: () => onSelectMode('SPEED_RUSH'),
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3 sm:space-y-6 py-1">
      {/* Hero Pilot Banner */}
      <div className="p-3 sm:p-6 bg-gradient-to-br from-arcade-surface via-arcade-chassis to-arcade-surface border-2 border-arcade-border rounded-2xl sm:rounded-3xl relative overflow-hidden shadow-arcade-md">
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="text-4xl sm:text-5xl p-2 bg-arcade-groove rounded-2xl border-2 border-arcade-border shadow-inner">
              {profile.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-arcade-amber">
                  PILOT
                </span>
                <span className="text-[10px] sm:text-xs font-mono px-1.5 py-0.5 bg-arcade-magenta/20 text-arcade-magenta rounded-full font-bold">
                  Sifir Champion
                </span>
              </div>
              <h1 className="font-display font-black text-xl sm:text-3xl text-arcade-cream tracking-wide">
                {profile.name}
              </h1>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-3 p-2 sm:p-3 bg-arcade-chassis/90 rounded-xl border border-arcade-border font-mono text-xs">
            <div className="flex items-center gap-1 text-arcade-amber font-bold">
              <span>⭐</span>
              <span>{profile.totalStars}</span>
            </div>
            <div className="flex items-center gap-1 text-arcade-cyan font-bold">
              <Zap className="w-3 h-3" />
              <span>{profile.speedRushHighScore} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Streamlined Cartridge Tiles (Visible on mobile screens) */}
      <div className="grid grid-cols-1 gap-2.5 sm:hidden">
        {modes.map((m) => (
          <div
            key={m.id}
            className="p-2.5 bg-arcade-surface border-2 border-arcade-border rounded-2xl flex items-center justify-between gap-2 shadow-arcade-sm"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border ${m.colorClasses}`}>
                {m.icon}
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-black text-sm text-arcade-cream truncate">
                  {m.title}
                </h3>
                <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${m.colorClasses}`}>
                  {m.badgeIcon}
                  {m.badgeText}
                </span>
              </div>
            </div>

            <TactileButton
              variant={m.variant}
              size="sm"
              onClick={m.action}
              className="flex-shrink-0 px-4 py-2 font-mono text-xs font-black uppercase"
            >
              {m.buttonText}
            </TactileButton>
          </div>
        ))}
      </div>

      {/* Tablet & Desktop 2x2 Expansive Grid (Visible on sm and up) */}
      <div className="hidden sm:grid sm:grid-cols-2 gap-4">
        {modes.map((m) => (
          <div
            key={m.id}
            className="p-5 bg-arcade-surface border-2 border-arcade-border rounded-3xl flex flex-col justify-between space-y-3 hover:border-arcade-border/80 transition shadow-arcade-md"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${m.colorClasses}`}>
                  {m.icon}
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded-lg border ${m.colorClasses}`}>
                  {m.badgeIcon}
                  {m.badgeText}
                </span>
              </div>
              <h3 className="font-display font-black text-lg text-arcade-cream">
                {m.title}
              </h3>
              <p className="text-xs text-arcade-cream/70 leading-relaxed">
                {m.description}
              </p>
            </div>

            <TactileButton
              variant={m.variant}
              size="md"
              fullWidth
              onClick={m.action}
            >
              Launch {m.title}
            </TactileButton>
          </div>
        ))}
      </div>

      {/* Parent Radar Bottom Bar */}
      <div className="p-2.5 sm:p-3 bg-arcade-groove/60 border border-arcade-border rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-arcade-amber flex-shrink-0" />
          <span className="font-display font-bold text-arcade-cream/80 truncate">
            Parent Radar Heatmap
          </span>
        </div>
        <button
          type="button"
          onClick={() => onSelectMode('PARENT_HEATMAP')}
          className="font-mono font-bold text-arcade-cyan hover:underline ml-2 flex-shrink-0"
        >
          View 144 Facts →
        </button>
      </div>
    </div>
  );
};

