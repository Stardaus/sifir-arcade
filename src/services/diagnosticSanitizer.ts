import type { UpdateCheckResult } from '../types/telemetry.ts';

export class HttpError extends Error {
  public readonly status: number;

  constructor(status: number) {
    super(`HTTP_${status}`);
    this.name = 'HttpError';
    this.status = status;
  }
}

export function scrubSecrets(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/https?:\/\/[^\s]+/gi, '[URL_REDACTED]')
    .replace(/(token|apiKey|key|secret|auth|password|bearer)=([^\s&]+)/gi, '$1=[REDACTED]')
    .replace(/\/(?:Users|home|var|etc|usr|tmp|app|private)[^\s:;,]+/gi, '[PATH_REDACTED]');
}

export function createOfflineResult(
  localBuildId: string,
  message = 'Cannot check for updates: No internet connection detected. Please verify your Wi-Fi or cellular connection.'
): UpdateCheckResult {
  return {
    code: 'OFFLINE_ERROR',
    title: 'Device Offline',
    message,
    debugCode: 'ERR_NET_OFFLINE',
    localBuildId,
    timestamp: Date.now(),
  };
}

export function createTimeoutResult(localBuildId: string): UpdateCheckResult {
  return {
    code: 'TIMEOUT_ERROR',
    title: 'Request Timeout',
    message: 'Update check timed out after 5 seconds. The connection may be unstable.',
    debugCode: 'ERR_FETCH_TIMEOUT',
    localBuildId,
    timestamp: Date.now(),
  };
}

export function createServerErrorResult(
  status: number | string,
  localBuildId: string
): UpdateCheckResult {
  return {
    code: 'SERVER_ERROR',
    title: 'Update Server Unavailable',
    message: `Update server responded with status HTTP ${status}. Please try again later.`,
    debugCode: `ERR_HTTP_${status}`,
    localBuildId,
    timestamp: Date.now(),
  };
}

export function createUpToDateResult(buildId: string): UpdateCheckResult {
  return {
    code: 'UP_TO_DATE',
    title: 'System Up to Date',
    message: `You are running the latest version (Build ${buildId} is current).`,
    debugCode: 'OK_LATEST_BUILD',
    localBuildId: buildId,
    timestamp: Date.now(),
  };
}

export function createDownloadingResult(
  localBuildId: string,
  targetBuildId: string
): UpdateCheckResult {
  return {
    code: 'DOWNLOADING',
    title: 'New Build Found',
    message: `Downloading new build assets (${targetBuildId}) in background...`,
    debugCode: 'DOWNLOADING_ASSETS',
    localBuildId,
    targetBuildId,
    timestamp: Date.now(),
  };
}

export function createUpdateAvailableResult(
  localBuildId: string,
  targetBuildId: string
): UpdateCheckResult {
  return {
    code: 'UPDATE_AVAILABLE',
    title: 'New Build Available',
    message: `New build ready (${targetBuildId}). Ready to install and reboot cabin.`,
    debugCode: 'NEW_BUILD_READY',
    localBuildId,
    targetBuildId,
    timestamp: Date.now(),
  };
}

export function sanitizeUpdateError(
  error: unknown,
  isOnline: boolean,
  localBuildId: string
): UpdateCheckResult {
  if (!isOnline) {
    return createOfflineResult(localBuildId);
  }

  if (error instanceof HttpError) {
    return createServerErrorResult(error.status, localBuildId);
  }

  const errName = error instanceof Error || error instanceof DOMException ? error.name : '';
  const rawMsg = error instanceof Error ? error.message : String(error || '');

  if (errName === 'AbortError' || /aborted|timeout/i.test(rawMsg)) {
    return createTimeoutResult(localBuildId);
  }

  const httpStatusMatch = rawMsg.match(/(?:HTTP_STATUS_|status:?\s*|HTTP\s*)(\d{3})/i);
  if (httpStatusMatch) {
    return createServerErrorResult(httpStatusMatch[1], localBuildId);
  }

  if (error instanceof TypeError && /failed to fetch|networkerror/i.test(rawMsg)) {
    return createOfflineResult(
      localBuildId,
      'Cannot check for updates: Network connection failed or server unreachable.'
    );
  }

  return {
    code: 'UNKNOWN_ERROR',
    title: 'Update Check Failed',
    message: 'Unable to verify updates due to an unexpected diagnostic error.',
    debugCode: 'ERR_CHECK_FAILED',
    localBuildId,
    timestamp: Date.now(),
  };
}
