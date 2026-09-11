# 03: Smart Update Dispatcher & Two-Stage Probe Service

Status: `DONE`
Blocked by: None

---

### Description
Refactor `pwaUpdateService.ts` to coordinate with Workbox (`workbox-window`) and the two-stage diagnostic probe. The service handles automatic background checks (on app resume, visibility change, and 15-minute interval), manual user-triggered checks via `checkNow()`, and state-aware seamless update application (auto-reloading on `CABIN_HOME` while withholding reload during active gameplay).

### Deliverables
1. **Workbox Window Integration (`src/services/pwaUpdateService.ts`)**:
   - Instantiate `Workbox` using `import.meta.env.BASE_URL + 'sw.js'`.
   - Wire event listeners: `'waiting'`, `'controlling'`, `'installed'`.
2. **Two-Stage Probe Implementation (`checkNow()`)**:
   - **Stage 1**: Fetch `version.json` with `cache: 'no-store'` and an explicit 5-second `AbortController` timeout.
   - If offline or failed, pass error to `diagnosticSanitizer` and return sanitized error result.
   - If remote `buildId` matches local `__APP_BUILD_INFO__.buildId`, return `UP_TO_DATE`.
   - **Stage 2**: If remote `buildId` differs, trigger `workbox.update()`, stage incoming worker, and return `UPDATE_AVAILABLE`.
3. **State-Aware Activation & Subscription**:
   - Maintain `applyUpdate(activeScreen)`: if `CABIN_HOME`, trigger `workbox.messageSkipWaiting()` and reload; otherwise notify subscribers to show `PwaUpdateBanner`.
   - Provide subscription method `subscribeDiagnostic(listener)` for UI components to track check progress.

### Verification
- Create unit tests in `src/services/pwaUpdateService.test.ts` mocking fetch and `Workbox` methods.
- Assert that `checkNow()` returns deterministic results for:
  - Matching build IDs (`UP_TO_DATE`).
  - Different build IDs (`UPDATE_AVAILABLE`).
  - Offline/fetch failures (`OFFLINE_ERROR`).
- Assert screen navigation to `CABIN_HOME` triggers update application when an update is pending.
