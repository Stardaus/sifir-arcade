# 05: End-to-End Build & PWA Invalidation Verification

Status: `DONE`
Blocked by: None

---

### Description
Perform full end-to-end integration and verification of the complete PWA delivery pipeline. Verify that the production build emits all required Workbox manifests and telemetry files, the preview server serves the PWA properly, and the test suite passes with 100% green status.

### Deliverables
1. **Build & Bundle Verification**:
   - Run `npm run build` to confirm production assets are emitted without errors.
   - Verify `dist/sw.js` contains Workbox precache entries with content hashes.
   - Verify `dist/version.json` contains matching build metadata.
   - Verify that modifying source code changes the generated precache manifest in `dist/sw.js`.
2. **Automated Test Suite**:
   - Run `npm test` across all test files:
     - `src/services/diagnosticSanitizer.test.ts`
     - `src/services/pwaUpdateService.test.ts`
     - Existing social share and telemetry tests
3. **PWA Runtime Verification**:
   - Run `npm run preview` and verify:
     - Service worker registers cleanly in browser.
     - Manual update check returns `UP_TO_DATE` with matching build ID.
     - Simulating network disconnection causes diagnostic inspector to report `OFFLINE_ERROR` without leaking secrets.

### Verification
- Full test pass with `npm test`.
- Clean production build with `npm run build`.
