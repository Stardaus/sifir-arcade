# Restore Learner Profile Name Visibility in Arcade Header

Written against: unavailable (not a git repository)

## Evidence chain

- Surface: `src/components/common/ArcadeHeader.tsx`
- Problem: The active profile name `{profile.name}` is permanently hidden (`display: none`) on all viewports, including desktop screens, inside the header profile pill button.
- Design evidence:
  - `ArcadeHeader.tsx:61`: `<span className="font-display font-bold text-arcade-cream text-sm sm:text-base hidden xs:inline">{profile.name}</span>`
  - `tailwind.config.js`: Does not configure an `xs:` screen breakpoint.
  - Compiled CSS (`dist/assets/index-F5IE8JJy.css`): Contains `.hidden { display: none; }` and `.sm\:inline { display: inline; }`, but drops `xs:inline`.
  - Exemplar: [ArcadeHeader.tsx:39](file:///Users/nina/development/test-projects/frontend-designer/src/components/common/ArcadeHeader.tsx#L39) defines `<span className="hidden sm:inline">Cabin</span>`.
- Owner: `src/components/common/ArcadeHeader.tsx`
- Scope and affected surfaces: `src/components/common/ArcadeHeader.tsx` (consumed in `src/App.tsx`)
- Uncertainty: none

## Design decision

Replace the invalid breakpoint modifier `xs:inline` with standard Tailwind utility `sm:inline` on line 61 of `ArcadeHeader.tsx`. This aligns the profile name's responsive behavior with the established header button pattern on line 39, hiding the text label on compact mobile viewports (< 640px) while rendering it inline on tablet and desktop screens (≥ 640px).

## Reuse

- `hidden sm:inline`
- Exemplar: [ArcadeHeader.tsx:39](file:///Users/nina/development/test-projects/frontend-designer/src/components/common/ArcadeHeader.tsx#L39)

## Changes

1. `src/components/common/ArcadeHeader.tsx`
   - Change: On line 61, replace `hidden xs:inline` with `hidden sm:inline`.
   - Preserve: Avatar emoji, typography classes (`font-display font-bold text-arcade-cream text-sm sm:text-base`), users icon, and `onOpenProfilePicker` click handler.
   - Verify: At viewport width ≥ 640px, the active learner's name is rendered visibly adjacent to the avatar emoji in the top header profile button. At viewport width < 640px, only the avatar and user icon remain visible.

## Scope

- Inherit: All views rendering `ArcadeHeader` (`src/App.tsx`).
- Verify: `ArcadeHeader` at viewports < 640px and ≥ 640px.
- Exclude: Profile picker modal, audio controls, star bank display.

## Validation

- Product: Open application in browser; verify the active profile name (e.g. "Hero") appears next to the avatar emoji in the header.
- Interface: Viewport ≥ 640px shows avatar + name; viewport < 640px shows avatar only without layout distortion or header wrapping.
- System: Reuses standard Tailwind breakpoint `sm:` matching line 39.
- Repository: `npm run build` → clean compilation without TypeScript or Vite errors.

## Stop conditions

- Stop if `tailwind.config.js` is customized with a custom `xs` screen breakpoint.

## Design documentation

- After acceptance and validation: none
