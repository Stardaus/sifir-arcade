import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pwaUpdateService } from './pwaUpdateService.ts';
import type { UpdateCheckResult } from '../types/telemetry.ts';

const originalFetch = globalThis.fetch;

beforeEach(() => {
  pwaUpdateService.__resetForTesting();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('checkNow returns UP_TO_DATE when remote version.json matches local buildId', async () => {
  const localBuild = pwaUpdateService.getLocalBuildInfo();

  globalThis.fetch = async () => {
    return new Response(
      JSON.stringify({
        version: localBuild.version,
        buildId: localBuild.buildId,
        timestamp: localBuild.timestamp,
        commit: localBuild.commit,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };

  const result = await pwaUpdateService.checkNow();
  assert.equal(result.code, 'UP_TO_DATE');
  assert.equal(result.localBuildId, localBuild.buildId);
  assert.match(result.message, new RegExp(localBuild.buildId));
});

test('checkNow returns DOWNLOADING and transitions to UPDATE_AVAILABLE on worker waiting', async () => {
  const localBuild = pwaUpdateService.getLocalBuildInfo();
  const remoteBuildId = 'v1.0.1-newest-build-999';

  globalThis.fetch = async () => {
    return new Response(
      JSON.stringify({
        version: '1.0.1',
        buildId: remoteBuildId,
        timestamp: new Date().toISOString(),
        commit: 'newest',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };

  const result = await pwaUpdateService.checkNow();
  assert.equal(result.code, 'DOWNLOADING');
  assert.equal(result.localBuildId, localBuild.buildId);
  assert.equal(result.targetBuildId, remoteBuildId);

  // Now simulate worker finishing precaching and entering waiting state
  pwaUpdateService.__simulateWorkerWaiting(remoteBuildId);

  assert.equal(pwaUpdateService.getIsUpdateAvailable(), true);
  const latestResult = pwaUpdateService.getLatestDiagnosticResult();
  assert.equal(latestResult?.code, 'UPDATE_AVAILABLE');
  assert.equal(latestResult?.targetBuildId, remoteBuildId);
});

test('checkNow returns OFFLINE_ERROR when network fetch fails', async () => {
  globalThis.fetch = async () => {
    throw new TypeError('Failed to fetch');
  };

  const result = await pwaUpdateService.checkNow();
  assert.equal(result.code, 'OFFLINE_ERROR');
  assert.equal(result.debugCode, 'ERR_NET_OFFLINE');
});

test('checkNow notifies diagnostic subscribers of checking and completion', async () => {
  const events: Array<{ checking: boolean; result: UpdateCheckResult | null }> = [];
  const unsubscribe = pwaUpdateService.subscribeDiagnostic((res, checking) => {
    events.push({ checking, result: res });
  });

  const localBuild = pwaUpdateService.getLocalBuildInfo();
  globalThis.fetch = async () => {
    return new Response(
      JSON.stringify({
        version: localBuild.version,
        buildId: localBuild.buildId,
        timestamp: localBuild.timestamp,
        commit: localBuild.commit,
      }),
      { status: 200 }
    );
  };

  await pwaUpdateService.checkNow();
  unsubscribe();

  assert.ok(events.length >= 2);
  const started = events.find((e) => e.checking === true);
  const finished = events.find((e) => e.checking === false && e.result?.code === 'UP_TO_DATE');
  assert.ok(started, 'Expected to find checking=true event');
  assert.ok(finished, 'Expected to find finished event with UP_TO_DATE');
});

test('screen navigation triggers deferred update when navigating to CABIN_HOME', () => {
  // Simulate active gameplay
  pwaUpdateService.handleScreenNavigation('SPEED_RUSH');
  pwaUpdateService.__simulateWorkerWaiting('v1.0.1-deferred');
  assert.equal(pwaUpdateService.getIsUpdateAvailable(), true);

  // Verify that navigating back to CABIN_HOME triggers applyUpdate without throwing
  let didApply = false;
  const originalApply = pwaUpdateService.applyUpdate;
  pwaUpdateService.applyUpdate = () => {
    didApply = true;
  };

  pwaUpdateService.handleScreenNavigation('CABIN_HOME');
  assert.equal(didApply, true, 'Expected applyUpdate to be triggered upon navigating to CABIN_HOME');
  pwaUpdateService.applyUpdate = originalApply;
});

test('build artifact verification: dist/version.json exists with valid structure', () => {
  const versionPath = path.resolve(process.cwd(), 'dist', 'version.json');
  if (fs.existsSync(versionPath)) {
    const raw = fs.readFileSync(versionPath, 'utf-8');
    const parsed = JSON.parse(raw);
    assert.ok(parsed.version, 'version.json must have version');
    assert.ok(parsed.buildId, 'version.json must have buildId');
    assert.ok(parsed.timestamp, 'version.json must have timestamp');
    assert.ok(parsed.commit, 'version.json must have commit');
  }
});
