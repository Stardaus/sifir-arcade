# 03: Interactive Snapshot Preview Modal Component

Status: `DONE`
Blocked by: 01-contracts-and-social-share-dispatcher, 02-procedural-canvas-card-generator

---

### Description
Implement `src/components/common/SnapshotPreviewModal.tsx`, the parent checkpoint modal that previews the rendered 1080×1080 snapshot graphic card, displays an editable celebratory caption text area, and exposes multi-tier sharing actions (Web Share API for WhatsApp, Copy Image, and Download PNG).

### Deliverables
1. **Interactive Preview Component (`src/components/common/SnapshotPreviewModal.tsx`)**:
   - Accepts `isOpen`, `onClose`, `imageBlob`, `defaultCaption`, and `title`.
   - Card Preview: Responsive container maintaining 1:1 aspect ratio with subtle neon border glow.
   - Editable Caption Field: Multi-line textarea pre-filled with the celebratory emoji caption, allowing parents to customize before dispatching.
   - Action Hub:
     - Primary Button: "Share to WhatsApp" (triggers `navigator.share` if file sharing is supported, or opens WhatsApp Web URL while prompting download/copy).
     - Secondary Buttons: "Copy Image" (with animated copied state) and "Download PNG".
   - Feedback State: Inline toast alert confirming successful clipboard copy or sharing status.

### Verification
- Component renders cleanly across mobile (375px) and desktop viewports without vertical overflow issues or clipping.
- Caption changes are preserved when dispatching share or copying.
