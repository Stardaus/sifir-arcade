# 04: Firmware & Telemetry Inspector UI

Status: `DONE`
Blocked by: None

---

### Description
Integrate the Firmware & Telemetry Inspector card into the Cabin System Config modal (`ArcadeSettingsModal.tsx`). This allows the user or parent to view their installed build stamp, tap a tactile "Check for Updates" button, and view live, debuggable, secret-safe diagnostic status badges.

### Deliverables
1. **Settings Modal Integration (`src/components/common/ArcadeSettingsModal.tsx`)**:
   - Add new "Firmware & Telemetry" section under Cabinet Themes and Hardware controls.
   - Display active Build Stamp: version (e.g. `v1.0.0`), build date/time, and git commit short hash.
   - Add tactile "Check for Updates" arcade button:
     - Shows spinning loader icon while checking.
     - Disables during active check to prevent duplicate requests.
     - Plays arcade tactile key-click sound on tap via `audioEngine`.
2. **Diagnostic Status Banner**:
   - Renders color-coded status badge with clean arcade aesthetics:
     - **Cyan border & glow**: `UP_TO_DATE` ("Build is up to date").
     - **Magenta border & glow**: `UPDATE_AVAILABLE` or `DOWNLOADING` ("New update ready - tap to install").
     - **Amber border & glow**: `OFFLINE_ERROR` / `TIMEOUT_ERROR` / `SERVER_ERROR` (Clear debuggable reason without secret leakage).
3. **Ergonomic & Responsive Polish**:
   - Ensure the modal remains scrollable within the `90dvh` viewport constraints on mobile devices and zero-scroll viewports.

### Verification
- Manual verification in desktop and mobile viewports:
  - Open Cabin System Config (`⚙️`).
  - Observe build stamp is visible.
  - Tap "Check for Updates" and verify loading spinner and resulting diagnostic badge.
  - Verify sound click triggers on tap.
