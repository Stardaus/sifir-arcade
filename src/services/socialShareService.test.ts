import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRunCelebrationCaption,
  formatMasteryCelebrationCaption,
  getWhatsAppShareUrl,
  getModeCelebrationTitle,
  getPwaAppUrl,
} from './socialShareService.ts';
import type { QuizResultSummary, MasteryMap } from '../types/sifir.ts';
import { createDefaultProfile } from '../types/profile.ts';

test('formatRunCelebrationCaption generates formatted WhatsApp caption for Step Practice', () => {
  const profile = createDefaultProfile('Ali', '🦊');
  const summary: QuizResultSummary = {
    mode: 'STEP_PRACTICE',
    targetTable: 7,
    totalQuestions: 12,
    correctAnswers: 12,
    starsEarned: 15,
    accuracyPercent: 100,
    maxCombo: 12,
    newlyMasteredCount: 1,
  };

  const caption = formatRunCelebrationCaption(summary, profile);

  assert.match(caption, /Ali/);
  assert.match(caption, /🦊/);
  assert.match(caption, /Sifir 7/);
  assert.match(caption, /100%/);
  assert.match(caption, /15/);
  assert.match(caption, /Sifir Neo-Arcade/);
  assert.strictEqual(caption.includes('https://sifir-arcade.web.app'), false);
});

test('formatRunCelebrationCaption generates formatted caption for Speed Rush with combo and pace', () => {
  const profile = createDefaultProfile('Zack', '⚡');
  const summary: QuizResultSummary = {
    mode: 'SPEED_RUSH',
    totalQuestions: 35,
    correctAnswers: 34,
    starsEarned: 20,
    accuracyPercent: 97,
    maxCombo: 18,
    newlyMasteredCount: 0,
  };

  const caption = formatRunCelebrationCaption(summary, profile);

  assert.match(caption, /Speed Rush/);
  assert.match(caption, /34 \/ 35/);
  assert.match(caption, /97%/);
  assert.match(caption, /18x/);
});

test('formatRunCelebrationCaption generates formatted caption for Smart Weak-Spot Drill', () => {
  const profile = createDefaultProfile('Nadia', '🤖');
  const summary: QuizResultSummary = {
    mode: 'SMART_QUIZ',
    totalQuestions: 10,
    correctAnswers: 9,
    starsEarned: 12,
    accuracyPercent: 90,
    maxCombo: 8,
    newlyMasteredCount: 2,
  };

  const caption = formatRunCelebrationCaption(summary, profile);

  assert.match(caption, /Nadia/);
  assert.match(caption, /Weak-Spot Drill/);
  assert.match(caption, /90%/);
  assert.match(caption, /8x/);
});

test('formatMasteryCelebrationCaption aggregates mastered count from MasteryMap', () => {
  const profile = createDefaultProfile('Maya', '🦄');
  const masteryMap: MasteryMap = {
    '2x2': {
      factorA: 2,
      factorB: 2,
      product: 4,
      attempts: 5,
      correctCount: 5,
      averageLatencyMs: 1200,
      lastPracticedAt: Date.now(),
      consecutiveStreak: 5,
      status: 'MASTERED',
    },
    '2x3': {
      factorA: 2,
      factorB: 3,
      product: 6,
      attempts: 3,
      correctCount: 2,
      averageLatencyMs: 2500,
      lastPracticedAt: Date.now(),
      consecutiveStreak: 1,
      status: 'LEARNING',
    },
  };

  const caption = formatMasteryCelebrationCaption(masteryMap, profile);

  assert.match(caption, /Maya/);
  assert.match(caption, /1 \/ 144/);
  assert.match(caption, /Mastery Radar/);
});

test('getWhatsAppShareUrl creates valid encoded WhatsApp URL', () => {
  const message = 'Hello World! 🚀 100%';
  const url = getWhatsAppShareUrl(message);

  assert.ok(url.startsWith('https://api.whatsapp.com/send?text='));
  assert.ok(url.includes(encodeURIComponent(message)));
});

test('getModeCelebrationTitle maps modes to consistent celebratory titles', () => {
  assert.strictEqual(
    getModeCelebrationTitle({
      mode: 'STEP_PRACTICE',
      targetTable: 9,
      totalQuestions: 12,
      correctAnswers: 12,
      starsEarned: 10,
      accuracyPercent: 100,
      maxCombo: 12,
      newlyMasteredCount: 1,
    }),
    'Sifir 9 Conquered!'
  );
  assert.strictEqual(
    getModeCelebrationTitle({
      mode: 'SPEED_RUSH',
      totalQuestions: 20,
      correctAnswers: 20,
      starsEarned: 20,
      accuracyPercent: 100,
      maxCombo: 20,
      newlyMasteredCount: 0,
    }),
    'Speed Rush Blitz!'
  );
});

test('getPwaAppUrl returns GitHub Pages fallback when window is not defined', () => {
  assert.strictEqual(getPwaAppUrl(), 'https://stardaus.github.io/sifir-arcade/');
});

