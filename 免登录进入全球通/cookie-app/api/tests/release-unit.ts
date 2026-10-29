import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { loadReleaseInfo } from '../services/releaseInfo.js'
import { frontendAssets, verifyRelease } from '../../scripts/release.mjs'

const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cookie-app-release-test-'))
const manifest = { id: 'mock-release', revision: 'abcdef123456', builtAt: '2026-10-10T00:00:00.000Z' }
const html = '<script src="/assets/new.js"></script><link href="/assets/new.css" rel="stylesheet">'
try {
  fs.mkdirSync(path.join(directory, 'assets'))
  fs.writeFileSync(path.join(directory, 'assets/new.js'), 'mock-source')
  fs.writeFileSync(path.join(directory, 'assets/new.css'), 'mock-style')
  fs.writeFileSync(path.join(directory, 'index.html'), html)
  assert.deepEqual(frontendAssets(html), ['/assets/new.js', '/assets/new.css'])
  assert.equal(loadReleaseInfo(path.join(directory, 'absent')), null)
  const metadata = path.join(directory, 'version.json')
  fs.writeFileSync(metadata, JSON.stringify(manifest))
  assert.deepEqual(loadReleaseInfo(metadata), manifest)
  fs.writeFileSync(metadata, JSON.stringify({ ...manifest, revision: 'not-a-commit' }))
  assert.equal(loadReleaseInfo(metadata), null)
  for (const scenario of ['success', 'stale-api', 'stale-page', 'missing-asset', 'wrong-asset']) {
    const request = async (input: URL) => {
      if (input.pathname === '/api/health') return Response.json({ data: { status: 'ok', release: scenario === 'stale-api' ? { ...manifest, id: 'old' } : manifest } })
      if (input.pathname === '/public') return new Response(scenario === 'stale-page' ? html.replace('new.js', 'old.js') : html)
      if (scenario === 'missing-asset') return new Response('', { status: 404 })
      if (scenario === 'wrong-asset') return new Response('stale-content')
      return new Response(fs.readFileSync(path.join(directory, input.pathname.slice(1))))
    }
    if (scenario === 'success') await verifyRelease('https://mock.invalid', manifest, directory, request)
    else await assert.rejects(verifyRelease('https://mock.invalid', manifest, directory, request))
  }
  console.log('release-unit: process version, stale HTML and missing/mismatched assets checks passed (mock only)')
} finally { fs.rmSync(directory, { recursive: true, force: true }) }
