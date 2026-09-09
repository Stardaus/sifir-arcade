# Arcade Settings Modal and Multi-Theme System Engine

Written against: unavailable (not a git repository)

## Evidence chain

- Surface: `src/components/common/ArcadeSettingsModal.tsx`, `src/types/theme.ts`, `src/components/common/ArcadeHeader.tsx`, `src/App.tsx`, `src/index.css`, `tailwind.config.js`
- Problem: Sifir Neo-Arcade previously had fixed midnight-neon color tokens, and lacked a centralized settings interface where learners could customize visual themes, speech dialect, sound synthesis, and mobile haptic vibration.
- Design evidence:
  - `tailwind.config.js` hardcoded `#12151E`, `#1A1F30`, `#00F5D4`, `#F72585`, preventing theme customizability.
  - `LearnerProfile` had `voiceLang: 'ms-MY' | 'en-US'` defined in types, but no UI in the product allowed users to switch language or manage system preferences.
  - User requested a dedicated, fun settings area with multiple themes and authentic neo-arcade visual design via `/grill-me`.
- Owner: `src/components/common/ArcadeSettingsModal.tsx`
- Scope and affected surfaces: Global app styling (`data-theme`), `ArcadeHeader.tsx`, `App.tsx`, `storageService.ts`, `audioEngine.ts`.
- Uncertainty: none

## Design decision

Implement a Retro Handheld BIOS Console Settings Modal (`ArcadeSettingsModal.tsx`) with a 4-theme dynamic CSS-variable architecture:
1. **Themes**:
   - `neo-arcade`: Midnight Obsidian with Electric Cyan, Amber, and Hot Pink.
   - `gameboy-8bit`: Nostalgic dot-matrix LCD olive with forest and emerald phosphors.
   - `cyber-synth`: Deep Synthwave indigo console with laser cyan and neon magenta.
   - `solar-flare`: Molten dark copper with sunburst gold and warm amber highlights.
2. **Settings Controls**:
   - Palette preview keycaps with real-time dynamic CSS variable swapping.
   - Master Sound Synthesizer toggle.
   - Spoken Voice Instruction toggle with Language dialect switch (`🇲🇾 BM ms-MY` / `🇬🇧 EN en-US`).
   - Tactile Haptic feedback vibration toggle for mobile touchscreen devices.
   - Direct launch shortcut to Parent Progress Portal.
3. **Persistence**:
   - Saved per `LearnerProfile` in `localStorage` via `profile.themeId` and `profile.hapticsEnabled`.

## Reuse

- Tactile button keypresses and haptic feedback via `audioEngine.playKeyClick()`.
- Safe area inset utility `pt-safe`.
- Standardized modal overlay with backdrop blur and Escape key dismissal.

## Validation

- Product: Open settings modal from header gear button on mobile or desktop; select any of the 4 themes; all surfaces (matrix, cabin, quiz, speed rush, HUD) switch colors instantly.
- Accessibility: All interactive elements exceed 44×44px touch targets; ARIA roles (`role="dialog"`, `aria-modal="true"`, `aria-pressed`) verified.
- Repository: `npm run build` → exit code 0 without errors.
