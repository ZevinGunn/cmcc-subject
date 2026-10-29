import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react'
import {
  AlertTriangle,
  BellRing,
  Bold,
  CalendarClock,
  CheckCircle2,
  Code2,
  Eye,
  FileUp,
  Italic,
  Link,
  List,
  ListOrdered,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react'
import V2ConfirmDialog from '../components/V2ConfirmDialog'

type AnnouncementLevel = 'strong' | 'medium' | 'weak'
type AnnouncementStatus = 'draft' | 'scheduled' | 'active' | 'expired'

type Announcement = {
  id: string
  title: string
  contentHtml: string
  level: AnnouncementLevel
  important: boolean
  enabled: boolean
  publishAt: string
  expireAt?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
  status: AnnouncementStatus
}

type ApiResponse<T> =
  | { ok: true; data: T; requestId: string }
  | { ok: false; message: string; errorCode: string; requestId: string }

type EditorValue = {
  title: string
  contentHtml: string
  level: AnnouncementLevel
  important: boolean
  enabled: boolean
  publishAt: string
  expireAt: string
}

const LEVEL_META: Record<AnnouncementLevel, { label: string; className: string }> = {
  strong: { label: '强', className: 'bg-rose-50 text-rose-700 ring-rose-200' },
  medium: { label: '中', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  weak: { label: '弱', className: 'bg-zinc-100 text-zinc-600 ring-zinc-200' },
}

const STATUS_META: Record<AnnouncementStatus, { label: string; className: string }> = {
  active: { label: '发布中', className: 'bg-emerald-50 text-emerald-700' },
  scheduled: { label: '待发布', className: 'bg-sky-50 text-sky-700' },
  draft: { label: '已停用', className: 'bg-zinc-100 text-zinc-600' },
  expired: { label: '已结束', className: 'bg-zinc-100 text-zinc-500' },
}

function formatDate(value?: string): string {
  if (!value) return '-'
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value))
}

function toLocalInput(value?: string): string {
  const date = value ? new Date(value) : new Date()
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

function fromLocalInput(value: string): string {
  return new Date(value).toISOString()
}

function emptyEditor(): EditorValue {
  return {
    title: '',
    contentHtml: '<p></p>',
    level: 'medium',
    important: false,
    enabled: true,
    publishAt: toLocalInput(),
    expireAt: '',
  }
}

function editorFromAnnouncement(item: Announcement): EditorValue {
  return {
    title: item.title,
    contentHtml: item.contentHtml,
    level: item.level,
    important: item.important,
    enabled: item.enabled,
    publishAt: toLocalInput(item.publishAt),
    expireAt: item.expireAt ? toLocalInput(item.expireAt) : '',
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
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

function AnnouncementEditor({
  announcement,
  onClose,
  onSaved,
}: {
  announcement?: Announcement
  onClose: () => void
  onSaved: (announcement: Announcement) => void
}) {
  const [value, setValue] = useState<EditorValue>(() => announcement ? editorFromAnnouncement(announcement) : emptyEditor())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>()
  const [previewOpen, setPreviewOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !saving) onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, saving])

  function wrapSelection(before: string, after = before) {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.contentHtml.slice(start, end)
    const next = `${value.contentHtml.slice(0, start)}${before}${selected || '内容'}${after}${value.contentHtml.slice(end)}`
    setValue((current) => ({ ...current, contentHtml: next }))
    window.setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + (selected || '内容').length)
    }, 0)
  }

  function addLink() {
    const href = window.prompt('请输入链接地址（https:// 或 http://）')?.trim()
    if (!href) return
    if (!/^https?:\/\//i.test(href)) {
      setError('链接地址必须以 http:// 或 https:// 开头')
      return
    }
    wrapSelection(`<a href="${escapeHtml(href)}">`, '</a>')
  }

  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.size > 1024 * 1024) {
      setError('导入文件不能超过 1MB')
      return
    }
    if (!/\.(html?|txt)$/i.test(file.name)) {
      setError('仅支持 .html、.htm 或 .txt 文件')
      return
    }
    const text = await file.text()
    const contentHtml = /\.txt$/i.test(file.name)
      ? text.split(/\n{2,}/).map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`).join('\n')
      : text
    setValue((current) => ({ ...current, contentHtml }))
    setError(undefined)
  }

  async function save() {
    setError(undefined)
    if (!value.title.trim()) return setError('请输入公告标题')
    if (!value.publishAt) return setError('请选择发布时间')
    if (value.expireAt && new Date(value.expireAt) <= new Date(value.publishAt)) {
      return setError('失效时间必须晚于发布时间')
    }
    setSaving(true)
    try {
      const body = {
        ...value,
        publishAt: fromLocalInput(value.publishAt),
        expireAt: value.expireAt ? fromLocalInput(value.expireAt) : null,
      }
      const data = await apiRequest<{ announcement: Announcement }>(
        announcement ? `/api/announcements/admin/${announcement.id}` : '/api/announcements/admin',
        { method: announcement ? 'PUT' : 'POST', body: JSON.stringify(body) },
      )
      onSaved(data.announcement)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const previewDocument = `<!doctype html><html><head><meta charset="utf-8"><style>body{font:14px/1.7 system-ui,sans-serif;color:#18181b;padding:20px;overflow-wrap:anywhere}img{max-width:100%;height:auto}table{border-collapse:collapse;max-width:100%}th,td{border:1px solid #d4d4d8;padding:6px 8px}blockquote{border-left:3px solid #10b981;margin-left:0;padding-left:12px;color:#52525b}</style></head><body>${value.contentHtml}</body></html>`

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={announcement ? '编辑公告' : '新建公告'}>
      <div className="flex max-h-[96vh] w-full max-w-5xl flex-col bg-white shadow-2xl sm:max-h-[92vh] sm:rounded-md">
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200 px-4 sm:px-5">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold text-zinc-950">{announcement ? '编辑公告' : '新建公告'}</h2>
            <p className="hidden text-xs text-zinc-500 sm:block">保存时自动净化富文本中的危险内容</p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="关闭" className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 disabled:opacity-50">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-zinc-700">标题</span>
                <input value={value.title} maxLength={120} onChange={(event) => setValue((current) => ({ ...current, title: event.target.value }))} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="输入公告标题" />
              </label>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-zinc-700">富文本正文</span>
                  <span className="text-[11px] text-zinc-400">{Math.round(new Blob([value.contentHtml]).size / 1024)} KB / 200 KB</span>
                </div>
                <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-b-0 border-zinc-300 bg-zinc-50 p-1.5">
                  {[
                    { label: '粗体', icon: Bold, action: () => wrapSelection('<strong>', '</strong>') },
                    { label: '斜体', icon: Italic, action: () => wrapSelection('<em>', '</em>') },
                    { label: '无序列表', icon: List, action: () => wrapSelection('<ul>\n  <li>', '</li>\n</ul>') },
                    { label: '有序列表', icon: ListOrdered, action: () => wrapSelection('<ol>\n  <li>', '</li>\n</ol>') },
                    { label: '链接', icon: Link, action: addLink },
                    { label: '代码', icon: Code2, action: () => wrapSelection('<code>', '</code>') },
                  ].map(({ label, icon: Icon, action }) => (
                    <button key={label} type="button" onClick={action} title={label} aria-label={label} className="grid h-8 w-8 place-items-center rounded text-zinc-600 hover:bg-white hover:text-zinc-950 hover:shadow-sm">
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                  <span className="mx-1 h-5 w-px bg-zinc-300" />
                  <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex h-8 items-center gap-1.5 rounded px-2 text-xs font-medium text-zinc-600 hover:bg-white hover:text-zinc-950 hover:shadow-sm">
                    <FileUp className="h-4 w-4" /> 导入
                  </button>
                  <button type="button" onClick={() => setPreviewOpen((open) => !open)} className="inline-flex h-8 items-center gap-1.5 rounded px-2 text-xs font-medium text-zinc-600 hover:bg-white hover:text-zinc-950 hover:shadow-sm">
                    <Eye className="h-4 w-4" /> {previewOpen ? '编辑' : '预览'}
                  </button>
                  <input ref={fileRef} type="file" accept=".html,.htm,.txt,text/html,text/plain" onChange={(event) => void importFile(event)} className="hidden" />
                </div>
                {previewOpen ? (
                  <iframe sandbox="" title="公告内容预览" srcDoc={previewDocument} className="h-[360px] w-full rounded-b-md border border-zinc-300 bg-white" />
                ) : (
                  <textarea ref={textareaRef} value={value.contentHtml} onChange={(event) => setValue((current) => ({ ...current, contentHtml: event.target.value }))} className="h-[360px] w-full resize-y rounded-b-md border border-zinc-300 bg-white p-3 font-mono text-[13px] leading-6 text-zinc-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" spellCheck={false} placeholder="输入 HTML 富文本内容" />
                )}
              </div>
            </div>

            <div className="space-y-4 border-t border-zinc-200 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
              <fieldset>
                <legend className="mb-2 text-xs font-medium text-zinc-700">提醒等级</legend>
                <div className="grid grid-cols-3 gap-1 rounded-md bg-zinc-100 p-1">
                  {(['strong', 'medium', 'weak'] as const).map((level) => (
                    <button key={level} type="button" onClick={() => setValue((current) => ({ ...current, level }))} className={`h-8 rounded text-xs font-semibold ${value.level === level ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}>
                      {LEVEL_META[level].label}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] leading-5 text-zinc-500">
                  {value.level === 'strong' ? '每天首次访问提醒一次' : value.level === 'medium' ? '首次访问提醒一次' : '仅在通知中心展示'}
                </p>
              </fieldset>

              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-zinc-200 p-3">
                <input type="checkbox" checked={value.important} onChange={(event) => setValue((current) => ({ ...current, important: event.target.checked }))} className="mt-0.5 h-4 w-4 accent-rose-600" />
                <span>
                  <strong className="block text-xs text-zinc-900">重要公告</strong>
                  <span className="mt-0.5 block text-[11px] leading-5 text-zinc-500">首次默认弹出，用户可永久关闭提醒</span>
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-zinc-700">发布时间</span>
                <input type="datetime-local" value={value.publishAt} onChange={(event) => setValue((current) => ({ ...current, publishAt: event.target.value }))} className="h-10 w-full rounded-md border border-zinc-300 px-2.5 text-xs outline-none focus:border-emerald-500" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-zinc-700">失效时间（可选）</span>
                <input type="datetime-local" value={value.expireAt} onChange={(event) => setValue((current) => ({ ...current, expireAt: event.target.value }))} className="h-10 w-full rounded-md border border-zinc-300 px-2.5 text-xs outline-none focus:border-emerald-500" />
              </label>

              <label className="flex cursor-pointer items-center justify-between gap-3 border-y border-zinc-200 py-3">
                <span>
                  <strong className="block text-xs text-zinc-900">启用公告</strong>
                  <span className="mt-0.5 block text-[11px] text-zinc-500">关闭后作为停用状态保存</span>
                </span>
                <input type="checkbox" checked={value.enabled} onChange={(event) => setValue((current) => ({ ...current, enabled: event.target.checked }))} className="h-4 w-4 accent-emerald-600" />
              </label>
            </div>
          </div>

          {error ? (
            <div className="mt-4 flex items-start gap-2 border-l-4 border-rose-500 bg-rose-50 px-3 py-2.5 text-sm text-rose-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-zinc-200 px-4 py-3 sm:px-5">
          <button type="button" onClick={onClose} disabled={saving} className="h-9 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">取消</button>
          <button type="button" onClick={() => void save()} disabled={saving} className="inline-flex h-9 min-w-24 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {saving ? '保存中' : '保存公告'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function V2AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [status, setStatus] = useState<'all' | AnnouncementStatus>('all')
  const [editor, setEditor] = useState<Announcement | null | undefined>(undefined)
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<string>()

  const load = useCallback(async () => {
    setLoading(true)
    setError(undefined)
    try {
      const data = await apiRequest<{ announcements: Announcement[] }>('/api/announcements/admin')
      setAnnouncements(data.announcements)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '加载公告失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(undefined), 3000)
    return () => window.clearTimeout(timer)
  }, [toast])

  async function remove() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await apiRequest<Record<string, never>>(`/api/announcements/admin/${deleteTarget.id}`, { method: 'DELETE' })
      setAnnouncements((current) => current.filter((item) => item.id !== deleteTarget.id))
      setDeleteTarget(null)
      setToast('公告已删除')
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : '删除公告失败')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = status === 'all' ? announcements : announcements.filter((item) => item.status === status)

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-950">公告管理</h1>
          <p className="mt-1 text-sm text-zinc-500">定时发布通知，管理 public 页面提醒策略</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => void load()} disabled={loading} aria-label="刷新公告" title="刷新" className="grid h-9 w-9 place-items-center rounded-md border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button type="button" onClick={() => setEditor(null)} className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800">
            <Plus className="h-4 w-4" /> 新建公告
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 pb-3">
        {([
          ['all', '全部'], ['active', '发布中'], ['scheduled', '待发布'], ['draft', '已停用'], ['expired', '已结束'],
        ] as const).map(([value, label]) => {
          const count = value === 'all' ? announcements.length : announcements.filter((item) => item.status === value).length
          return (
            <button key={value} type="button" onClick={() => setStatus(value)} className={`h-8 rounded-md px-2.5 text-xs font-medium ${status === value ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}>
              {label} <span className={status === value ? 'text-zinc-300' : 'text-zinc-400'}>{count}</span>
            </button>
          )
        })}
      </div>

      {error ? (
        <div className="flex items-start gap-2 border-l-4 border-rose-500 bg-rose-50 px-3 py-3 text-sm text-rose-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="min-w-0 flex-1">{error}</span>
          <button type="button" onClick={() => setError(undefined)} aria-label="关闭错误提示"><X className="h-4 w-4" /></button>
        </div>
      ) : null}

      <div className="overflow-hidden border-y border-zinc-200 bg-white sm:rounded-md sm:border">
        <div className="hidden grid-cols-[minmax(240px,1fr)_120px_140px_160px_88px] gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-[11px] font-medium text-zinc-500 lg:grid">
          <span>公告</span><span>状态 / 等级</span><span>发布时间</span><span>失效时间</span><span className="text-right">操作</span>
        </div>
        {loading && announcements.length === 0 ? (
          <div className="divide-y divide-zinc-100">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="grid animate-pulse gap-3 px-4 py-4 lg:grid-cols-[minmax(240px,1fr)_120px_140px_160px_88px]">
                <div><div className="h-4 w-3/5 rounded bg-zinc-200" /><div className="mt-2 h-3 w-2/5 rounded bg-zinc-100" /></div>
                <div className="h-6 w-20 rounded bg-zinc-100" /><div className="h-4 w-24 rounded bg-zinc-100" /><div className="h-4 w-24 rounded bg-zinc-100" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <BellRing className="mx-auto h-8 w-8 text-zinc-300" />
            <p className="mt-3 text-sm font-medium text-zinc-700">{announcements.length === 0 ? '还没有公告' : '没有符合筛选条件的公告'}</p>
            <p className="mt-1 text-xs text-zinc-500">{announcements.length === 0 ? '创建后可立即发布或设置未来发布时间' : '切换筛选条件查看其他公告'}</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filtered.map((item) => {
              const level = LEVEL_META[item.level]
              const state = STATUS_META[item.status]
              return (
                <div key={item.id} className="grid gap-3 px-4 py-3.5 hover:bg-zinc-50/70 lg:grid-cols-[minmax(240px,1fr)_120px_140px_160px_88px] lg:items-center">
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      {item.important ? <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" aria-label="重要公告" /> : null}
                      <strong className="truncate text-sm text-zinc-950">{item.title}</strong>
                    </div>
                    <div className="mt-1 truncate text-xs text-zinc-500">由 {item.createdBy || '管理员'} 更新于 {formatDate(item.updatedAt)}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`rounded px-1.5 py-1 text-[11px] font-medium ${state.className}`}>{state.label}</span>
                    <span className={`rounded px-1.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${level.className}`}>{level.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-600"><CalendarClock className="h-3.5 w-3.5 shrink-0 text-zinc-400 lg:hidden" />{formatDate(item.publishAt)}</div>
                  <div className="text-xs text-zinc-500">{formatDate(item.expireAt)}</div>
                  <div className="flex justify-end gap-1">
                    <button type="button" onClick={() => setEditor(item)} title="编辑" aria-label={`编辑 ${item.title}`} className="grid h-8 w-8 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"><Pencil className="h-4 w-4" /></button>
                    <button type="button" onClick={() => setDeleteTarget(item)} title="删除" aria-label={`删除 ${item.title}`} className="grid h-8 w-8 place-items-center rounded-md text-zinc-400 hover:bg-rose-50 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {editor !== undefined ? (
        <AnnouncementEditor
          announcement={editor ?? undefined}
          onClose={() => setEditor(undefined)}
          onSaved={(saved) => {
            setAnnouncements((current) => [saved, ...current.filter((item) => item.id !== saved.id)])
            setEditor(undefined)
            setToast(editor ? '公告已更新' : '公告已创建')
          }}
        />
      ) : null}

      <V2ConfirmDialog open={Boolean(deleteTarget)} title="删除公告？" description={deleteTarget ? `公告“${deleteTarget.title}”及全部用户提醒记录将被删除，建议日常下线使用停用。` : ''} confirmLabel="删除公告" destructive loading={deleting} onClose={() => setDeleteTarget(null)} onConfirm={() => void remove()} />

      {toast ? <div className="fixed right-4 top-16 z-[90] rounded-md bg-zinc-950 px-4 py-3 text-sm font-medium text-white shadow-xl">{toast}</div> : null}
    </div>
  )
}
