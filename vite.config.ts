import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import pkg from './package.json';

const version = pkg.version || '1.0.0';

let commitHash = 'local';
try {
  commitHash = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim();
} catch {
  commitHash = 'local';
}

const timestamp = new Date().toISOString();
const buildId = `v${version}-${Date.now().toString(36)}-${commitHash}`;

const buildInfo = {
  version,
  buildId,
  timestamp,
  commit: commitHash,
};

function generateVersionJsonPlugin() {
  return {
    name: 'generate-version-json',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify(buildInfo, null, 2),
      });
    },
  };
}

export default defineConfig({
  base: './',
  define: {
    __APP_BUILD_INFO__: JSON.stringify(buildInfo),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: false,
      },
    }),
    generateVersionJsonPlugin(),
  ],
});
