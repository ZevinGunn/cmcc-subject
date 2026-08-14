import assert from 'node:assert/strict';
import test from 'node:test';

import {
  absorbSetCookieLines,
  selectCookieJar,
  serializeCookieJar,
  splitSetCookieHeader
} from './cookieJar.js';

test('public CK contains only cookies issued through Set-Cookie', () => {
  const requestJar = new Map([
    ['clientId', 'local-seed'],
    ['WT_FPC', 'local-telemetry']
  ]);
  const upstreamNames = new Set();

  absorbSetCookieLines(requestJar, ['grayscale=1; Path=/', 'shareToken=real-ticket; HttpOnly'], upstreamNames);

  assert.equal(
    serializeCookieJar(selectCookieJar(requestJar, upstreamNames)),
    'grayscale=1; shareToken=real-ticket'
  );
  assert.equal(upstreamNames.has('clientId'), false);
  assert.equal(upstreamNames.has('WT_FPC'), false);
});

test('expired upstream cookies are not returned as current CK', () => {
  const requestJar = new Map([['shareToken', 'old-ticket']]);
  const upstreamNames = new Set();

  absorbSetCookieLines(requestJar, ['shareToken=; Max-Age=0; Path=/'], upstreamNames);

  assert.equal(serializeCookieJar(selectCookieJar(requestJar, upstreamNames)), '');
});

test('combined Set-Cookie headers preserve Expires commas', () => {
  assert.deepEqual(
    splitSetCookieHeader('a=1; Expires=Wed, 21 Oct 2030 07:28:00 GMT, b=2; Path=/'),
    ['a=1; Expires=Wed, 21 Oct 2030 07:28:00 GMT', 'b=2; Path=/']
  );
});
