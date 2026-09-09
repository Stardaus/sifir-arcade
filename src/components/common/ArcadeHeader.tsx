import React from 'react';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Users,
  ArrowLeft,
  Shield,
  Settings,
} from 'lucide-react';
import { LearnerProfile } from '../../types/profile';
import { ActiveScreen } from '../../types/sifir';
import { TactileButton } from './TactileButton';
import { audioEngine } from '../../services/audioEngine';

interface ArcadeHeaderProps {
  readonly profile: LearnerProfile;
  readonly activeScreen: ActiveScreen;
  readonly onScreenChange: (screen: ActiveScreen) => void;
  readonly onOpenProfilePicker: () => void;
  readonly onOpenSettings: () => void;
  readonly onToggleSound: () => void;
  readonly onToggleVoice: () => void;
}

export const ArcadeHeader: React.FC<ArcadeHeaderProps> = ({
  profile,
  activeScreen,
  onScreenChange,
  onOpenProfilePicker,
  onOpenSettings,
  onToggleSound,
  onToggleVoice,
}) => {
  const isHome = activeScreen === 'CABIN_HOME';

  const handleOpenSettings = () => {
    audioEngine.playKeyClick();
    onOpenSettings();
  };

  const handleSoundToggle = () => {
    audioEngine.playKeyClick();
    onToggleSound();
  };

  const handleVoiceToggle = () => {
    audioEngine.playKeyClick();
    onToggleVoice();
  };

  const handleParentPortal = () => {
    audioEngine.playKeyClick();
    onScreenChange('PARENT_HEATMAP');
  };

  return (
    <header
      role="banner"
      className="w-full max-w-full bg-arcade-surface/95 backdrop-blur-md border-b-2 border-arcade-border px-2 sm:px-4 py-1.5 sm:py-2.5 sticky top-0 z-40 pt-safe transition-colors"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-3 w-full min-w-0">
        {/* Left: Navigation or Brand */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 min-w-0">
          {!isHome ? (
            <TactileButton
              variant="neutral"
              size="sm"
              onClick={() => onScreenChange('CABIN_HOME')}
              className="min-h-[44px] min-w-[44px] flex items-center gap-1 sm:gap-1.5 px-3 py-2 text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-arcade-cyan focus-visible:outline-none"
              aria-label="Return to Cabin Home"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span className="font-bold hidden xs:inline sm:inline">Cabin</span>
            </TactileButton>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 select-none py-1">
              <span className="text-xl sm:text-2xl motion-safe:animate-bounce" aria-hidden="true">🕹️</span>
              <span className="font-display font-black text-sm sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-arcade-amber via-arcade-cyan to-arcade-magenta tracking-wider whitespace-nowrap">
                SIFIR<span className="hidden sm:inline"> ARCADE</span>
              </span>
            </div>
          )}
        </div>

        {/* Center: Profile Hub & Star Bank */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* Mobile Integrated Pilot Cartridge Badge (< 640px) */}
          <button
            type="button"
            onClick={onOpenProfilePicker}
            className="sm:hidden min-h-[44px] px-2.5 py-1.5 bg-arcade-groove hover:bg-arcade-border border border-arcade-border rounded-xl active:scale-95 transition flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan"
            aria-label={`Current pilot: ${profile.name}, ${profile.totalStars} stars earned. Tap to switch profile`}
          >
            <span className="text-xl leading-none" aria-hidden="true">{profile.avatar}</span>
            <span className="w-px h-4 bg-arcade-border/80" aria-hidden="true" />
            <span className="flex items-center gap-1 font-mono font-black text-xs text-arcade-amber">
              <span aria-hidden="true">⭐</span>
              <span>{profile.totalStars}</span>
            </span>
          </button>

          {/* Desktop Separated Profile Pill (>= 640px) */}
          <button
            type="button"
            onClick={onOpenProfilePicker}
            className="hidden sm:flex min-h-[44px] items-center gap-2 px-3 py-1.5 bg-arcade-groove hover:bg-arcade-border border border-arcade-border/80 rounded-2xl transition cursor-pointer active:scale-95 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan"
            aria-label={`Current pilot: ${profile.name}. Tap to switch profile`}
          >
            <span className="text-xl leading-none" aria-hidden="true">{profile.avatar}</span>
            <span className="font-display font-bold text-arcade-cream">{profile.name}</span>
            <Users className="w-3.5 h-3.5 text-arcade-cream/50" aria-hidden="true" />
          </button>

          {/* Desktop Separated Star Bank (>= 640px) */}
          <div
            className="hidden sm:flex min-h-[44px] items-center gap-1.5 px-3 py-1.5 bg-arcade-amber/15 border border-arcade-amber/40 rounded-2xl shadow-inner"
            aria-label={`${profile.totalStars} total stars earned`}
          >
            <span className="text-lg leading-none" aria-hidden="true">⭐</span>
            <span className="font-display font-black text-arcade-amber text-lg font-mono leading-none">{profile.totalStars}</span>
          </div>
        </div>

        {/* Right: Controls Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Mobile Master Sound Quick-Toggle (< 640px) */}
          <button
            type="button"
            onClick={handleSoundToggle}
            className={`sm:hidden min-w-[44px] min-h-[44px] rounded-xl border transition active:scale-95 flex items-center justify-center relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan ${
              profile.soundEnabled
                ? 'bg-arcade-cyan/15 text-arcade-cyan border-arcade-cyan/40 shadow-[0_0_8px_rgba(0,245,212,0.25)]'
                : 'bg-arcade-groove text-arcade-cream/40 border-arcade-border/60'
            }`}
            aria-label={profile.soundEnabled ? 'Mute game sound effects' : 'Enable game sound effects'}
            aria-pressed={profile.soundEnabled}
          >
            {profile.soundEnabled ? <Volume2 className="w-5 h-5" aria-hidden="true" /> : <VolumeX className="w-5 h-5" aria-hidden="true" />}
            <span
              className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${
                profile.soundEnabled ? 'bg-arcade-cyan shadow-[0_0_6px_#00F5D4]' : 'bg-arcade-border'
              }`}
              aria-hidden="true"
            />
          </button>

          {/* Mobile Settings Button (< 640px) */}
          <button
            type="button"
            onClick={handleOpenSettings}
            className="sm:hidden min-w-[44px] min-h-[44px] rounded-xl border border-arcade-border bg-arcade-groove hover:bg-arcade-border text-arcade-cream/80 transition active:scale-95 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan cursor-pointer"
            aria-label="Open arcade settings and themes"
          >
            <Settings className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Desktop Sound Button (>= 640px) */}
          <button
            type="button"
            onClick={handleSoundToggle}
            className={`hidden sm:flex min-w-[44px] min-h-[44px] p-2.5 rounded-xl border transition active:scale-95 items-center justify-center relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan ${
              profile.soundEnabled
                ? 'bg-arcade-cyan/15 text-arcade-cyan border-arcade-cyan/40 shadow-[0_0_8px_rgba(0,245,212,0.25)]'
                : 'bg-arcade-groove text-arcade-cream/40 border-transparent'
            }`}
            aria-label={profile.soundEnabled ? 'Mute game sound effects' : 'Enable game sound effects'}
            aria-pressed={profile.soundEnabled}
          >
            {profile.soundEnabled ? <Volume2 className="w-4 h-4" aria-hidden="true" /> : <VolumeX className="w-4 h-4" aria-hidden="true" />}
          </button>

          {/* Desktop Voice Button (>= 640px) */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            className={`hidden sm:flex min-w-[44px] min-h-[44px] p-2.5 rounded-xl border transition active:scale-95 items-center justify-center relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan ${
              profile.voiceEnabled
                ? 'bg-arcade-magenta/15 text-arcade-magenta border-arcade-magenta/40 shadow-[0_0_8px_rgba(247,37,133,0.25)]'
                : 'bg-arcade-groove text-arcade-cream/40 border-transparent'
            }`}
            aria-label={profile.voiceEnabled ? 'Mute voice instructions' : 'Enable voice instructions'}
            aria-pressed={profile.voiceEnabled}
          >
            {profile.voiceEnabled ? <Mic className="w-4 h-4" aria-hidden="true" /> : <MicOff className="w-4 h-4" aria-hidden="true" />}
          </button>

          {/* Desktop Settings Button (>= 640px) */}
          <button
            type="button"
            onClick={handleOpenSettings}
            className="hidden sm:flex min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-arcade-groove hover:bg-arcade-border text-arcade-cream/80 border border-arcade-border transition active:scale-95 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan cursor-pointer"
            aria-label="Open arcade settings and themes"
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Desktop Parent Portal (>= 640px) */}
          {activeScreen !== 'PARENT_HEATMAP' && (
            <button
              type="button"
              onClick={handleParentPortal}
              className="hidden sm:flex min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-arcade-groove hover:bg-arcade-border text-arcade-cream/80 border border-arcade-border transition active:scale-95 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan"
              aria-label="Open Parent Progress Dashboard"
            >
              <Shield className="w-4 h-4 text-arcade-amber" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
