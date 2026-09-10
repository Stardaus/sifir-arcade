# Specification: Garmin-Style Social Telemetry Progress Snapshots

Triage: `ready-for-agent`
Date: 2026-09-10
Status: Approved

---

### Problem Statement

Young learners using Sifir Neo-Arcade achieve thrilling mathematical milestones—such as mastering a challenging times table (e.g., Sifir 7) with 100% accuracy, maintaining a 12× combo streak in Speed Rush, or unlocking 80+ facts across the matrix. However, parents have no seamless way to celebrate and share these achievements with family members, tutors, or class study groups on WhatsApp. 

Currently, parents must resort to standard phone screenshots, which capture awkward browser UI chrome, system battery bars, and uncropped viewports. Unlike modern fitness trackers (such as Garmin Connect) that package a completed workout into an attractive, branded athletic badge with key performance metrics, Sifir Neo-Arcade lacks a dedicated tactile sharing mechanic that turns mathematics practice into a proud, sporty achievement.

---

### Solution

Implement a client-side **Social Telemetry Progress Snapshot** engine:
1. **Procedural 1:1 Graphic Cards (1080×1080 PNG)**: Render high-contrast, retro-arcade achievement badges in the browser runtime via HTML5 2D Canvas without server round-trips or external rendering libraries.
2. **Dual Seam Triggers**:
   - **Run Telemetry Card**: Triggered directly from the post-game `CelebrationModal` for `StepPractice`, `SmartQuiz`, and `SpeedRush`.
   - **Mastery Radar Card**: Triggered from the `ParentHeatmapView` to celebrate cumulative matrix progress (e.g., "84 / 144 Facts Mastered") with an embedded micro-heatmap.
3. **Snapshot Preview Modal**: A parent inspection checkpoint offering an instant card preview, editable celebratory emoji caption text, and multi-tier share dispatch.
4. **Social Telemetry Dispatcher**: Uses the native Web Share API (`navigator.share({ files: [pngFile], text })`) to attach the image directly into WhatsApp on mobile devices, with seamless fallbacks for desktop and non-supporting browsers ("Copy Image", "Download PNG", and "Open WhatsApp Web").

---

### User Stories

1. **As a parent whose child finished a times table session**, I want to tap a "Share Snapshot" button on the celebration screen, so that I can generate a sports-style graphic card of the completed run.
2. **As a parent sharing to a WhatsApp group**, I want the Run Telemetry Card to showcase the learner's avatar, mode title, accuracy percentage, combo streak, stars earned, and date, so that recipients immediately appreciate the child's effort and skill.
3. **As a parent viewing long-term progress**, I want to tap "Share Mastery Card" on the Parent Heatmap, so that I can broadcast a milestone graphic celebrating total facts mastered and an arcade micro-heatmap of the 12×12 grid.
4. **As a parent, I want to inspect the generated card in a preview modal before sending**, so that I can review the graphic and customize the pre-filled WhatsApp message before dispatching.
5. **As a mobile phone user (iOS Safari or Android Chrome)**, I want tapping the share button to open the native OS share sheet with the PNG file attached, so that I can send it to WhatsApp with a single tap.
6. **As a desktop user**, I want clear fallback buttons to copy the PNG image directly to my clipboard, open WhatsApp Web with the caption, or save the image file to disk, so that I am never blocked by platform limitations.
7. **As a privacy-conscious parent**, I want the graphic card to display only my child's chosen nickname and avatar (omitting personal identifiers or accounts), so that my child's privacy is preserved.
8. **As an offline PWA user**, I want snapshot cards to generate and export instantly without internet connectivity, so that sharing works anywhere.

---

### Implementation Decisions

#### 1. Modules to Build & Modify

- **`src/services/shareCardGenerator.ts` [NEW]**:
  - Encapsulates pure procedural HTML5 2D Canvas rendering at 1080×1080 resolution.
  - Generates crisp retro-arcade styling: dark chassis background (`#0B0E14`), glowing borders, neon accents (`#00F5D4`, `#FFB703`, `#06D6A0`), avatar and Captain Bot mascot styling, high-contrast typography, and discrete branding footer (`Sifir Neo-Arcade ⚡ Math Fluency`).
  - Exports asynchronous methods returning PNG `Blob`:
    - `generateRunTelemetryCard(summary: QuizResultSummary, profile: LearnerProfile): Promise<Blob>`
    - `generateMasteryRadarCard(masteryMap: MasteryMap, profile: LearnerProfile): Promise<Blob>`

- **`src/services/socialShareService.ts` [NEW]**:
  - Encapsulates capability detection and dispatch logic:
    - Checks `navigator.canShare && navigator.canShare({ files: [file] })`.
    - Coordinates native file share, clipboard copy (`navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])`), WhatsApp URL formatting (`https://api.whatsapp.com/send?text=...`), and direct file download.
    - Generates pre-filled celebratory caption templates with emojis and formatted stats.

- **`src/components/common/SnapshotPreviewModal.tsx` [NEW]**:
  - Modal providing interactive card preview (scaled responsively to fit mobile screens).
  - Editable caption textarea pre-filled with the generated caption.
  - Primary tactile action button ("Share via WhatsApp") and secondary actions ("Copy Image", "Download PNG").
  - Clear user feedback alerts on clipboard copy or share completion.

- **`src/components/rewards/CelebrationModal.tsx` [MODIFY]**:
  - Adds tactile "Share Snapshot" button to the results action bar.
  - Mounts `SnapshotPreviewModal` on tap with run telemetry.

- **`src/components/parent/ParentHeatmapView.tsx` [MODIFY]**:
  - Adds tactile "Share Mastery Card" button to the header actions.
  - Mounts `SnapshotPreviewModal` on tap with cumulative mastery telemetry.

#### 2. Module Interfaces & Contracts

```ts
export interface RunTelemetryShareData {
  readonly summary: QuizResultSummary;
  readonly profile: LearnerProfile;
}

export interface MasteryRadarShareData {
  readonly masteryMap: MasteryMap;
  readonly profile: LearnerProfile;
}

export type SnapshotPayload =
  | { readonly kind: 'RUN_TELEMETRY'; readonly data: RunTelemetryShareData }
  | { readonly kind: 'MASTERY_RADAR'; readonly data: MasteryRadarShareData };

export interface ShareExecutionResult {
  readonly success: boolean;
  readonly method: 'NATIVE_SHARE' | 'CLIPBOARD_COPY' | 'WHATSAPP_LINK' | 'DOWNLOAD';
  readonly error?: string;
}
```

#### 3. Architectural Alignment

- Adheres strictly to [`docs/adr/0007-client-canvas-social-telemetry-cards.md`](file:///Users/nina/development/test-projects/frontend-designer/docs/adr/0007-client-canvas-social-telemetry-cards.md).
- Zero external runtime dependencies added; strictly utilizes browser standards.

---

### Testing Decisions

1. **Seams Under Test**:
   - **Template & Caption Logic**: Validate text caption formatting for each mode (`StepPractice`, `SmartQuiz`, `SpeedRush`, `MasteryRadar`) with correct metric interpolation.
   - **Share Dispatch Routing**: Validate graceful degradation in `socialShareService` across:
     - Full Web Share with files supported.
     - Web Share without file support (fallback to clipboard + WhatsApp URL).
     - Desktop environments (direct clipboard copy and file download triggers).
   - **Canvas Drawing Seam**: Validate that `shareCardGenerator` outputs a valid, non-empty PNG `Blob` with dimensions 1080×1080.
2. **Build Verification**:
   - Full TypeScript strict type checks (`npm run build`).

---

### Out of Scope

- Backend or cloud server image generation or hosting.
- Public web permalinks / hosted learner scorecards.
- Direct automated posting via proprietary social networks APIs (Facebook Graph API, Twitter API, etc.).
- Animated MP4 or GIF video rendering.
