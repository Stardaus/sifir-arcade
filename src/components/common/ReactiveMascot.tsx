import React from 'react';
import { CARTOON_THEMES, getOfflineCargoPodSvg } from '../../services/cartoonAssetService';

export type MascotMood = 'idle' | 'streak' | 'overdrive' | 'wrong' | 'celebrate';

interface ReactiveMascotProps {
  readonly mood?: MascotMood;
  readonly streak?: number;
  readonly customMessage?: string;
  readonly className?: string;
}

const getMascotSpeech = (mood: MascotMood, streak: number, customMessage?: string): string => {
  if (customMessage) return customMessage;
  switch (mood) {
    case 'overdrive':
      return '⚡ OVERDRIVE FEVER! Math powers 100%!';
    case 'streak':
      return streak >= 5 ? `🔥 ${streak}x COMBO! Unstoppable!` : `⭐ ${streak} in a row! Keep going!`;
    case 'wrong':
      return "No problem! Let's deconstruct and conquer!";
    case 'celebrate':
      return '🎉 Math Champion! Sifir Mastered!';
    default:
      return "You've got this, Pilot!";
  }
};

export const ReactiveMascot: React.FC<ReactiveMascotProps> = ({
  mood = 'idle',
  streak = 0,
  customMessage,
  className = '',
}) => {
  const robotUrl = CARTOON_THEMES.cosmicBot.getRobotUrl(`CaptainBot-${mood}`);
  const fallbackSvg = getOfflineCargoPodSvg('#00F5D4');
  const speechText = getMascotSpeech(mood, streak, customMessage);

  const getBubbleBorder = (): string => {
    switch (mood) {
      case 'overdrive':
        return 'border-arcade-magenta text-arcade-magenta bg-arcade-magenta/10 shadow-neon';
      case 'streak':
        return 'border-arcade-amber text-arcade-amber bg-arcade-amber/10';
      case 'wrong':
        return 'border-arcade-cyan text-arcade-cyan bg-arcade-cyan/10';
      default:
        return 'border-arcade-border text-arcade-cream/80 bg-arcade-chassis/80';
    }
  };

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Cartoon Mascot Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={robotUrl}
          alt="Captain Bot"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallbackSvg;
          }}
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-arcade-groove border-2 p-1 transition-transform ${
            mood === 'overdrive'
              ? 'border-arcade-magenta scale-110 animate-pulse'
              : mood === 'streak'
              ? 'border-arcade-amber scale-105'
              : 'border-arcade-cyan'
          }`}
        />
        {mood === 'overdrive' && (
          <span className="absolute -top-1 -right-1 text-xs animate-bounce">⚡</span>
        )}
      </div>

      {/* Reactive Speech Bubble */}
      <div
        className={`px-3 py-1 rounded-xl border font-mono text-xs font-bold transition-all duration-200 ${getBubbleBorder()}`}
      >
        <span className="truncate block max-w-[200px] sm:max-w-xs">{speechText}</span>
      </div>
    </div>
  );
};
