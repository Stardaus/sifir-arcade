import type { ActiveScreen } from '../types/sifir.ts';
import type { AppBuildInfo, UpdateCheckResult } from '../types/telemetry.ts';
import {
  HttpError,
  sanitizeUpdateError,
  createUpToDateResult,
  createDownloadingResult,
  createUpdateAvailableResult,
} from './diagnosticSanitizer.ts';

type UpdateListener = (available: boolean) => void;
type DiagnosticListener = (result: UpdateCheckResult | null, isChecking: boolean) => void;

interface WorkboxInstance {
  register: () => Promise<ServiceWorkerRegistration | undefined>;
  update: () => Promise<void>;
  messageSkipWaiting: () => void;
  addEventListener: (event: string, callback: (event: unknown) => void) => void;
}

const CHECK_TIMEOUT_MS = 5000;
const PERIODIC_CHECK_INTERVAL_MS = 15 * 60 * 1000;

class PwaUpdateService {
  private wb: WorkboxInstance | null = null;
  private isInitialized: boolean = false;
  private isUpdateAvailable: boolean = false;
  private isChecking: boolean = false;
  private currentScreen: ActiveScreen = 'CABIN_HOME';
  private latestResult: UpdateCheckResult | null = null;
  private updateListeners: Set<UpdateListener> = new Set();
  private diagnosticListeners: Set<DiagnosticListener> = new Set();

  private localBuildInfo: AppBuildInfo =
    typeof __APP_BUILD_INFO__ !== 'undefined'
      ? __APP_BUILD_INFO__
      : {
          version: '1.0.0',
          buildId: 'v1.0.0-local-dev',
          timestamp: new Date().toISOString(),
          commit: 'dev',
        };

  public getLocalBuildInfo(): AppBuildInfo {
    return this.localBuildInfo;
  }

  public getIsUpdateAvailable(): boolean {
    return this.isUpdateAvailable;
  }

  public getLatestDiagnosticResult(): UpdateCheckResult | null {
    return this.latestResult;
  }

  public init(): void {
    if (this.isInitialized || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }
    this.isInitialized = true;

    if (document.readyState === 'complete') {
      void this.initWorkbox();
    } else {
      window.addEventListener('load', () => {
        void this.initWorkbox();
      });
    }

    // Launch probe
    void this.checkNow();

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        void this.checkNow();
      }
    });

    window.addEventListener('focus', () => {
      void this.checkNow();
    });

    window.setInterval(() => {
      void this.checkNow();
    }, PERIODIC_CHECK_INTERVAL_MS);
  }

  private async initWorkbox(): Promise<void> {
    try {
      const { Workbox } = await import('workbox-window');
      const swUrl = `${import.meta.env.BASE_URL}sw.js`;
      const wb = new Workbox(swUrl) as WorkboxInstance;
      this.wb = wb;

      wb.addEventListener('waiting', () => {
        this.onWorkerWaiting();
      });

      wb.addEventListener('controlling', () => {
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      });

      await wb.register();
    } catch (err) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('[PWA] Workbox registration skipped or failed:', err);
      }
    }
  }

  private onWorkerWaiting(): void {
    this.isUpdateAvailable = true;
    const targetBuildId = this.latestResult?.targetBuildId || 'latest';
    this.latestResult = createUpdateAvailableResult(this.localBuildInfo.buildId, targetBuildId);
    this.notifyUpdateListeners();
    this.notifyDiagnosticListeners();

    if (this.currentScreen === 'CABIN_HOME') {
      this.applyUpdate();
    }
  }

  public async checkNow(): Promise<UpdateCheckResult> {
    if (this.isChecking) {
      return this.latestResult || createUpToDateResult(this.localBuildInfo.buildId);
    }

    this.isChecking = true;
    this.notifyDiagnosticListeners();

    const isOnline =
      typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
        ? navigator.onLine
        : true;

    if (!isOnline) {
      const offlineResult = sanitizeUpdateError(new Error('Offline'), false, this.localBuildInfo.buildId);
      this.finishCheck(offlineResult);
      return offlineResult;
    }

    try {
      const remoteData = await this.fetchRemoteBuildInfo();
      const remoteBuildId = remoteData.buildId || remoteData.version || '';

      if (remoteBuildId && remoteBuildId !== this.localBuildInfo.buildId) {
        const downloadingResult = createDownloadingResult(this.localBuildInfo.buildId, remoteBuildId);
        if (this.wb) {
          void this.wb.update().catch(() => {});
        }
        this.finishCheck(downloadingResult);
        return downloadingResult;
      }

      const upToDateResult = createUpToDateResult(this.localBuildInfo.buildId);
      this.finishCheck(upToDateResult);
      return upToDateResult;
    } catch (err) {
      const errorResult = sanitizeUpdateError(err, isOnline, this.localBuildInfo.buildId);
      this.finishCheck(errorResult);
      return errorResult;
    }
  }

  private async fetchRemoteBuildInfo(): Promise<Partial<AppBuildInfo>> {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS) : null;

    try {
      const baseUrl = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : './';
      const versionUrl = `${baseUrl}version.json?_t=${Date.now()}`;
      const response = await fetch(versionUrl, {
        cache: 'no-store',
        signal: controller?.signal,
      });

      if (!response.ok) {
        throw new HttpError(response.status);
      }

      return (await response.json()) as Partial<AppBuildInfo>;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  private finishCheck(result: UpdateCheckResult): void {
    this.latestResult = result;
    this.isChecking = false;
    this.notifyDiagnosticListeners();
  }

  private notifyUpdateListeners(): void {
    this.updateListeners.forEach((listener) => listener(this.isUpdateAvailable));
  }

  private notifyDiagnosticListeners(): void {
    this.diagnosticListeners.forEach((listener) =>
      listener(this.latestResult, this.isChecking)
    );
  }

  public subscribe(listener: UpdateListener): () => void {
    this.updateListeners.add(listener);
    listener(this.isUpdateAvailable);
    return () => this.updateListeners.delete(listener);
  }

  public subscribeDiagnostic(listener: DiagnosticListener): () => void {
    this.diagnosticListeners.add(listener);
    listener(this.latestResult, this.isChecking);
    return () => this.diagnosticListeners.delete(listener);
  }

  public applyUpdate(): void {
    if (this.wb) {
      this.wb.messageSkipWaiting();
    }
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  public handleScreenNavigation(newScreen: ActiveScreen): void {
    this.currentScreen = newScreen;
    if (this.isUpdateAvailable && newScreen === 'CABIN_HOME') {
      this.applyUpdate();
    }
  }

  // Testing hooks to simulate worker events
  public __simulateWorkerWaiting(targetBuildId = 'v1.0.1-test'): void {
    this.latestResult = createDownloadingResult(this.localBuildInfo.buildId, targetBuildId);
    this.onWorkerWaiting();
  }

  public __resetForTesting(): void {
    this.isInitialized = false;
    this.isUpdateAvailable = false;
    this.isChecking = false;
    this.currentScreen = 'CABIN_HOME';
    this.latestResult = null;
    this.updateListeners.clear();
    this.diagnosticListeners.clear();
  }
}

export const pwaUpdateService = new PwaUpdateService();
