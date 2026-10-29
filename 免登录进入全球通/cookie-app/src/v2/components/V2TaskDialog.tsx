import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Loader2, Play, X } from 'lucide-react'
import type { V2TaskType } from '../lib/types'

const TASK_OPTIONS: Array<{ value: V2TaskType; label: string }> = [
  { value: 'ck_maintenance', label: 'CK 自动维护' },
  { value: 'global_telecom_daily', label: '全球通每日签到+补签+抽奖' },
  { value: 'global_telecom_resign', label: '一键补签+一键盲盒' },
  { value: 'refresh_and_sign', label: '刷新 + 签到 + 拼图' },
  { value: 'query_info', label: '同步账号资料' },
  { value: 'wed_recharge', label: '周三拼图' },
  { value: 'cmcc_auto_checkin', label: '移动活动自动化' },
]

type Props = {
  open: boolean
  initialType?: V2TaskType
  accountIds: string[]
  totalAccountCount: number
  loading?: boolean
  error?: string
  onClose: () => void
  onSubmit: (args: { type: V2TaskType; accountIds: string[]; sspid?: string }) => void
}

export default function V2TaskDialog({
  open,
  initialType = 'ck_maintenance',
  accountIds,
  totalAccountCount,
  loading,
  error,
  onClose,
  onSubmit,
}: Props) {
  const [type, setType] = useState<V2TaskType>(initialType)
  const [scope, setScope] = useState<'selected' | 'all'>(accountIds.length > 0 ? 'selected' : 'all')
  const [sspid, setSspid] = useState('')
  const [autoDryRun, setAutoDryRun] = useState(true)
  const [autoOperations, setAutoOperations] = useState<string[]>(['sign'])

  useEffect(() => {
    if (!open) return
    setType(initialType)
    setScope(accountIds.length > 0 ? 'selected' : 'all')
    setSspid('')
    setAutoDryRun(true)
    setAutoOperations(['sign'])
  }, [accountIds.length, initialType, open])

  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) onClose()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [loading, onClose, open])

  const finalIds = scope === 'selected' ? accountIds : []
  const finalCount = scope === 'selected' ? accountIds.length : totalAccountCount
  const needsSspid = type === 'refresh_and_sign' || type === 'wed_recharge' || type === 'sign' || type === 'global_telecom_resign'
  const autoCheckinOperations = [
    ['sign', '主签到与签到页扩展任务'],
    ['wed', '周三充值日拼图'],
    ['seed', 'AI 豆苗养成记'],
    ['gold', 'AI 豆兑换话费券'],
    ['rate', '评价有礼'],
    ['fee', '话费余额查询'],
    ['seckill', '限时秒杀'],
    ['liaoning', '辽宁充值领券'],
  ] as const
  const canSubmit = finalCount > 0 && !loading
  const title = useMemo(
    () => TASK_OPTIONS.find((option) => option.value === type)?.label || '批量任务',
    [type],
  )

  if (!open) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="关闭新建任务"
        disabled={loading}
        onClick={onClose}
        className="absolute bottom-0 left-0 right-0 top-0 bg-black/40"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="v2-task-dialog-title"
        className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-md border border-zinc-200 bg-white shadow-2xl sm:max-w-xl sm:rounded-md">
        <header className="flex items-start gap-3 border-b border-zinc-200 px-4 py-4 sm:px-5">
          <div className="min-w-0 flex-1">
            <h2 id="v2-task-dialog-title" className="text-base font-semibold text-zinc-950">新建批量任务</h2>
            <p className="mt-1 text-sm text-zinc-500">最终范围 {finalCount} 个账号</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="关闭新建任务"
            className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-5 px-4 py-5 sm:px-5">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-zinc-800">任务类型</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as V2TaskType)}
              className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
              {TASK_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-zinc-800">执行范围</legend>
            {accountIds.length > 0 ? (
              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-zinc-200 px-3 py-3 hover:bg-zinc-50">
                <input
                  type="radio"
                  name="v2-task-scope"
                  checked={scope === 'selected'}
                  onChange={() => setScope('selected')}
                  className="mt-0.5 h-4 w-4 accent-emerald-700"
                />
                <span><strong className="block text-sm font-medium text-zinc-900">已选账号</strong><span className="mt-0.5 block text-xs text-zinc-500">{accountIds.length} 个明确选择的账号</span></span>
              </label>
            ) : null}
            <label className="flex cursor-pointer items-start gap-3 rounded-md border border-zinc-200 px-3 py-3 hover:bg-zinc-50">
              <input
                type="radio"
                name="v2-task-scope"
                checked={scope === 'all'}
                onChange={() => setScope('all')}
                className="mt-0.5 h-4 w-4 accent-emerald-700"
              />
              <span><strong className="block text-sm font-medium text-zinc-900">全部可用账号</strong><span className="mt-0.5 block text-xs text-zinc-500">当前共 {totalAccountCount} 个账号</span></span>
            </label>
          </fieldset>

          {type === 'cmcc_auto_checkin' ? (
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-zinc-800">活动模块</span>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {autoCheckinOperations.map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700">
                      <input type="checkbox" checked={autoOperations.includes(value)} onChange={(event) => setAutoOperations((current) => event.target.checked ? Array.from(new Set([...current, value])) : current.filter((item) => item !== value))} className="h-4 w-4 accent-emerald-700" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <label className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                <input type="checkbox" checked={!autoDryRun} onChange={(event) => setAutoDryRun(!event.target.checked)} className="mt-0.5 h-4 w-4 accent-amber-700" />
                <span><strong className="block">允许真实写操作</strong><span className="mt-0.5 block text-xs">关闭时只查询状态；勾选后可能签到、领奖、兑换或参与秒杀。</span></span>
              </label>
            </div>
          ) : needsSspid ? (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-zinc-800">SSPID</span>
              <input
                value={sspid}
                onChange={(event) => setSspid(event.target.value)}
                placeholder="可留空，使用已有默认配置"
                className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </label>
          ) : null}

          <div className="border-l-4 border-emerald-500 bg-emerald-50 px-3 py-3 text-sm text-emerald-900">
            <strong className="block">{title}</strong>
            <span className="mt-1 block text-xs">任务创建后会进入任务中心，并按账号保存执行结果。</span>
            {type === 'cmcc_auto_checkin' && <span className="mt-1 block text-xs text-amber-700">默认 dry-run；缺少活动专用凭据的模块会被明确跳过。</span>}
          </div>

          {error ? (
            <div className="flex items-start gap-2 border-l-4 border-rose-500 bg-rose-50 px-3 py-3 text-sm text-rose-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}
        </div>

        <footer className="flex justify-end gap-2 border-t border-zinc-200 px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-9 rounded-md border border-zinc-200 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">
            取消
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => onSubmit({ type, accountIds: finalIds, sspid: type === 'cmcc_auto_checkin' ? JSON.stringify({ operations: autoOperations, dryRun: autoDryRun, allowSideEffects: !autoDryRun, includeAllSignTasks: true }) : sspid.trim() || undefined })}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {loading ? '创建中' : '创建并开始'}
          </button>
        </footer>
      </section>
    </div>
  )
}
