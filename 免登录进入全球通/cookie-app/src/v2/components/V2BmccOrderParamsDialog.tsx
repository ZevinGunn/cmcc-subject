import { Eye, EyeOff, Loader2, Save, Settings2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import {
  sanitizeBmccOrderCodeInput,
  type BmccActivityConfig,
} from '../lib/bmccActivityOrderApi'
import { BMCC_ACTIVITY_FIELDS } from '../lib/bmccActivityOrderFields'

type Props = {
  open: boolean
  config: BmccActivityConfig
  code: string
  saving?: boolean
  onClose: () => void
  onSave: (config: BmccActivityConfig, code: string) => void
}

export default function V2BmccOrderParamsDialog({
  open,
  config,
  code,
  saving,
  onClose,
  onSave,
}: Props) {
  const [draft, setDraft] = useState<BmccActivityConfig>(config)
  const [draftCode, setDraftCode] = useState(code)
  const [showCode, setShowCode] = useState(false)

  useEffect(() => {
    if (!open) return
    setDraft({ ...config })
    setDraftCode(code)
    setShowCode(false)
  }, [code, config, open])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !saving) onClose()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, open, saving])

  useEffect(() => {
    if (draft.packageCode !== 'JFBXHY' && draftCode.length > 6) {
      setDraftCode(draftCode.slice(0, 6))
    }
  }, [draft.packageCode, draftCode])

  if (!open || typeof document === 'undefined') return null
  const supportsEightDigitCode = draft.packageCode === 'JFBXHY'
  const ready = Boolean(
    draft.activityName && draft.displayName && (draft.proType || draft.productShowCode)
      && draft.packageId && draft.packageCode && draft.pitemShowCode,
  )

  return createPortal(
    <div className="fixed inset-0 z-[145] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="关闭订购参数遮罩"
        disabled={saving}
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="bmcc-order-params-title"
        className="relative z-10 flex max-h-[92dvh] w-full flex-col rounded-t-md border border-zinc-200 bg-white shadow-2xl sm:max-w-4xl sm:rounded-md">
        <header data-dialog-drag-handle className="flex shrink-0 items-start gap-3 border-b border-zinc-200 px-4 py-4 sm:px-5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-zinc-100 text-zinc-700">
            <Settings2 className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="bmcc-order-params-title" className="text-base font-semibold text-zinc-950">订购验证码与请求参数</h2>
            <p className="mt-1 text-xs text-zinc-500">修改请求参数后，现有订购验证码上下文将失效</p>
          </div>
          <button type="button" disabled={saving} onClick={onClose} aria-label="关闭订购参数" className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 disabled:opacity-50">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <div className="border-b border-zinc-200 pb-5">
            <label className="block max-w-md space-y-1.5">
              <span className="text-xs font-medium text-zinc-700">{supportsEightDigitCode ? '订购验证密码（6 或 8 位）' : '订购验证码（6 位）'}</span>
              <span className="flex">
                <input
                  type={showCode ? 'text' : 'password'}
                  value={draftCode}
                  onChange={(event) => setDraftCode(sanitizeBmccOrderCodeInput(event.target.value, supportsEightDigitCode))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder={supportsEightDigitCode ? '8 位原码或 6 位截取码' : '请输入 6 位验证码'}
                  className="h-10 min-w-0 flex-1 rounded-l-md border border-r-0 border-zinc-300 px-3 text-sm outline-none focus:border-red-600"
                />
                <button
                  type="button"
                  onClick={() => setShowCode((value) => !value)}
                  title={showCode ? '隐藏验证码' : '显示验证码'}
                  aria-label={showCode ? '隐藏验证码' : '显示验证码'}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-r-md border border-zinc-300 text-zinc-600 hover:bg-zinc-50">
                  {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
              {supportsEightDigitCode ? <span className="block text-xs text-zinc-500">8 位原码将自动取前 5 位和最后 1 位提交</span> : null}
            </label>
          </div>

          <div className="pt-5">
            <h3 className="text-sm font-semibold text-zinc-950">订购请求配置</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {BMCC_ACTIVITY_FIELDS.map((field) => (
                <label key={field.key} className={cn('space-y-1', field.wide && 'sm:col-span-2')}>
                  <span className="text-xs text-zinc-600">{field.label}{field.required ? ' *' : ''}</span>
                  <input
                    value={String(draft[field.key] || '')}
                    onChange={(event) => setDraft((current) => ({ ...current, [field.key]: event.target.value }))}
                    className="h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600"
                  />
                </label>
              ))}
              <label className="flex min-h-9 items-center gap-2 self-end text-sm text-zinc-800">
                <input type="checkbox" checked={draft.isQd2018 === true} onChange={(event) => setDraft((current) => ({ ...current, isQd2018: event.target.checked }))} />
                <span>启用 isQd2018</span>
              </label>
            </div>
          </div>
        </div>

        <footer className="flex shrink-0 justify-end gap-2 border-t border-zinc-200 px-4 py-3 sm:px-5">
          <button type="button" disabled={saving} onClick={onClose} className="h-9 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">取消</button>
          <button type="button" disabled={saving || !ready} onClick={() => onSave(draft, draftCode)} className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? '保存中' : '应用修改'}
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  )
}
