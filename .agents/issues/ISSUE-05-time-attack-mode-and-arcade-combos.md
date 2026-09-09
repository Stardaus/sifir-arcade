# Issue #5: 60-Second Time Attack & Arcade Combo Challenge

## What to build

A high-intensity, gamified 60-second speed-run mode designed to test fluency and rapid mental arithmetic. Features a pulsating timer bar, ascending combo multipliers for uninterrupted correct answer streaks, speed rating titles ("Lightning Sifir Master", "Turbo Multiplier"), personal high score leaderboards per profile, and audio urgency effects.

```typescript
// Time Attack State
interface TimeAttackSession {
  timeLeftSeconds: number; // starts at 60
  totalAnswered: number;
  correctCount: number;
  maxCombo: number;
  currentCombo: number;
  finalScore: number;
}
```

## Acceptance criteria

- [ ] 60-second countdown timer with visual progress bar shifting from teal to amber to urgent pulsing coral.
- [ ] Rapid question generation across all Sifir 1–12 tables.
- [ ] Combo multiplier system ($1\times \to 2\times \to 3\times \to 5\times$) that increases points per correct answer and resets on mistake.
- [ ] Time-out game over screen with arcade scoreboard ranking, stars calculated from score, and celebratory badge unlock notifications.
- [ ] Personal best records tracked and displayed per learner profile.

## Blocked by

- [Issue #4: Smart Quiz & Adaptive Weak-Spot Mastery Engine](file:///Users/nina/development/test-projects/frontend-designer/.agents/issues/ISSUE-04-smart-quiz-and-adaptive-weak-spot-mastery.md)
