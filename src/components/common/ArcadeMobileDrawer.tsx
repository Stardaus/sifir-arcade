import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Shield, ChevronRight } from 'lucide-react';
import { LearnerProfile } from '../../types/profile';
import { ActiveScreen } from '../../types/sifir';

interface ArcadeMobileDrawerProps {
  readonly isOpen: boolean;
  readonly profile: LearnerProfile;
  readonly activeScreen: ActiveScreen;
  readonly onClose: () => void;
  readonly onToggleSound: () => void;
  readonly onToggleVoice: () => void;
  readonly onOpenParentPortal: () => void;
}

export const ArcadeMobileDrawer: React.FC<ArcadeMobileDrawerProps> = ({
  isOpen,
  profile,
  activeScreen,
  onClose,
  onToggleSound,
  onToggleVoice,
  onOpenParentPortal,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 top-[56px] bg-arcade-chassis/80 backdrop-blur-sm z-30 sm:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Tray */}
      <div
        id="mobile-arcade-settings"
        ref={drawerRef}
        role="region"
        aria-label="Arcade HUD Quick Controls"
        className="absolute top-full left-0 right-0 bg-arcade-surface border-b-2 border-arcade-border p-3 shadow-arcade-lg z-40 sm:hidden flex flex-col gap-2.5"
      >
        <div className="flex items-center justify-between px-1 pb-1 border-b border-arcade-border/50 text-[11px] font-mono uppercase tracking-wider text-arcade-cream/60">
          <span>Arcade HUD Controls</span>
          <span className="text-arcade-cyan font-bold">{profile.name}</span>
        </div>

        {/* Voice Toggle Row */}
        <button
          type="button"
          onClick={onToggleVoice}
          className={`w-full min-h-[48px] px-3 py-2.5 rounded-xl border flex items-center justify-between gap-3 text-left transition active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan ${
            profile.voiceEnabled
              ? 'bg-arcade-magenta/15 border-arcade-magenta/40 text-arcade-cream'
              : 'bg-arcade-groove border-arcade-border text-arcade-cream/60'
          }`}
          aria-label={profile.voiceEnabled ? 'Disable spoken voice instructions' : 'Enable spoken voice instructions'}
          aria-pressed={profile.voiceEnabled}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                profile.voiceEnabled
                  ? 'bg-arcade-magenta/25 text-arcade-magenta'
                  : 'bg-arcade-surface text-arcade-cream/40'
              }`}
            >
              {profile.voiceEnabled ? (
                <Mic className="w-5 h-5" aria-hidden="true" />
              ) : (
                <MicOff className="w-5 h-5" aria-hidden="true" />
              )}
            </div>
            <div>
              <div className="font-display font-bold text-sm text-arcade-cream">Voice Guide</div>
              <div className="text-[11px] text-arcade-cream/50">Spoken math instructions</div>
            </div>
          </div>
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
              profile.voiceEnabled
                ? 'bg-arcade-magenta/20 text-arcade-magenta border border-arcade-magenta/40'
                : 'bg-arcade-chassis text-arcade-cream/40 border border-arcade-border/50'
            }`}
          >
            {profile.voiceEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Sound FX Toggle Row */}
        <button
          type="button"
          onClick={onToggleSound}
          className={`w-full min-h-[48px] px-3 py-2.5 rounded-xl border flex items-center justify-between gap-3 text-left transition active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan ${
            profile.soundEnabled
              ? 'bg-arcade-cyan/15 border-arcade-cyan/40 text-arcade-cream'
              : 'bg-arcade-groove border-arcade-border text-arcade-cream/60'
          }`}
          aria-label={profile.soundEnabled ? 'Disable game sound effects' : 'Enable game sound effects'}
          aria-pressed={profile.soundEnabled}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                profile.soundEnabled
                  ? 'bg-arcade-cyan/25 text-arcade-cyan'
                  : 'bg-arcade-surface text-arcade-cream/40'
              }`}
            >
              {profile.soundEnabled ? (
                <Volume2 className="w-5 h-5" aria-hidden="true" />
              ) : (
                <VolumeX className="w-5 h-5" aria-hidden="true" />
              )}
            </div>
            <div>
              <div className="font-display font-bold text-sm text-arcade-cream">Arcade Sound</div>
              <div className="text-[11px] text-arcade-cream/50">Chimes, pulses, and streaks</div>
            </div>
          </div>
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
              profile.soundEnabled
                ? 'bg-arcade-cyan/20 text-arcade-cyan border border-arcade-cyan/40'
                : 'bg-arcade-chassis text-arcade-cream/40 border border-arcade-border/50'
            }`}
          >
            {profile.soundEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Parent Heatmap Row */}
        {activeScreen !== 'PARENT_HEATMAP' && (
          <button
            type="button"
            onClick={onOpenParentPortal}
            className="w-full min-h-[48px] px-3 py-2.5 rounded-xl bg-arcade-groove hover:bg-arcade-border border border-arcade-border text-arcade-cream flex items-center justify-between gap-3 text-left transition active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan"
            aria-label="Open Parent Progress Matrix"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-arcade-amber/20 text-arcade-amber flex items-center justify-center">
                <Shield className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <div className="font-display font-bold text-sm text-arcade-cream">
                  Parent Progress
                </div>
                <div className="text-[11px] text-arcade-cream/50">Mastery heatmap & telemetry</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-arcade-cream/40" aria-hidden="true" />
          </button>
        )}
      </div>
    </>
  );
};
