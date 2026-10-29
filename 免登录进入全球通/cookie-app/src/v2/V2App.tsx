import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import AccountLoginDialog from '@/components/AccountLoginDialog'
import V2Shell from './components/V2Shell'
import V2AccountDrawer from './components/V2AccountDrawer'
import V2ConfirmDialog from './components/V2ConfirmDialog'
import V2ScheduleDialog from './components/V2ScheduleDialog'
import V2TaskDialog from './components/V2TaskDialog'
import V2TaskDrawer from './components/V2TaskDrawer'
import V2Dashboard from './pages/V2Dashboard'
import {
  ApiClientError,
  cancelTask,
  createTaskSchedule,
  deleteAccounts,
  deleteTaskSchedule,
  exportValidQqtTokens,
  getTask,
  loadRecentTasks,
  loadSchedules,
  loadV2Accounts,
  startBatchTask,
  updateTaskSchedule,
} from './lib/api'
import type {
  CreateTaskScheduleInput,
  V2Account,
  V2BatchTask,
  V2Schedule,
  V2TaskType,
} from './lib/types'

type TaskDialogState = {
  type: V2TaskType
  accountIds: string[]
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.requestId ? `${error.message}（请求 ${error.requestId}）` : error.message
  }
  return error instanceof Error ? error.message : '请求失败'
}

const ATTENTION_STATUSES = new Set(['invalid', 'expired', 'expiring', 'maintenance', 'unknown'])

const PublicLinksAdmin = lazy(() => import('@/pages/PublicLinksAdmin'))
const UsersAdmin = lazy(() => import('@/pages/UsersAdmin'))
const V2AccountsPage = lazy(() => import('./pages/V2AccountsPage'))
const V2AnnouncementsPage = lazy(() => import('./pages/V2AnnouncementsPage'))
const V2AuditPage = lazy(() => import('./pages/V2AuditPage'))
const V2AutomationsPage = lazy(() => import('./pages/V2AutomationsPage'))
const V2BenefitsPage = lazy(() => import('./pages/V2BenefitsPage'))
const WedPuzzlePool = lazy(() => import('../pages/WedPuzzlePool'))
const V2LuckyThreeDayPage = lazy(() => import('./pages/V2LuckyThreeDayPage'))
const V2GlobalTelecomPage = lazy(() => import('./pages/V2GlobalTelecomPage'))
const V2BusinessPage = lazy(() => import('./pages/V2BusinessPage'))
const V2RetailProductQueryPage = lazy(() => import('./pages/V2RetailProductQueryPage'))
const V2UnifiedBusinessOrderPage = lazy(() => import('./pages/V2UnifiedBusinessOrderPage'))
const V2SettingsPage = lazy(() => import('./pages/V2SettingsPage'))
const V2TasksPage = lazy(() => import('./pages/V2TasksPage'))

function routeNeedsAccounts(pathname: string): boolean {
  return pathname === '/v2' || pathname === '/v2/' ||
    pathname.startsWith('/v2/accounts') || pathname.startsWith('/v2/benefits') ||
    pathname.startsWith('/v2/business') || pathname.startsWith('/v2/product-query')
}

function routeNeedsTasks(pathname: string): boolean {
  return pathname === '/v2' || pathname === '/v2/' ||
    pathname.startsWith('/v2/tasks') || pathname.startsWith('/v2/audit')
}

function routeNeedsSchedules(pathname: string): boolean {
  return pathname.startsWith('/v2/automations')
}

function RouteFallback() {
  return (
    <div className="mx-auto w-full max-w-[1500px] animate-pulse space-y-4" aria-label="页面加载中">
      <div className="h-6 w-32 rounded bg-zinc-200" />
      <div className="h-4 w-56 rounded bg-zinc-100" />
      <div className="h-64 rounded-md border border-zinc-200 bg-white" />
    </div>
  )
}

export default function V2App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [accounts, setAccounts] = useState<V2Account[]>([])
  const [tasks, setTasks] = useState<V2BatchTask[]>([])
  const [schedules, setSchedules] = useState<V2Schedule[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectedAccount, setSelectedAccount] = useState<V2Account | null>(null)
  const [loginAccount, setLoginAccount] = useState<V2Account | null | undefined>(undefined)
  const [selectedTask, setSelectedTask] = useState<V2BatchTask | null>(null)
  const [taskDialog, setTaskDialog] = useState<TaskDialogState | null>(null)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [loadingAccounts, setLoadingAccounts] = useState(() => routeNeedsAccounts(location.pathname))
  const [loadingTasks, setLoadingTasks] = useState(() => routeNeedsTasks(location.pathname))
  const [loadingSchedules, setLoadingSchedules] = useState(() => routeNeedsSchedules(location.pathname))
  const [hasLoadedAccounts, setHasLoadedAccounts] = useState(false)
  const [hasLoadedTasks, setHasLoadedTasks] = useState(false)
  const [hasLoadedSchedules, setHasLoadedSchedules] = useState(false)
  const accountsLoadingRef = useRef(false)
  const tasksLoadingRef = useRef(false)
  const schedulesLoadingRef = useRef(false)
  const [accountError, setAccountError] = useState<string>()
  const [taskError, setTaskError] = useState<string>()
  const [scheduleError, setScheduleError] = useState<string>()
  const [taskSubmitting, setTaskSubmitting] = useState(false)
  const [taskSubmitError, setTaskSubmitError] = useState<string>()
  const [taskCancelling, setTaskCancelling] = useState(false)
  const [taskToStop, setTaskToStop] = useState<V2BatchTask | null>(null)
  const [scheduleToDelete, setScheduleToDelete] = useState<V2Schedule | null>(null)
  const [scheduleDeleting, setScheduleDeleting] = useState(false)
  const [scheduleSubmitting, setScheduleSubmitting] = useState(false)
  const [toast, setToast] = useState<string>()
  const [copyingTokens, setCopyingTokens] = useState(false)
  const [accountIdsToDelete, setAccountIdsToDelete] = useState<string[]>([])
  const [deletingAccounts, setDeletingAccounts] = useState(false)

  const refreshAccounts = useCallback(async () => {
    if (accountsLoadingRef.current) return []
    accountsLoadingRef.current = true
    setLoadingAccounts(true)
    setAccountError(undefined)
    try {
      const next = await loadV2Accounts({ includeDisabled: true })
      setAccounts(next)
      setSelectedIds((current) => current.filter((id) => next.some((account) => account.id === id)))
      setSelectedAccount((current) => current ? next.find((account) => account.id === current.id) ?? null : null)
      return next
    } catch (error) {
      setAccountError(errorMessage(error))
      return []
    } finally {
      accountsLoadingRef.current = false
      setHasLoadedAccounts(true)
      setLoadingAccounts(false)
    }
  }, [])

  const refreshTasks = useCallback(async () => {
    if (tasksLoadingRef.current) return []
    tasksLoadingRef.current = true
    setLoadingTasks(true)
    setTaskError(undefined)
    try {
      const next = await loadRecentTasks()
      setTasks(next)
      setSelectedTask((current) => current ? next.find((task) => task.id === current.id) ?? current : null)
      return next
    } catch (error) {
      setTaskError(errorMessage(error))
      return []
    } finally {
      tasksLoadingRef.current = false
      setHasLoadedTasks(true)
      setLoadingTasks(false)
    }
  }, [])

  const refreshSchedules = useCallback(async () => {
    if (schedulesLoadingRef.current) return []
    schedulesLoadingRef.current = true
    setLoadingSchedules(true)
    setScheduleError(undefined)
    try {
      const next = await loadSchedules()
      setSchedules(next)
      return next
    } catch (error) {
      setScheduleError(errorMessage(error))
      return []
    } finally {
      schedulesLoadingRef.current = false
      setHasLoadedSchedules(true)
      setLoadingSchedules(false)
    }
  }, [])

  const refreshAll = useCallback(() => {
    const requests: Array<Promise<unknown>> = []
    if (routeNeedsAccounts(location.pathname)) requests.push(refreshAccounts())
    if (routeNeedsTasks(location.pathname)) requests.push(refreshTasks())
    if (routeNeedsSchedules(location.pathname)) requests.push(refreshSchedules())
    void Promise.all(requests)
  }, [location.pathname, refreshAccounts, refreshSchedules, refreshTasks])

  useEffect(() => {
    const requests: Array<Promise<unknown>> = []
    if (routeNeedsAccounts(location.pathname) && !hasLoadedAccounts) requests.push(refreshAccounts())
    if (routeNeedsTasks(location.pathname) && !hasLoadedTasks) requests.push(refreshTasks())
    if (routeNeedsSchedules(location.pathname) && !hasLoadedSchedules) requests.push(refreshSchedules())
    void Promise.all(requests)
  }, [hasLoadedAccounts, hasLoadedSchedules, hasLoadedTasks, location.pathname, refreshAccounts, refreshSchedules, refreshTasks])

  useEffect(() => {
    if (!routeNeedsTasks(location.pathname)) return undefined
    const hasRunningTask = tasks.some((task) => task.status === 'pending' || task.status === 'running')
    if (!hasRunningTask) return undefined
    const timer = window.setInterval(() => {
      void refreshTasks()
      if (selectedTask) {
        void getTask(selectedTask.id).then((task) => {
          if (task) setSelectedTask(task)
        }).catch(() => undefined)
      }
    }, 2500)
    return () => window.clearInterval(timer)
  }, [location.pathname, refreshTasks, selectedTask, tasks])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(undefined), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const usableAccounts = useMemo(
    () => accounts.filter((account) => account.health.status !== 'disabled'),
    [accounts],
  )
  const attentionCount = useMemo(
    () => accounts.filter((account) => ATTENTION_STATUSES.has(account.health.status)).length,
    [accounts],
  )

  async function logout() {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'same-origin',
      })
    } finally {
      navigate('/admin-login?next=%2Fv2', { replace: true })
    }
  }

  function openTaskDialog(type: V2TaskType = 'ck_maintenance', accountIds: string[] = []) {
    setTaskSubmitError(undefined)
    setTaskDialog({ type, accountIds })
  }

  function openTask(task: V2BatchTask) {
    setSelectedTask(task)
    void getTask(task.id).then((detail) => {
      if (detail) setSelectedTask(detail)
    }).catch(() => undefined)
  }

  async function submitTask(args: { type: V2TaskType; accountIds: string[]; sspid?: string }) {
    setTaskSubmitting(true)
    setTaskSubmitError(undefined)
    try {
      const result = await startBatchTask(args.type, {
        scopeType: args.accountIds.length > 0 ? 'selected_accounts' : 'admin_all',
        accountIds: args.accountIds.length > 0 ? args.accountIds : undefined,
        sspid: args.sspid,
        timezone: 'Asia/Shanghai',
      })
      setTaskDialog(null)
      setSelectedTask(result.task)
      setTasks((current) => [result.task, ...current.filter((task) => task.id !== result.task.id)])
      setToast(result.reused ? '已恢复相同范围的进行中任务' : '任务已创建并开始执行')
      navigate('/v2/tasks')
    } catch (error) {
      setTaskSubmitError(errorMessage(error))
    } finally {
      setTaskSubmitting(false)
    }
  }

  async function stopTask(task: V2BatchTask) {
    setTaskCancelling(true)
    try {
      const next = await cancelTask(task.id)
      if (next) {
        setSelectedTask(next)
        setTasks((current) => [next, ...current.filter((item) => item.id !== next.id)])
      }
      setToast('任务已停止，已完成账号不会回滚')
      setTaskToStop(null)
    } catch (error) {
      setTaskError(errorMessage(error))
    } finally {
      setTaskCancelling(false)
    }
  }

  async function toggleSchedule(schedule: V2Schedule, enabled: boolean) {
    try {
      const next = await updateTaskSchedule(schedule.id, { enabled })
      setSchedules((current) => current.map((item) => item.id === next.id ? next : item))
      setToast(enabled ? '计划已启用' : '计划已暂停')
    } catch (error) {
      setScheduleError(errorMessage(error))
    }
  }

  async function removeSchedule(schedule: V2Schedule) {
    setScheduleDeleting(true)
    try {
      await deleteTaskSchedule(schedule.id)
      setSchedules((current) => current.filter((item) => item.id !== schedule.id))
      setScheduleToDelete(null)
      setToast('计划已删除')
    } catch (error) {
      setScheduleError(errorMessage(error))
    } finally {
      setScheduleDeleting(false)
    }
  }

  async function createSchedule(input: CreateTaskScheduleInput) {
    setScheduleSubmitting(true)
    setScheduleError(undefined)
    try {
      const next = await createTaskSchedule(input)
      setSchedules((current) => [next, ...current])
      setScheduleDialogOpen(false)
      setToast('自动化计划已创建')
    } catch (error) {
      setScheduleError(errorMessage(error))
    } finally {
      setScheduleSubmitting(false)
    }
  }

  async function copyValidTokens() {
    setCopyingTokens(true)
    try {
      const result = await exportValidQqtTokens()
      const text = result.tokens.map((item) => item.accessToken).filter(Boolean).join('\n')
      if (!text) {
        setToast('当前没有符合条件的有效 Token')
        return
      }
      await navigator.clipboard.writeText(text)
      setToast(`已复制 ${result.total} 个有效 Token`)
    } catch (error) {
      setTaskError(errorMessage(error))
    } finally {
      setCopyingTokens(false)
    }
  }

  async function removeSelectedAccounts() {
    if (accountIdsToDelete.length === 0 || deletingAccounts) return
    setDeletingAccounts(true)
    setAccountError(undefined)
    try {
      const deleted = await deleteAccounts(accountIdsToDelete)
      const deletedSet = new Set(deleted)
      setSelectedIds((current) => current.filter((id) => !deletedSet.has(id)))
      setSelectedAccount((current) => current && deletedSet.has(current.id) ? null : current)
      setAccountIdsToDelete([])
      await refreshAccounts()
      setToast(`已删除 ${deleted.length} 个账号`)
    } catch (error) {
      setAccountError(errorMessage(error))
    } finally {
      setDeletingAccounts(false)
    }
  }

  return (
    <V2Shell accountCount={hasLoadedAccounts ? accounts.length : undefined} attentionCount={hasLoadedAccounts ? attentionCount : undefined} onLogout={() => void logout()}>
      <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route
          index
          element={
            <V2Dashboard
              accounts={accounts}
              tasks={tasks}
              loading={loadingAccounts || loadingTasks}
              error={accountError || taskError}
              onRefresh={refreshAll}
              onNavigate={navigate}
              onOpenAccount={setSelectedAccount}
              onOpenTask={openTask}
            />
          }
        />
        <Route
          path="accounts"
          element={
            <V2AccountsPage
              accounts={accounts}
              loading={loadingAccounts}
              error={accountError}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onRefresh={() => {
                void refreshAccounts()
              }}
              onOpenAccount={setSelectedAccount}
              onAddAccount={() => setLoginAccount(null)}
              onStartTask={openTaskDialog}
              onDeleteSelected={(ids) => setAccountIdsToDelete(Array.from(new Set(ids)))}
              deleting={deletingAccounts}
            />
          }
        />
        <Route path="tasks" element={<V2TasksPage tasks={tasks} loading={loadingTasks} error={taskError} onRefresh={() => void refreshTasks()} onCreate={() => openTaskDialog()} onOpen={openTask} />} />
        <Route path="automations" element={<V2AutomationsPage schedules={schedules} loading={loadingSchedules} error={scheduleError} onRefresh={() => void refreshSchedules()} onToggle={(schedule, enabled) => void toggleSchedule(schedule, enabled)} onDelete={setScheduleToDelete} onCreate={() => setScheduleDialogOpen(true)} />} />
        <Route path="benefits" element={<V2BenefitsPage accounts={accounts} onStartTask={openTaskDialog} />} />
        <Route path="benefits/wed-puzzle" element={<WedPuzzlePool />} />
        <Route path="benefits/global-telecom" element={<V2GlobalTelecomPage accounts={accounts} />} />
        <Route path="benefits/lucky-three-day" element={<V2LuckyThreeDayPage />} />
        <Route path="benefits/lucky-three-day/:batchId/:skuId" element={<V2LuckyThreeDayPage />} />
        <Route path="business" element={<V2BusinessPage accounts={accounts} />} />
        <Route path="business/order" element={<V2UnifiedBusinessOrderPage accounts={accounts} />} />
        <Route path="business/order/ai-bean-contract" element={<Navigate to={{ pathname: '/business-order/ai-bean-contract', search: location.search }} replace />} />
        <Route path="business/order/fly-card-8" element={<Navigate to={{ pathname: '/business-order/fly-card-8', search: location.search }} replace />} />
        <Route path="product-query" element={<V2RetailProductQueryPage accounts={accounts} />} />
        <Route path="links" element={<PublicLinksAdmin embedded />} />
        <Route path="users" element={<UsersAdmin embedded />} />
        <Route path="announcements" element={<V2AnnouncementsPage />} />
        <Route path="audit" element={<V2AuditPage tasks={tasks} onOpenTask={openTask} />} />
        <Route path="settings" element={<V2SettingsPage />} />
        <Route path="*" element={<Navigate to="/v2" replace />} />
      </Routes>
      </Suspense>

      <V2AccountDrawer
        account={selectedAccount}
        tasks={tasks}
        onClose={() => setSelectedAccount(null)}
        onLogin={(account) => {
          setSelectedAccount(null)
          setLoginAccount(account)
        }}
        onStartTask={(type, ids) => {
          setSelectedAccount(null)
          openTaskDialog(type, ids)
        }}
        onOpenBusiness={(account) => {
          navigate(`/business-query?accountId=${encodeURIComponent(account.id)}`)
        }}
      />

      <V2TaskDrawer task={selectedTask} cancelling={taskCancelling} copyingTokens={copyingTokens} onClose={() => setSelectedTask(null)} onCancel={setTaskToStop} onCopyTokens={() => void copyValidTokens()} />

      <V2TaskDialog
        open={Boolean(taskDialog)}
        initialType={taskDialog?.type}
        accountIds={taskDialog?.accountIds ?? []}
        totalAccountCount={usableAccounts.length}
        loading={taskSubmitting}
        error={taskSubmitError}
        onClose={() => setTaskDialog(null)}
        onSubmit={(args) => void submitTask(args)}
      />

      <V2ScheduleDialog open={scheduleDialogOpen} loading={scheduleSubmitting} error={scheduleError} onClose={() => setScheduleDialogOpen(false)} onSubmit={(input) => void createSchedule(input)} />

      <V2ConfirmDialog
        open={accountIdsToDelete.length > 0}
        title="永久删除选中的账号？"
        description={`将删除 ${accountIdsToDelete.length} 个账号及其登录凭据和关联数据，此操作无法撤销。`}
        confirmLabel="删除账号"
        destructive
        loading={deletingAccounts}
        onClose={() => setAccountIdsToDelete([])}
        onConfirm={() => void removeSelectedAccounts()}
      />

      <V2ConfirmDialog
        open={Boolean(taskToStop)}
        title="停止正在执行的任务？"
        description={taskToStop ? `已完成 ${taskToStop.completedCount} / ${taskToStop.totalCount} 个账号，已完成结果不会回滚。` : ''}
        confirmLabel="停止任务"
        destructive
        loading={taskCancelling}
        onClose={() => setTaskToStop(null)}
        onConfirm={() => {
          if (taskToStop) void stopTask(taskToStop)
        }}
      />

      <V2ConfirmDialog
        open={Boolean(scheduleToDelete)}
        title="删除自动化计划？"
        description={scheduleToDelete ? `计划“${scheduleToDelete.name}”将不再自动触发，历史任务不会删除。` : ''}
        confirmLabel="删除计划"
        destructive
        loading={scheduleDeleting}
        onClose={() => setScheduleToDelete(null)}
        onConfirm={() => {
          if (scheduleToDelete) void removeSchedule(scheduleToDelete)
        }}
      />

      <AccountLoginDialog
        open={loginAccount !== undefined}
        title={loginAccount ? '重新登录账号' : '添加账号'}
        account={loginAccount ? {
          id: loginAccount.id,
          phone: loginAccount.raw?.phone,
          phoneMasked: loginAccount.phoneMasked,
          label: loginAccount.label,
          lastLoginMethod: loginAccount.raw?.lastLoginMethod,
        } : undefined}
        defaultMethod={
          loginAccount?.raw?.lastLoginMethod === 'cmcc_qr' || loginAccount?.raw?.lastLoginMethod === 'manual_cookie'
            ? loginAccount.raw.lastLoginMethod
            : 'cmcc_sms'
        }
        onClose={() => setLoginAccount(undefined)}
        onSuccess={async () => {
          setLoginAccount(undefined)
          await refreshAccounts()
          setToast('账号登录状态已更新')
        }}
      />

      {toast ? (
        <div className="fixed right-3 top-16 z-[80] max-w-sm rounded-md bg-zinc-950 px-4 py-3 text-sm font-medium text-white shadow-xl sm:right-5 lg:right-6">
          {toast}
        </div>
      ) : null}
    </V2Shell>
  )
}
