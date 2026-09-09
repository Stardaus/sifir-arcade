# Align Speed Rush Mode Action Button Label with Sibling Cards

Written against: unavailable (not a git repository)

## Evidence chain

- Surface: `src/components/home/CabinHomeView.tsx`
- Problem: The "60s Speed Rush" mode button contains a trailing emoji `⚡` (`Launch Speed Rush ⚡`), introducing decorative label inconsistency among the four sibling adventure cards on the cabin home screen.
- Design evidence:
  - `CabinHomeView.tsx:146-152`: `<TactileButton ...>Launch Speed Rush ⚡</TactileButton>`
  - Sibling cards on `CabinHomeView.tsx`:
    - Matrix card (line 79): `<TactileButton ...>Explore Matrix</TactileButton>`
    - Practice card (line 103): `<TactileButton ...>Practice Sifir (1–12)</TactileButton>`
    - Quiz card (line 127): `<TactileButton ...>Start Smart Quiz</TactileButton>`
  - Icon badge on line 135: `<Zap className="w-6 h-6" />` already establishes the lightning bolt visual motif for Speed Rush.
- Owner: `src/components/home/CabinHomeView.tsx`
- Scope and affected surfaces: `src/components/home/CabinHomeView.tsx`
- Uncertainty: none

## Design decision

Remove the trailing `⚡` emoji from `CabinHomeView.tsx:146` so the button label reads `Launch Speed Rush`. This standardizes the button labeling pattern across all 4 sibling adventure cards as clean, active verb phrases without redundant emoji decoration.

## Reuse

- Clean action verb phrase button labeling pattern.
- Exemplars: [CabinHomeView.tsx:79](file:///Users/nina/development/test-projects/frontend-designer/src/components/home/CabinHomeView.tsx#L79) (`Explore Matrix`), [CabinHomeView.tsx:127](file:///Users/nina/development/test-projects/frontend-designer/src/components/home/CabinHomeView.tsx#L127) (`Start Smart Quiz`).

## Changes

1. `src/components/home/CabinHomeView.tsx`
   - Change: Replace `Launch Speed Rush ⚡` with `Launch Speed Rush` as the text content of `TactileButton` on lines 145–153.
   - Preserve: Button variant `green`, size `lg`, `fullWidth`, `onClick={() => onSelectMode('SPEED_RUSH')}`.
   - Verify: The button text displays cleanly as "Launch Speed Rush" without the trailing lightning emoji.

## Scope

- Inherit: Speed Rush card on `CabinHomeView`.
- Verify: Primary mode grid on `CabinHomeView`.
- Exclude: Speed Rush gameplay view (`SpeedRushView.tsx`), celebration modal.

## Validation

- Product: View Cabin Home screen; confirm all 4 mode buttons follow consistent typographic formatting.
- Interface: Check button label alignment, padding, and text centering across mobile and desktop.
- System: Enforces single-responsibility label design without redundant inline emoji iconography.
- Repository: `npm run build` → clean compilation.

## Stop conditions

- Stop if sibling card action buttons adopt emoji labeling conventions.

## Design documentation

- After acceptance and validation: none
