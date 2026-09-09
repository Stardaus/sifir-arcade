import { ActiveScreen } from '../types/sifir';

type UpdateListener = (available: boolean) => void;

class PwaUpdateService {
  private registration: ServiceWorkerRegistration | null = null;
  private isUpdateAvailable: boolean = false;
  private listeners: Set<UpdateListener> = new Set();

  public init(): void {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    window.addEventListener('load', () => {
      this.registerServiceWorker();
    });

    // Check on app resume and window focus
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkForUpdate();
      }
    });

    window.addEventListener('focus', () => {
      this.checkForUpdate();
    });

    // Periodic check every 15 minutes
    window.setInterval(() => {
      this.checkForUpdate();
    }, 15 * 60 * 1000);
  }

  private registerServiceWorker(): void {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => {
        this.registration = reg;

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.notifyUpdateAvailable();
            }
          });
        });
      })
      .catch((err) => {
        console.warn('Service Worker registration skipped:', err);
      });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // If controller changes, we can reload to pick up new assets
      window.location.reload();
    });
  }

  public checkForUpdate(): void {
    if (!this.registration) return;
    this.registration.update().catch(() => {});
  }

  private notifyUpdateAvailable(): void {
    this.isUpdateAvailable = true;
    this.listeners.forEach((listener) => listener(true));
  }

  public subscribe(listener: UpdateListener): () => void {
    this.listeners.add(listener);
    listener(this.isUpdateAvailable);
    return () => this.listeners.delete(listener);
  }

  public applyUpdate(_activeScreen?: ActiveScreen): void {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  }

  public handleScreenNavigation(newScreen: ActiveScreen): void {
    if (this.isUpdateAvailable && newScreen === 'CABIN_HOME') {
      this.applyUpdate('CABIN_HOME');
    }
  }
}

export const pwaUpdateService = new PwaUpdateService();
