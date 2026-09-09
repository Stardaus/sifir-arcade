import React, { useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Vibrate,
  Shield,
  Palette,
  Check,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { LearnerProfile, ArcadeThemeId } from '../../types/profile';
import { ARCADE_THEMES } from '../../types/theme';
import { audioEngine } from '../../services/audioEngine';

interface ArcadeSettingsModalProps {
  readonly isOpen: boolean;
  readonly profile: LearnerProfile;
  readonly onClose: () => void;
  readonly onUpdateProfile: (updated: Partial<LearnerProfile>) => void;
  readonly onOpenParentPortal: () => void;
}

import { SettingToggleRow } from './SettingToggleRow';

export const ArcadeSettingsModal: React.FC<ArcadeSettingsModalProps> = ({
  isOpen,
  profile,
  onClose,
  onUpdateProfile,
  onOpenParentPortal,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectTheme = (themeId: ArcadeThemeId) => {
    audioEngine.playKeyClick();
    onUpdateProfile({ themeId });
  };
  const handleToggleSound = () => {
    audioEngine.playKeyClick();
    onUpdateProfile({ soundEnabled: !profile.soundEnabled });
  };
  const handleToggleVoice = () => {
    audioEngine.playKeyClick();
    onUpdateProfile({ voiceEnabled: !profile.voiceEnabled });
  };
  const handleToggleLang = () => {
    audioEngine.playKeyClick();
    onUpdateProfile({ voiceLang: profile.voiceLang === 'ms-MY' ? 'en-US' : 'ms-MY' });
  };
  const handleToggleHaptics = () => {
    audioEngine.playKeyClick();
    onUpdateProfile({ hapticsEnabled: !profile.hapticsEnabled });
  };
  const handleLaunchParent = () => {
    audioEngine.playKeyClick();
    onClose();
    onOpenParentPortal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-arcade-chassis/80 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-arcade-surface border-2 border-arcade-border rounded-2xl sm:rounded-3xl shadow-arcade-lg overflow-hidden flex flex-col max-h-[90dvh]"
      >
        {/* BIOS Modal Header */}
        <div className="px-4 py-3 bg-arcade-groove/80 border-b-2 border-arcade-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">⚙️</span>
            <div>
              <h2 id="settings-dialog-title" className="font-display font-black text-sm sm:text-base text-arcade-cream tracking-wide">
                CABIN SYSTEM CONFIG
              </h2>
              <p className="text-[10px] font-mono text-arcade-cyan font-bold">PILOT: {profile.name.toUpperCase()}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 rounded-xl bg-arcade-surface hover:bg-arcade-border border border-arcade-border text-arcade-cream flex items-center justify-center transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan cursor-pointer"
            aria-label="Close settings modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable BIOS Controls Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
          {/* Section 1: Cabinet Themes */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Palette className="w-4 h-4 text-arcade-cyan" aria-hidden="true" />
              <h3 className="font-display font-black text-xs sm:text-sm text-arcade-cream tracking-wider uppercase">
                Cabinet Theme Skins
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {ARCADE_THEMES.map((t) => {
                const isSelected = profile.themeId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTheme(t.id)}
                    className={`min-h-[58px] p-2.5 rounded-xl border-2 text-left transition active:scale-[0.98] flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan ${
                      isSelected
                        ? 'bg-arcade-groove border-arcade-cyan shadow-[0_0_12px_rgba(0,245,212,0.2)]'
                        : 'bg-arcade-surface hover:bg-arcade-groove/60 border-arcade-border/80'
                    }`}
                    aria-label={`Select ${t.name} theme`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full border border-black/30" style={{ backgroundColor: t.swatches.accent }} aria-hidden="true" />
                        <span className="w-3 h-3 rounded-full border border-black/30" style={{ backgroundColor: t.swatches.highlight }} aria-hidden="true" />
                      </div>
                      <span className="text-[9px] font-mono font-bold px-1 py-0.5 rounded bg-black/40 text-arcade-cream/70">{t.tag}</span>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-display font-bold text-xs text-arcade-cream leading-tight">{t.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-arcade-cyan" aria-hidden="true" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Hardware & Audio Controls */}
          <div>
            <h3 className="font-display font-black text-xs sm:text-sm text-arcade-cream tracking-wider uppercase mb-2.5">
              Hardware & Audio
            </h3>
            <div className="space-y-2">
              <SettingToggleRow
                icon={profile.soundEnabled ? <Volume2 className="w-5 h-5 text-arcade-cyan" /> : <VolumeX className="w-5 h-5 text-arcade-cream/40" />}
                title="Sound Effects"
                subtitle="Tactile arcade synthesizer"
                control={
                  <button
                    type="button"
                    onClick={handleToggleSound}
                    className={`min-w-[48px] h-8 px-2 rounded-lg font-mono text-xs font-bold transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan cursor-pointer ${
                      profile.soundEnabled ? 'bg-arcade-cyan text-arcade-chassis font-black' : 'bg-arcade-surface text-arcade-cream/50 border border-arcade-border'
                    }`}
                    aria-label={profile.soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
                    aria-pressed={profile.soundEnabled}
                  >
                    {profile.soundEnabled ? 'ON' : 'OFF'}
                  </button>
                }
              />

              <SettingToggleRow
                icon={profile.voiceEnabled ? <Mic className="w-5 h-5 text-arcade-magenta" /> : <MicOff className="w-5 h-5 text-arcade-cream/40" />}
                title="Voice Instructions"
                subtitle="Spoken problem guidance"
                control={
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    className={`min-w-[48px] h-8 px-2 rounded-lg font-mono text-xs font-bold transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan cursor-pointer ${
                      profile.voiceEnabled ? 'bg-arcade-magenta text-white font-black' : 'bg-arcade-surface text-arcade-cream/50 border border-arcade-border'
                    }`}
                    aria-label={profile.voiceEnabled ? 'Disable voice guidance' : 'Enable voice guidance'}
                    aria-pressed={profile.voiceEnabled}
                  >
                    {profile.voiceEnabled ? 'ON' : 'OFF'}
                  </button>
                }
              />

              <SettingToggleRow
                icon={<Globe className="w-5 h-5 text-arcade-amber" />}
                title="Voice Language"
                subtitle="Speech synthesis dialect"
                control={
                  <button
                    type="button"
                    onClick={handleToggleLang}
                    className="h-8 px-2.5 rounded-lg bg-arcade-amber/20 hover:bg-arcade-amber/30 text-arcade-amber border border-arcade-amber/40 font-mono text-xs font-bold transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan cursor-pointer"
                    aria-label={`Voice language currently ${profile.voiceLang === 'ms-MY' ? 'Bahasa Melayu' : 'English'}. Click to switch.`}
                  >
                    {profile.voiceLang === 'ms-MY' ? '🇲🇾 BM (ms-MY)' : '🇬🇧 EN (en-US)'}
                  </button>
                }
              />

              <SettingToggleRow
                icon={<Vibrate className={`w-5 h-5 ${profile.hapticsEnabled ? 'text-arcade-green' : 'text-arcade-cream/40'}`} />}
                title="Tactile Haptics"
                subtitle="Physical vibration on keypress"
                control={
                  <button
                    type="button"
                    onClick={handleToggleHaptics}
                    className={`min-w-[48px] h-8 px-2 rounded-lg font-mono text-xs font-bold transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan cursor-pointer ${
                      profile.hapticsEnabled ? 'bg-arcade-green text-arcade-chassis font-black' : 'bg-arcade-surface text-arcade-cream/50 border border-arcade-border'
                    }`}
                    aria-label={profile.hapticsEnabled ? 'Disable tactile vibration' : 'Enable tactile vibration'}
                    aria-pressed={profile.hapticsEnabled}
                  >
                    {profile.hapticsEnabled ? 'ON' : 'OFF'}
                  </button>
                }
              />
            </div>
          </div>

          {/* Section 3: Parent Progress Shortcut */}
          <button
            type="button"
            onClick={handleLaunchParent}
            className="w-full min-h-[50px] p-3 rounded-xl bg-arcade-amber/10 hover:bg-arcade-amber/20 border-2 border-arcade-amber/40 text-arcade-cream flex items-center justify-between gap-3 transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan cursor-pointer"
            aria-label="Open Parent Progress Heatmap"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-arcade-amber/25 text-arcade-amber flex items-center justify-center">
                <Shield className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="text-left">
                <div className="font-display font-black text-xs sm:text-sm text-arcade-amber">Parent Progress Portal</div>
                <div className="text-[10px] text-arcade-cream/60">Inspect fluency telemetry and mastery heatmaps</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-arcade-amber" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
