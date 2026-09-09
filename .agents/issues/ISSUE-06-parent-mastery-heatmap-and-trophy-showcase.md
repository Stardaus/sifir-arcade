# Issue #6: Parent 12×12 Mastery Heatmap & Trophy Showcase

## What to build

A dedicated analytics and trophy showcase dashboard for parents and learners. Renders a comprehensive 12×12 color-coded heatmap matrix representing all 144 multiplication facts $(1\times 1 \text{ to } 12\times 12)$ with status colors (`UNTOUCHED`, `LEARNING`, `PRACTICING`, `MASTERED`). Parents can click any cell to see detailed telemetry (accuracy rate, average latency in ms, and total attempts), view unlocked collectible badges/trophies, and export/import progress data via JSON.

```typescript
// Heatmap Telemetry Metric
interface FactMetric {
  factKey: string; // e.g. "8x7"
  multiplier: number;
  multiplicand: number;
  product: number;
  status: "UNTOUCHED" | "LEARNING" | "PRACTICING" | "MASTERED";
  accuracy: number; // percentage 0 - 100
  avgTimeMs: number;
  attempts: number;
}
```

## Acceptance criteria

- [ ] Complete 12×12 color-coded heatmap grid representing all 144 multiplication facts with instant visual status indicators.
- [ ] Hover/Tap tooltip on each cell revealing exact attempts, accuracy %, and average response speed.
- [ ] Trophy & Badge showcase exhibiting unlocked achievements (e.g. "Sifir 2 Ninja", "Sifir 7 Hero", "Speed Demon", "12x12 Grandmaster").
- [ ] Overall Mastery Progress bar showing percentage of all 144 facts mastered.
- [ ] One-click JSON Backup Export and Restore utility to transfer or backup progress across devices.

## Blocked by

- [Issue #4: Smart Quiz & Adaptive Weak-Spot Mastery Engine](file:///Users/nina/development/test-projects/frontend-designer/.agents/issues/ISSUE-04-smart-quiz-and-adaptive-weak-spot-mastery.md)
