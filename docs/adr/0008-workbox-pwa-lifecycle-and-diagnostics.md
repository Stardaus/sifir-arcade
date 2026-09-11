# 0008 Workbox PWA Lifecycle and Diagnostic Telemetry

We decided to upgrade the application's service worker pipeline and telemetry infrastructure using `vite-plugin-pwa` with Workbox and a two-stage diagnostic probe:

1. **Automated Content Hashing with Workbox**:
   - Adopt `vite-plugin-pwa` (`generateSW` mode with `registerType: 'prompt'`) to replace the hand-rolled static `public/sw.js`.
   - Every production build dynamically generates a content-hashed precache manifest for all bundles and assets. Any deployment to production modifies the service worker script byte-for-byte, guaranteeing browser cache invalidation.

2. **Dual-Stage Update Probe**:
   - **Stage 1 (Build Telemetry Seam)**: Fetches `/version.json` with `cache: 'no-store'` and an explicit 5-second timeout. If the returned `buildId` matches the client's compile-time `__APP_BUILD_INFO__`, it deterministically confirms the app is on the latest build without waiting on indeterminate service worker states.
   - **Stage 2 (Workbox Service Worker Update)**: If a newer build is detected or during automatic checks, triggers `registration.update()` via `workbox-window`.

3. **State-Aware Seamless Auto-Update**:
   - On the idle `CABIN_HOME` screen, incoming service worker activation calls `workbox.messageSkipWaiting()` and reloads immediately to deliver the latest build seamlessly.
   - During active gameplay (`StepPractice`, `SmartQuiz`, `SpeedRush`), auto-reload is deferred and the arcade `PwaUpdateBanner` is displayed to protect active combo streaks and time-attack timers.

4. **Sanitized Diagnostics & Secret Protection**:
   - The manual "Check for Updates" probe reports structured, debuggable domain diagnostic codes (`UP_TO_DATE`, `OFFLINE`, `TIMEOUT`, `SERVER_ERROR`, `UPDATE_AVAILABLE`).
   - The UI never displays raw system exceptions, internal stack traces, API keys, auth headers, or backend query parameters. Raw unhandled errors are safely classified under `UNKNOWN_ERROR` and logged only to client `console.debug()`.

5. **Firmware & Telemetry Inspector UI**:
   - Integrated directly into `ArcadeSettingsModal` ("CABIN SYSTEM CONFIG"), presenting active build provenance (version, build timestamp, git short commit) alongside the manual check trigger and live diagnostic status badge.
