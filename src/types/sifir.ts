export type SifirFactor = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type MasteryStatus = 'UNTOUCHED' | 'LEARNING' | 'PRACTICING' | 'MASTERED';

export interface SifirFactRecord {
  readonly factorA: SifirFactor;
  readonly factorB: SifirFactor;
  readonly product: number;
  readonly attempts: number;
  readonly correctCount: number;
  readonly averageLatencyMs: number;
  readonly lastPracticedAt: number | null;
  readonly consecutiveStreak: number;
  readonly status: MasteryStatus;
}

export type MasteryMap = Readonly<Record<string, SifirFactRecord>>;

export type ActiveScreen =
  | 'CABIN_HOME'
  | 'EXPLORE_MATRIX'
  | 'STEP_PRACTICE'
  | 'SMART_QUIZ'
  | 'SPEED_RUSH'
  | 'PARENT_HEATMAP';

export interface QuestionItem {
  readonly factorA: SifirFactor;
  readonly factorB: SifirFactor;
  readonly product: number;
  readonly options: readonly number[];
  readonly diagnosticReason?: string;
}

export interface QuizResultSummary {
  readonly mode: 'STEP_PRACTICE' | 'SMART_QUIZ' | 'SPEED_RUSH';
  readonly targetTable?: SifirFactor;
  readonly totalQuestions: number;
  readonly correctAnswers: number;
  readonly starsEarned: number;
  readonly accuracyPercent: number;
  readonly maxCombo: number;
  readonly newlyMasteredCount: number;
}
