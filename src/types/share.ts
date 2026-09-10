import { QuizResultSummary, MasteryMap } from './sifir';
import { LearnerProfile } from './profile';

export interface RunTelemetryShareData {
  readonly summary: QuizResultSummary;
  readonly profile: LearnerProfile;
}

export interface MasteryRadarShareData {
  readonly masteryMap: MasteryMap;
  readonly profile: LearnerProfile;
}

export type SnapshotPayload =
  | { readonly kind: 'RUN_TELEMETRY'; readonly data: RunTelemetryShareData }
  | { readonly kind: 'MASTERY_RADAR'; readonly data: MasteryRadarShareData };

export type ShareMethod = 'NATIVE_SHARE' | 'CLIPBOARD_COPY' | 'WHATSAPP_LINK' | 'DOWNLOAD';

export interface ShareExecutionResult {
  readonly success: boolean;
  readonly method: ShareMethod;
  readonly error?: string;
}
