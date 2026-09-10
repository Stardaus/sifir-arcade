# 0007 Client-Side Canvas Social Telemetry Cards

We decided to implement client-side graphic card generation and native social dispatch for sharing learner progress:

1. **Dual Seam Triggers**:
   - **Run Telemetry Card**: Accessible immediately from the `CelebrationModal` upon completing any learning run (`StepPractice`, `SmartQuiz`, or `SpeedRush`), capturing instantaneous session metrics (accuracy, combo streak, stars, speed).
   - **Mastery Radar Card**: Accessible from `ParentHeatmapView`, capturing cumulative mastery progress (e.g. "84/144 Facts Mastered") and rendering a micro 12×12 matrix heatmap.

2. **Native HTML5 2D Canvas Engine**:
   - Cards are rendered to a high-resolution 1080×1080 canvas purely in the browser runtime without DOM-to-image dependencies (`html2canvas`) or backend rendering servers.
   - Ensures 100% offline functionality in the PWA, instant rasterization, and immune to iOS Safari SVG/CSS layout rasterization bugs.

3. **Multi-Tier Social Telemetry Dispatcher**:
   - **Primary**: Web Share API (`navigator.share({ files: [pngFile], text })`), enabling direct native attachment to WhatsApp, Telegram, or camera roll on mobile devices.
   - **Fallback**: Direct WhatsApp text link (`https://api.whatsapp.com/send?text=...`) paired with one-tap clipboard image copying (`navigator.clipboard.write`) and direct PNG download.

4. **Parent Pre-Dispatch Inspection**:
   - Every share is gated behind a `SnapshotPreviewModal` allowing parents to review the generated graphic, customize or edit the pre-filled celebratory emoji caption, and choose their preferred export path.

5. **Privacy-Preserving Branding**:
   - Graphic cards feature only the learner's chosen avatar and display nickname (no personally identifiable data), stamped with date and subtle "Sifir Neo-Arcade" branding.
