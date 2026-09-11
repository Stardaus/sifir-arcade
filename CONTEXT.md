# Sifir Neo-Arcade

An educational mathematics game designed for young learners to master multiplication tables (1 to 12) through tactile arcade-inspired interaction, multimodal visualization, and cognitive fluency diagnostics.

## Language

### Core Modes

**Step Practice**:
A sequential learning flow guiding a learner step-by-step from 1 to 12 through a single chosen times table using multimodal visual representations.
_Avoid_: Flashcards, rote drill, test mode

**Explore Matrix**:
An interactive conceptual discovery surface enabling learners to sweep dynamic bounding areas, inspect commutative symmetries, and scan mathematical number patterns across the 12×12 grid.
_Avoid_: Static multiplication chart, cheat sheet, lookup table

**Weak-Spot Drill**:
A targeted remediation mode prioritizing equations with high latency, repeated errors, or low retention, providing diagnostic transparency and adaptive deconstruction until mastered.
_Avoid_: Smart quiz, random quiz, diagnostic exam

**Speed Rush**:
A high-intensity 60-second time-attack mode measuring and training rapid fact retrieval automaticity under arcade countdown pressure.
_Avoid_: Timed test, speed exam, sprint quiz

**Mode Dispatch Badge**:
A dynamic status chip on each Cabin Home mode card communicating personalized readiness, pending weak-spot counts, or high-score milestones.
_Avoid_: Notification dot, generic tag

### Arcade Fluency & Momentum Mechanics

**Arcade Overdrive**:
An electrified audiovisual state activated at elevated combo streaks (5× and 10×) that applies glowing aesthetics, score multipliers, and accelerating auditory tempo.
_Avoid_: Frenzy mode, bonus round

**Time Surge**:
A clutch countdown time extension (+2s) awarded for sub-second accurate responses, directly incentivizing retrieval automaticity over conscious calculation.
_Avoid_: Extra time, time cheat

**Arcade Juice**:
The multimodal sensory reward layer combining floating point bursts, pulsating combo banners, and glowing tactile submit indicators that makes fact retrieval thrilling for kids.
_Avoid_: Flashy animation, visual clutter, confetti plugin

**Reactive Mascot**:
The animated cartoon companion (Captain Bot) providing dynamic emotional feedback, enthusiastic streak celebrations, and gentle scaffold cues across learning screens.
_Avoid_: Static avatar, helper icon, assistant bot

### Diagnostic & Remediation Mechanics

**Target Lock**:
A telemetry badge displayed on weak-spot questions communicating the specific performance reason (e.g., latency alert, error rate) why the fact was flagged for practice.
_Avoid_: Error warning, danger sign

**Friendly Deconstruction**:
An adaptive pedagogical breakdown triggered on an incorrect answer that splits difficult multiplication facts into simpler distributive anchor chunks (e.g., using $\times 5$ or doubles).
_Avoid_: Answer reveal, cheat hint

**Mastery Re-queue**:
The protocol of re-inserting missed or slow facts back into the active session queue so the learner concludes the drill having achieved active recall.
_Avoid_: Retry loop, infinite loop

### Visual Representations

**Equal Groups Model**:
A pictorial representation displaying multiplication as distinct cartoon containers holding equal quantities of collectible items.
_Avoid_: Dot array, matrix grid

**Skip-Counting Strip**:
An animated horizontal sequence displaying the cumulative repeated addition checkpoints corresponding to each step of a times table.
_Avoid_: Ruler, standard number line

**Cartoon Asset Library**:
Scalable vector character and item artwork sourced from open asset APIs and CDNs to animate multiplication models.
_Avoid_: Plain emojis, raster clip-art

**Dynamic Area Canvas**:
An illuminated rectangular bounding zone formed between origin $(1, 1)$ and coordinate $(a, b)$ on the matrix demonstrating multiplication as two-dimensional area.
_Avoid_: Selection box, highlighted cells

**Pattern Scanner**:
Interactive filters that selectively illuminate structural mathematical relationships across the matrix, such as square numbers, commutative mirrors, and factor progressions.
_Avoid_: Search filter, color legend

### Ergonomic Viewport Archetypes

**Zero-Scroll Viewport**:
The compact mobile phone presentation constraining HUD, question display, active visual feedback, and tactile input strictly within 100dvh without vertical page scroll.
_Avoid_: Long-form quiz, scrollable page, responsive flow

**Cockpit Layout**:
The dual-pane spatial arrangement utilized on tablets and landscape orientations that positions visual representations alongside the tactile input console.
_Avoid_: Desktop view, split screen, side-by-side grid

**Thumb-Anchored Console**:
The touch-engineered input console docked flush at the base of mobile phone viewports within natural thumb reach, maintaining fixed tactile target sizes and safe-area insets.
_Avoid_: Floating keypad, on-screen keyboard, modal numpad

**Free-Pan Canvas**:
The touch-scrollable presentation of the Explore Matrix on mobile screens featuring frozen row and column coordinate headers to maintain multiplication orientation during smooth panning.
_Avoid_: Scrollable table, cropped matrix, overflow wrapper

**Visual Stage Switcher**:
The adaptive visual viewport providing fast-toggle access between the Equal Groups Model and Skip-Counting Strip on compact screens while rendering both simultaneously on cockpit displays.
_Avoid_: Tab menu, display toggle, visual filter

**Cartridge Tile**:
The high-density horizontal action unit utilized on mobile phone home screens presenting mode icon, title, live telemetry badge, and tactile launch trigger within an unscrollable single-screen hub.
_Avoid_: List item, menu row, mini card

**Tactile Touch Engine**:
The responsive interaction layer enforcing zero-delay touch dispatch (`touch-action: manipulation`), touch callout suppression, seamless WebAudio context activation, and micro-vibration haptic pulses on key strikes.
_Avoid_: Event handler, vibration plugin, touch listener

### PWA & Client Lifecycle Mechanics

**Smart Update Dispatcher**:
The progressive web application lifecycle monitor that checks for newer deployment builds on app resume and visibility shifts, immediately refreshing idle screens while preserving active gameplay streaks behind a non-disruptive arcade prompt.
_Avoid_: PWA updater, reload prompt, cache bust script

**Build Telemetry Seam**:
The lightweight version endpoint (`version.json`) generated at compile-time holding release timestamp, commit/build hash, and version tag, queried to verify deployment freshness without parsing heavy assets.
_Avoid_: Cache buster, API ping, update checker URL

**Firmware & Telemetry Inspector**:
The diagnostic console interface within the Cabin System Config (Settings Modal) allowing the pilot to inspect active build provenance and trigger on-demand update probes with sanitized status reporting.
_Avoid_: Dev menu, debug screen, reload button

**Build Stamp**:
The compile-time release fingerprint injected into the client bundle containing semver, build timestamp, and git commit hash.
_Avoid_: Build number, version string

### Progress Snapshot & Social Telemetry Mechanics

**Run Telemetry Card**:
A high-contrast retro-arcade sports graphic (1:1 square) rendered immediately upon completing a learning run (Step Practice, Speed Rush, or Weak-Spot Drill) displaying fact automaticity, accuracy percentage, max combo streak, stars earned, and celebratory mascot badge.
_Avoid_: Generic screenshot, result popup, social post

**Mastery Radar Card**:
A milestone achievement graphic (1:1 square) capturing the learner's cumulative progress across all 144 multiplication facts, featuring an integrated 12×12 micro-heatmap matrix, total facts mastered, and overall accuracy.
_Avoid_: Scorecard, grade report, certificate

**Snapshot Preview Modal**:
A pre-dispatch inspection modal allowing the parent to review the rendered graphic card, copy celebratory caption text, and trigger native platform sharing or offline image export.
_Avoid_: Share dialog, export menu, popup sheet

**Social Telemetry Dispatcher**:
The client-side sharing coordinator that attempts native image file sharing via Web Share API (`navigator.share`), gracefully falling back to one-tap clipboard image copying, WhatsApp text links (`wa.me`), and PNG disk download.
_Avoid_: Share button, social plugin, social SDK


