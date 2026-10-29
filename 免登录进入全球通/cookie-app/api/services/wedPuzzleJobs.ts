import crypto from 'node:crypto'
import { getPrisma } from './prisma.js'
import { decryptJson, encryptJson } from './cryptoBox.js'
import { getAccountById, setAccountWedRechargeCookie, setAccountWedRechargeInfo } from './accountsStore.js'
import { ensureUsable10086Cookie, recover10086CookieByYunpan } from './cmccCookieRecovery.js'
import { getUserById, listUserAccountSummaries } from './userAuthStore.js'
import { withKeyLock } from './taskGuards.js'
import { wedWorker, wedWorkerAlive, withWedActivityLock } from './wedActivityLock.js'
import { prepareWedRechargeSession, wedRechargeQueryPictureInfo, wedRechargeTradeList, wedRechargeGift,
  wedRechargeReceive, wedRechargeDrawPicture, wedRechargeReceiveCoupon, WedAuthenticationExpired, type WedRechargePictureInfo } from './wedRecharge.js'
import { PUZZLE_ROUNDS, canDrawPuzzle, ordinaryReady, planPuzzleTarget, puzzleCount, roundComplete, type PuzzleSnapshot } from '../../shared/wedPuzzlePlanner.js'

export type PuzzleJobInput = { accountIds: string[]; targetIds: string[]; maxRound: number; redeem: boolean;
  mode: 'auto' | 'transfer' | 'receive'; from?: string; to?: string; piece?: string; count?: number; token?: string }
type Checkpoint = { kind: 'gift' | 'draw' | 'redeem' | 'receive'; from?: string; to: string; piece?: string;
  round: number; before: WedRechargePictureInfo; fromBefore?: number; token?: string }
export type PuzzleJob = { id: string; owner: string; input: PuzzleJobInput; status: 'queued' | 'running' | 'paused' | 'completed' | 'stopped';
  logs: { at: string; message: string }[]; pool: PuzzleSnapshot[]; completedTargets: string[]; transfersDone?: number; checkpoint?: Checkpoint; createdAt: string; worker?: typeof wedWorker }
type Stored = { id: string; owner: string; status: string; payload: string; cancel: boolean }
let initialized: Promise<void> | undefined
const live = new Set<string>()

// Separate journal: the existing batch worker must not pick up and replay these mutations.
async function init() {
  if (!initialized) initialized = (async () => {
    await getPrisma().$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "WedPuzzleJob" (
      id text PRIMARY KEY, owner text NOT NULL, status text NOT NULL, payload text NOT NULL,
      cancel boolean NOT NULL DEFAULT false, "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now())`)
    await getPrisma().$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "WedPuzzleJob_owner_active" ON "WedPuzzleJob" (owner) WHERE status IN ('queued','running','paused')`)
  })().catch(error => { initialized = undefined; throw error })
  await initialized
}
async function save(job: PuzzleJob) {
  await getPrisma().$executeRaw`UPDATE "WedPuzzleJob" SET status=${job.status}, payload=${encryptJson(job)}, "updatedAt"=now() WHERE id=${job.id}`
}
export async function readPuzzleJob(id: string, owner: string): Promise<PuzzleJob | null> {
  await init()
  const rows = await getPrisma().$queryRaw<Stored[]>`SELECT id, owner, status, payload, cancel FROM "WedPuzzleJob" WHERE id=${id} AND owner=${owner}`
  if (!rows[0]) return null
  const job = decryptJson<PuzzleJob>(rows[0].payload)
  job.status = rows[0].status as PuzzleJob['status']
  if (['queued', 'running'].includes(job.status) && (!job.worker || !wedWorkerAlive(job.worker))) {
    job.status = 'paused'
    const recovered = await getPrisma().$executeRaw`UPDATE "WedPuzzleJob" SET status='paused', payload=${encryptJson(job)}, "updatedAt"=now() WHERE id=${id} AND payload=${rows[0].payload} AND status IN ('queued','running')`
    if (!recovered) return readPuzzleJob(id, owner)
  }
  return job
}
export async function latestPuzzleJob(owner: string) {
  await init()
  const rows = await getPrisma().$queryRaw<{ id: string }[]>`SELECT id FROM "WedPuzzleJob" WHERE owner=${owner} ORDER BY "createdAt" DESC LIMIT 1`
  return rows[0] ? readPuzzleJob(rows[0].id, owner) : null
}
export function publicPuzzleJob(job: PuzzleJob | null) {
  if (!job) return null
  // Do not expose gift tokens, CK, card numbers, or upstream raw payloads.
  const { token: _token, ...input } = job.input
  return { id: job.id, input, status: job.status, logs: job.logs, pool: job.pool.map(publicSnapshot),
    completedTargets: job.completedTargets, createdAt: job.createdAt, pendingOperation: job.checkpoint?.kind }
}
export function publicSnapshot(row: PuzzleSnapshot) {
  if (!row.info) return row
  const { raw: _raw, cardNo: _card, ...info } = row.info
  return { ...row, info }
}
async function assertOwnership(owner: string, ids: string[]) {
  if (owner === 'admin') return
  if (!owner.startsWith('user:')) throw new Error('请登录账号中心')
  const user = await getUserById(owner.slice(5))
  if (!user || user.disabledAt) throw new Error('用户已停用或登录已失效')
  const allowed = new Set((await listUserAccountSummaries(owner.slice(5))).map(row => row.id))
  if (ids.some(id => !allowed.has(id))) throw new Error('号码池账号归属已变更，任务已停止')
}
export type PuzzleTransport = {
  query(id: string): Promise<PuzzleSnapshot>
  tradeList(id: string): Promise<Awaited<ReturnType<typeof wedRechargeTradeList>>>
  gift(id: string, piece: string): Promise<string>
  receive(id: string, token: string): Promise<string>
  draw(id: string, round: number): Promise<unknown>
  redeem(id: string, round: number): Promise<void>
}
export function puzzleTransport(owner: string): PuzzleTransport {
  const sessions = new Map<string, { cookie: string; at: number }>()
  async function cookie(id: string) {
    await assertOwnership(owner, [id])
    const rec = await getAccountById(id)
    if (!rec || rec.disabledAt) throw Object.assign(new Error('账号已停用，请重新登录'), { code: 'RELOGIN_REQUIRED' })
    const cached = sessions.get(id)
    if (cached && Date.now() - cached.at < 5 * 60_000) return cached.cookie
    const usable = await ensureUsable10086Cookie({ rec, allowRecentSkip: false, clearOnYunpanFailure: false, preferYunpan: true })
    if (!usable.ok || !usable.cookie) {
      const hasRecoveryCredential = Boolean(rec.yunpanSession || rec.qqtAccessToken)
      throw Object.assign(new Error(usable.message || '10086 CK 已失效，请重新登录或导入有效 CK'), { code: hasRecoveryCredential ? 'UPSTREAM_ERROR' : 'COOKIE_INVALID' })
    }
    let baseCookie = usable.cookie
    try {
      const session = await prepareWedRechargeSession({ cookie: baseCookie, forceRefresh: true })
      await setAccountWedRechargeCookie({ id, cookie: session.cookie })
      sessions.set(id, { cookie: session.cookie, at: Date.now() })
      return session.cookie
    } catch (firstError) {
      // 周三接口可能比首页更早判定 10086 CK 失效；有云盘/全球通凭据时只续期一次。
      const current = await getAccountById(id)
      if (!current || (!current.yunpanSession && !current.qqtAccessToken)) throw firstError
      const recovered = await recover10086CookieByYunpan({ rec: current, reason: '周三拼图接口拒绝现有 10086 CK', clearOnYunpanFailure: false })
      if (!recovered.ok || !recovered.cookie) throw Object.assign(new Error(recovered.message || '云盘 CK 置换 10086 CK 失败，请重新登录'), { code: 'UPSTREAM_ERROR' })
      baseCookie = recovered.cookie
      const session = await prepareWedRechargeSession({ cookie: baseCookie, forceRefresh: true })
      await setAccountWedRechargeCookie({ id, cookie: session.cookie })
      sessions.set(id, { cookie: session.cookie, at: Date.now() })
      return session.cookie
    }
  }
  return {
    async query(id) {
      const ck = await cookie(id)
      try {
        const info = await wedRechargeQueryPictureInfo({ cookie: ck })
        if (!info.pictureList || typeof info.pictureList !== 'object') throw new Error('官方未返回拼图库存')
        for (const config of PUZZLE_ROUNDS) for (let i = 0; i < config.size; i++) puzzleCount(info, config.round, i)
        await setAccountWedRechargeInfo({ id, info: info as unknown as Record<string, unknown> })
        const rec = await getAccountById(id)
        const phone = rec?.displayPhone || rec?.phone || ''
        return { id, label: phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') || id.slice(0, 8), info, updatedAt: new Date().toISOString() }
      } catch (error) {
        if (error instanceof WedAuthenticationExpired) throw Object.assign(error, { code: 'COOKIE_INVALID' })
        throw error
      }
    },
    async tradeList(id) { return wedRechargeTradeList(await cookie(id)) },
    async gift(id, piece) { return wedRechargeGift(await cookie(id), piece) },
    async receive(id, token) { return wedRechargeReceive(await cookie(id), token) },
    async draw(id, round) { return wedRechargeDrawPicture({ cookie: await cookie(id), round: `dp${round}` }) },
    async redeem(id, round) { return wedRechargeReceiveCoupon(await cookie(id), round) },
  }
}
export async function queryPuzzlePool(owner: string, ids: string[], transport = puzzleTransport(owner)) {
  await assertOwnership(owner, ids)
  const pool: PuzzleSnapshot[] = []
  for (const id of ids) {
    try { pool.push(await transport.query(id)) }
    catch (e) {
      const code = e && typeof e === 'object' && 'code' in e ? String((e as { code?: unknown }).code) : 'UPSTREAM_ERROR'
      pool.push({ id, label: id.slice(0, 8), error: safeError(e), errorCode: code === 'RELOGIN_REQUIRED' ? 'RELOGIN_REQUIRED' : code === 'COOKIE_INVALID' ? 'COOKIE_INVALID' : 'UPSTREAM_ERROR', updatedAt: new Date().toISOString() })
    }
  }
  return pool
}
function safeError(error: unknown): string {
  return (error instanceof Error ? error.message : '操作失败').replace(/[a-f0-9]{32,}/gi, '[已隐藏]').replace(/\b1\d{10}\b/g, value => `${value.slice(0, 3)}****${value.slice(-4)}`).slice(0, 350)
}
export async function withPuzzleAccounts<T>(ids: string[], fn: () => Promise<T>): Promise<T> {
  const sorted = [...new Set(ids)].sort()
  const next = (index: number): Promise<T> => index === sorted.length ? fn() : withKeyLock(`account:${sorted[index]}`, () => next(index + 1))
  return next(0)
}

// Dependency-injected runner: tests exercise the exact state machine without upstream side effects.
export async function executePuzzleJob(job: PuzzleJob, io: PuzzleTransport, persist: () => Promise<void>, cancelled: () => Promise<boolean>) {
  const log = async (message: string) => {
    job.logs.push({ at: new Date().toISOString(), message })
    await persist()
  }
  const query = async (id: string) => {
    const row = await io.query(id)
    if (!row.info) throw new Error('未返回有效库存')
    job.pool = [...job.pool.filter(item => item.id !== id), row]
    return row.info
  }
  const label = (id: string) => job.pool.find(row => row.id === id)?.label || id.slice(0, 8)
  const stop = async () => {
    if (await cancelled()) { job.status = 'stopped'; await log('已停止；已完成的转赠和抽图不会撤销'); return true }
    return false
  }
  const reconcile = async () => {
    const pending = job.checkpoint
    if (!pending) return
    const after = await query(pending.to)
    const config = PUZZLE_ROUNDS[pending.round - 1]
    if (pending.kind === 'gift') {
      const index = Number(pending.piece!.split('_')[1])
      let sender = await query(pending.from!)
      let receiver = after
      const received = () => puzzleCount(receiver, pending.round, index) === puzzleCount(pending.before, pending.round, index) + 1 &&
        puzzleCount(sender, pending.round, index) === pending.fromBefore! - 1
      if (!received()) {
        if (!pending.token) throw new Error('生成转赠 Token 的结果不明，禁止重新生成；请在官方记录核实后结束此任务')
        if (puzzleCount(receiver, pending.round, index) !== puzzleCount(pending.before, pending.round, index) ||
          ![pending.fromBefore!, pending.fromBefore! - 1].includes(puzzleCount(sender, pending.round, index))) throw new Error('库存已被其他操作修改，请核对转赠记录')
        try {
          const piece = await io.receive(pending.to, pending.token)
          if (piece !== pending.piece) throw new Error('接收拼图编号与转赠不符')
        } catch (e) {
          sender = await query(pending.from!); receiver = await query(pending.to)
          if (!received()) throw e
        }
        sender = await query(pending.from!); receiver = await query(pending.to)
        if (!received()) throw new Error('赠送与接收未形成预期库存变化，已暂停核对')
      }
      job.transfersDone = (job.transfersDone || 0) + 1
      job.logs.push({ at: new Date().toISOString(), message: `${label(pending.from!)} → ${label(pending.to)}：${config.label} ${index + 1} 号 ×1，库存已核实` })
    } else if (pending.kind === 'draw') {
      if (puzzleCount(after, pending.round, config.rare) !== puzzleCount(pending.before, pending.round, config.rare) + 1 ||
        Number(after.drawTimes) !== Number(pending.before.drawTimes) - 1) throw new Error('未确认抽到稀有图，或抽取结果不明；已暂停，不会自动再次抽取')
      job.logs.push({ at: new Date().toISOString(), message: `${label(pending.to)}：已核实获得 ${config.label} ${config.rare + 1} 号稀有图` })
    } else if (pending.kind === 'redeem') {
      if (![3, 6, 7, 9].includes(after[config.status] ?? -1)) throw new Error('领券结果未确认，请核对官方奖品记录，不自动重试')
      job.logs.push({ at: new Date().toISOString(), message: `${label(pending.to)}：领券状态已更新` })
    } else {
      // External tokens are one-use. Replaying only the same token cannot create another gift.
      const gainedOne = (info: WedRechargePictureInfo) => {
        const changes = PUZZLE_ROUNDS.flatMap(c => Array.from({ length: c.size }, (_, i) => ({ piece: `dp${c.round}_${i}`, delta: puzzleCount(info, c.round, i) - puzzleCount(pending.before, c.round, i) }))).filter(row => row.delta !== 0)
        return changes.length === 1 && changes[0].delta === 1 && (!pending.piece || pending.piece === changes[0].piece)
      }
      let changed = gainedOne(after)
      if (!changed) {
        pending.piece = await io.receive(pending.to, pending.token!)
        await persist()
        const current = await query(pending.to)
        changed = gainedOne(current)
      }
      if (!changed) throw new Error('领取后未确认库存增加，请核对官方记录')
      job.completedTargets.push(pending.to)
      job.logs.push({ at: new Date().toISOString(), message: `${label(pending.to)}：分享拼图已接收并核实库存` })
    }
    job.checkpoint = undefined
    await persist()
  }
  const transfer = async (from: string, to: string, piece: string) => {
    const round = Number(piece[2]), index = Number(piece.split('_')[1])
    const sender = await query(from), receiver = await query(to)
    const count = puzzleCount(sender, round, index)
    const entry = (await io.tradeList(from)).find(row => row.prize === piece)
    if (count < 2 || !entry || entry.btnStatus !== 2 || entry.num !== count) throw new Error('赠送方库存不足或官方不允许赠送，已停止')
    job.checkpoint = { kind: 'gift', from, to, piece, round, before: receiver, fromBefore: count }
    await persist() // write-ahead journal before issuing a non-idempotent request
    job.checkpoint.token = await io.gift(from, piece)
    await persist()
    await reconcile()
  }
  try {
    job.status = 'running'; await persist()
    // On resume reconcile the old operation before considering any new mutation.
    await reconcile()
    if (await stop()) return
    for (const id of job.input.accountIds) {
      if (await stop()) return
      await query(id)
      await log(`库存同步 ${job.pool.length}/${job.input.accountIds.length}：${label(id)}`)
    }
    if (job.input.mode === 'receive') {
      if (!job.completedTargets.includes(job.input.to!)) {
        job.checkpoint = { kind: 'receive', to: job.input.to!, round: 1, before: await query(job.input.to!), token: job.input.token }
        await persist(); await reconcile()
      }
    } else if (job.input.mode === 'transfer') {
      // Count completed transfers in the journal, including a reconciled last operation.
      const done = job.transfersDone || 0
      for (let i = done; i < job.input.count!; i++) {
        if (await stop()) return
        await transfer(job.input.from!, job.input.to!, job.input.piece!)
      }
    } else {
      for (const target of job.input.targetIds) {
        if (job.completedTargets.includes(target)) continue
        for (let round = 1; round <= job.input.maxRound; round++) {
          if (await stop()) return
          // Earlier inventory may have unlocked/changed since the preview. Never execute a stale plan.
          // Pool inventories are kept current by each verified transfer. Refresh the target;
          // donors are checked again immediately before gifting, avoiding an O(N²) full-pool scan.
          await query(target)
          let plan = planPuzzleTarget(job.pool, target, round)
          const previous = PUZZLE_ROUNDS[round - 2]
          if (plan.reason && round > 1 && job.input.redeem) {
            const info = job.pool.find(row => row.id === target)!.info!
            if (info[PUZZLE_ROUNDS[round - 1].drawStatus] === 3 && info[previous.status] === 2 && roundComplete(info, round - 1)) {
              job.checkpoint = { kind: 'redeem', to: target, round: round - 1, before: info }
              await persist(); await io.redeem(target, round - 1); await reconcile()
              plan = planPuzzleTarget(job.pool, target, round)
            }
          }
          if (plan.complete) { await log(`${label(target)}：${PUZZLE_ROUNDS[round - 1].label} 已集齐，跳过`); continue }
          if (plan.reason) { await log(`${label(target)}：${PUZZLE_ROUNDS[round - 1].label} ${plan.reason}`); break }
          for (const move of plan.transfers) {
            for (let i = 0; i < move.count; i++) {
              if (await stop()) return
              await transfer(move.from, move.to, move.piece)
            }
          }
          if (plan.draw) {
            if (await stop()) return
            const before = await query(target)
            if (!ordinaryReady(before, round) || !canDrawPuzzle(before, round)) throw new Error('抽图前复查未满足普通图各 10 张、档位资格和次数条件')
            if (roundComplete(before, round)) continue
            job.checkpoint = { kind: 'draw', to: target, round, before }
            await persist()
            await io.draw(target, round)
            await reconcile()
          }
          if (!roundComplete(await query(target), round)) throw new Error('目标档位尚未集齐，已暂停核对')
        }
        if (roundComplete(await query(target), job.input.maxRound)) {
          job.completedTargets.push(target); await log(`${label(target)}：目标档位已完成`)
        }
      }
    }
    job.status = 'completed'
    await log(job.input.mode === 'auto' ? `队列结束，目标达成 ${job.completedTargets.length}/${job.input.targetIds.length}；未达成可刷新库存后重新规划` : '队列操作已完成')
  } catch (error) {
    job.status = 'paused'
    await log(`已暂停：${safeError(error)}`)
  }
}

function launch(job: PuzzleJob) {
  live.add(job.id)
  void withKeyLock('wed-puzzle-queue', () => withWedActivityLock(() => withPuzzleAccounts(job.input.accountIds, async () => {
    await executePuzzleJob(job, puzzleTransport(job.owner), () => save(job), async () => {
      const rows = await getPrisma().$queryRaw<{ cancel: boolean }[]>`SELECT cancel FROM "WedPuzzleJob" WHERE id=${job.id}`
      return !!rows[0]?.cancel
    })
  }), true)).catch(async () => { job.status = 'paused'; await save(job) }).finally(() => live.delete(job.id))
}
export async function createPuzzleJob(owner: string, input: PuzzleJobInput, id: string = crypto.randomUUID()) {
  await init()
  const existing = await readPuzzleJob(id, owner)
  if (existing) return existing
  const job: PuzzleJob = { id, owner, input, status: 'queued', logs: [], pool: [], completedTargets: [], createdAt: new Date().toISOString(), worker: wedWorker }
  try {
    await getPrisma().$executeRaw`INSERT INTO "WedPuzzleJob" (id, owner, status, payload) VALUES (${job.id}, ${owner}, ${job.status}, ${encryptJson(job)})`
  } catch {
    const duplicate = await readPuzzleJob(id, owner)
    if (duplicate) return duplicate
    throw new Error('任务未创建：请先处理已有未结束的号码池任务，或检查任务存储')
  }
  launch(job)
  return job
}
export async function controlPuzzleJob(owner: string, id: string, action: 'stop' | 'resume' | 'close') {
  return withKeyLock(`puzzle-control:${owner}`, async () => {
    const job = await readPuzzleJob(id, owner)
    if (!job) throw new Error('任务不存在')
    if (action === 'stop') {
      await getPrisma().$executeRaw`UPDATE "WedPuzzleJob" SET cancel=true WHERE id=${id}`
    } else if (action === 'close') {
      if (live.has(id) || ['queued', 'running'].includes(job.status)) throw new Error('请先停止执行中的队列')
      if (job.status !== 'paused') return job
      job.status = 'stopped'
      const closed = await getPrisma().$executeRaw`UPDATE "WedPuzzleJob" SET status='stopped', payload=${encryptJson(job)}, "updatedAt"=now() WHERE id=${id} AND status='paused'`
      if (!closed) throw new Error('任务状态已变化，请刷新后重试')
    } else {
      if (live.has(id) || job.status !== 'paused') throw new Error('任务当前不可恢复')
      await assertOwnership(owner, job.input.accountIds)
      const claimed = await getPrisma().$executeRaw`UPDATE "WedPuzzleJob" SET cancel=false, status='queued' WHERE id=${id} AND status='paused'`
      if (!claimed) throw new Error('任务已由其他窗口恢复')
      job.status = 'queued'; job.worker = wedWorker; await save(job); launch(job)
    }
    return job
  })
}
