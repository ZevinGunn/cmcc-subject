import crypto from 'node:crypto'
import { access, chmod, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import type { AccountRecord } from './accountsStore.js'

/**
 * 固定引用工具的脚本清单。脚本由服务端选择，调用方不能提交任意路径，
 * 避免把批量任务接口变成任意命令执行入口。
 */
export const CMCC_AUTO_CHECKIN_OPERATIONS = [
  'sign',
  'wed',
  'seed',
  'gold',
  'rate',
  'fee',
  'seckill',
  'liaoning',
] as const

export type CmccAutoCheckinOperation = (typeof CMCC_AUTO_CHECKIN_OPERATIONS)[number]

export type CmccAutoCheckinParams = {
  operations?: string[]
  dryRun?: boolean
  includeAllSignTasks?: boolean
  timeoutSeconds?: number
  /** 仅供管理员在已明确了解副作用时使用。 */
  allowSideEffects?: boolean
}

export type CmccAutoCheckinCapability = {
  id: CmccAutoCheckinOperation
  label: string
  script: string
  sideEffect: boolean
  credential: string
  notes: string
}

export type CmccAutoCheckinResult = {
  status: 'success' | 'failed' | 'skipped'
  message: string
  operationResults: Array<{
    operation: CmccAutoCheckinOperation
    status: 'success' | 'failed' | 'skipped'
    message: string
    exitCode?: number | null
    timedOut?: boolean
  }>
}

const CAPABILITIES: CmccAutoCheckinCapability[] = [
  { id: 'sign', label: '主签到、累计奖励、AI 豆任务、拓展活动和周三拼图', script: 'cmcc_sign.py', sideEffect: true, credential: 'cmccAppCookie', notes: '默认包含 tasks/games/wed/seed/gold 子流程' },
  { id: 'wed', label: '周三充值日拼图和抽奖', script: 'cmcc_wed.py', sideEffect: true, credential: 'cmccAppCookie', notes: '周三活动会话；可在 dry-run 下只查询' },
  { id: 'seed', label: 'AI 豆苗养成记', script: 'cmcc_seed.py', sideEffect: true, credential: 'wedRechargeCookie', notes: '需要活动票据；缺少票据时明确跳过' },
  { id: 'gold', label: '签到专属 AI 豆兑换话费券', script: 'cmcc_gold.py', sideEffect: true, credential: 'cmccAppCookie', notes: 'dry-run 只查询余额和档位' },
  { id: 'rate', label: '评价有礼与评价币兑换', script: 'cmcc_rate.py', sideEffect: true, credential: 'cmccAppCookie', notes: '脚本会按服务端返回判断是否有可评价/可兑换内容' },
  { id: 'fee', label: '话费余额查询', script: 'cmcc_fee.py', sideEffect: false, credential: 'fee_session_cookie', notes: '当前账号模型尚未保存独立 jsessionid-cmcc，会报告缺少凭据' },
  { id: 'seckill', label: '限时秒杀', script: 'cmcc_seckill.py', sideEffect: true, credential: 'cmccAppCookie', notes: '仅显式任务执行；默认 dry-run 不抢购' },
  { id: 'liaoning', label: '辽宁充值领券活动', script: 'liaoning/liaoning.py', sideEffect: true, credential: 'cmccAppCookie', notes: '仅辽宁移动号码适用；非辽宁号码由上游返回不参与' },
]

const operationSet = new Set<string>(CMCC_AUTO_CHECKIN_OPERATIONS)

export function listCmccAutoCheckinCapabilities(): CmccAutoCheckinCapability[] {
  return CAPABILITIES.map((item) => ({ ...item }))
}

export function parseCmccAutoCheckinParams(value?: string | null): CmccAutoCheckinParams {
  if (!value?.trim()) return { operations: ['sign'], dryRun: true, includeAllSignTasks: true }
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>
    const operations = Array.isArray(parsed.operations)
      ? parsed.operations.map((item) => String(item).trim()).filter((item) => operationSet.has(item))
      : []
    return {
      operations: operations.length > 0 ? Array.from(new Set(operations)) : ['sign'],
      dryRun: parsed.dryRun !== false,
      includeAllSignTasks: parsed.includeAllSignTasks !== false,
      timeoutSeconds: Number.isFinite(Number(parsed.timeoutSeconds))
        ? Math.max(30, Math.min(900, Math.floor(Number(parsed.timeoutSeconds))))
        : 300,
      allowSideEffects: parsed.allowSideEffects === true,
    }
  } catch {
    return { operations: ['sign'], dryRun: true, includeAllSignTasks: true }
  }
}

function getReferenceRoot(): string {
  const configured = process.env.CMCC_AUTO_CHECKIN_ROOT?.trim()
  if (configured) return path.resolve(configured)
  const serviceDirectory = path.dirname(fileURLToPath(import.meta.url))
  const candidates = [
    path.resolve(process.cwd(), '../参考工具/cmcc-auto-checkin'),
    path.resolve(process.cwd(), '../../参考工具/cmcc-auto-checkin'),
    path.resolve(serviceDirectory, '../../../../参考工具/cmcc-auto-checkin'),
  ]
  return candidates.find((candidate) => existsSync(candidate)) || candidates[0]
}

function resolvePython(root: string): string {
  const configured = process.env.CMCC_AUTO_CHECKIN_PYTHON?.trim()
  if (configured) return configured
  return path.join(root, '.venv310/bin/python')
}

function redactOutput(value: string): string {
  return value
    .replace(/(JSESSIONID|UID|ticketID|token|jwtToken|app_token|coc3_ticket|fee_session_cookie)\s*[=:]\s*[^;\s,]+/gi, '$1=[已隐藏]')
    .replace(/\b1\d{10}\b/g, '手机号[已隐藏]')
    .slice(-24_000)
}

function summarizeOperationResults(
  operationResults: CmccAutoCheckinResult['operationResults'],
): string {
  if (operationResults.length === 0) return '无模块结果'
  return operationResults
    .map((item) => `${item.operation}:${item.status}（${item.message.split(/\r?\n/, 1)[0].slice(0, 180)}）`)
    .join('；')
}

function buildConfig(account: AccountRecord): Record<string, unknown> {
  return {
    app_token: account.cmccAppCookie || '',
    phone: account.phone,
    // 周三活动凭据在 cookie-app 中对应独立的活动会话字段。
    coc3_ticket: account.wedRechargeCookie || '',
    province_code: process.env.CMCC_AUTO_CHECKIN_PROVINCE_CODE || '731',
    city_code: process.env.CMCC_AUTO_CHECKIN_CITY_CODE || '0731',
    carrier_operator: process.env.CMCC_AUTO_CHECKIN_CARRIER_OPERATOR || '002',
    app_version_code: process.env.CMCC_AUTO_CHECKIN_APP_VERSION || '12.5.2',
    activity_id: process.env.CMCC_AUTO_CHECKIN_ACTIVITY_ID || '1021122301',
    channel_id: process.env.CMCC_AUTO_CHECKIN_CHANNEL_ID || 'P00000109876',
    fee_session_cookie: '',
    serverchan_sendkey: '',
    bark_url: '',
  }
}

function runScript(args: {
  python: string
  script: string
  configPath: string
  cwd: string
  extraArgs: string[]
  timeoutMs: number
}): Promise<{ exitCode: number | null; output: string; timedOut: boolean }> {
  return new Promise((resolve) => {
    const child = spawn(args.python, [args.script, '--config', args.configPath, ...args.extraArgs], {
      cwd: args.cwd,
      env: { ...process.env, PYTHONUNBUFFERED: '1' },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let output = ''
    let settled = false
    const append = (chunk: Buffer | string) => {
      output += String(chunk)
      if (output.length > 48_000) output = output.slice(-48_000)
    }
    child.stdout.on('data', append)
    child.stderr.on('data', append)
    const timer = setTimeout(() => {
      if (settled) return
      child.kill('SIGTERM')
      setTimeout(() => child.kill('SIGKILL'), 3_000).unref()
    }, args.timeoutMs)
    child.on('error', (error) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve({ exitCode: null, output: `${output}\n${error.message}`, timedOut: false })
    })
    child.on('close', (code, signal) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve({ exitCode: code, output: signal ? `${output}\n进程信号: ${signal}` : output, timedOut: signal === 'SIGTERM' || signal === 'SIGKILL' })
    })
  })
}

function operationArgs(operation: CmccAutoCheckinOperation, params: CmccAutoCheckinParams): string[] {
  const args: string[] = []
  if (params.dryRun !== false) args.push('--dry-run')
  if (operation === 'sign' && params.includeAllSignTasks !== false) {
    args.push('--tasks', '--games', '--wed', '--seed', '--gold')
  }
  return args
}

export async function executeCmccAutoCheckin(args: {
  account: AccountRecord
  params?: CmccAutoCheckinParams
  onProgress?: (message: string) => void
}): Promise<CmccAutoCheckinResult> {
  const params = args.params || { operations: ['sign'], dryRun: true }
  const operations = (params.operations || ['sign']).filter((item): item is CmccAutoCheckinOperation => operationSet.has(item))
  if (operations.length === 0) return { status: 'skipped', message: '未选择活动脚本', operationResults: [] }
  if (params.dryRun === false && params.allowSideEffects !== true) {
    return { status: 'failed', message: '真实活动写操作需要显式确认 allowSideEffects=true', operationResults: [] }
  }

  const root = getReferenceRoot()
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'cmcc-auto-checkin-'))
  const configPath = path.join(tempDir, `config-${crypto.randomUUID()}.json`)
  const config = buildConfig(args.account)
  await writeFile(configPath, JSON.stringify(config), { encoding: 'utf8', mode: 0o600 })
  await chmod(configPath, 0o600).catch(() => undefined)
  const python = resolvePython(root)
  const operationResults: CmccAutoCheckinResult['operationResults'] = []
  try {
    for (const operation of operations) {
      const capability = CAPABILITIES.find((item) => item.id === operation)
      if (!capability) continue
      if (operation === 'seed' && !args.account.wedRechargeCookie) {
        operationResults.push({ operation, status: 'skipped', message: '缺少周三活动票据（wedRechargeCookie）' })
        continue
      }
      if (operation === 'fee') {
        operationResults.push({ operation, status: 'skipped', message: '缺少话费查询专用 jsessionid-cmcc，未尝试使用其他 CK 替代' })
        continue
      }
      const scriptPath = path.join(root, capability.script)
      try {
        await access(scriptPath)
      } catch {
        operationResults.push({ operation, status: 'failed', message: `参考脚本不存在：${capability.script}` })
        continue
      }
      args.onProgress?.(`${capability.label}执行中`)
      const result = await runScript({
        python,
        script: scriptPath,
        configPath,
        cwd: root,
        extraArgs: operationArgs(operation, params),
        timeoutMs: (params.timeoutSeconds || 300) * 1000,
      })
      const output = redactOutput(result.output).trim()
      const ok = result.exitCode === 0 && !result.timedOut
      operationResults.push({
        operation,
        status: ok ? 'success' : 'failed',
        message: output || (ok ? '脚本执行完成' : '脚本执行失败'),
        exitCode: result.exitCode,
        timedOut: result.timedOut,
      })
      if (!ok && params.dryRun !== false) continue
    }
  } finally {
    await rm(tempDir, { recursive: true, force: true }).catch(() => undefined)
  }
  const failed = operationResults.filter((item) => item.status === 'failed').length
  const succeeded = operationResults.filter((item) => item.status === 'success').length
  const skipped = operationResults.filter((item) => item.status === 'skipped').length
  const status = failed > 0 && succeeded === 0 ? 'failed' : failed > 0 || skipped > 0 ? 'skipped' : 'success'
  return {
    status,
    message: `移动活动自动化完成：成功 ${succeeded}，跳过 ${skipped}，失败 ${failed}${params.dryRun !== false ? '（dry-run）' : ''}`,
    operationResults,
  }
}

export const __test__ = {
  buildConfig,
  getReferenceRoot,
  operationArgs,
  redactOutput,
  resolvePython,
  runScript,
  summarizeOperationResults,
}
