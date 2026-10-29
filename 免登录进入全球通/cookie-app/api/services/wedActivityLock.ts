import os from 'node:os'
import crypto from 'node:crypto'
import { getPrisma } from './prisma.js'

export const wedWorker = { host: os.hostname(), pid: process.pid }
export function wedWorkerAlive(worker: typeof wedWorker): boolean {
  if (worker.host !== wedWorker.host) return true // never steal a remote worker's lock
  try { process.kill(worker.pid, 0); return true } catch (e) { return (e as NodeJS.ErrnoException).code !== 'ESRCH' }
}
let ready: Promise<unknown> | undefined
// A persisted global lease also excludes the old draw / task endpoints across local processes.
export async function withWedActivityLock<T>(fn: () => Promise<T>, wait = false): Promise<T> {
  if (!ready) ready = getPrisma().$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "WedActivityLease" (id text PRIMARY KEY, nonce text NOT NULL, host text NOT NULL, pid integer NOT NULL)`)
    .catch(error => { ready = undefined; throw error })
  await ready
  const nonce = crypto.randomUUID()
  for (;;) {
    const claimed = await getPrisma().$queryRaw<{ nonce: string }[]>`INSERT INTO "WedActivityLease" (id, nonce, host, pid) VALUES ('puzzle', ${nonce}, ${wedWorker.host}, ${wedWorker.pid}) ON CONFLICT DO NOTHING RETURNING nonce`
    if (claimed.length) break
    const rows = await getPrisma().$queryRaw<{ nonce: string; host: string; pid: number }[]>`SELECT nonce, host, pid FROM "WedActivityLease" WHERE id='puzzle'`
    if (rows[0] && !wedWorkerAlive(rows[0])) {
      await getPrisma().$executeRaw`DELETE FROM "WedActivityLease" WHERE id='puzzle' AND nonce=${rows[0].nonce}`
      continue
    }
    if (!wait) throw new Error('周三拼图队列正在操作库存，请等待队列结束')
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  try { return await fn() }
  finally { await getPrisma().$executeRaw`DELETE FROM "WedActivityLease" WHERE id='puzzle' AND nonce=${nonce}` }
}
