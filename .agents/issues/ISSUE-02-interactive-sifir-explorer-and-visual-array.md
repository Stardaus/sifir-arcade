# Issue #2: Interactive Sifir 1–12 Explorer & Visual Array Visualizer

## What to build

An interactive 12×12 multiplication exploration matrix coupled with a dynamic visual grouping visualizer. Learners can interact with any cell in the table to inspect the product, view the repeated addition formula ($A \times B = B + B + \dots$), see an animated dot/gem array representing the geometric area, and listen to synthesized voice pronunciation (in Malay/English).

```typescript
// Sifir Visual Fact State
interface SifirFactView {
  multiplicand: number; // 1-12
  multiplier: number;   // 1-12
  product: number;
  repeatedAddition: string; // e.g. "4 + 4 + 4 = 12"
}
```

## Acceptance criteria

- [ ] Complete 12×12 multiplication table rendered as a responsive, touch-friendly grid.
- [ ] Active row and column header highlighting on hover/tap.
- [ ] Interactive Detail Modal / Flyout when tapping any cell showing:
  - Big bold mathematical equation (e.g. $6 \times 7 = 42$).
  - Repeated addition breakdown string.
  - Interactive $A \times B$ visual grid rendered with sparkling animated gem icons / dots.
- [ ] Web Speech API / Voice trigger button to speak the equation clearly (e.g. "Enam kali tujuh sama dengan empat puluh dua").
- [ ] Smooth transitions and responsive design for phone and tablet screens.

## Blocked by

- [Issue #1: App Foundation & Multi-Profile System](file:///Users/nina/development/test-projects/frontend-designer/.agents/issues/ISSUE-01-app-foundation-and-multi-profile-system.md)
