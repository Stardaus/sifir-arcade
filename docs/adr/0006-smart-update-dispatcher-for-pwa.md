# 0006 Smart Update Dispatcher for PWA

We decided to implement a state-aware Smart Update Dispatcher for the Progressive Web App (PWA):
1. **Periodic & Resume Checks**: The Service Worker checks for newer build deployments on app initialization, `window.onfocus`, and `document.visibilitychange` events, as well as an interval every 15 minutes.
2. **Immediate Cache Takeover**: The incoming Service Worker uses `self.skipWaiting()` and `clients.claim()` during installation to ensure the new static assets are ready without lingering in the `waiting` state.
3. **State-Aware Activation**:
   - If the user is on the `CabinHome` idle screen, the application seamlessly triggers `window.location.reload()` to serve the fresh build immediately.
   - If the user is engaged in active gameplay (`StepPractice`, `SmartQuiz`, or `SpeedRush`), the reload is deferred and an arcade toast banner is presented (`🚀 New Update Ready — Tap to Refresh`), ensuring active combo streaks and time-attack timers are never lost mid-calculation.

This resolves the common PWA stale-cache trap on mobile phones while protecting young learners from frustrating interruptions.
