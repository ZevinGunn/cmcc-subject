import { useEffect, useState } from 'react'
import { AlertTriangle, Loader2, X } from 'lucide-react'
import type { CreateTaskScheduleInput, V2TaskType } from '../lib/types'

const ACTIONS: Array<{ value: V2TaskType; label: string }> = [
  { value: 'global_telecom_daily', label: '全球通每日签到+补签+抽奖' },
  { value: 'refresh_and_sign', label: '刷新 + 签到 + 拼图' },
  { value: 'ck_maintenance', label: 'CK 自动维护' },
  { value: 'wed_recharge', label: '周三拼图' },
  { value: 'query_info', label: '同步账号资料' },
  { value: 'cmcc_auto_checkin', label: '移动活动自动化（默认 dry-run）' },
]

type Props = {
  open: boolean
  loading?: boolean
  error?: string
  onClose: () => void
  onSubmit: (input: CreateTaskScheduleInput) => void
}

export default function V2ScheduleDialog({
  open,
  loading,
  error,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState('每日刷新签到')
  const [action, setAction] = useState<V2TaskType>('refresh_and_sign')
  const [time, setTime] = useState('09:00')
  const [sspid, setSspid] = useState('')

  useEffect(() => {
    if (!open) return
    setName('每日刷新签到')
    setAction('refresh_and_sign')
    setTime('09:00')
    setSspid('')
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="关闭新建计划"
        onClick={onClose}
        disabled={loading}
        className="absolute inset-0 bg-black/40"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="v2-schedule-title"
        className="relative max-h-[100dvh] w-full overflow-y-auto rounded-t-md border border-zinc-200 bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:max-w-lg sm:rounded-md">
        <header className="flex items-start border-b border-zinc-200 px-4 py-4 sm:px-5">
          <div className="min-w-0 flex-1">
            <h2 id="v2-schedule-title" className="text-base font-semibold text-zinc-950">
              新建自动化计划
            </h2>
            <p className="mt-1 text-sm text-zinc-500">北京时间</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="关闭新建计划"
            className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="grid gap-4 px-4 py-5 sm:grid-cols-2 sm:px-5">
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-sm font-medium text-zinc-800">计划名称</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-zinc-800">任务</span>
            <select
              value={action}
              onChange={(event) => setAction(event.target.value as V2TaskType)}
              className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
              {ACTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-zinc-800">每天执行时间</span>
            <input
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          {action === 'refresh_and_sign' || action === 'wed_recharge' || action === 'cmcc_auto_checkin' ? (
            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-sm font-medium text-zinc-800">SSPID</span>
              <input
                value={sspid}
                onChange={(event) => setSspid(event.target.value)}
                placeholder={action === 'cmcc_auto_checkin' ? '可留空；或填 JSON 配置活动模块' : '签到类计划需要填写'}
                className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </label>
          ) : null}
          {error ? (
            <div className="flex items-start gap-2 border-l-4 border-rose-500 bg-rose-50 px-3 py-3 text-sm text-rose-800 sm:col-span-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          ) : null}
        </div>

        <footer className="flex justify-end gap-2 border-t border-zinc-200 px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-9 rounded-md border border-zinc-200 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            取消
          </button>
          <button
            type="button"
            disabled={loading || !name.trim() || !time}
            onClick={() =>
              onSubmit({
                name: name.trim(),
                times: [time],
                action,
                sspid: sspid.trim() || undefined,
                enabled: true,
                timezone: 'Asia/Shanghai',
              })
            }
            className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? '创建中' : '创建计划'}
          </button>
        </footer>
      </section>
    </div>
  )
}
