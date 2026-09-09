# Issue #1: App Foundation & Multi-Profile System

## What to build

A high-performance, mobile/tablet-optimized web application foundation featuring the Arcade Neo-Play design system and an offline-first multi-profile learner management system. Parents and children can create learner profiles with custom avatars, switch between active profiles seamlessly, view personal star banks and levels, and have all profile data, settings, and progress persisted reliably in browser storage.

```typescript
// Profile Data Shape
interface LearnerProfile {
  id: string;
  name: string;
  avatar: string;
  totalStars: number;
  currentStreak: number;
  bestStreak: number;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  createdAt: number;
}
```

## Acceptance criteria

- [ ] Fast, responsive application shell loads with Arcade Neo-Play theme (deep cosmos background, vibrant token accents, crisp responsive layout).
- [ ] Profile Picker allows creating a new learner profile (name input + playful avatar selection).
- [ ] Switching between multiple profiles updates active session context instantly.
- [ ] Top navigation bar displays active learner avatar, name, star bank counter with bounce animation, and quick profile switcher modal.
- [ ] Global settings drawer allows toggling audio sound effects and synthesized voiceovers.
- [ ] All profile data automatically persists across browser refreshes via localStorage.

## Blocked by

- None - can start immediately
