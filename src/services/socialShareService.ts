import type { QuizResultSummary, MasteryMap } from '../types/sifir.ts';
import type { LearnerProfile } from '../types/profile.ts';
import type { ShareExecutionResult } from '../types/share.ts';
import { computeMasteryOverview } from './masteryEngine.ts';

const PWA_URL = 'https://sifir-arcade.web.app';

export const getModeCelebrationTitle = (summary: QuizResultSummary): string => {
  if (summary.mode === 'STEP_PRACTICE') {
    return `Sifir ${summary.targetTable} Conquered!`;
  }
  if (summary.mode === 'SPEED_RUSH') {
    return 'Speed Rush Blitz!';
  }
  return 'Weak-Spot Drill Cleared!';
};

export const formatRunCelebrationCaption = (
  summary: QuizResultSummary,
  profile: LearnerProfile
): string => {
  const modeTitle = getModeCelebrationTitle(summary);
  const lines = [
    `⚡ ${profile.avatar} ${profile.name} just crushed a math run on *Sifir Neo-Arcade*!`,
    `🏆 *${modeTitle}*`,
    `🎯 Accuracy: ${summary.accuracyPercent}% (${summary.correctAnswers} / ${summary.totalQuestions})`,
    `🔥 Max Streak: ${summary.maxCombo}x combo`,
    `⭐ Stars Earned: +${summary.starsEarned}`,
    '',
    `Train your math automaticity here: ${PWA_URL}`,
  ];

  return lines.join('\n');
};

export const formatMasteryCelebrationCaption = (
  masteryMap: MasteryMap,
  profile: LearnerProfile
): string => {
  const stats = computeMasteryOverview(masteryMap);
  const lines = [
    `📊 ${profile.avatar} ${profile.name}'s *Mastery Radar Update* on Sifir Neo-Arcade!`,
    `🎯 *${stats.masteredCount} / 144 Facts Mastered*`,
    `⚡ Lifetime Accuracy: ${stats.accuracyPercent}% across ${stats.totalAttempts} attempts`,
    '',
    `Level up your times tables: ${PWA_URL}`,
  ];

  return lines.join('\n');
};

export const getWhatsAppShareUrl = (captionText: string): string => {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(captionText)}`;
};

export const canShareFiles = (): boolean => {
  if (typeof navigator === 'undefined' || !navigator.share || !navigator.canShare) {
    return false;
  }
  try {
    const dummyFile = new File([''], 'test.png', { type: 'image/png' });
    return navigator.canShare({ files: [dummyFile] });
  } catch {
    return false;
  }
};

export const dispatchNativeShare = async (payload: {
  readonly file: File;
  readonly title: string;
  readonly text: string;
}): Promise<ShareExecutionResult> => {
  if (!canShareFiles()) {
    return { success: false, method: 'NATIVE_SHARE', error: 'Web Share not supported' };
  }
  try {
    await navigator.share({
      files: [payload.file],
      title: payload.title,
      text: payload.text,
    });
    return { success: true, method: 'NATIVE_SHARE' };
  } catch (error) {
    const isAbort = error instanceof Error && error.name === 'AbortError';
    return {
      success: false,
      method: 'NATIVE_SHARE',
      error: isAbort ? 'User cancelled share' : 'Share failed',
    };
  }
};

export const copyImageToClipboard = async (blob: Blob): Promise<ShareExecutionResult> => {
  if (typeof navigator === 'undefined' || !navigator.clipboard || !navigator.clipboard.write) {
    return { success: false, method: 'CLIPBOARD_COPY', error: 'Clipboard unsupported' };
  }
  try {
    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
    return { success: true, method: 'CLIPBOARD_COPY' };
  } catch {
    return { success: false, method: 'CLIPBOARD_COPY', error: 'Failed to write to clipboard' };
  }
};

export const triggerBlobDownload = (blob: Blob, filename: string): ShareExecutionResult => {
  if (typeof document === 'undefined') {
    return { success: false, method: 'DOWNLOAD', error: 'DOM not available' };
  }
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
  return { success: true, method: 'DOWNLOAD' };
};
