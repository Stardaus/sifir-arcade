# 05: Parent Mastery Radar Seam Integration (Milestone Heatmap Share)

Status: `DONE`
Blocked by: 03-snapshot-preview-modal

---

### Description
Integrate the progress snapshot flow into the parent telemetry dashboard (`ParentHeatmapView.tsx`), allowing parents to share cumulative milestone cards featuring total facts mastered (e.g., "94/144 Facts Mastered") and a procedural 12×12 micro-heatmap matrix.

### Deliverables
1. **Parent Dashboard Action Header (`src/components/parent/ParentHeatmapView.tsx`)**:
   - Add tactile "Share Mastery Card" button in the top action cluster alongside "Export Backup".
   - On tap: Asynchronously generate the 1080×1080 `MasteryRadarCard` using `shareCardGenerator` with loading indicator.
   - Open `SnapshotPreviewModal` with the rendered blob, learner nickname, and pre-filled mastery caption.

### Verification
- Full interactive flow: Open Parent Mastery Radar -> Tap "Share Mastery Card" -> Preview modal opens showing the 12×12 micro-heatmap reflecting current mastery states -> Test sharing/copying/downloading -> Dismiss back to heatmap.
