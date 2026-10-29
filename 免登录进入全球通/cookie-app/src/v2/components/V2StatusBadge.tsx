import { cn } from '@/lib/utils'
import type { V2StatusTone } from '../lib/types'

const TONE_CLASS: Record<V2StatusTone, string> = {
  neutral: 'bg-zinc-100 text-zinc-700 ring-zinc-200',
  info: 'bg-sky-50 text-sky-700 ring-sky-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200',
  danger: 'bg-rose-50 text-rose-700 ring-rose-200',
}

export default function V2StatusBadge({
  label,
  tone = 'neutral',
  className,
}: {
  label: string
  tone?: V2StatusTone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex min-h-6 items-center whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
        TONE_CLASS[tone],
        className,
      )}>
      {label}
    </span>
  )
}

