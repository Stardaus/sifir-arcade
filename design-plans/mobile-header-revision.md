# Revision of Mobile View Arcade Header for Ergonomics and Accessibility

Written against: unavailable (not a git repository)

## Evidence chain

- Surface: `src/components/common/ArcadeHeader.tsx` and `src/components/common/ArcadeMobileDrawer.tsx`
- Problem: The mobile viewport (< 640px) header crowded 6 disparate controls into a cramped row with undersized 26px touch targets (violating WCAG 2.5.5 / 2.5.8 recommendations of 44–48px minimum target size), omitted semantic ARIA accessibility labels and toggle states (`aria-pressed`, `aria-expanded`), omitted visible focus-ring outlines, lacked safe-area top inset support (`pt-safe`), and did not respect user reduced motion preferences (`prefers-reduced-motion`).
- Design evidence:
  - `ArcadeHeader.tsx` previously used `p-1.5` and `w-3.5 h-3.5` on icon buttons, creating a physical tap area of ~26×26px on phone viewports.
  - Squeezed 6 items (Logo/Back, Profile Pill, Star Bank, Sound Toggle, Voice Toggle, Parent Shield) horizontally into ~340px viewport width, creating fat-finger mis-taps.
  - `CONTEXT.md` specifies "Zero-Scroll Viewport: The compact mobile phone presentation constraining HUD, question display, active visual feedback, and tactile input strictly within 100dvh without vertical page scroll."
  - ADR 0005 emphasizes "Tactile Touch Engine: zero-delay touch execution (`touch-action: manipulation`) ... authentic handheld console feel on mobile phones and tablets."
- Owner: `src/components/common/ArcadeHeader.tsx`
- Scope and affected surfaces: `src/components/common/ArcadeHeader.tsx`, `src/components/common/ArcadeMobileDrawer.tsx` (consumed in `src/App.tsx`)
- Uncertainty: none

## Design decision

Revision the header for mobile phone viewports into three high-contrast ergonomic zones:
1. **Left (Navigation / Brand)**: Tactile Return-to-Cabin button with `min-h-[44px]` (in game) or branded animated logo with `motion-safe:animate-bounce` (on home).
2. **Center (Integrated Pilot Cartridge Badge)**: A unified 44px tap target combining avatar emoji and star count (`[ 🦊 | ⭐ 120 ]`) that directly launches the Profile Picker modal.
3. **Right (Tactile Control Cluster & HUD Drawer)**: Direct 44×44px Master Sound quick-toggle with LED status indicator + a 44×44px Quick-Settings trigger that expands an accessible, slide-down Arcade HUD Drawer (`ArcadeMobileDrawer`) housing Voice Guide, Sound FX, and Parent Progress with generous 48px touch rows.
Desktop and tablet viewports (≥ 640px) retain their full horizontal expanded layout with separated profile pill, star bank, and utility buttons.

## Reuse

- Tactile button keypresses and haptic feedback via `audioEngine.playKeyClick()`.
- Safe area inset utility `pt-safe`.
- Arcade palette tokens (`arcade-chassis`, `arcade-surface`, `arcade-groove`, `arcade-border`, `arcade-cyan`, `arcade-magenta`, `arcade-amber`, `arcade-cream`).

## Changes

1. `src/components/common/ArcadeHeader.tsx`
   - Upgrade `<header>` with `role="banner"`, `pt-safe`, and sticky placement.
   - Enforce `min-w-[44px] min-h-[44px]` on all interactive buttons.
   - Add explicit `aria-label`, `aria-pressed`, `aria-expanded`, and high-contrast `focus-visible:ring-2 focus-visible:ring-arcade-cyan`.
   - Implement responsive branching: integrated pilot badge on `< 640px`, separate pills on `≥ 640px`.
   - Add glowing LED pips to indicate toggle state.
2. `src/components/common/ArcadeMobileDrawer.tsx`
   - Modular slide-down settings drawer with backdrop overlay, Escape key dismissal, and 48px tap target rows for Voice Guide, Sound FX, and Parent Progress.

## Scope

- Inherit: All views rendering `ArcadeHeader` (`src/App.tsx`).
- Verify: Mobile viewport (320px–414px) and tablet/desktop viewports (≥ 640px).
- Exclude: Profile picker modal, game CRT display, numpad console.

## Validation

- Product: Open app; verify mobile view displays an uncluttered, thumb-friendly HUD with accessible tap targets.
- Interface: Tap master sound toggle, open mobile settings drawer, toggle voice guidance, and navigate to parent matrix or cabin.
- Accessibility: All buttons meet WCAG 2.5.5 / 2.5.8 touch target sizes (≥44px), have clear accessible names, and support keyboard focus.
- Repository: `npm run build` → clean compilation without TypeScript or Vite errors.

## Stop conditions

- Stop if viewport width exceeds 640px (full desktop controls layout takes over).
