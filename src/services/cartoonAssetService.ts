/**
 * Service providing cartoon vector assets via DiceBear Bottts / Fun-Emoji APIs
 * with resilient offline SVG fallbacks.
 */

export interface CartoonTheme {
  readonly id: string;
  readonly name: string;
  readonly itemName: string;
  readonly itemEmoji: string;
  readonly getRobotUrl: (seed: string) => string;
}

export const CARTOON_THEMES: Record<string, CartoonTheme> = {
  cosmicBot: {
    id: 'cosmicBot',
    name: 'Cosmic Bottts',
    itemName: 'Energy Gems',
    itemEmoji: '💎',
    getRobotUrl: (seed: string) =>
      `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(seed)}&backgroundColor=1a1f30&radius=20`,
  },
  funSpark: {
    id: 'funSpark',
    name: 'Spark Critters',
    itemName: 'Power Stars',
    itemEmoji: '⭐',
    getRobotUrl: (seed: string) =>
      `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(seed)}&backgroundColor=242c44&radius=20`,
  },
};

/**
 * Returns an offline SVG data URI for an animated arcade cargo pod.
 */
export const getOfflineCargoPodSvg = (accentColor = '#00F5D4'): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none">
    <rect x="8" y="16" width="64" height="48" rx="16" fill="#1A1F30" stroke="${accentColor}" stroke-width="3"/>
    <path d="M20 28H60" stroke="${accentColor}" stroke-width="2" stroke-dasharray="4 2"/>
    <circle cx="24" cy="50" r="4" fill="${accentColor}"/>
    <circle cx="56" cy="50" r="4" fill="${accentColor}"/>
    <path d="M34 50H46" stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>
    <path d="M28 8L34 16H46L52 8" stroke="${accentColor}" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

/**
 * Returns an offline SVG data URI for a glowing collectible gem.
 */
export const getOfflineGemSvg = (fillColor = '#FFB703'): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
    <polygon points="16,2 30,12 24,30 8,30 2,12" fill="${fillColor}" stroke="#12151E" stroke-width="1.5"/>
    <polygon points="16,6 25,13 21,26 11,26 7,13" fill="#FFFFFF" fill-opacity="0.3"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
