export interface AppBuildInfo {
  readonly version: string;
  readonly buildId: string;
  readonly timestamp: string;
  readonly commit: string;
}

export type UpdateDiagnosticCode =
  | 'UP_TO_DATE'
  | 'DOWNLOADING'
  | 'UPDATE_AVAILABLE'
  | 'OFFLINE_ERROR'
  | 'TIMEOUT_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

export interface UpdateCheckResult {
  readonly code: UpdateDiagnosticCode;
  readonly title: string;
  readonly message: string;
  readonly debugCode: string;
  readonly localBuildId: string;
  readonly targetBuildId?: string;
  readonly timestamp: number;
}
