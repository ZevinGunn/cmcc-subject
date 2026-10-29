import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import {
  AlertTriangle,
  Bell,
  BellOff,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Loader2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type AnnouncementLevel = 'strong' | 'medium' | 'weak'

export type PublicAnnouncement = {
  id: string
  title: string
  contentHtml: string
  level: AnnouncementLevel
  important: boolean
  publishAt: string
  expireAt?: string
  readAt?: string
  dismissedAt?: string
}

export type PublicAnnouncementData = {
  announcements: PublicAnnouncement[]
  unreadCount: number
  popupAnnouncement: PublicAnnouncement | null
  serverDay: string
}

type ApiResponse<T> =
  | { ok: true; data: T; requestId: string }
  | { ok: false; message: string; errorCode: string; requestId: string }

const LEVEL_META: Record<AnnouncementLevel, { label: string; className: string }> = {
  strong: { label: '强提醒', className: 'bg-rose-50 text-rose-700 ring-rose-200' },
  medium: { label: '中提醒', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  weak: { label: '通知', className: 'bg-zinc-100 text-zinc-600 ring-zinc-200' },
}

const GUIDE_STEPS = [
  {
    selector: '[data-onboarding="login-entry"]',
    title: '登录或新增移动账号',
    description: '从这里选择 10086 验证码、App 扫码、导入 CK 或云盘登录。',
  },
  {
    selector: '[data-onboarding="account-summary"]',
    title: '快速掌握账号状态',
    description: '总数、可用、将到期和未登录状态集中展示，右上角刷新按钮可同步最新账号状态。',
  },
  {
    selector: '[data-onboarding="batch-actions"]',
    title: '批量执行常用任务',
    description: '一键维护会检查并恢复登录态；一键签到和一键拼图可批量处理当前可用账号。',
  },
  {
    selector: '[data-onboarding="account-card"]',
    title: '查看单个账号详情',
    description: '账号卡片展示 CK、Token、登录方式、有效期和任务状态，点击详情可查看更多信息。',
  },
  {
    selector: '[data-onboarding="account-menu"]',
    title: '打开账号业务操作',
    description: '重新登录位于菜单顶部；全球通、云服务和 10086 服务按当前登录能力分组展示。',
  },
  {
    selector: '[data-onboarding="notifications"]',
    title: '查看通知和帮助',
    description: '铃铛展示未读公告，帮助按钮可随时重新打开本指引。',
  },
] as const

function onboardingStorageKey(userId: string): string {
  return `cmcc_public_onboarding_v2_${userId}`
}

function OverlayPortal({ children }: { children: ReactNode }) {
  if (typeof document === 'undefined') return null
  return createPortal(children, document.body)
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value))
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: 'same-origin',
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json', ...init.headers } : init?.headers,
  })
  const payload = await response.json() as ApiResponse<T>
  if (!payload.ok) {
    const failure = payload as Extract<ApiResponse<T>, { ok: false }>
    throw new Error(failure.message || '请求失败')
  }
  return payload.data
}

function RichAnnouncementContent({ html }: { html: string }) {
  return (
    <div
      className="break-words text-sm leading-7 text-zinc-700 [&_a]:text-blue-700 [&_a]:underline [&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-400 [&_blockquote]:pl-3 [&_h1]:my-3 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:my-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:my-2 [&_h3]:font-semibold [&_img]:my-3 [&_img]:h-auto [&_img]:max-w-full [&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-zinc-950 [&_pre]:p-3 [&_pre]:text-xs [&_pre]:text-zinc-100 [&_table]:my-3 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_td]:border [&_td]:border-zinc-200 [&_td]:p-2 [&_th]:border [&_th]:border-zinc-200 [&_th]:bg-zinc-50 [&_th]:p-2 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function GuideOverlay({
  userId,
  onClose,
}: {
  userId: string
  onClose: () => void
}) {
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const steps = useMemo(
    () => GUIDE_STEPS.filter((item) => Boolean(document.querySelector(item.selector))),
    [],
  )
  const current = steps[step] ?? GUIDE_STEPS[0]

  useEffect(() => {
    const element = document.querySelector(current.selector)
    function updateRect() {
      if (!element) {
        setRect(null)
        return
      }
      setRect(element.getBoundingClientRect())
    }
    element?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    updateRect()
    const settleTimer = window.setTimeout(updateRect, 300)
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, true)
    return () => {
      window.clearTimeout(settleTimer)
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [current.selector])

  function complete() {
    window.localStorage.setItem(onboardingStorageKey(userId), 'done')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[1200] isolate" role="dialog" aria-modal="true" aria-label="新手指引">
      {rect ? (
        <div
          className="pointer-events-none fixed z-0 rounded-md ring-2 ring-emerald-400"
          style={{
            left: Math.max(6, rect.left - 6),
            top: Math.max(6, rect.top - 6),
            width: Math.min(window.innerWidth - 12, rect.width + 12),
            height: rect.height + 12,
            boxShadow: '0 0 0 9999px rgba(9, 9, 11, 0.64)',
          }}
        />
      ) : <div className="absolute inset-0 bg-black/60" />}

      <div className="fixed inset-x-3 bottom-3 z-10 mx-auto max-w-md rounded-md bg-white p-4 shadow-2xl sm:bottom-6">
        <div className="flex items-start gap-3">
          <div className="grid h-8 min-w-10 shrink-0 place-items-center rounded-md bg-emerald-50 px-1.5 text-xs font-semibold text-emerald-700">{step + 1}/{steps.length}</div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-zinc-950">{current.title}</h2>
            <p className="mt-1 text-xs leading-5 text-zinc-600">{current.description}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <button type="button" onClick={complete} className="text-xs font-medium text-zinc-500 hover:text-zinc-900">跳过指引</button>
          <div className="flex items-center gap-2">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((value) => value - 1)} aria-label="上一步" title="上一步" className="grid h-9 w-9 place-items-center rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
            ) : null}
            <button type="button" onClick={() => step === steps.length - 1 ? complete() : setStep((value) => value + 1)} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-zinc-950 px-3 text-xs font-medium text-white hover:bg-zinc-800">
              {step === steps.length - 1 ? <><Check className="h-4 w-4" /> 完成</> : <>下一步 <ChevronRight className="h-4 w-4" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PublicExperienceControls({
  userId,
  initialData,
  onNotify,
}: {
  userId: string
  initialData?: PublicAnnouncementData
  onNotify: (type: 'success' | 'error', message: string) => void
}) {
  const [announcements, setAnnouncements] = useState<PublicAnnouncement[]>(initialData?.announcements ?? [])
  const [unreadCount, setUnreadCount] = useState(initialData?.unreadCount ?? 0)
  const [loading, setLoading] = useState(!initialData)
  const [centerOpen, setCenterOpen] = useState(false)
  const [selected, setSelected] = useState<PublicAnnouncement | null>(null)
  const [popup, setPopup] = useState<PublicAnnouncement | null>(initialData?.popupAnnouncement ?? null)
  const [popupRecorded, setPopupRecorded] = useState<string>()
  const [guideOpen, setGuideOpen] = useState(false)
  const guideScheduledRef = useRef(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await request<PublicAnnouncementData>('/api/announcements/public')
      setAnnouncements(data.announcements)
      setUnreadCount(data.unreadCount)
      setPopup(data.popupAnnouncement)
    } catch (error) {
      onNotify('error', error instanceof Error ? error.message : '公告加载失败')
    } finally {
      setLoading(false)
    }
  }, [onNotify])

  useEffect(() => {
    if (initialData) {
      setAnnouncements(initialData.announcements)
      setUnreadCount(initialData.unreadCount)
      setPopup(initialData.popupAnnouncement)
      setLoading(false)
      return
    }
    void load()
  }, [initialData, load, userId])

  useEffect(() => {
    if (loading || popup || guideScheduledRef.current) return
    guideScheduledRef.current = true
    if (window.localStorage.getItem(onboardingStorageKey(userId))) return
    const timer = window.setTimeout(() => setGuideOpen(true), 450)
    return () => window.clearTimeout(timer)
  }, [loading, popup, userId])

  useEffect(() => {
    if (!popup || popupRecorded === popup.id) return
    setPopupRecorded(popup.id)
    setUnreadCount((count) => Math.max(0, count - (popup.readAt ? 0 : 1)))
    setAnnouncements((items) => items.map((item) => item.id === popup.id ? { ...item, readAt: item.readAt || new Date().toISOString() } : item))
    void request<{ receipt: unknown }>(`/api/announcements/${popup.id}/shown`, { method: 'POST' }).catch((error) => {
      onNotify('error', error instanceof Error ? error.message : '公告提醒状态保存失败')
    })
  }, [onNotify, popup, popupRecorded])

  const sortedAnnouncements = useMemo(
    () => [...announcements].sort((a, b) => Number(b.important) - Number(a.important) || Date.parse(b.publishAt) - Date.parse(a.publishAt)),
    [announcements],
  )

  async function markRead(item: PublicAnnouncement) {
    setSelected(item)
    if (item.readAt) return
    const now = new Date().toISOString()
    setAnnouncements((items) => items.map((current) => current.id === item.id ? { ...current, readAt: now } : current))
    setUnreadCount((count) => Math.max(0, count - 1))
    try {
      await request<{ receipt: unknown; unreadCount: number }>(`/api/announcements/${item.id}/read`, { method: 'POST' })
    } catch (error) {
      setAnnouncements((items) => items.map((current) => current.id === item.id ? { ...current, readAt: undefined } : current))
      setUnreadCount((count) => count + 1)
      onNotify('error', error instanceof Error ? error.message : '标记已读失败')
    }
  }

  function closePopup() {
    setPopup(null)
    if (!window.localStorage.getItem(onboardingStorageKey(userId))) {
      window.setTimeout(() => setGuideOpen(true), 250)
      guideScheduledRef.current = true
    }
  }

  async function dismissPopup(scope: 'today' | 'forever') {
    if (!popup) return
    const current = popup
    closePopup()
    try {
      await request<{ receipt: unknown }>(`/api/announcements/${current.id}/dismiss`, {
        method: 'POST',
        body: JSON.stringify({ scope }),
      })
      setAnnouncements((items) => items.map((item) => item.id === current.id && scope === 'forever' ? { ...item, dismissedAt: new Date().toISOString() } : item))
    } catch (error) {
      onNotify('error', error instanceof Error ? error.message : '提醒设置保存失败')
    }
  }

  return (
    <>
      <div className="flex shrink-0 items-center gap-1" data-onboarding="notifications">
        <button type="button" onClick={() => setGuideOpen(true)} aria-label="打开新手指引" title="新手指引" className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
          <CircleHelp className="h-[18px] w-[18px]" />
        </button>
        <button type="button" onClick={() => setCenterOpen(true)} aria-label={`通知中心，${unreadCount} 条未读`} title="通知中心" className="relative grid h-9 w-9 place-items-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950">
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 ? (
            <span className="absolute right-0 top-0 inline-flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          ) : null}
        </button>
      </div>

      {centerOpen ? (
        <OverlayPortal>
          <div className="fixed inset-0 z-[1000]" role="dialog" aria-modal="true" aria-label="通知中心">
            <button type="button" aria-label="关闭通知中心" className="absolute inset-0 h-full w-full bg-black/40" onClick={() => setCenterOpen(false)} />
            <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-md bg-white shadow-2xl sm:inset-y-0 sm:left-auto sm:w-[430px] sm:rounded-none">
              <div className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200 px-4">
                <Bell className="h-4 w-4 text-zinc-500" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-zinc-950">通知中心</h2>
                  <p className="text-[11px] text-zinc-500">{unreadCount > 0 ? `${unreadCount} 条未读公告` : '已查看全部公告'}</p>
                </div>
                <button type="button" onClick={() => setCenterOpen(false)} aria-label="关闭" className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100"><X className="h-4 w-4" /></button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                {selected ? (
                  <div className="p-4">
                    <button type="button" onClick={() => setSelected(null)} className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900"><ChevronLeft className="h-3.5 w-3.5" />返回公告列表</button>
                    <div className="flex flex-wrap items-center gap-2">
                      {selected.important ? <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700"><AlertTriangle className="h-3 w-3" />重要</span> : null}
                      <span className={`rounded px-2 py-1 text-[11px] font-medium ring-1 ring-inset ${LEVEL_META[selected.level].className}`}>{LEVEL_META[selected.level].label}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-zinc-950">{selected.title}</h3>
                    <p className="mt-1 text-xs text-zinc-500">{formatDate(selected.publishAt)}</p>
                    <div className="mt-4 border-t border-zinc-200 pt-2"><RichAnnouncementContent html={selected.contentHtml} /></div>
                  </div>
                ) : loading ? (
                  <div className="flex min-h-64 items-center justify-center text-sm text-zinc-500"><Loader2 className="mr-2 h-4 w-4 animate-spin" />加载公告</div>
                ) : sortedAnnouncements.length === 0 ? (
                  <div className="px-4 py-16 text-center"><BellOff className="mx-auto h-8 w-8 text-zinc-300" /><p className="mt-3 text-sm font-medium text-zinc-700">暂无公告</p><p className="mt-1 text-xs text-zinc-500">新的通知会显示在这里</p></div>
                ) : (
                  <div className="divide-y divide-zinc-100">
                    {sortedAnnouncements.map((item) => (
                      <button key={item.id} type="button" onClick={() => void markRead(item)} className="flex w-full items-start gap-3 px-4 py-3.5 text-left hover:bg-zinc-50">
                        <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', item.readAt ? 'bg-zinc-200' : 'bg-rose-600')} />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5">
                            {item.important ? <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-600" /> : null}
                            <strong className="truncate text-sm font-medium text-zinc-900">{item.title}</strong>
                          </span>
                          <span className="mt-1 block text-xs text-zinc-500">{LEVEL_META[item.level].label} · {formatDate(item.publishAt)}</span>
                        </span>
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-zinc-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </OverlayPortal>
      ) : null}

      {popup ? (
        <OverlayPortal>
          <div className="fixed inset-0 z-[1100] flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={popup.title}>
            <div className="flex max-h-[88vh] w-full max-w-xl flex-col rounded-t-md bg-white shadow-2xl sm:rounded-md">
              <div className={cn('h-1.5 shrink-0 sm:rounded-t-md', popup.important ? 'bg-rose-600' : popup.level === 'strong' ? 'bg-amber-500' : 'bg-emerald-600')} />
              <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-md', popup.important ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700')}>
                    {popup.important ? <AlertTriangle className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {popup.important ? <span className="text-[11px] font-semibold text-rose-700">重要公告</span> : <span className="text-[11px] font-semibold text-amber-700">{LEVEL_META[popup.level].label}</span>}
                      <span className="text-[11px] text-zinc-400">{formatDate(popup.publishAt)}</span>
                    </div>
                    <h2 className="mt-1 text-lg font-semibold text-zinc-950">{popup.title}</h2>
                  </div>
                </div>
                <div className="mt-4 border-t border-zinc-200 pt-2"><RichAnnouncementContent html={popup.contentHtml} /></div>
              </div>
              <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-zinc-200 p-3 sm:flex-row sm:items-center sm:justify-end sm:px-5">
                {popup.important || popup.level === 'medium' ? (
                  <button type="button" onClick={() => void dismissPopup('forever')} className="h-9 rounded-md px-3 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">不再提醒</button>
                ) : popup.level === 'strong' ? (
                  <button type="button" onClick={() => void dismissPopup('today')} className="h-9 rounded-md px-3 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">今天不再提醒</button>
                ) : null}
                <button type="button" onClick={closePopup} className="h-9 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800">知道了</button>
              </div>
            </div>
          </div>
        </OverlayPortal>
      ) : null}

      {guideOpen && !popup ? (
        <OverlayPortal>
          <GuideOverlay userId={userId} onClose={() => setGuideOpen(false)} />
        </OverlayPortal>
      ) : null}
    </>
  )
}
