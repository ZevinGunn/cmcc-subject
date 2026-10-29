import fs from 'node:fs'
import path from 'node:path'

export type ReleaseInfo = { id: string; revision: string; builtAt: string }

export function loadReleaseInfo(file = path.resolve(process.cwd(), 'dist/version.json')): ReleaseInfo | null {
  try {
    const value = JSON.parse(fs.readFileSync(file, 'utf8'))
    if (!/^[A-Za-z0-9._-]{1,100}$/.test(value.id) || !/^[a-f0-9]{7,40}$/.test(value.revision) || !Number.isFinite(Date.parse(value.builtAt))) return null
    return { id: value.id, revision: value.revision, builtAt: value.builtAt }
  } catch { return null }
}

// Snapshot at process startup: a new dist alone must not masquerade as a reloaded API.
export const currentRelease = loadReleaseInfo()
export const serverStartedAt = new Date().toISOString()
