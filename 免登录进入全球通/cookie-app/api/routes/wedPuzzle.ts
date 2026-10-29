import crypto from 'node:crypto'
import { Router } from 'express'
import { isAdminRequest } from '../services/serviceLoginGuard.js'
import { findCurrentUser, listUserAccountSummaries } from '../services/userAuthStore.js'
import { listAccountSummaries, getAccountById } from '../services/accountsStore.js'
import { findCurrentAdmin } from '../services/adminAuthStore.js'
import { toolboxBridgeHandler } from '../services/wedToolboxBridge.js'
import { parseWedReceiveToken } from '../services/wedRecharge.js'
import { PUZZLE_ROUNDS } from '../../shared/wedPuzzlePlanner.js'
import { withWedActivityLock } from '../services/wedActivityLock.js'
import { createPuzzleJob, controlPuzzleJob, latestPuzzleJob, publicPuzzleJob, publicSnapshot, queryPuzzlePool, withPuzzleAccounts, type PuzzleJobInput } from '../services/wedPuzzleJobs.js'

const router = Router()
router.all(['/toolbox/accounts', '/toolbox/accounts/:id/session'], toolboxBridgeHandler({
  admin: findCurrentAdmin, user: findCurrentUser,
  listAdmin: () => listAccountSummaries(), listUser: listUserAccountSummaries, account: getAccountById,
}))

export function validatePuzzleInput(body: Record<string, unknown>, allowed: Set<string>): PuzzleJobInput {
  const ids = (value: unknown) => Array.isArray(value) ? [...new Set(value.map(String))] : []
  const accountIds = ids(body.accountIds), targetIds = ids(body.targetIds)
  if (!accountIds.length || accountIds.length > 100 || accountIds.some(id => !allowed.has(id))) throw new Error('请选择 1–100 个有权限的账号')
  const mode = body.mode
  if (mode !== 'auto' && mode !== 'transfer' && mode !== 'receive') throw new Error('操作类型无效')
  const maxRound = Number(body.maxRound)
  if (![1, 2, 3].includes(maxRound)) throw new Error('档位无效')
  const input: PuzzleJobInput = { accountIds, targetIds, maxRound, redeem: body.redeem === true, mode }
  if (mode === 'auto') {
    if (!targetIds.length || targetIds.some(id => !accountIds.includes(id))) throw new Error('目标号码必须来自号码池')
  } else {
    input.to = String(body.to || '')
    if (!accountIds.includes(input.to)) throw new Error('接收号码必须来自号码池')
    if (mode === 'receive') input.token = parseWedReceiveToken(String(body.token || ''))
    else {
      input.from = String(body.from || ''); input.piece = String(body.piece || ''); input.count = Number(body.count)
      if (input.from === input.to || !accountIds.includes(input.from)) throw new Error('请选择不同的赠送与接收号码')
      const match = /^dp([123])_(\d)$/.exec(input.piece)
      if (!match || Number(match[2]) >= PUZZLE_ROUNDS[Number(match[1]) - 1].size) throw new Error('拼图编号无效')
      if (!Number.isInteger(input.count) || input.count < 1 || input.count > 100) throw new Error('单次转赠数量为 1–100 张')
    }
  }
  return input
}

router.all(['/', '/inventory', '/jobs', '/jobs/:id/:action'], async (req, res) => {
  const requestId = crypto.randomUUID()
  res.setHeader('Cache-Control', 'no-store')
  try {
    const admin = isAdminRequest(req)
    const user = admin ? null : await findCurrentUser(req)
    if (!admin && !user) {
      res.status(401).json({ ok: false, message: '请先登录账号中心', requestId }); return
    }
    const owner = admin ? 'admin' : `user:${user!.id}`
    const accounts = (admin ? await listAccountSummaries() : await listUserAccountSummaries(user!.id)).filter(row => !row.disabledAt)
    const allowed = new Set(accounts.map(row => row.id))
    let data: unknown
    if (req.method === 'GET' && req.path === '/') {
      data = { accounts: accounts.map(row => ({ id: row.id, label: (row.displayPhone || row.phoneMasked || row.phone || row.id.slice(0, 8)).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'), hasCookie: row.hasCookie, canRecover: Boolean(row.hasYunpanSession || row.qqtAccessToken) })), job: publicPuzzleJob(await latestPuzzleJob(owner)) }
    } else if (req.method === 'GET' && req.path === '/jobs') {
      data = { job: publicPuzzleJob(await latestPuzzleJob(owner)) }
    } else if (req.method === 'POST' && req.path === '/inventory') {
      const id = String(req.body?.accountId || '')
      if (!allowed.has(id)) { res.status(403).json({ ok: false, message: '账号不属于当前用户', requestId }); return }
      data = await withWedActivityLock(() => withPuzzleAccounts([id], async () => ({ rows: (await queryPuzzlePool(owner, [id])).map(publicSnapshot) })))
    } else if (req.method === 'POST' && req.path === '/jobs') {
      if (req.body?.confirmed !== true) throw new Error('请先确认转赠和抽图操作')
      const key = String(req.body?.idempotencyKey || '')
      if (!/^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i.test(key)) throw new Error('缺少有效的操作标识，请刷新重试')
      const input = validatePuzzleInput(req.body, allowed)
      const phones = new Set<string>()
      for (const id of input.accountIds) {
        const phone = accounts.find(row => row.id === id)?.phone
        if (!phone || !/^1\d{10}$/.test(phone)) continue
        if (phones.has(phone)) throw new Error('号码池包含重复手机号，请只保留一个登录记录，避免重复统计库存')
        phones.add(phone)
      }
      data = { job: publicPuzzleJob(await createPuzzleJob(owner, input, key)) }
    } else if (req.method === 'POST' && ['stop', 'resume', 'close'].includes(String(req.params.action))) {
      data = { job: publicPuzzleJob(await controlPuzzleJob(owner, String(req.params.id), req.params.action as 'stop' | 'resume' | 'close')) }
    } else { res.status(405).json({ ok: false, message: '不支持的请求', requestId }); return }
    res.json({ ok: true, data, requestId })
  } catch (e) {
    const message = e instanceof Error ? e.message : '拼图服务异常'
    // Do not leak DB connection strings / Prisma internals through API errors.
    res.status(400).json({ ok: false, message: /prisma|database|encryption|sql/i.test(message) ? '拼图任务存储不可用，请联系管理员' : message.slice(0, 350), requestId })
  }
})
export default router
