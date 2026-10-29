import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import type { Info, Transfer } from '../shared/puzzle.js'

export type Account = { id: string; phone: string; identityKey: string; source: 'sms' | 'appck' | 'cookieapp'; credential: { cookie: string; app?: Record<string, unknown> }; activityCookie: string; info?: Info; error?: string; updatedAt: string }
export type ImportJob = { id: string; status: 'running' | 'completed' | 'interrupted'; total: number; processed: number; imported: number; updated: number; skipped: number; failed: number; results: { phone: string; status: 'imported' | 'updated' | 'skipped' | 'failed'; message: string }[]; message?: string }
export type Checkpoint = { kind: 'gift' | 'draw' | 'receive' | 'redeem' | 'task'; to: string; from?: string; piece?: string; token?: string; round: number; before: Info; fromBefore?: number; task?: { taskId: string; status?: number; completedTimes?: number }; phase?: string }
export type Job = { id: string; requestId: string; kind: 'transfer' | 'relay' | 'daily' | 'receive' | 'redeem' | 'draw'; donors: string[]; to: string; round: number; mode: 'fill' | 'all'; autoDraw: boolean; autoAdvance?: boolean; relayTargets?: string[]; relayStart?: number; relayEnd?: number; relayCompleted?: string[]; relayDrawn?: string[]; relayActive?: boolean; fastTasks?: boolean; taskFilter?: string[]; drawnRounds?: number[]; completedRounds?: number[]; taskRuns?: Record<string, number>; tasksUnconfirmed?: string[]; tasksFailed?: string[]; status: 'running' | 'paused' | 'completed' | 'stopped'; createdAt: string; logs: { at: string; message: string }[]; checkpoint?: Checkpoint; transfersDone: number; drawDone: boolean; cursor: number; taskIndex: number; taskIds?: string[]; tasksDone: string[]; tokens?: string[]; remaining?: Transfer[]; cancel?: boolean }
export type State = { version: 1; accounts: Account[]; jobs: Job[]; importJob?: ImportJob }
export class Store {
  state: State
  private key: Buffer
  private file: string
  private lock: string
  constructor(readonly dir: string) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 })
    const keyFile = path.join(dir, 'key'), file = this.file = path.join(dir, 'state.enc')
    this.lock = path.join(dir, 'process.lock')
    try { const pid = Number(fs.readFileSync(this.lock, 'utf8')); if (!Number.isSafeInteger(pid) || pid < 1) throw new Error('锁文件损坏'); try { process.kill(pid, 0); throw new Error('此账号库已由另一个工具进程使用') } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error } fs.unlinkSync(this.lock) } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error }
    fs.writeFileSync(this.lock, String(process.pid), { flag: 'wx', mode: 0o600 })
    try {
      if (!fs.existsSync(keyFile)) { if (fs.existsSync(file)) throw new Error('加密密钥丢失，请恢复 data/key，不会覆盖账号库'); fs.writeFileSync(keyFile, crypto.randomBytes(32), { flag: 'wx', mode: 0o600 }) }
      this.key = fs.readFileSync(keyFile)
      if (this.key.length !== 32) throw new Error('账号库密钥格式异常')
      this.state = fs.existsSync(file) ? this.decrypt(fs.readFileSync(file)) : { version: 1, accounts: [], jobs: [] }
      if (this.state.version !== 1 || !Array.isArray(this.state.accounts) || !Array.isArray(this.state.jobs)) throw new Error('账号库格式不兼容')
      if (this.state.importJob?.status === 'running') { this.state.importJob.status = 'interrupted'; this.state.importJob.message = '服务重启，导入已中断；已导入号码保留，可重新导入' }
      for (const j of this.state.jobs) if (j.status === 'running') { j.status = 'paused'; j.cancel = false; j.logs.push({ at: new Date().toISOString(), message: '进程重启，任务已暂停。继续时先核对上次操作，禁止重复生成转赠或抽图。' }) }
      this.save()
    } catch (error) { fs.unlinkSync(this.lock); throw error }
  }
  private decrypt(buf: Buffer): State {
    const d = crypto.createDecipheriv('aes-256-gcm', this.key, buf.subarray(0, 12)); d.setAuthTag(buf.subarray(12, 28))
    return JSON.parse(Buffer.concat([d.update(buf.subarray(28)), d.final()]).toString('utf8'))
  }
  save() {
    const iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', this.key, iv)
    const data = Buffer.concat([c.update(JSON.stringify(this.state), 'utf8'), c.final()])
    const buf = Buffer.concat([iv, c.getAuthTag(), data]), temp = this.file + '.tmp'
    const fd = fs.openSync(temp, 'w', 0o600)
    try { fs.writeFileSync(fd, buf); fs.fsyncSync(fd) } finally { fs.closeSync(fd) }
    fs.renameSync(temp, this.file)
  }
  close() { if (fs.existsSync(this.lock) && fs.readFileSync(this.lock, 'utf8') === String(process.pid)) fs.unlinkSync(this.lock) }
  account(id: string) { const a = this.state.accounts.find(a => a.id === id); if (!a) throw new Error('号码不在账号池中'); return a }
  view() {
    return { accounts: this.state.accounts.map(({ id, phone, source, info, error, updatedAt }) => ({ id, phone, source, info, error, updatedAt })), jobs: this.state.jobs.slice(-20).reverse().map(j => ({ id: j.id, kind: j.kind, status: j.status, donors: j.donors, to: j.to, round: j.round, mode: j.mode, autoDraw: j.autoDraw, autoAdvance: j.autoAdvance, logs: j.logs, createdAt: j.createdAt, transfersDone: j.transfersDone, drawDone: j.drawDone, drawCount: j.kind === 'relay' ? j.relayDrawn?.length || 0 : j.drawnRounds?.length ?? (j.drawDone ? 1 : 0), relayTargets: j.relayTargets, relayCompleted: j.relayCompleted, relayStart: j.relayStart, relayEnd: j.relayEnd, completedRounds: j.completedRounds || [], tasksCompleted: j.tasksDone.length, tasksUnconfirmed: j.tasksUnconfirmed?.length || 0, tasksFailed: j.tasksFailed?.length || 0, pending: j.checkpoint?.kind })) }
  }
}
