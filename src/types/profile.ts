export type ArcadeThemeId = 'neo-arcade' | 'gameboy-8bit' | 'cyber-synth' | 'solar-flare';

export interface LearnerProfile {
  readonly id: string;
  readonly name: string;
  readonly avatar: string;
  readonly totalStars: number;
  readonly currentStreak: number;
  readonly bestStreak: number;
  readonly speedRushHighScore: number;
  readonly soundEnabled: boolean;
  readonly voiceEnabled: boolean;
  readonly voiceLang: 'ms-MY' | 'en-US';
  readonly themeId: ArcadeThemeId;
  readonly hapticsEnabled: boolean;
  readonly createdAt: number;
}

export const DEFAULT_AVATARS = [
  '🦊', '🦁', '🚀', '⚡', '🦖', '🐼', '🐯', '🦄', '🤖', '🎮', '🥋', '👑'
] as const;

export const createDefaultProfile = (name: string, avatar: string): LearnerProfile => ({
  id: `profile_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  name: name.trim() || 'Hero',
  avatar: avatar || '🦊',
  totalStars: 0,
  currentStreak: 0,
  bestStreak: 0,
  speedRushHighScore: 0,
  soundEnabled: true,
  voiceEnabled: true,
  voiceLang: 'ms-MY',
  themeId: 'neo-arcade',
  hapticsEnabled: true,
  createdAt: Date.now(),
});
