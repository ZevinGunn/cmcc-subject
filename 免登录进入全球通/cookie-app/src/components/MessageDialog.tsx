import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatUpstreamErrorMessage } from '../../shared/upstreamErrorMessage'

export type MessageDialogState = {
  type: 'success' | 'error' | 'info'
  title: string
  message: string
  errorCode?: string
}

export default function MessageDialog({
  value,
  onClose,
  secondaryAction,
}: {
  value: MessageDialogState
  onClose: () => void
  secondaryAction?: { label: string; onClick: () => void }
}) {
  const Icon = value.type === 'success' ? CheckCircle2 : value.type === 'error' ? AlertCircle : Info
  useEffect(() => {
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
  }, [onClose])

  const content = (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="关闭消息遮罩"
        onClick={onClose}
        className="absolute inset-0 bg-black/55"
      />
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="message-dialog-title"
        className="relative z-10 w-full max-w-[420px] rounded-lg bg-white px-5 pb-5 pt-6 text-center shadow-2xl">
        <button
          type="button"
          aria-label="关闭消息"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-md bg-zinc-100 text-zinc-500 hover:bg-zinc-200">
          <X className="h-5 w-5" />
        </button>
        <div
          className={cn(
            'mx-auto flex h-14 w-14 items-center justify-center rounded-full',
            value.type === 'success'
              ? 'bg-emerald-50 text-emerald-500'
              : value.type === 'error'
                ? 'bg-rose-50 text-rose-500'
                : 'bg-blue-50 text-blue-500',
          )}>
          <Icon className="h-8 w-8" />
        </div>
        <h2 id="message-dialog-title" className="mt-4 text-[22px] font-extrabold text-zinc-950">
          {value.title}
        </h2>
        <div className="mt-4 border-t border-zinc-100 pt-4 text-left">
          <p className="break-words text-[15px] leading-7 text-zinc-700">{value.type === 'error' ? formatUpstreamErrorMessage(value.message, value.errorCode) : value.message}</p>
          {value.errorCode ? (
            <p className="mt-2 text-sm text-zinc-400">错误码：{value.errorCode}</p>
          ) : null}
        </div>
        <div className={cn('mt-6 grid gap-2', secondaryAction && 'sm:grid-cols-2')}>
          {secondaryAction ? (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50">
              {secondaryAction.label}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'h-11 rounded-md text-sm font-semibold text-white',
              value.type === 'error' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-blue-500 hover:bg-blue-600',
            )}>
            我知道了
          </button>
        </div>
      </section>
    </div>
  )
  return typeof document === 'undefined' ? content : createPortal(content, document.body)
}
