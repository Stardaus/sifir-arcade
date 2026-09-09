# Conform Hero Pilot Banner Border to Card Container Standard

Written against: unavailable (not a git repository)

## Evidence chain

- Surface: `src/components/home/CabinHomeView.tsx`
- Problem: The Hero Pilot Banner renders with no visible border (`border-width: 0px`), creating a visual discrepancy against the other 4 enclosed mode cards on the cabin view.
- Design evidence:
  - `CabinHomeView.tsx:19`: `<div className="... border-3 border-arcade-border rounded-3xl ...">`
  - `tailwind.config.js`: `borderWidth` is not configured or extended.
  - Compiled CSS (`dist/assets/index-F5IE8JJy.css`): Contains `.border-2 { border-width: 2px; }` and `.border-arcade-border { border-color: rgb(50 61 94 / ...); }`. Utility `border-3` is absent.
  - Exemplar: [CabinHomeView.tsx:60, 84, 108, 132](file:///Users/nina/development/test-projects/frontend-designer/src/components/home/CabinHomeView.tsx#L60) all specify `border-2 border-arcade-border rounded-3xl`.
- Owner: `src/components/home/CabinHomeView.tsx`
- Scope and affected surfaces: `src/components/home/CabinHomeView.tsx`
- Uncertainty: none

## Design decision

Replace invalid utility `border-3` with standard `border-2` on `CabinHomeView.tsx:19`. This resolves the 0px preflight reset and applies a 2px arcade border (`#323D5E`) that matches the container card contract used throughout `CabinHomeView`.

## Reuse

- `border-2 border-arcade-border rounded-3xl`
- Exemplars: [CabinHomeView.tsx:60](file:///Users/nina/development/test-projects/frontend-designer/src/components/home/CabinHomeView.tsx#L60), [CabinHomeView.tsx:84](file:///Users/nina/development/test-projects/frontend-designer/src/components/home/CabinHomeView.tsx#L84), [CabinHomeView.tsx:108](file:///Users/nina/development/test-projects/frontend-designer/src/components/home/CabinHomeView.tsx#L108), [CabinHomeView.tsx:132](file:///Users/nina/development/test-projects/frontend-designer/src/components/home/CabinHomeView.tsx#L132)

## Changes

1. `src/components/home/CabinHomeView.tsx`
   - Change: Replace `border-3 border-arcade-border rounded-3xl` with `border-2 border-arcade-border rounded-3xl` on line 19.
   - Preserve: Background gradient `bg-gradient-to-br from-arcade-surface via-arcade-chassis to-arcade-surface`, padding `p-6 sm:p-8`, shadow `shadow-arcade-lg`, relative positioning, overflow hidden, and all inner content.
   - Verify: The Hero Pilot Banner renders with a defined 2px border in color `#323D5E`, visually matching the enclosure style of the 4 mode cards below it.

## Scope

- Inherit: `CabinHomeView` in `src/App.tsx`.
- Verify: `CabinHomeView` at mobile and desktop viewport widths.
- Exclude: Mode cards, bottom parent bar, avatar inner border.

## Validation

- Product: Open Cabin Home view; verify the hero pilot banner has an unbroken 2px border around its perimeter.
- Interface: Banner border visually matches the border weight and color of the mode cards below it.
- System: Reuses standard Tailwind `border-2` class without introducing custom tokens.
- Repository: `npm run build` → clean compilation without warnings.

## Stop conditions

- Stop if `tailwind.config.js` defines a deliberate custom `borderWidth` scale.

## Design documentation

- After acceptance and validation: none
