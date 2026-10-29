import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { type JobInput } from './engine.js'
import { Contexts } from './contexts.js'
import { authenticate, checkSource, sessionCookies, AccessError, type Identity } from './access.js'
import { config, planTransfers } from '../shared/puzzle.js'
import { parseWedReceiveToken } from './protocol/wedRecharge.js'
import { CookieAppBridge, newImportJob, runCookieAppImport } from './cookieAppImport.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const port = Number(process.env.PORT || 4186)
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('PORT 必须在 1024–65535 范围')
const contexts = new Contexts(process.env.WED_DATA_DIR || path.join(root, 'data'))
const base = '/wed-puzzle'
const publicOrigin = process.env.WED_PUBLIC_ORIGIN
if (publicOrigin && (new URL(publicOrigin).protocol !== 'https:' || new URL(publicOrigin).origin !== publicOrigin)) throw new Error('WED_PUBLIC_ORIGIN 必须是 HTTPS origin')
const authOrigin = process.env.WED_AUTH_ORIGIN || 'http://127.0.0.1:3101'
const app = express(), cooldown = new Map<string, number>()
app.disable('x-powered-by')
app.enable('strict routing')
app.use((req, res, next) => {
  if (!checkSource(req.headers.host || '', req.headers.origin, port, publicOrigin)) { res.status(403).json({ ok: false, message: '不允许此访问来源' }); return }
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('X-Frame-Options', 'DENY')
  if (req.path.startsWith('/api/') || req.path.startsWith(`${base}/api/`)) {
    res.setHeader('Cache-Control', 'no-store')
    if (!['/api/health', `${base}/api/health`].includes(req.path) && req.headers['x-wed-toolbox'] !== '1') { res.status(403).json({ ok: false, message: '请从工具箱页面操作' }); return }
  }
  next()
})
app.use(express.json({ limit: '512kb' }))
const wrap = (fn: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => (req: express.Request, res: express.Response, next: express.NextFunction) => { void fn(req, res, next).catch(next) }
function apiRouter(context: ReturnType<Contexts['get']>) {
const { store, client, engine } = context
const app = express.Router()
const send = (res: express.Response) => res.json({ ok: true, ...store.view(), importJob: store.state.importJob, busy: engine.busy, identity: res.locals.identity })
const start = (j: ReturnType<typeof findJob>, res: express.Response) => { context.verifyJob = res.locals.verify; engine.start(j) }
const phoneOf = (input: unknown) => { const p = String(input || '').trim(); if (!/^1\d{10}$/.test(p)) throw new Error('请输入正确的 11 位手机号'); return p }
const idsOf = (input: unknown) => { if (!Array.isArray(input) || input.some(i => typeof i !== 'string') || input.length > 100) throw new Error('号码选择格式错误'); return [...new Set(input)] as string[] }
const findJob = (id: string) => { const j = store.state.jobs.find(j => j.id === id); if (!j) throw new Error('任务不存在'); return j }

app.get('/api/state', (_req, res) => { send(res) })
app.post('/api/accounts/import-cookieapp', wrap(async (req, res) => {
  const cookie = sessionCookies(req.headers.cookie), identity = await authenticate(cookie, authOrigin)
  if (identity.key !== res.locals.identity.key) throw new AccessError(401, '请从已登录的 home 站点使用账号导入功能')
  const bridge = new CookieAppBridge(identity, cookie, authOrigin)
  if (store.state.importJob?.status === 'running') { send(res); return }
  if (engine.busy) throw new Error('串行队列正在执行，请等待当前操作完成')
  // Reserve the same global lock used by activity operations before replying.
  const work = engine.exclusive(async () => {
    const job = newImportJob(); store.state.importJob = job; store.save()
    await runCookieAppImport(job, {
      list: () => bridge.list(), credential: candidate => bridge.credential(candidate), verify: () => bridge.verify(),
      add: (credential, phone) => client.importCookieApp(credential, phone),
      exists: phone => store.state.accounts.some(a => a.phone === phone), save: () => store.save(),
    })
  })
  void work.catch(() => {
    if (store.state.importJob?.status === 'running') { store.state.importJob.status = 'interrupted'; store.state.importJob.message = '导入中断，已导入号码保留'; store.save() }
  })
  send(res)
}))
app.post('/api/auth/sms', wrap(async (req, res) => {
  const phone = phoneOf(req.body?.phone), until = cooldown.get(phone) || 0
  if (until > Date.now()) { res.status(429).json({ ok: false, message: `请等待 ${Math.ceil((until - Date.now()) / 1000)} 秒再发送` }); return }
  await engine.exclusive(async () => { await client.sms(phone); cooldown.set(phone, Date.now() + 60000) })
  res.json({ ok: true, cooldownSeconds: 60 })
}))
app.post('/api/auth/login', wrap(async (req, res) => {
  const phone = phoneOf(req.body?.phone), code = String(req.body?.code || '').trim()
  if (!/^\d{6}$/.test(code)) throw new Error('请输入 6 位验证码')
  await engine.exclusive(() => client.login(phone, code)); send(res)
}))
app.post('/api/auth/import', wrap(async (req, res) => {
  const input = String(req.body?.input || ''), phone = req.body?.phone ? phoneOf(req.body.phone) : undefined
  await engine.exclusive(() => client.import(input, phone)); send(res)
}))
app.post('/api/accounts/refresh', wrap(async (req, res) => {
  const ids = idsOf(req.body?.ids)
  await engine.exclusive(async () => { for (const id of ids) { store.account(id); try { await client.query(id) } catch { /* Return each account's error and retained data. */ } } }); send(res)
}))
app.delete('/api/accounts/:id', wrap(async (req, res) => {
  const id = String(req.params.id)
  await engine.exclusive(async () => {
    if (store.state.jobs.some(j => ['running', 'paused'].includes(j.status) && (j.to === id || j.donors.includes(id)))) throw new Error('此号码仍被未结束任务引用，请先结束任务')
    store.account(id); store.state.accounts = store.state.accounts.filter(a => a.id !== id); store.save()
  }); send(res)
}))
app.get('/api/accounts/:id/tasks', wrap(async (req, res) => {
  const tasks = await engine.exclusive(async () => { await client.query(String(req.params.id)); return client.tasks(String(req.params.id)) })
  res.json({ ok: true, tasks: tasks.map(({ raw: _raw, jumpUrl: _url, ...t }) => t) })
}))
app.post('/api/plan', wrap(async (req, res) => {
  const donors = idsOf(req.body?.donors), to = String(req.body?.to || ''), round = Number(req.body?.round)
  config(round); const mode = req.body?.mode === 'all' ? 'all' : 'fill'
  const plan = await engine.exclusive(async () => { for (const id of [...new Set([...donors, to])]) await client.query(id); return planTransfers(store.view().accounts, donors, to, round, mode, req.body?.autoAdvance === true) })
  res.json({ ok: true, plan, ...store.view(), busy: engine.busy, identity: res.locals.identity })
}))
app.post('/api/relay/preview', wrap(async (req, res) => {
  const scope = idsOf(req.body?.scope), targets = idsOf(req.body?.targets), start = Number(req.body?.start), end = Number(req.body?.end)
  const relay = await engine.previewRelay(scope, targets, start, end)
  res.json({ ok: true, relay, ...store.view(), busy: engine.busy, identity: res.locals.identity })
}))
app.post('/api/jobs', wrap(async (req, res) => {
  const body = req.body || {}, requestId = String(body.requestId || '')
  if (!/^[0-9a-f-]{36}$/i.test(requestId)) throw new Error('缺少有效任务幂等标识')
  if (!['transfer', 'relay', 'daily', 'receive', 'redeem', 'draw'].includes(body.kind)) throw new Error('任务类型无效')
  const kind = body.kind as JobInput['kind'], donors = idsOf(body.donors || []), to = kind === 'relay' ? '' : String(body.to || ''), round = Number(body.round || 1)
  config(round)
  if (!['daily', 'relay'].includes(kind)) store.account(to)
  const relayTargets = kind === 'relay' ? idsOf(body.relayTargets) : undefined
  const relayEnd = kind === 'relay' ? Number(body.relayEnd) : undefined
  const expectedRevision = kind === 'relay' ? String(body.expectedRevision || '') : undefined
  if (kind === 'relay' && !/^[a-f0-9]{64}$/.test(expectedRevision!)) throw new Error('请先核对接力库存与预览')
  let tokens: string[] | undefined
  if (kind === 'receive') { if (!Array.isArray(body.links) || !body.links.length || body.links.length > 500) throw new Error('请提供 1–500 个转赠链接'); tokens = [...new Set<string>((body.links as unknown[]).map(s => parseWedReceiveToken(String(s))))] }
  const expectedTransfers = kind === 'transfer' && Array.isArray(body.expectedTransfers) ? body.expectedTransfers : undefined
  const taskFilter = body.taskFilter === undefined ? undefined : idsOf(body.taskFilter)
  if (taskFilter && (!taskFilter.length || taskFilter.some(id => !id || id.length > 128))) throw new Error('任务编号格式错误')
  const j = await engine.create({ kind, donors, to, round, mode: body.mode === 'all' ? 'all' : 'fill', autoDraw: body.autoDraw === true, autoAdvance: kind === 'transfer' && body.autoAdvance === true, relayTargets, relayEnd, expectedRevision, fastTasks: body.fastTasks !== false, taskFilter, tokens, requestId, expectedTransfers })
  if (j.status === 'paused' && !j.logs.some(l => l.message !== '任务已进入串行队列')) start(j, res)
  send(res)
}))
app.post('/api/jobs/:id/:action', wrap(async (req, res) => {
  const j = findJob(String(req.params.id)), action = String(req.params.action)
  if (action === 'pause') engine.stop(j)
  else if (action === 'resume') start(j, res)
  else if (action === 'finish') engine.abandon(j)
  else throw new Error('操作无效')
  send(res)
}))
app.get('/api/jobs/:id/pending-link', wrap(async (req, res) => {
  const j = findJob(String(req.params.id)), p = j.checkpoint
  if (!p?.token || !['gift', 'receive'].includes(p.kind)) throw new Error('当前没有可恢复的转赠链接')
  res.json({ ok: true, link: `https://wx.10086.cn/hlwyxhdhub/act-wedrecharge/1024101716?giveCard=${encodeURIComponent(p.token)}` })
}))
app.use('/api', (_req, res) => { res.status(404).json({ ok: false, message: '接口不存在' }) })
return app
}
const routers = new Map<string, ReturnType<typeof apiRouter>>()
const apiAccess = wrap(async (req, res, next) => {
  const isPublic = !!publicOrigin && req.headers.host === new URL(publicOrigin).host
  const cookie = sessionCookies(req.headers.cookie)
  const identity: Identity = isPublic ? await authenticate(cookie, authOrigin) : { key: 'local', kind: 'local', name: '本机号码池' }
  res.locals.identity = identity
  res.locals.verify = isPublic ? async () => { if ((await authenticate(cookie, authOrigin)).key !== identity.key) throw new AccessError(401, '账号身份已变化，任务已暂停') } : undefined
  const context = contexts.get(identity)
  if (!context.store.state.jobs.some(j => j.status === 'running')) context.verifyJob = res.locals.verify
  let router = routers.get(identity.key)
  if (!router) { router = apiRouter(context); routers.set(identity.key, router) }
  router(req, res, next)
})
app.get([`${base}/api/health`, '/api/health'], (_req, res) => { res.json({ ok: true, service: 'wed-puzzle-toolbox', features: ['pool-relay'] }) })
// Keep the /api prefix inside the router; remove only the deployment base.
app.use(base, (req, res, next) => { if (req.path.startsWith('/api/')) apiAccess(req, res, next); else next() })
app.use('/api/', (req, res, next) => { req.url = `/api${req.url}`; apiAccess(req, res, next) })
app.get(['/', base], (_req, res) => { res.redirect(302, `${base}/`) })
app.use(base, express.static(path.join(root, 'dist'), { index: 'index.html', etag: true, maxAge: 0, setHeaders: (res, file) => { if (file.endsWith('.html')) res.setHeader('Cache-Control', 'no-store') } }))
app.get(`${base}/*`, (_req, res) => { res.setHeader('Cache-Control', 'no-store'); res.sendFile(path.join(root, 'dist/index.html')) })
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  let message = error instanceof Error ? error.message : '操作失败'
  message = message.replace(/https?:\/\/\S+/g, '[接口地址]').replace(/(?:Cookie|token|sid|password)\s*[=:]\s*[^\s,;]+/gi, '[凭证已隐藏]').slice(0, 260)
  res.status(error instanceof AccessError ? error.status : 400).json({ ok: false, message })
})
const server = app.listen(port, '127.0.0.1', () => { console.log(`周三拼图互助工具箱：http://127.0.0.1:${port}`) })
server.on('error', () => { contexts.close(); process.exitCode = 1 })
process.once('exit', () => contexts.close())
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.once(signal, () => {
  contexts.stop()
  server.close(() => process.exit(0))
  // If an upstream request is interrupted, its persisted checkpoint is reconciled on next launch.
  setTimeout(() => process.exit(0), 20000).unref()
})
