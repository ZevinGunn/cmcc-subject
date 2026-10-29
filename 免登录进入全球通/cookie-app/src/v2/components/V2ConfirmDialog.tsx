import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, Loader2, X } from 'lucide-react'

type Props = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  loading?: boolean
  destructive?: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function V2ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  loading,
  destructive = false,
  onClose,
  onConfirm,
}: Props) {
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, open])

  if (!open || typeof document === 'undefined') return null
  return createPortal(
    <div className="fixed inset-0 z-[140] flex items-end justify-center sm:items-center sm:p-4">
      <button type="button" aria-label="关闭确认遮罩" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <section role="alertdialog" aria-modal="true" aria-labelledby="v2-confirm-title" className="relative z-10 w-full rounded-t-md border border-zinc-200 bg-white shadow-2xl sm:max-w-md sm:rounded-md">
        <header className="flex items-start gap-3 border-b border-zinc-200 px-4 py-4">
          <span className={destructive ? 'grid h-9 w-9 shrink-0 place-items-center rounded-md bg-rose-50 text-rose-700' : 'grid h-9 w-9 shrink-0 place-items-center rounded-md bg-amber-50 text-amber-700'}>
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="v2-confirm-title" className="text-base font-semibold text-zinc-950">{title}</h2>
            <p className="mt-1 text-sm text-zinc-600">{description}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭确认" className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100">
            <X className="h-4 w-4" />
          </button>
        </header>
        <footer className="flex justify-end gap-2 px-4 py-3">
          <button type="button" onClick={onClose} className="h-9 rounded-md border border-zinc-200 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50">取消</button>
          <button type="button" onClick={onConfirm} disabled={loading} className={destructive ? 'inline-flex h-9 items-center gap-2 rounded-md bg-rose-600 px-3 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50' : 'inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50'}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? '处理中' : confirmLabel}
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  )
}
