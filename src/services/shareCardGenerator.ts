import type { QuizResultSummary, MasteryMap, SifirFactor } from '../types/sifir.ts';
import type { LearnerProfile } from '../types/profile.ts';
import type { RunTelemetryShareData, MasteryRadarShareData } from '../types/share.ts';
import { computeMasteryOverview, MasteryOverview } from './masteryEngine.ts';
import { getModeCelebrationTitle } from './socialShareService.ts';

const CARD_SIZE = 1080;
const COLOR_CHASSIS = '#0B0E14';
const COLOR_GROOVE = '#151A23';
const COLOR_BORDER = '#263147';
const COLOR_CYAN = '#00F5D4';
const COLOR_AMBER = '#FFB703';
const COLOR_GREEN = '#06D6A0';
const COLOR_MAGENTA = '#F72585';
const COLOR_CREAM = '#F8F9FA';
const COLOR_MUTED = '#94A3B8';
const COLOR_UNTOUCHED = '#1A2234';

const drawArcadeGrid = (ctx: CanvasRenderingContext2D): void => {
  ctx.strokeStyle = 'rgba(38, 49, 71, 0.4)';
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let pos = 0; pos < CARD_SIZE; pos += gridSize) {
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, CARD_SIZE);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(CARD_SIZE, pos);
    ctx.stroke();
  }
};

const drawGlowingBorder = (ctx: CanvasRenderingContext2D): void => {
  ctx.save();
  ctx.strokeStyle = COLOR_CYAN;
  ctx.lineWidth = 8;
  ctx.shadowColor = COLOR_CYAN;
  ctx.shadowBlur = 24;
  ctx.strokeRect(32, 32, CARD_SIZE - 64, CARD_SIZE - 64);
  ctx.restore();

  // Corner accent brackets
  const bSize = 24;
  ctx.fillStyle = COLOR_AMBER;
  ctx.fillRect(28, 28, bSize, bSize);
  ctx.fillRect(CARD_SIZE - 28 - bSize, 28, bSize, bSize);
  ctx.fillRect(28, CARD_SIZE - 28 - bSize, bSize, bSize);
  ctx.fillRect(CARD_SIZE - 28 - bSize, CARD_SIZE - 28 - bSize, bSize, bSize);
};

const drawArcadeBackground = (ctx: CanvasRenderingContext2D): void => {
  ctx.fillStyle = COLOR_CHASSIS;
  ctx.fillRect(0, 0, CARD_SIZE, CARD_SIZE);
  drawArcadeGrid(ctx);
  drawGlowingBorder(ctx);
};

const drawLearnerAvatar = (ctx: CanvasRenderingContext2D, profile: LearnerProfile): void => {
  ctx.save();
  ctx.fillStyle = COLOR_GROOVE;
  ctx.strokeStyle = COLOR_AMBER;
  ctx.lineWidth = 4;
  ctx.shadowColor = COLOR_AMBER;
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(140, 140, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.font = '56px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(profile.avatar, 140, 142);

  ctx.textAlign = 'left';
  ctx.fillStyle = COLOR_AMBER;
  ctx.font = 'bold 22px monospace';
  ctx.fillText('ARCADE CADET', 230, 110);

  ctx.fillStyle = COLOR_CREAM;
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText(profile.name, 230, 158);
};

const drawTitlePill = (ctx: CanvasRenderingContext2D, title: string, subtitle: string): void => {
  ctx.fillStyle = 'rgba(0, 245, 212, 0.12)';
  ctx.fillRect(72, 230, CARD_SIZE - 144, 76);
  ctx.strokeStyle = 'rgba(0, 245, 212, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(72, 230, CARD_SIZE - 144, 76);

  ctx.fillStyle = COLOR_CYAN;
  ctx.font = 'bold 36px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(title.toUpperCase(), CARD_SIZE / 2, 280);

  ctx.fillStyle = COLOR_MUTED;
  ctx.font = '20px monospace';
  ctx.fillText(subtitle, CARD_SIZE / 2, 335);
};

const drawCardHeader = (
  ctx: CanvasRenderingContext2D,
  profile: LearnerProfile,
  title: string,
  subtitle: string
): void => {
  drawLearnerAvatar(ctx, profile);
  drawTitlePill(ctx, title, subtitle);
};

const drawMetricTile = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  value: string,
  accentColor: string
): void => {
  ctx.fillStyle = COLOR_GROOVE;
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = COLOR_BORDER;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  ctx.fillStyle = accentColor;
  ctx.fillRect(x, y, width, 6);

  ctx.textAlign = 'center';
  ctx.fillStyle = COLOR_MUTED;
  ctx.font = 'bold 20px monospace';
  ctx.fillText(label.toUpperCase(), x + width / 2, y + 44);

  ctx.fillStyle = accentColor;
  ctx.font = 'bold 54px monospace';
  ctx.fillText(value, x + width / 2, y + 115);
};

const drawMascotCelebrationBanner = (ctx: CanvasRenderingContext2D): void => {
  ctx.fillStyle = 'rgba(6, 214, 160, 0.1)';
  ctx.fillRect(85, 800, CARD_SIZE - 170, 110);
  ctx.strokeStyle = 'rgba(6, 214, 160, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(85, 800, CARD_SIZE - 170, 110);

  ctx.font = '48px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🤖', 120, 872);

  ctx.fillStyle = COLOR_GREEN;
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('Captain Bot: "Sensational automaticity and rhythm!"', 190, 855);

  ctx.fillStyle = COLOR_MUTED;
  ctx.font = '20px monospace';
  ctx.fillText('Math fluency telemetry verified on device', 190, 888);
};

const drawRunMetricsGrid = (ctx: CanvasRenderingContext2D, summary: QuizResultSummary): void => {
  const w = 430;
  const h = 160;
  const startX = 85;
  const gap = 50;

  drawMetricTile(ctx, startX, 380, w, h, 'Accuracy', `${summary.accuracyPercent}%`, COLOR_GREEN);
  drawMetricTile(ctx, startX + w + gap, 380, w, h, 'Correct Facts', `${summary.correctAnswers} / ${summary.totalQuestions}`, COLOR_CYAN);
  drawMetricTile(ctx, startX, 380 + h + gap, w, h, 'Max Streak', `${summary.maxCombo}x COMBO`, COLOR_AMBER);
  drawMetricTile(ctx, startX + w + gap, 380 + h + gap, w, h, 'Stars Earned', `+${summary.starsEarned} ⭐`, COLOR_MAGENTA);

  drawMascotCelebrationBanner(ctx);
};

const drawMicroHeatmapCells = (
  ctx: CanvasRenderingContext2D,
  masteryMap: MasteryMap,
  startX: number,
  startY: number,
  gridSize: number
): void => {
  const factors: SifirFactor[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const cellSize = Math.floor(gridSize / 12);

  factors.forEach((row, r) => {
    factors.forEach((col, c) => {
      const fact = masteryMap[`${row}x${col}`];
      const status = fact?.status || 'UNTOUCHED';

      let cellColor = COLOR_UNTOUCHED;
      if (status === 'MASTERED') cellColor = COLOR_GREEN;
      else if (status === 'PRACTICING') cellColor = COLOR_CYAN;
      else if (status === 'LEARNING') cellColor = COLOR_AMBER;

      ctx.fillStyle = cellColor;
      ctx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize - 2, cellSize - 2);
    });
  });
};

const drawHeatmapLegend = (ctx: CanvasRenderingContext2D, x: number, y: number): void => {
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'left';

  ctx.fillStyle = COLOR_GREEN;
  ctx.fillRect(x + 30, y - 12, 14, 14);
  ctx.fillStyle = COLOR_CREAM;
  ctx.fillText('Mastered', x + 50, y);

  ctx.fillStyle = COLOR_CYAN;
  ctx.fillRect(x + 160, y - 12, 14, 14);
  ctx.fillStyle = COLOR_CREAM;
  ctx.fillText('Practicing', x + 180, y);

  ctx.fillStyle = COLOR_AMBER;
  ctx.fillRect(x + 300, y - 12, 14, 14);
  ctx.fillStyle = COLOR_CREAM;
  ctx.fillText('Learning', x + 320, y);
};

const drawMasteryRadarContent = (
  ctx: CanvasRenderingContext2D,
  masteryMap: MasteryMap,
  stats: MasteryOverview
): void => {
  drawMetricTile(ctx, 85, 370, 390, 160, 'Total Mastered', `${stats.masteredCount} / 144`, COLOR_GREEN);
  drawMetricTile(ctx, 85, 560, 390, 150, 'Overall Accuracy', `${stats.accuracyPercent}%`, COLOR_CYAN);
  drawMetricTile(ctx, 85, 740, 390, 150, 'In Progress', `${stats.practicingCount + stats.learningCount} Facts`, COLOR_AMBER);

  const hmX = 520;
  const hmY = 370;
  const hmSize = 475;

  ctx.fillStyle = COLOR_GROOVE;
  ctx.fillRect(hmX, hmY, hmSize, 520);
  ctx.strokeStyle = COLOR_BORDER;
  ctx.lineWidth = 2;
  ctx.strokeRect(hmX, hmY, hmSize, 520);

  ctx.fillStyle = COLOR_AMBER;
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('12×12 MASTERY MATRIX', hmX + hmSize / 2, hmY + 36);

  drawMicroHeatmapCells(ctx, masteryMap, hmX + 22, hmY + 54, 430);
  drawHeatmapLegend(ctx, hmX, hmY + 500);
};

const drawArcadeFooter = (ctx: CanvasRenderingContext2D): void => {
  ctx.textAlign = 'center';
  ctx.fillStyle = COLOR_CYAN;
  ctx.font = 'bold 24px monospace';
  ctx.fillText('⚡ SIFIR NEO-ARCADE ⚡', CARD_SIZE / 2, 970);

  ctx.fillStyle = COLOR_MUTED;
  ctx.font = '18px monospace';
  ctx.fillText('Tactile Mathematics Fluency PWA', CARD_SIZE / 2, 1002);
};

const renderCanvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas rasterization failed'));
    }, 'image/png');
  });
};

const createCardCanvas = (): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } => {
  const canvas = document.createElement('canvas');
  canvas.width = CARD_SIZE;
  canvas.height = CARD_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D Canvas context unavailable');
  return { canvas, ctx };
};

export const generateRunTelemetryCard = async (
  summary: QuizResultSummary,
  profile: LearnerProfile
): Promise<Blob> => {
  const { canvas, ctx } = createCardCanvas();
  const title = getModeCelebrationTitle(summary);
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  drawArcadeBackground(ctx);
  drawCardHeader(ctx, profile, title, `Activity completed on ${dateStr}`);
  drawRunMetricsGrid(ctx, summary);
  drawArcadeFooter(ctx);

  return renderCanvasToBlob(canvas);
};

export const generateMasteryRadarCard = async (
  masteryMap: MasteryMap,
  profile: LearnerProfile
): Promise<Blob> => {
  const { canvas, ctx } = createCardCanvas();
  const stats = computeMasteryOverview(masteryMap);
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  drawArcadeBackground(ctx);
  drawCardHeader(ctx, profile, 'Mastery Radar Snapshot', `Cumulative Progress as of ${dateStr}`);
  drawMasteryRadarContent(ctx, masteryMap, stats);
  drawArcadeFooter(ctx);

  return renderCanvasToBlob(canvas);
};

export const generateSnapshotBlob = async (payload: RunTelemetryShareData | MasteryRadarShareData): Promise<Blob> => {
  if ('summary' in payload) {
    return generateRunTelemetryCard(payload.summary, payload.profile);
  }
  return generateMasteryRadarCard(payload.masteryMap, payload.profile);
};
