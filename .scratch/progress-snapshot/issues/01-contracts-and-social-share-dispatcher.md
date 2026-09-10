# 01: Core Telemetry Contracts & Social Share Dispatcher

Status: `DONE`
Blocked by: None

---

### Description
Establish the foundational type contracts and the multi-tier social sharing service for progress snapshots. This service coordinates capability detection for the Web Share API (`navigator.canShare`), builds pre-filled celebratory WhatsApp captions with formatted emoji metrics, and provides reliable fallbacks for clipboard copying, WhatsApp Web links, and disk downloads.

### Deliverables
1. **Type Definitions (`src/types/share.ts`)**:
   - `RunTelemetryShareData`: Combines `QuizResultSummary` and `LearnerProfile`.
   - `MasteryRadarShareData`: Combines `MasteryMap` and `LearnerProfile`.
   - `SnapshotPayload`: Discriminated union of snapshot kinds.
   - `ShareExecutionResult`: Status report of share/copy/download operation.
2. **Social Telemetry Dispatcher (`src/services/socialShareService.ts`)**:
   - `formatRunCelebrationCaption(summary: QuizResultSummary, profile: LearnerProfile): string`
   - `formatMasteryCelebrationCaption(masteryMap: MasteryMap, profile: LearnerProfile): string`
   - `canShareFiles(): boolean`
   - `dispatchNativeShare(payload: { file: File; title: string; text: string }): Promise<boolean>`
   - `copyImageToClipboard(blob: Blob): Promise<boolean>`
   - `getWhatsAppShareUrl(captionText: string): string`
   - `triggerBlobDownload(blob: Blob, filename: string): void`

### Verification
- Unit/seam verification asserting caption templates interpolate correct figures for Step Practice, Speed Rush, Smart Quiz, and Mastery Radar.
- Validates graceful fallbacks when Web Share API is unavailable.
