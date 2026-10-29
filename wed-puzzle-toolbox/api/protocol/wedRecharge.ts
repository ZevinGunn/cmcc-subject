import { httpsRequestText } from './cmccHttp.js'

const WED_BASE = 'https://wx.10086.cn'
const WED_ACTIVITY_ID = '1024101716'
const WED_BIND_REFERER = `${WED_BASE}/website/bind/bindAccount/new`
const WED_UA =
  'Mozilla/5.0 (iPad; CPU OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148/wkwebview leadeon/12.1.0/CMCCIT'
const WED_PAGE_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'

export type WedRechargePictureInfo = {
  activeIndex?: number
  drawTimes?: string
  pictureList?: Record<string, Record<string, string>>
  r4Status?: number
  r5Status?: number
  r6Status?: number
  r4DrawStatus?: number
  r5DrawStatus?: number
  r6DrawStatus?: number
  cardNo?: string
  raw: unknown
}

export type WedRechargeDrawResult = {
  receiveTime?: string
  prize?: {
    prizeId?: string
    prizeName?: string
    shortName?: string
    img?: string
    expire?: number
    raw: unknown
  }
  raw: unknown
}

export type WedRechargeTask = {
  order: number
  taskId: string
  title: string
  description?: string
  taskDate?: string
  taskType?: string
  status?: number
  buttonText?: string
  requireTimes?: number
  completedTimes?: number
  addDrawTimes?: number
  jumpUrl?: string
  raw: unknown
}

export type WedRechargeTaskPlanItem = {
  task: WedRechargeTask
  runTimes: number
}

export type WedRechargeSkippedTask = {
  task: WedRechargeTask
  reason: string
}

export type WedRechargeTaskPlan = {
  runnable: WedRechargeTaskPlanItem[]
  skipped: WedRechargeSkippedTask[]
}

export type WedRechargeOpenTaskInfo = {
  cToken: string
  scanTimeSeconds: number
  finishDesc?: string
  errorDesc?: string
  unfinishedPageToast?: string
  backUrl?: string
  iconUrl?: string
  raw: unknown
}

export type WedRechargeOpenFinishResult = {
  code?: string
  msg?: string
  message: string
  raw: unknown
}

export type WedRechargeFinishTaskResult = {
  code?: string
  msg?: string
  message: string
  addDrawTimes?: number
  raw: unknown
}

export type WedRechargeTaskStrategy =
  | 'directFinish'
  | 'openPlugin'
  | 'unsupported'

export type WedRechargeSession = {
  cookie: string
  token?: string
  updated: boolean
}

function headers(args: {
  cookie: string
  referer: string
  accept?: string
  extra?: Record<string, string>
}): Record<string, string> {
  return {
    Host: 'wx.10086.cn',
    Accept: args.accept ?? 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Content-Type': 'application/json;charset=UTF-8',
    Origin: WED_BASE,
    Referer: args.referer,
    'User-Agent': WED_UA,
    Cookie: args.cookie,
    'login-check': '1',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    ...args.extra,
  }
}

function parseCookie(cookie: string): Map<string, string> {
  const out = new Map<string, string>()
  for (const part of String(cookie || '').split(';')) {
    const index = part.indexOf('=')
    if (index <= 0) continue
    const key = part.slice(0, index).trim()
    const value = part.slice(index + 1).trim()
    if (key) out.set(key, value)
  }
  return out
}

function formatCookie(cookieMap: Map<string, string>): string {
  return Array.from(cookieMap.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join('; ')
}

function stripWedRechargeSessionToken(cookie: string): string {
  const cookieMap = parseCookie(cookie)
  cookieMap.delete('HLWHD_SESSION_TOKEN')
  return formatCookie(cookieMap)
}

function mergeSetCookie(cookieMap: Map<string, string>, setCookie: string[] | string | undefined): boolean {
  const list = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : []
  let changed = false
  for (const item of list) {
    const first = String(item).split(';', 1)[0]
    const index = first.indexOf('=')
    if (index <= 0) continue
    const key = first.slice(0, index).trim()
    const value = first.slice(index + 1).trim()
    if (!key) continue
    if (cookieMap.get(key) !== value) changed = true
    cookieMap.set(key, value)
  }
  return changed
}

function resolveRedirectUrl(baseUrl: string, location: string | string[] | undefined): string {
  const raw = Array.isArray(location) ? location[0] : location
  if (!raw) return ''
  try {
    return new URL(raw, baseUrl).toString()
  } catch {
    return ''
  }
}

function extractTokenFromUrl(url: string): string | undefined {
  try {
    return new URL(url).searchParams.get('token') || undefined
  } catch {
    return undefined
  }
}

export async function prepareWedRechargeSession(args: {
  cookie: string
  forceRefresh?: boolean
}): Promise<WedRechargeSession> {
  const baseCookie = args.forceRefresh ? stripWedRechargeSessionToken(args.cookie) : args.cookie
  const cookieMap = parseCookie(baseCookie)
  if (cookieMap.has('HLWHD_SESSION_TOKEN') && !args.forceRefresh) {
    return { cookie: args.cookie, updated: false }
  }

  let url = `${WED_BASE}/hlwyxhdhub/act-wedrecharge/${WED_ACTIVITY_ID}`
  let referer = WED_BIND_REFERER
  let updated = false
  let token: string | undefined

  for (let step = 0; step < 8; step += 1) {
    const res = await httpsRequestText({
      url,
      method: 'GET',
      headers: {
        Cookie: formatCookie(cookieMap),
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'User-Agent': WED_PAGE_UA,
        Referer: referer,
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Dest': 'document',
      },
      timeoutMs: 15000,
    })

    if (mergeSetCookie(cookieMap, res.headers['set-cookie'])) {
      updated = true
    }

    const currentToken = extractTokenFromUrl(url)
    if (currentToken) token = currentToken

    if (res.statusCode >= 300 && res.statusCode < 400) {
      const nextUrl = resolveRedirectUrl(url, res.headers.location)
      if (!nextUrl) break
      referer = url
      url = nextUrl
      continue
    }

    break
  }

  return {
    cookie: formatCookie(cookieMap),
    token,
    updated,
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown
  } catch {
    return { raw: text }
  }
}

function getString(obj: unknown, key: string): string | undefined {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return undefined
  const value = (obj as Record<string, unknown>)[key]
  if (typeof value === 'string') return value
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return undefined
}

function getObject(obj: unknown, key: string): Record<string, unknown> | undefined {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return undefined
  const value = (obj as Record<string, unknown>)[key]
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  return value as Record<string, unknown>
}

function getArray(obj: unknown, key: string): unknown[] | undefined {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return undefined
  const value = (obj as Record<string, unknown>)[key]
  return Array.isArray(value) ? value : undefined
}

function getNumber(obj: unknown, key: string): number | undefined {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return undefined
  const value = (obj as Record<string, unknown>)[key]
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

function upstreamMessage(payload: unknown): string {
  const code = getString(payload, 'code') || getString(payload, 'status')
  const msg = getString(payload, 'msg') || getString(payload, 'message')
  if (code === 'GOTO_LOGIN') {
    return '活动接口提示需要登录，已尝试通过 10086 CK 刷新活动会话仍失败，请确认当前 10086 CK 是否有效'
  }
  if (msg || code) return [code, msg].filter(Boolean).join(': ')
  return '周三拼图接口返回异常'
}

export class WedBusinessError extends Error {
  constructor(readonly code: string, message: string) { super(message); this.name = 'WedBusinessError' }
}
function ensureSuccess(payload: unknown, okCodes: string[]): void {
  const code = getString(payload, 'code')
  if (code && okCodes.includes(code)) return
  if (code) throw new WedBusinessError(code, upstreamMessage(payload))
  throw new Error(upstreamMessage(payload))
}

function decodeMaybeBase64Json(text: string): unknown {
  const parsed = safeJson(text)
  if (
    parsed &&
    typeof parsed === 'object' &&
    !Array.isArray(parsed) &&
    !Object.prototype.hasOwnProperty.call(parsed, 'raw')
  ) {
    return parsed
  }
  const trimmed = String(text || '').trim()
  if (!trimmed || !/^[A-Za-z0-9+/]+={0,2}$/.test(trimmed)) return parsed
  try {
    return JSON.parse(Buffer.from(trimmed, 'base64').toString('utf8')) as unknown
  } catch {
    return parsed
  }
}

async function postJson(args: {
  url: string
  cookie: string
  referer: string
  body: Record<string, unknown>
  accept?: string
  extraHeaders?: Record<string, string>
}): Promise<unknown> {
  const body = JSON.stringify(args.body)
  const res = await httpsRequestText({
    url: args.url,
    method: 'POST',
    headers: headers({
      cookie: args.cookie,
      referer: args.referer,
      accept: args.accept,
      extra: {
        'Content-Length': Buffer.byteLength(body).toString(),
        ...(args.extraHeaders ?? {}),
      },
    }),
    body,
    timeoutMs: 15000,
  })
  if (res.statusCode < 200 || res.statusCode >= 300) {
    throw new Error(`周三拼图接口 HTTP ${res.statusCode}`)
  }
  return decodeMaybeBase64Json(res.bodyText)
}

async function postJsonOrBase64Json(args: {
  url: string
  cookie: string
  referer: string
  body: Record<string, unknown>
  accept?: string
  extraHeaders?: Record<string, string>
}): Promise<unknown> {
  const body = JSON.stringify(args.body)
  const res = await httpsRequestText({
    url: args.url,
    method: 'POST',
    headers: headers({
      cookie: args.cookie,
      referer: args.referer,
      accept: args.accept,
      extra: {
        'Content-Length': Buffer.byteLength(body).toString(),
        ...(args.extraHeaders ?? {}),
      },
    }),
    body,
    timeoutMs: 15000,
  })
  if (res.statusCode < 200 || res.statusCode >= 300) {
    throw new Error(`周三拼图接口 HTTP ${res.statusCode}`)
  }
  return decodeMaybeBase64Json(res.bodyText)
}

function normalizeTask(item: unknown): WedRechargeTask | null {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return null
  const taskId = getString(item, 'taskId')?.trim() || ''
  if (!taskId) return null
  return {
    order: getNumber(item, 'order') ?? 999,
    taskId,
    title: getString(item, 'title')?.trim() || taskId,
    description: getString(item, 'description'),
    taskDate: getString(item, 'taskDate'),
    taskType: getString(item, 'taskType'),
    status: getNumber(item, 'status'),
    buttonText: getString(item, 'buttontxt') ?? getString(item, 'buttontext'),
    requireTimes: getNumber(item, 'requireTimes'),
    completedTimes: getNumber(item, 'completedTimes'),
    addDrawTimes: getNumber(item, 'addDrawTimes'),
    jumpUrl: getString(item, 'jumpUrl'),
    raw: item,
  }
}

function normalizePictureInfoData(data: unknown, raw: unknown): WedRechargePictureInfo {
  const obj = data && typeof data === 'object' && !Array.isArray(data) ? data : {}
  const pictureList = getObject(obj, 'pictureList')
  return {
    activeIndex: getNumber(obj, 'activeIndex'),
    drawTimes: getString(obj, 'drawTimes'),
    pictureList: pictureList as Record<string, Record<string, string>> | undefined,
    r4Status: getNumber(obj, 'r4Status'),
    r5Status: getNumber(obj, 'r5Status'),
    r6Status: getNumber(obj, 'r6Status'),
    r4DrawStatus: getNumber(obj, 'r4DrawStatus'),
    r5DrawStatus: getNumber(obj, 'r5DrawStatus'),
    r6DrawStatus: getNumber(obj, 'r6DrawStatus'),
    cardNo: getString(obj, 'cardNo'),
    raw,
  }
}

export function selectWedRechargeRunnableTasks(args: {
  tasks: WedRechargeTask[]
  now?: Date
}): WedRechargeTask[] {
  return planWedRechargeTasks(args).runnable.map((item) => item.task)
}

export function planWedRechargeTasks(args: {
  tasks: WedRechargeTask[]
  now?: Date
}): WedRechargeTaskPlan {
  void args.now
  const runnable: WedRechargeTaskPlanItem[] = []
  const skipped: WedRechargeSkippedTask[] = []

  for (const task of args.tasks
    .slice()
    .sort((a, b) => a.order - b.order)) {
    if (task.status !== 0) {
      skipped.push({ task, reason: task.buttonText || '当前不可执行或已完成' })
      continue
    }
    const strategy = resolveWedRechargeTaskStrategy(task)
    if (strategy === 'unsupported') {
      skipped.push({ task, reason: `暂不支持的任务类型 ${task.taskType || 'unknown'}` })
      continue
    }
    runnable.push({ task, runTimes: 1 })
  }

  return { runnable, skipped }
}

export function resolveWedRechargeTaskRunTimes(task: WedRechargeTask): number {
  const plan = planWedRechargeTasks({ tasks: [task] })
  return plan.runnable[0]?.runTimes ?? 0
}

export function resolveWedRechargeTaskStrategy(
  task: Pick<WedRechargeTask, 'taskType'>,
): WedRechargeTaskStrategy {
  const type = String(task.taskType || '').trim()
  if (type === '1' || type === '2' || type === '3' || type === '5' || type === '6') {
    return 'directFinish'
  }
  if (type === '4') return 'openPlugin'
  return 'unsupported'
}

export const __test__ = {
  stripWedRechargeSessionToken,
  resolveWedRechargeTaskStrategy,
  normalizeTask,
  normalizePictureInfoData,
}

export async function wedRechargeTaskList(args: {
  cookie: string
}): Promise<WedRechargeTask[]> {
  const session = await prepareWedRechargeSession({ cookie: args.cookie })
  const payload = await postJsonOrBase64Json({
    url: `${WED_BASE}/hlwyxhdhub/api/wedrecharge/taskList`,
    cookie: session.cookie,
    referer: WED_BIND_REFERER,
    body: {},
  })
  ensureSuccess(payload, ['0'])
  return (getArray(payload, 'data') ?? [])
    .map(normalizeTask)
    .filter((task): task is WedRechargeTask => Boolean(task))
    .sort((a, b) => a.order - b.order)
}

export async function wedRechargeQueryPictureInfo(args: {
  cookie: string
  token?: string
}): Promise<WedRechargePictureInfo> {
  const session = await prepareWedRechargeSession({ cookie: args.cookie })
  const payload = await postJson({
    url: `${WED_BASE}/hlwyxhdhub/api/wedrecharge/queryPictureActInfo`,
    cookie: session.cookie,
    referer: WED_BIND_REFERER,
    body: {},
  })
  ensureSuccess(payload, ['0'])
  return normalizePictureInfoData(getObject(payload, 'data'), payload)
}

export async function wedRechargeGetJtToken(args: {
  cookie: string
  taskId: string
  activityId?: string
}): Promise<string> {
  const session = await prepareWedRechargeSession({ cookie: args.cookie })
  const payload = await postJson({
    url: `${WED_BASE}/hlwyxhdhub/api/wedrecharge/getJtToken`,
    cookie: session.cookie,
    referer: WED_BIND_REFERER,
    body: {
      taskId: args.taskId,
      activityId: args.activityId || WED_ACTIVITY_ID,
    },
  })
  ensureSuccess(payload, ['0'])
  const token = getString(payload, 'data')
  if (!token) throw new Error('未获取到 jtToken')
  return token
}

export async function wedRechargeGetOpenTaskInfo(args: {
  cookie: string
  jtToken: string
  referer?: string
}): Promise<WedRechargeOpenTaskInfo> {
  const session = await prepareWedRechargeSession({ cookie: args.cookie })
  const payload = await postJson({
    url: `${WED_BASE}/hlwyxhdhub/api/open/_pub/task/getOneTaskInfo`,
    cookie: session.cookie,
    referer: args.referer || WED_BIND_REFERER,
    body: { jtToken: args.jtToken },
    accept: '*/*',
    extraHeaders: { 'x-requested-with': 'XMLHttpRequest' },
  })
  ensureSuccess(payload, ['SUCCESS'])
  const data = getObject(payload, 'data')
  const cToken = getString(data, 'cToken')
  if (!cToken) throw new Error('未获取到 cToken')
  const scanTimeSeconds = getNumber(data, 'scanTime')
  if (scanTimeSeconds === undefined || scanTimeSeconds < 0) {
    throw new Error('任务接口未返回有效 scanTime')
  }
  return {
    cToken,
    scanTimeSeconds: Math.min(300, Math.ceil(scanTimeSeconds)),
    finishDesc: getString(data, 'finishDesc'),
    errorDesc: getString(data, 'errorDesc'),
    unfinishedPageToast: getString(data, 'unfinishedPageToast'),
    backUrl: getString(data, 'backUrl'),
    iconUrl: getString(data, 'iconUrl'),
    raw: payload,
  }
}

export async function wedRechargeGetCToken(args: {
  cookie: string
  jtToken: string
  referer?: string
}): Promise<string> {
  return (await wedRechargeGetOpenTaskInfo(args)).cToken
}

export async function wedRechargeGetShareToken(args: {
  cookie: string
  taskId: string
}): Promise<string> {
  const session = await prepareWedRechargeSession({ cookie: args.cookie })
  const payload = await postJson({
    url: `${WED_BASE}/hlwyxhdhub/api/wedrecharge/getShareToken`,
    cookie: session.cookie,
    referer: WED_BIND_REFERER,
    body: { taskId: args.taskId },
  })
  ensureSuccess(payload, ['0'])
  const token = getString(payload, 'data')
  if (!token) throw new Error('未获取到业务跳转 Token')
  return token
}

export function buildWedRechargeExternalBusinessUrl(args: {
  task: Pick<WedRechargeTask, 'taskId' | 'jumpUrl'>
  shareToken: string
}): string {
  const raw = String(args.task.jumpUrl || '').trim()
  if (!raw) throw new Error('任务未配置 jumpUrl')
  const url = new URL(raw)
  url.searchParams.set(args.task.taskId, args.shareToken)
  return url.toString()
}

export async function wedRechargeOpenFinish(args: {
  cookie: string
  jtToken: string
  cToken: string
  referer?: string
}): Promise<WedRechargeOpenFinishResult> {
  const session = await prepareWedRechargeSession({ cookie: args.cookie })
  const payload = await postJson({
    url: `${WED_BASE}/hlwyxhdhub/api/open/_pub/task/openFinish`,
    cookie: session.cookie,
    referer: args.referer || WED_BIND_REFERER,
    body: { cToken: args.cToken },
    accept: '*/*',
    extraHeaders: { 'x-requested-with': 'XMLHttpRequest' },
  })
  ensureSuccess(payload, ['SUCCESS'])
  const code = getString(payload, 'code')
  const msg = getString(payload, 'msg') || getString(payload, 'message')
  return {
    code,
    msg,
    message: [code, msg].filter(Boolean).join(': ') || 'SUCCESS',
    raw: payload,
  }
}

export async function wedRechargeAppendYdrzToken(args: {
  cookie: string
  targetUrl: string
}): Promise<string | undefined> {
  const session = await prepareWedRechargeSession({ cookie: args.cookie })
  const payload = await postJson({
    url: `${WED_BASE}/hlwyxhdhub/user/appendYDRZToken`,
    cookie: session.cookie,
    referer: WED_BIND_REFERER,
    body: {
      iconPosition: '',
      targetUrl: args.targetUrl,
    },
  })
  ensureSuccess(payload, ['SUCCESS'])
  return getString(payload, 'data')
}

export async function wedRechargeFinishTask(args: {
  cookie: string
  taskId: string
}): Promise<WedRechargeFinishTaskResult> {
  const session = await prepareWedRechargeSession({ cookie: args.cookie })
  const payload = await postJson({
    url: `${WED_BASE}/hlwyxhdhub/api/wedrecharge/finishTask`,
    cookie: session.cookie,
    referer: WED_BIND_REFERER,
    body: { taskId: args.taskId },
  })
  ensureSuccess(payload, ['0'])
  const data = getObject(payload, 'data')
  const code = getString(payload, 'code')
  const msg = getString(payload, 'msg') || getString(payload, 'message')
  return {
    code,
    msg,
    message: [code, msg].filter(Boolean).join(': ') || 'success',
    addDrawTimes: data ? getNumber(data, 'addDrawTimes') : undefined,
    raw: payload,
  }
}

export async function wedRechargeDrawPicture(args: {
  cookie: string
  round: string
  token?: string
}): Promise<WedRechargeDrawResult> {
  const session = await prepareWedRechargeSession({ cookie: args.cookie })
  const payload = await postJson({
    url: `${WED_BASE}/hlwyxhdhub/api/wedrecharge/drawPicture`,
    cookie: session.cookie,
    referer: WED_BIND_REFERER,
    body: { round: args.round },
  })
  ensureSuccess(payload, ['0'])
  const data = getObject(payload, 'data') ?? {}
  const prize = getObject(data, 'prize')
  return {
    receiveTime:
      typeof data.receiveTime === 'string' ? data.receiveTime : undefined,
    prize: prize
      ? {
          prizeId: typeof prize.prizeId === 'string' ? prize.prizeId : undefined,
          prizeName:
            typeof prize.prizeName === 'string' ? prize.prizeName : undefined,
          shortName:
            typeof prize.shortName === 'string' ? prize.shortName : undefined,
          img: typeof prize.img === 'string' ? prize.img : undefined,
          expire: typeof prize.expire === 'number' ? prize.expire : undefined,
          raw: prize,
        }
      : undefined,
    raw: payload,
  }
}

export function resolveWedRechargeRound(info?: WedRechargePictureInfo): string {
  const activeIndex = Number(info?.activeIndex)
  if (Number.isInteger(activeIndex) && activeIndex >= 1 && activeIndex <= 3) {
    return `dp${Math.floor(activeIndex)}`
  }
  throw new Error('未获取到有效的当前拼图档位')
}

// These endpoints use plain JSON (not the App login encryption protocol).
async function puzzlePost(cookie: string, endpoint: string, body: Record<string, unknown>) {
  const session = await prepareWedRechargeSession({ cookie })
  const payload = await postJson({ url: `${WED_BASE}/hlwyxhdhub/api/wedrecharge/${endpoint}`,
    cookie: session.cookie, referer: `${WED_BASE}/hlwyxhdhub/act-wedrecharge/${WED_ACTIVITY_ID}`, body })
  ensureSuccess(payload, ['0'])
  return payload
}

export type WedTradePiece = { prize: string; num: number; btnStatus: number; name: string }
export async function wedRechargeTradeList(cookie: string): Promise<WedTradePiece[]> {
  const payload = await puzzlePost(cookie, 'tradePuzzleList', {})
  const data = getObject(payload, 'data')
  if (!data) throw new Error('拼图转赠列表缺失')
  return ['dp1', 'dp2', 'dp3'].flatMap(round => {
    const rows = data[round]
    if (!Array.isArray(rows)) return []
    return rows.map(row => ({ prize: getString(row, 'prize') || '', num: getNumber(row, 'num') ?? -1,
      btnStatus: getNumber(row, 'btnStatus') ?? -1, name: getString(row, 'name') || '' }))
  })
}

export function parseWedGiftToken(payload: unknown): string {
  ensureSuccess(payload, ['0'])
  const nested = getObject(payload, 'data')
  ensureSuccess(nested, ['0']) // HAR: success is nested twice; outer success is insufficient.
  const token = getString(nested, 'data') || ''
  if (!/^[a-fA-F0-9]{32,512}$/.test(token)) throw new Error('转赠接口未返回有效 Token')
  return token
}

export async function wedRechargeGift(cookie: string, puzzleName: string): Promise<string> {
  if (!/^dp[123]_\d$/.test(puzzleName)) throw new Error('拼图编号无效')
  return parseWedGiftToken(await puzzlePost(cookie, 'tradePuzzleToken', { type: 2, puzzleName }))
}

export function parseWedReceiveToken(input: string): string {
  let token = input.trim()
  if (token.startsWith('https://')) {
    const url = new URL(token)
    if (url.hostname !== 'wx.10086.cn' || !url.pathname.startsWith('/hlwyxhdhub/act-wedrecharge/')) throw new Error('请使用官方周三拼图分享链接')
    token = url.searchParams.get('giveCard') || new URLSearchParams(url.hash.split('?')[1] || '').get('giveCard') || ''
  }
  if (!/^[a-fA-F0-9]{32,512}$/.test(token)) throw new Error('请输入有效的 giveCard 链接或转赠 Token')
  return token
}

export async function wedRechargeReceive(cookie: string, token: string): Promise<string> {
  const payload = await puzzlePost(cookie, 'handleGivePzl', { givePuzzleToken: parseWedReceiveToken(token) })
  const id = getString(getObject(payload, 'data'), 'puzzleId')
  if (!id || !/^dp[123]_\d$/.test(id)) throw new Error('领取响应缺少拼图编号，请先核对库存')
  return id
}

export async function wedRechargeReceiveCoupon(cookie: string, round: number): Promise<void> {
  if (![1, 2, 3].includes(round)) throw new Error('拼图档位无效')
  await puzzlePost(cookie, 'receiveNew', { round: ['r6', 'r5', 'r4'][round - 1] })
}

