import { ArcadeThemeId } from './profile';

export interface ArcadeThemeConfig {
  readonly id: ArcadeThemeId;
  readonly name: string;
  readonly description: string;
  readonly tag: string;
  readonly swatches: {
    readonly chassis: string;
    readonly surface: string;
    readonly accent: string;
    readonly highlight: string;
  };
}

export const ARCADE_THEMES: readonly ArcadeThemeConfig[] = [
  {
    id: 'neo-arcade',
    name: 'Neo-Arcade',
    description: 'Midnight obsidian chassis with electric cyan, amber, and hot pink neon glows.',
    tag: 'DEFAULT',
    swatches: {
      chassis: '#12151E',
      surface: '#1A1F30',
      accent: '#00F5D4',
      highlight: '#FFB703',
    },
  },
  {
    id: 'gameboy-8bit',
    name: 'Game Boy 8-Bit',
    description: 'Nostalgic dot-matrix olive LCD screen with rich forest and emerald tones.',
    tag: 'RETRO',
    swatches: {
      chassis: '#162415',
      surface: '#223821',
      accent: '#9BBC0F',
      highlight: '#8BAC0F',
    },
  },
  {
    id: 'cyber-synth',
    name: 'Cyber Synth',
    description: 'Deep synthwave indigo console with radiant laser cyan and neon magenta.',
    tag: 'VAPOR',
    swatches: {
      chassis: '#130924',
      surface: '#1E1038',
      accent: '#00F0FF',
      highlight: '#FF007F',
    },
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    description: 'Molten dark copper chassis with radiating sunburst gold and warm amber.',
    tag: 'GOLD',
    swatches: {
      chassis: '#1C140D',
      surface: '#2B1F14',
      accent: '#FFA94D',
      highlight: '#FFD43B',
    },
  },
];
