# Issue #3: Step-by-Step Table Practice & Tactile Numpad Engine

## What to build

A focused table drill mode where learners select a specific table (e.g. Sifir 4) and practice equations $1 \times 4$ through $12 \times 4$ sequentially. Includes the signature Arcade Neo-Play chunky 3D push-button numpad with realistic press physics and keyboard bindings, along with a procedural Web Audio sound synthesizer providing instant auditory feedback (happy chimes for correct, gentle boops on mistake, celebratory arpeggios on table completion).

```typescript
// Practice State
interface TablePracticeSession {
  targetTable: number; // 1 - 12
  currentStep: number;  // 1 - 12
  currentStreak: number;
  starsAwarded: number;
  inputBuffer: string;
  isComplete: boolean;
}
```

## Acceptance criteria

- [ ] Table Selector allowing learner to pick any table from 1 to 12.
- [ ] Sequential practice question display ($1 \times N$ up to $12 \times N$) with progress bar.
- [ ] Chunky 3D Arcade Numpad component with keys `0-9`, `Clear/Backspace`, and `Enter`:
  - Visual 3D push-down animation on click/touch (`active:translate-y-1` and shadow shift).
  - Full hardware keyboard event listener (`0-9`, `Enter`, `Backspace`, `Escape`).
- [ ] Web Audio procedural sound synthesizer (no external audio files):
  - Correct chime sequence ($E_5 \to G_5 \to B_5$).
  - Soft error boop.
  - Completion victory fanfare.
- [ ] Star reward animation and update to active profile's total stars upon completing the table.

## Blocked by

- [Issue #1: App Foundation & Multi-Profile System](file:///Users/nina/development/test-projects/frontend-designer/.agents/issues/ISSUE-01-app-foundation-and-multi-profile-system.md)
