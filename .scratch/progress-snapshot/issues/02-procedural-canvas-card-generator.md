# 02: Procedural HTML5 Canvas 2D Card Generator

Status: `DONE`
Blocked by: 01-contracts-and-social-share-dispatcher

---

### Description
Implement a pure client-side HTML5 Canvas 2D procedural rendering engine in `src/services/shareCardGenerator.ts` capable of rasterizing crisp 1080×1080 PNG graphic cards entirely in memory without DOM dependencies or server calls. Generates both Run Telemetry Cards and Mastery Radar Cards adhering to Neo-Arcade high-contrast styling.

### Deliverables
1. **Procedural Rendering Engine (`src/services/shareCardGenerator.ts`)**:
   - High-contrast arcade aesthetics: Chassis dark background (`#0B0E14`), glowing neon border rails (`#00F5D4`, `#FFB703`), retro grid backdrop.
   - Learner avatar emoji with glowing frame and Captain Bot mascot badge.
   - Distinctive typography, title badge, and formatted date stamp.
   - `generateRunTelemetryCard(summary: QuizResultSummary, profile: LearnerProfile): Promise<Blob>`:
     - 4-card metric grid: Accuracy %, Correct Answers, Max Combo Streak, Stars Earned.
   - `generateMasteryRadarCard(masteryMap: MasteryMap, profile: LearnerProfile): Promise<Blob>`:
     - Prominent "X / 144 Facts Mastered" hero metric.
     - 12×12 procedural micro-heatmap visualization with color-coded mastery states (Mastered green, Practicing cyan, Learning amber, Untouched groove).
     - Overall accuracy metric.
   - Discrete footer badge: `Sifir Neo-Arcade ⚡ Math Fluency`.
2. **Blob & File Conversion**:
   - Converts HTMLCanvasElement to standard `image/png` Blob/File at full 1080×1080 resolution.

### Verification
- Generates valid PNG Blobs of exact dimensions (1080×1080) and non-zero byte size for all game modes and mastery states.
