# Issue #4: Smart Quiz & Adaptive Weak-Spot Mastery Engine

## What to build

An adaptive quiz engine that creates personalized 15-question revision sessions prioritizing multiplication facts where the learner has high error rates or slow response times. Supports dual input methods (tactile numpad or 4-option multiple choice) switchable by the learner, updates the 144-fact mastery state (`UNTOUCHED`, `LEARNING`, `PRACTICING`, `MASTERED`), and displays celebratory summary cards with confetti bursts and star bonuses.

```typescript
// Sifir Fact Mastery Model
interface SifirMasteryRecord {
  factKey: string; // e.g. "7x8"
  attempts: number;
  correct: number;
  lastResponseMs: number;
  streak: number;
  status: "UNTOUCHED" | "LEARNING" | "PRACTICING" | "MASTERED";
}
```

## Acceptance criteria

- [ ] Adaptive question selection algorithm weighting missed and slow-response facts higher than already mastered facts.
- [ ] Input mode toggle: Learner can switch between "Keypad" (active recall numpad) and "Multiple Choice" (4 distinct options with plausible distractors).
- [ ] Real-time combo streak multiplier (e.g. 2x, 3x, 5x Combo!) with visual particle flare.
- [ ] End-of-Quiz Summary Screen:
  - Accuracy percentage, time taken, and total stars earned.
  - Breakdown of newly mastered facts vs facts that need more practice.
  - Confetti explosion effect (via canvas-confetti) on scoring $\ge 80\%$.
- [ ] Automatically updates the profile's 144-fact mastery map in localStorage.

## Blocked by

- [Issue #3: Step-by-Step Table Practice & Tactile Numpad Engine](file:///Users/nina/development/test-projects/frontend-designer/.agents/issues/ISSUE-03-step-by-step-table-practice-and-tactile-numpad.md)
