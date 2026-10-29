import path from 'node:path'
import { spawn } from 'node:child_process'
import { getPrisma } from './prisma.js'
import { pruneAccessLogs } from './accessLog.js'

type RunState = {
  running: boolean
  lastStartedAt?: string
  lastFinishedAt?: string
  lastSuccessAt?: string
  lastError?: string
  lastResult?: Record<string, number>
}

export type DatabaseMaintenanceStatus = {
  enabled: boolean
  backupEnabled: boolean
  cleanupEnabled: boolean
  backupIntervalHours: number
  cleanupIntervalHours: number
  retentionDays: {
    sessions: number
    logs: number
    accessLogs: number
    tasks: number
    scheduleFires: number
    dailyStates: number
  }
  backup: RunState
  cleanup: RunState
}

const backupState: RunState = { running: false }
const cleanupState: RunState = { running: false }
let started = false

function boolEnv(name: string, fallback: boolean): boolean {
  const value = process.env[name]?.trim().toLowerCase()
  if (!value) return fallback
  return !['0', 'false', 'off', 'no'].includes(value)
}

export function positiveNumberEnv(name: string, fallback: number): number {
  const value = Number(process.env[name])
  return Number.isFinite(value) && value > 0 ? value : fallback
}

function config() {
  return {
    enabled: boolEnv('DB_MAINTENANCE_ENABLED', true),
    backupEnabled: boolEnv('DB_BACKUP_ENABLED', true),
    cleanupEnabled: boolEnv('DB_CLEANUP_ENABLED', true),
    backupIntervalHours: positiveNumberEnv('DB_BACKUP_INTERVAL_HOURS', 24),
    cleanupIntervalHours: positiveNumberEnv('DB_CLEANUP_INTERVAL_HOURS', 24),
    initialDelaySeconds: positiveNumberEnv('DB_MAINTENANCE_INITIAL_DELAY_SECONDS', 60),
    retentionDays: {
      sessions: positiveNumberEnv('DB_SESSION_RETENTION_DAYS', 7),
      logs: positiveNumberEnv('DB_LOG_RETENTION_DAYS', 30),
      accessLogs: positiveNumberEnv('DB_ACCESS_LOG_RETENTION_DAYS', 30),
      tasks: positiveNumberEnv('DB_TASK_RETENTION_DAYS', 30),
      scheduleFires: positiveNumberEnv('DB_SCHEDULE_FIRE_RETENTION_DAYS', 30),
      dailyStates: positiveNumberEnv('DB_DAILY_STATE_RETENTION_DAYS', 90),
    },
  }
}

function cutoff(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
}

export function getDatabaseMaintenanceStatus(): DatabaseMaintenanceStatus {
  const current = config()
  return {
    enabled: current.enabled,
    backupEnabled: current.backupEnabled,
    cleanupEnabled: current.cleanupEnabled,
    backupIntervalHours: current.backupIntervalHours,
    cleanupIntervalHours: current.cleanupIntervalHours,
    retentionDays: current.retentionDays,
    backup: { ...backupState },
    cleanup: { ...cleanupState },
  }
}

export async function runDatabaseBackup(): Promise<void> {
  if (backupState.running) throw new Error('BACKUP_ALREADY_RUNNING')
  backupState.running = true
  backupState.lastStartedAt = new Date().toISOString()
  backupState.lastError = undefined
  try {
    const script = path.resolve(process.cwd(), 'scripts/db-backup.sh')
    await new Promise<void>((resolve, reject) => {
      const child = spawn('bash', [script], {
        cwd: process.cwd(),
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe'],
      })
      let stderr = ''
      child.stderr.on('data', (chunk) => { stderr += String(chunk) })
      child.on('error', reject)
      child.on('close', (code) => code === 0 ? resolve() : reject(new Error(stderr.trim() || `备份进程退出码 ${code}`)))
    })
    backupState.lastSuccessAt = new Date().toISOString()
  } catch (error) {
    backupState.lastError = error instanceof Error ? error.message : '数据库备份失败'
    throw error
  } finally {
    backupState.running = false
    backupState.lastFinishedAt = new Date().toISOString()
  }
}

export async function runDatabaseCleanup(): Promise<Record<string, number>> {
  if (cleanupState.running) throw new Error('CLEANUP_ALREADY_RUNNING')
  cleanupState.running = true
  cleanupState.lastStartedAt = new Date().toISOString()
  cleanupState.lastError = undefined
  try {
    const current = config()
    const prisma = getPrisma()
    const terminal = ['success', 'failed', 'partial_success', 'cancelled', 'skipped']
    const accessLogs = await pruneAccessLogs(cutoff(current.retentionDays.accessLogs))
    const [sessions, logs, tasks, scheduleFires, retailTasks, dailyStates] = await prisma.$transaction([
      prisma.userSession.deleteMany({
        where: { OR: [
          { expiresAt: { lt: cutoff(current.retentionDays.sessions) } },
          { revokedAt: { not: null, lt: cutoff(current.retentionDays.sessions) } },
        ] },
      }),
      prisma.logEntry.deleteMany({ where: { createdAt: { lt: cutoff(current.retentionDays.logs) } } }),
      prisma.batchTask.deleteMany({
        where: { status: { in: terminal }, finishedAt: { lt: cutoff(current.retentionDays.tasks) } },
      }),
      prisma.taskScheduleFire.deleteMany({
        where: { createdAt: { lt: cutoff(current.retentionDays.scheduleFires) } },
      }),
      prisma.retailProductQueryTask.deleteMany({
        where: { status: { in: terminal }, finishedAt: { lt: cutoff(current.retentionDays.tasks) } },
      }),
      prisma.dailyTaskState.deleteMany({
        where: {
          status: { notIn: ['pending', 'running'] },
          updatedAt: { lt: cutoff(current.retentionDays.dailyStates) },
        },
      }),
    ])
    const result = {
      sessions: sessions.count,
      logs: logs.count,
      accessLogs,
      tasks: tasks.count,
      scheduleFires: scheduleFires.count,
      retailTasks: retailTasks.count,
      dailyStates: dailyStates.count,
    }
    cleanupState.lastResult = result
    cleanupState.lastSuccessAt = new Date().toISOString()
    return result
  } catch (error) {
    cleanupState.lastError = error instanceof Error ? error.message : '数据库清理失败'
    throw error
  } finally {
    cleanupState.running = false
    cleanupState.lastFinishedAt = new Date().toISOString()
  }
}

function schedule(task: () => Promise<unknown>, initialDelayMs: number, intervalMs: number) {
  const run = () => void task().catch((error) => {
    console.error('[database-maintenance]', error instanceof Error ? error.message : error)
  })
  const initial = setTimeout(() => {
    run()
    const timer = setInterval(run, intervalMs)
    timer.unref()
  }, initialDelayMs)
  initial.unref()
}

export function startDatabaseMaintenanceScheduler(): void {
  if (started) return
  started = true
  const current = config()
  if (!current.enabled) return
  const delay = current.initialDelaySeconds * 1000
  if (current.backupEnabled) schedule(runDatabaseBackup, delay, current.backupIntervalHours * 60 * 60 * 1000)
  if (current.cleanupEnabled) schedule(runDatabaseCleanup, delay + 15_000, current.cleanupIntervalHours * 60 * 60 * 1000)
}
