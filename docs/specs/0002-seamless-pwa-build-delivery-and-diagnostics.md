# Specification: Seamless PWA Production Delivery & Diagnostic Telemetry

Triage: `ready-for-agent`
Date: 2026-09-12
Status: Approved

---

### Problem Statement

When learners install Sifir Neo-Arcade as a Progressive Web App (PWA) on mobile phones or tablets, they frequently remain stranded on obsolete application builds long after new versions have been deployed to production. 

This failure occurs because the current service worker implementation relies on a static, hand-rolled file (`public/sw.js`) with a hardcoded cache version. When developers push new code, Vite creates new hashed bundles (`dist/assets/index-[hash].js`), but the static service worker script itself undergoes zero byte changes. Because browsers only trigger service worker lifecycle updates when the worker script changes byte-for-byte, installed PWAs never detect the deployment.

Furthermore, learners and parents have no mechanism within the app to manually verify whether they are running the latest release. Current update checks fail silently without reporting errors. If an update cannot proceed due to network disconnection, timeout, or server unavailability, users receive no diagnostic feedback. Conversely, naive error reporting risks leaking sensitive deployment internals, authorization headers, full URLs with query parameters, or raw JavaScript stack traces.

---

### Solution

Implement an automated, deterministic PWA delivery and diagnostic telemetry architecture:

1. **Automated Content Hashing with Workbox (`vite-plugin-pwa`)**: Replace static service worker maintenance with Workbox `generateSW` in `prompt` mode. Every production build dynamically generates a content-hashed precache manifest. Any production deployment alters the service worker script byte-for-byte, guaranteeing browser cache invalidation.
2. **Compile-Time Build Stamp & Telemetry Seam**:
   - Inject `__APP_BUILD_INFO__` (semantic version, ISO build timestamp, git commit short hash) into the bundle via Vite `define`.
   - Generate a lightweight `dist/version.json` endpoint during build time.
3. **Two-Stage Deterministic Update Probe**:
   - **Stage 1 (HTTP Seam)**: Fetches `/version.json` with `cache: 'no-store'` and an explicit 5-second timeout. If the remote build matches the local build stamp, it immediately reports `[UP_TO_DATE]`. If the device is offline or the request times out, it immediately reports the exact failure condition.
   - **Stage 2 (Service Worker Sync)**: If a newer build is detected or during automatic lifecycle triggers, invokes `workbox.update()` to stage the incoming service worker.
4. **State-Aware Seamless Refresh**:
   - When the learner is on the idle home screen (`CABIN_HOME`), the incoming worker executes `skipWaiting()` and the app reloads seamlessly.
   - During active gameplay (`StepPractice`, `SmartQuiz`, `SpeedRush`), the reload is deferred and the non-disruptive `PwaUpdateBanner` is shown to protect active math streaks.
5. **Sanitized Diagnostics & Secret Protection**:
   - Diagnostic output maps to a strict allowlist of domain codes: `UP_TO_DATE`, `UPDATE_AVAILABLE`, `DOWNLOADING`, `OFFLINE_ERROR`, `TIMEOUT_ERROR`, `SERVER_ERROR`, `UNKNOWN_ERROR`.
   - Error messages are stripped of internal file paths, query parameters, authorization headers, and raw stack traces. Unhandled exceptions are logged only to client `console.debug()`.
6. **Firmware & Telemetry Inspector in Cabin Settings**:
   - An interactive diagnostic row inside `ArcadeSettingsModal` ("CABIN SYSTEM CONFIG") displaying active build provenance, a tactile "Check for Updates" button with loading state, and color-coded diagnostic badge.

---

### User Stories

1. **As a developer pushing a new release to production**, I want every installed PWA client to automatically detect and download the new build on app launch or resume, so that users never remain stuck on stale code.
2. **As a young learner actively playing Speed Rush or Step Practice**, I want incoming updates to defer reloading until I return to the home screen or tap the update banner, so that my active combo streak and countdown timer are never interrupted mid-calculation.
3. **As a parent or pilot on the Cabin Home screen**, I want incoming updates to apply seamlessly upon return to the cabin, so that I always experience the freshest game features without manual friction.
4. **As a user suspecting an update is available**, I want a "Check for Updates" button in the Cabin System Config settings, so that I can manually probe the server on demand.
5. **As a user whose application is already current**, I want the diagnostic message to state explicitly that the build is up to date alongside the installed build stamp, so that I have complete confidence in my installation status.
6. **As a user experiencing connectivity issues**, I want the update probe to report specifically that the check failed due to an offline connection or request timeout, so that I understand why the check could not complete.
7. **As a security-conscious administrator**, I want all update diagnostic messages to strictly sanitize error outputs, so that server URLs, query tokens, and internal stack traces are never exposed in the user interface.

---

### Implementation Decisions

#### 1. Modules to Build & Modify

- **`package.json` [MODIFY]**:
  - Add `vite-plugin-pwa` to `devDependencies`.
  - Add `workbox-window` to `dependencies`.

- **`vite.config.ts` [MODIFY]**:
  - Configure `VitePWA` with `generateSW`, `registerType: 'prompt'`, `cleanupOutdatedCaches: true`, and standard PWA asset glob patterns (`**/*.{js,css,html,svg,png,webmanifest}`).
  - Add a custom Vite build plugin `generateBuildMetadataPlugin` that writes `dist/version.json` containing `{ version, buildId, timestamp, commit }`.
  - Expose `__APP_BUILD_INFO__` via Vite `define`.

- **`src/types/telemetry.ts` [NEW]**:
  - `AppBuildInfo`: `{ version: string; buildId: string; timestamp: string; commit: string }`.
  - `UpdateDiagnosticCode`: `'IDLE' | 'CHECKING' | 'UP_TO_DATE' | 'UPDATE_AVAILABLE' | 'DOWNLOADING' | 'OFFLINE_ERROR' | 'TIMEOUT_ERROR' | 'SERVER_ERROR' | 'UNKNOWN_ERROR'`.
  - `UpdateCheckResult`:
    ```ts
    export interface UpdateCheckResult {
      code: UpdateDiagnosticCode;
      title: string;
      message: string;
      localBuildId: string;
      targetBuildId?: string;
      timestamp: number;
    }
    ```

- **`src/services/diagnosticSanitizer.ts` [NEW]**:
  - Pure diagnostic error parsing and formatting engine.
  - Implements `sanitizeUpdateError(error: unknown, isOnline: boolean): UpdateCheckResult`.
  - Strict guardrails: removes any URLs, query strings (`?token=...`), tokens, and stack traces before formatting the user-facing message.
  - Generates reproducible, debuggable error codes (e.g. `ERR_NET_OFFLINE`, `ERR_FETCH_TIMEOUT`, `ERR_HTTP_503`).

- **`src/services/pwaUpdateService.ts` [MODIFY]**:
  - Rewired to use `workbox-window.Workbox`.
  - Implements two-stage `checkNow(): Promise<UpdateCheckResult>`.
  - Coordinates state-aware activation: calls `wb.messageSkipWaiting()` and reloads on `CABIN_HOME`, or dispatches `PwaUpdateBanner` during active gameplay.
  - Broadcasts live update check state changes to subscribed listeners.

- **`src/components/common/ArcadeSettingsModal.tsx` [MODIFY]**:
  - Adds the **Firmware & Telemetry Inspector** card in the BIOS settings.
  - Displays: Current Version, Build ID / Timestamp badge.
  - Tactile **Check for Updates** button with spinner during `CHECKING`.
  - Diagnostic status banner with appropriate arcade theme borders:
    - Cyan border: `UP_TO_DATE`
    - Magenta border: `UPDATE_AVAILABLE` / `DOWNLOADING`
    - Amber border: `OFFLINE_ERROR` / `TIMEOUT_ERROR` / `SERVER_ERROR`

---

### Testing Decisions

#### Seams Under Test
1. **Sanitization Seam (`diagnosticSanitizer.test.ts`)**:
   - Verify that network disconnect (`TypeError: Failed to fetch` or `navigator.onLine === false`) maps to `OFFLINE_ERROR`.
   - Verify that timeouts (`DOMException: AbortError`) map to `TIMEOUT_ERROR`.
   - Verify that sensitive strings (e.g. `https://api.internal.org/secret?token=xyz123`) in error inputs are scrubbed completely from user messages.
2. **Build Seam (`version.json` + `dist/sw.js`)**:
   - Automated `npm run build` verification checking that `dist/version.json` exists, is valid JSON, and matches `__APP_BUILD_INFO__`.
   - Verify that Workbox generates `dist/sw.js` with content hashes for precached assets.
3. **PWA Dispatcher Logic (`pwaUpdateService.test.ts`)**:
   - Test version comparison: matching build IDs produce `UP_TO_DATE`; disparate build IDs produce `UPDATE_AVAILABLE`.
   - Test screen navigation triggering deferred updates when entering `CABIN_HOME`.

---

### Out of Scope

- **Native App Store Binaries**: iOS App Store / Google Play binary wrapping (Capacitor/Cordova) is not part of this release; this focuses purely on the standard Progressive Web Application running in browser and installed standalone mode.
- **Rollback Orchestration**: The client will detect and install what the production server serves; automated server-side traffic shifting or instant rollbacks are handled by the hosting CDN, not the client.
