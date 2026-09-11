/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare const __APP_BUILD_INFO__: {
  readonly version: string;
  readonly buildId: string;
  readonly timestamp: string;
  readonly commit: string;
};
