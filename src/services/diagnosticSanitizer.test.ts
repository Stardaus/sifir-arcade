import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  HttpError,
  sanitizeUpdateError,
  createUpToDateResult,
  createDownloadingResult,
  createUpdateAvailableResult,
  scrubSecrets,
} from './diagnosticSanitizer.ts';

test('sanitizeUpdateError classifies offline states as OFFLINE_ERROR without exposing raw internals', () => {
  const err = new TypeError('Failed to fetch');
  const result = sanitizeUpdateError(err, false, 'v1.0.0');

  assert.equal(result.code, 'OFFLINE_ERROR');
  assert.equal(result.debugCode, 'ERR_NET_OFFLINE');
  assert.equal(result.title, 'Device Offline');
  assert.match(result.message, /internet connection/i);
  assert.equal(result.localBuildId, 'v1.0.0');
});

test('sanitizeUpdateError classifies AbortError as TIMEOUT_ERROR', () => {
  const err = new DOMException('The operation was aborted', 'AbortError');
  const result = sanitizeUpdateError(err, true, 'v1.0.0');

  assert.equal(result.code, 'TIMEOUT_ERROR');
  assert.equal(result.debugCode, 'ERR_FETCH_TIMEOUT');
  assert.equal(result.title, 'Request Timeout');
  assert.match(result.message, /timed out/i);
});

test('sanitizeUpdateError handles HttpError typed instances as SERVER_ERROR', () => {
  const err = new HttpError(503);
  const result = sanitizeUpdateError(err, true, 'v1.0.0');

  assert.equal(result.code, 'SERVER_ERROR');
  assert.equal(result.debugCode, 'ERR_HTTP_503');
  assert.equal(result.title, 'Update Server Unavailable');
  assert.match(result.message, /503/);
});

test('sanitizeUpdateError classifies string HTTP status errors as SERVER_ERROR', () => {
  const err = new Error('HTTP_STATUS_500');
  const result = sanitizeUpdateError(err, true, 'v1.0.0');

  assert.equal(result.code, 'SERVER_ERROR');
  assert.equal(result.debugCode, 'ERR_HTTP_500');
  assert.equal(result.title, 'Update Server Unavailable');
  assert.match(result.message, /500/);
});

test('sanitizeUpdateError scrubs sensitive URLs, tokens, and system paths from unexpected errors', () => {
  const leakSource =
    'Connection failed to https://api.arcade.internal/v1/updates?token=SECRET_AUTH_TOKEN&apiKey=PRIVATE_KEY in /var/secrets/app.config';
  const err = new Error(leakSource);
  const result = sanitizeUpdateError(err, true, 'v1.0.0');

  assert.equal(result.code, 'UNKNOWN_ERROR');
  assert.equal(result.debugCode, 'ERR_CHECK_FAILED');
  assert.equal(result.title, 'Update Check Failed');

  assert.doesNotMatch(result.message, /SECRET_AUTH_TOKEN/);
  assert.doesNotMatch(result.message, /PRIVATE_KEY/);
  assert.doesNotMatch(result.message, /https:\/\/api\.arcade\.internal/);
  assert.doesNotMatch(result.message, /\/var\/secrets/);
});

test('scrubSecrets removes URL parameters, auth tokens, and disk paths', () => {
  const dirty = 'Error at https://example.com/check?auth=XYZ_123 in /Users/dev/project/src.ts';
  const clean = scrubSecrets(dirty);

  assert.doesNotMatch(clean, /XYZ_123/);
  assert.doesNotMatch(clean, /https:\/\/example\.com/);
  assert.doesNotMatch(clean, /\/Users\/dev/);
});

test('createUpToDateResult produces structured UP_TO_DATE status', () => {
  const result = createUpToDateResult('v1.0.0-build-abc');

  assert.equal(result.code, 'UP_TO_DATE');
  assert.equal(result.debugCode, 'OK_LATEST_BUILD');
  assert.equal(result.title, 'System Up to Date');
  assert.match(result.message, /v1\.0\.0-build-abc/);
  assert.equal(result.localBuildId, 'v1.0.0-build-abc');
});

test('createDownloadingResult produces structured DOWNLOADING status', () => {
  const result = createDownloadingResult('v1.0.0-old', 'v1.0.1-new');

  assert.equal(result.code, 'DOWNLOADING');
  assert.equal(result.debugCode, 'DOWNLOADING_ASSETS');
  assert.equal(result.title, 'New Build Found');
  assert.equal(result.localBuildId, 'v1.0.0-old');
  assert.equal(result.targetBuildId, 'v1.0.1-new');
});

test('createUpdateAvailableResult produces structured UPDATE_AVAILABLE status', () => {
  const result = createUpdateAvailableResult('v1.0.0-old', 'v1.0.0-new');

  assert.equal(result.code, 'UPDATE_AVAILABLE');
  assert.equal(result.debugCode, 'NEW_BUILD_READY');
  assert.equal(result.title, 'New Build Available');
  assert.equal(result.localBuildId, 'v1.0.0-old');
  assert.equal(result.targetBuildId, 'v1.0.0-new');
});
