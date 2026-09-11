# 02: Diagnostic Sanitizer & Secret Guardrail Engine

Status: `DONE`
Blocked by: None

---

### Description
Implement a pure, deterministic diagnostic parser and sanitization engine that maps network exceptions, timeouts, HTTP errors, and success states into safe, debuggable domain diagnostic messages. Enforce strict guardrails to prevent leaking sensitive information (e.g. authorization headers, query tokens, internal server paths, or raw JavaScript stack traces).

### Deliverables
1. **Diagnostic Type Definitions (`src/types/telemetry.ts`)**:
   - `UpdateDiagnosticCode`: `'IDLE' | 'CHECKING' | 'UP_TO_DATE' | 'UPDATE_AVAILABLE' | 'DOWNLOADING' | 'OFFLINE_ERROR' | 'TIMEOUT_ERROR' | 'SERVER_ERROR' | 'UNKNOWN_ERROR'`.
   - `UpdateCheckResult`: Structure containing `code`, `title`, `message`, `debugCode`, `localBuildId`, `targetBuildId`, and `timestamp`.
2. **Sanitizer Engine (`src/services/diagnosticSanitizer.ts`)**:
   - `sanitizeUpdateError(error: unknown, isOnline: boolean, localBuildId: string): UpdateCheckResult`:
     - Detects offline states (`!isOnline`, `TypeError: Failed to fetch`) -> `OFFLINE_ERROR` (`ERR_NET_OFFLINE`).
     - Detects timeouts (`AbortError`) -> `TIMEOUT_ERROR` (`ERR_FETCH_TIMEOUT`).
     - Detects HTTP status codes -> `SERVER_ERROR` (`ERR_HTTP_{status}`).
     - Fallback for unexpected errors -> `UNKNOWN_ERROR` (`ERR_CHECK_FAILED`).
   - `createUpToDateResult(buildId: string): UpdateCheckResult`:
     - Generates clear confirmation message: `System is up to date (Build {buildId} is current)`.
   - `createUpdateAvailableResult(localBuildId: string, targetBuildId: string): UpdateCheckResult`:
     - Generates prompt: `New build available ({targetBuildId}). Ready to install`.
   - `scrubSecrets(raw: string): string`:
     - Strips URLs, tokens (`?token=...`, `key=...`, `Bearer ...`), and path traces.
     - Logs raw diagnostic info safely to `console.debug()`.

### Verification
- Create `src/services/diagnosticSanitizer.test.ts`.
- Run `npm test` verifying:
  - Network disconnect error mapping.
  - Timeout error mapping.
  - Up-to-date message formatting.
  - Secret scrubbing: ensures query parameters, authorization tokens, and internal file paths are completely stripped from user-facing strings.
