import { Loader2, PackagePlus, Save, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { CustomBusinessTier } from '../lib/customBusinessTiers'

type Props = {
  open: boolean
  tier?: CustomBusinessTier
  custom: boolean
  saving?: boolean
  onClose: () => void
  onSave: (tier: CustomBusinessTier) => void
  onDelete?: () => void
}

const EMPTY_TIER: CustomBusinessTier = { id: '', name: '', price: 0 }

export default function V2BusinessTierDialog({
  open,
  tier,
  custom,
  saving,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [draft, setDraft] = useState<CustomBusinessTier>(EMPTY_TIER)
  const nameRef = useRef<HTMLInputElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setDraft(tier ? { ...tier } : EMPTY_TIER)
    const frame = window.requestAnimationFrame(() => nameRef.current?.focus())
    return () => {
      window.cancelAnimationFrame(frame)
      returnFocusRef.current?.focus()
      returnFocusRef.current = null
    }
  }, [open, tier])

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

  if (!open || typeof document === 'undefined') return null
  const validCode = /^\d{1,20}$/.test(draft.id)
  const validName = Boolean(draft.name.trim()) && draft.name.trim().length <= 80
  const validPrice = Number.isFinite(draft.price) && draft.price >= 0 && draft.price <= 100000
  const ready = validCode && validName && validPrice

  return createPortal(
    <div className="fixed inset-0 z-[145] flex items-end justify-center sm:items-center sm:p-4">
      <button type="button" aria-label="关闭档位编辑遮罩" disabled={saving} onClick={onClose} className="absolute inset-0 bg-black/45" />
      <section role="dialog" aria-modal="true" aria-labelledby="business-tier-dialog-title" className="relative z-10 flex max-h-[92dvh] w-full flex-col rounded-t-md border border-zinc-200 bg-white shadow-2xl sm:max-w-lg sm:rounded-md">
        <header data-dialog-drag-handle className="flex shrink-0 items-start gap-3 border-b border-zinc-200 px-4 py-4 sm:px-5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-zinc-100 text-zinc-700"><PackagePlus className="h-4 w-4" /></span>
          <div className="min-w-0 flex-1">
            <h2 id="business-tier-dialog-title" className="text-base font-semibold text-zinc-950">{tier ? '编辑业务档位' : '新增自定义档位'}</h2>
            <p className="mt-1 text-xs text-zinc-500">{tier && !custom ? '保存后将创建本地自定义覆盖，不会修改上游返回数据' : '档位保存在当前浏览器'}</p>
          </div>
          <button type="button" disabled={saving} onClick={onClose} aria-label="关闭档位编辑" className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-zinc-500 transition-[background-color,transform] duration-150 hover:bg-zinc-100 active:scale-[0.97] disabled:opacity-50"><X className="h-4 w-4" /></button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-xs font-medium text-zinc-700">档位名称 *</span>
              <input ref={nameRef} value={draft.name} maxLength={80} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="例如：智臻会员199档（A版）" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-zinc-700">产品编码 *</span>
              <input value={draft.id} inputMode="numeric" onChange={(event) => setDraft((current) => ({ ...current, id: event.target.value.replace(/\D/g, '').slice(0, 20) }))} placeholder="请输入 productCode" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
              {draft.id && !validCode ? <span className="block text-xs text-red-600">产品编码必须为 1-20 位数字</span> : null}
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-zinc-700">资费（元/月）*</span>
              <input value={String(draft.price)} inputMode="decimal" onChange={(event) => setDraft((current) => ({ ...current, price: Number(event.target.value.replace(/[^\d.]/g, '')) }))} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
              {!validPrice ? <span className="block text-xs text-red-600">资费必须为 0-100000 之间的数字</span> : null}
            </label>
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-zinc-200 px-4 py-3 sm:px-5">
          <div>{custom && onDelete ? <button type="button" disabled={saving} onClick={onDelete} className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-red-700 transition-[background-color,transform] duration-150 hover:bg-red-50 active:scale-[0.97] disabled:opacity-50"><Trash2 className="h-4 w-4" />删除</button> : null}</div>
          <div className="flex gap-2">
            <button type="button" disabled={saving} onClick={onClose} className="h-9 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition-[background-color,transform] duration-150 hover:bg-zinc-50 active:scale-[0.97] disabled:opacity-50">取消</button>
            <button type="button" disabled={saving || !ready} onClick={() => onSave({ ...draft, name: draft.name.trim() })} className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-zinc-800 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              保存并选中
            </button>
          </div>
        </footer>
      </section>
    </div>,
    document.body,
  )
}
