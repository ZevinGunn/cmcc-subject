import { Link } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { DatabaseBackup, Eraser, ExternalLink, Loader2, ShieldCheck } from 'lucide-react'

type MaintenanceStatus = {
  enabled: boolean
  backupEnabled: boolean
  cleanupEnabled: boolean
  backupIntervalHours: number
  cleanupIntervalHours: number
  retentionDays: Record<string, number>
  backup: { running: boolean; lastSuccessAt?: string; lastError?: string }
  cleanup: { running: boolean; lastSuccessAt?: string; lastError?: string; lastResult?: Record<string, number> }
}

function formatTime(value?: string) {
  return value ? new Date(value).toLocaleString('zh-CN', { hour12: false }) : '尚未运行'
}

export default function V2SettingsPage() {
  const [maintenance, setMaintenance] = useState<MaintenanceStatus>()
  const [maintenanceError, setMaintenanceError] = useState('')
  const [runningAction, setRunningAction] = useState<'backup' | 'cleanup'>()

  const loadMaintenance = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/database-maintenance', { credentials: 'same-origin' })
      const body = await response.json() as { ok: boolean; data?: MaintenanceStatus; message?: string }
      if (!response.ok || !body.ok || !body.data) throw new Error(body.message || '加载数据库维护状态失败')
      setMaintenance(body.data)
      setMaintenanceError('')
    } catch (error) {
      setMaintenanceError(error instanceof Error ? error.message : '加载数据库维护状态失败')
    }
  }, [])

  useEffect(() => { void loadMaintenance() }, [loadMaintenance])

  async function runMaintenance(action: 'backup' | 'cleanup') {
    setRunningAction(action)
    setMaintenanceError('')
    try {
      const response = await fetch(`/api/admin/database-maintenance/${action}`, {
        method: 'POST',
        credentials: 'same-origin',
      })
      const body = await response.json() as { ok: boolean; data?: { status: MaintenanceStatus }; message?: string }
      if (!response.ok || !body.ok || !body.data) throw new Error(body.message || '数据库维护失败')
      setMaintenance(body.data.status)
    } catch (error) {
      setMaintenanceError(error instanceof Error ? error.message : '数据库维护失败')
    } finally {
      setRunningAction(undefined)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1000px] space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">系统设置</h1>
        <p className="mt-1 text-sm text-zinc-500">V2 第一阶段 · 与 V1 共用业务配置</p>
      </div>
      <section className="border-y border-zinc-200 bg-white">
        <div className="grid gap-3 border-b border-zinc-100 px-4 py-4 sm:grid-cols-[minmax(180px,1fr)_minmax(220px,1fr)] sm:items-center">
          <div>
            <strong className="text-sm text-zinc-950">默认界面</strong>
            <p className="mt-1 text-xs text-zinc-500">直接访问 URL 时以 URL 为准</p>
          </div>
          <div className="inline-flex w-fit rounded-md border border-zinc-200 bg-zinc-100 p-0.5 text-xs font-medium">
            <Link to="/" className="rounded px-3 py-1.5 text-zinc-500 hover:bg-white">
              V1 经典版
            </Link>
            <span className="rounded bg-white px-3 py-1.5 text-emerald-800 shadow-sm">
              V2 新版
            </span>
          </div>
        </div>
        <div className="grid gap-3 border-b border-zinc-100 px-4 py-4 sm:grid-cols-[minmax(180px,1fr)_minmax(220px,1fr)] sm:items-center">
          <div>
            <strong className="text-sm text-zinc-950">业务内核</strong>
            <p className="mt-1 text-xs text-zinc-500">账号、任务与权限仍使用现有 API</p>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            兼容模式
          </div>
        </div>
        <div className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(180px,1fr)_minmax(220px,1fr)] sm:items-center">
          <div>
            <strong className="text-sm text-zinc-950">高级业务配置</strong>
            <p className="mt-1 text-xs text-zinc-500">
              SSPID、活动凭据与通知配置暂由经典版维护
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            打开经典版设置 <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <section className="border-y border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-4 py-4">
          <h2 className="text-sm font-semibold text-zinc-950">数据库维护</h2>
          <p className="mt-1 text-xs text-zinc-500">
            {maintenance?.enabled
              ? `备份每 ${maintenance.backupIntervalHours} 小时，清理每 ${maintenance.cleanupIntervalHours} 小时`
              : '自动维护已停用'}
          </p>
        </div>
        <div className="grid gap-4 px-4 py-4 sm:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DatabaseBackup className="h-4 w-4 text-emerald-700" />
              <strong className="text-sm text-zinc-900">定期备份</strong>
            </div>
            <p className="text-xs text-zinc-500">最近成功：{formatTime(maintenance?.backup.lastSuccessAt)}</p>
            {maintenance?.backup.lastError ? <p className="text-xs text-red-600">{maintenance.backup.lastError}</p> : null}
            <button
              type="button"
              disabled={runningAction !== undefined || maintenance?.backup.running}
              onClick={() => void runMaintenance('backup')}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-400">
              {runningAction === 'backup' ? <Loader2 className="h-4 w-4 animate-spin" /> : <DatabaseBackup className="h-4 w-4" />}
              立即备份
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Eraser className="h-4 w-4 text-amber-700" />
              <strong className="text-sm text-zinc-900">历史数据清理</strong>
            </div>
            <p className="text-xs text-zinc-500">最近成功：{formatTime(maintenance?.cleanup.lastSuccessAt)}</p>
            {maintenance?.cleanup.lastError ? <p className="text-xs text-red-600">{maintenance.cleanup.lastError}</p> : null}
            <button
              type="button"
              disabled={runningAction !== undefined || maintenance?.cleanup.running}
              onClick={() => void runMaintenance('cleanup')}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-400">
              {runningAction === 'cleanup' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eraser className="h-4 w-4" />}
              立即清理
            </button>
          </div>
        </div>
        {maintenanceError ? <div className="border-t border-red-100 bg-red-50 px-4 py-3 text-xs text-red-700">{maintenanceError}</div> : null}
      </section>
    </div>
  )
}
