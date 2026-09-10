# 04: End-of-Run Celebration Seam Integration (Garmin-Style Post-Game Share)

Status: `DONE`
Blocked by: 03-snapshot-preview-modal

---

### Description
Integrate the progress snapshot flow directly into the post-run celebration screen (`CelebrationModal.tsx`), giving learners and parents an immediate Garmin-like post-activity share trigger after finishing Step Practice, Speed Rush, or Smart Quiz.

### Deliverables
1. **Modal Action Enhancement (`src/components/rewards/CelebrationModal.tsx`)**:
   - Add tactile "Share Snapshot" button with Share/Sparkles icon to the celebration action cluster alongside "Cabin Home" and "Play Again".
   - Pass learner profile to `CelebrationModal` (or retrieve from active profile context).
   - On tap: Asynchronously generate the 1080×1080 `RunTelemetryCard` using `shareCardGenerator` with loading indicator.
   - Open `SnapshotPreviewModal` with the rendered blob, mode title, and pre-filled celebration caption.

### Verification
- Full interactive flow: Complete a game mode (`StepPractice`, `SpeedRush`, `SmartQuiz`) -> Celebration Modal appears -> Tap "Share Snapshot" -> Preview modal opens with accurate run statistics -> Test sharing/copying/downloading -> Dismiss back to celebration modal or Cabin Home.
