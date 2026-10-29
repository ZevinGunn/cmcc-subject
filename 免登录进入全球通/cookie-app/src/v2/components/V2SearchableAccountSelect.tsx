import { Check, ChevronDown, Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { calculateViewportMenuPosition, type ViewportMenuPosition } from '@/lib/floatingMenu'
import { cn } from '@/lib/utils'
import type { BusinessOrderAccount } from '../lib/businessOrderApi'

function maskPhone(value: string): string {
  return String(value || '').replace(/1\d{10}/g, (phone) => `${phone.slice(0, 3)}****${phone.slice(-4)}`)
}

function accountText(account: BusinessOrderAccount): string {
  const phone = maskPhone(account.displayPhone || account.phoneMasked || account.phone || '')
  const label = maskPhone(account.label || '')
  return [phone, label].filter(Boolean).join(' · ') || account.id
}

export default function V2SearchableAccountSelect({
  accounts,
  value,
  onChange,
  label = '办理账号',
  emptyLabel = '请选择已有账号',
  allowEmpty = true,
  disabled = false,
}: {
  accounts: BusinessOrderAccount[]
  value: string
  onChange: (value: string) => void
  label?: string
  emptyLabel?: string
  allowEmpty?: boolean
  disabled?: boolean
}) {
  const anchorRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [position, setPosition] = useState<(ViewportMenuPosition & { width: number }) | null>(null)
  const selected = accounts.find((account) => account.id === value)

  const options = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const items = accounts.filter((account) => {
      if (!normalized) return true
      return [account.id, account.label, account.phone, account.phoneMasked, account.displayPhone]
        .some((item) => String(item || '').toLowerCase().includes(normalized))
    }).map((account) => ({ id: account.id, label: accountText(account) }))
    return allowEmpty && !normalized ? [{ id: '', label: emptyLabel }, ...items] : items
  }, [accounts, allowEmpty, emptyLabel, query])

  useEffect(() => {
    if (!open) return
    const updatePosition = () => {
      const rect = anchorRef.current?.getBoundingClientRect()
      if (!rect) return
      const width = Math.max(240, rect.width)
      setPosition({
        ...calculateViewportMenuPosition(rect, { width: window.innerWidth, height: window.innerHeight }, {
          width,
          maxHeight: 320,
          preferredHeight: 280,
        }),
        width,
      })
    }
    const closeOutside = (event: PointerEvent) => {
      const target = event.target as Node
      if (anchorRef.current?.contains(target)) return
      const menu = document.querySelector('[data-account-select-menu="true"]')
      if (menu?.contains(target)) return
      setOpen(false)
      setQuery('')
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    document.addEventListener('pointerdown', closeOutside)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      document.removeEventListener('pointerdown', closeOutside)
    }
  }, [open])

  useEffect(() => setActiveIndex(0), [query])

  function choose(id: string) {
    onChange(id)
    setOpen(false)
    setQuery('')
    inputRef.current?.blur()
  }

  return (
    <label className="block min-w-0 space-y-1.5">
      <span className="text-xs font-medium text-zinc-700">{label}</span>
      <div ref={anchorRef} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-controls="account-select-options"
          aria-autocomplete="list"
          disabled={disabled}
          value={open ? query : selected ? accountText(selected) : ''}
          placeholder={emptyLabel}
          onFocus={() => {
            setOpen(true)
            setQuery('')
          }}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false)
              setQuery('')
              inputRef.current?.blur()
              return
            }
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setOpen(true)
              setActiveIndex((index) => options.length ? Math.min(options.length - 1, index + 1) : 0)
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault()
              setActiveIndex((index) => Math.max(0, index - 1))
            }
            if (event.key === 'Enter' && open && options[activeIndex]) {
              event.preventDefault()
              choose(options[activeIndex].id)
            }
          }}
          className="h-10 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-9 text-sm text-zinc-950 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-zinc-100 disabled:text-zinc-500"
        />
        <button
          type="button"
          tabIndex={-1}
          title="展开账号列表"
          aria-label="展开账号列表"
          disabled={disabled}
          onClick={() => {
            if (open) {
              setOpen(false)
              setQuery('')
              inputRef.current?.blur()
            } else {
              setOpen(true)
              inputRef.current?.focus()
            }
          }}
          className="absolute right-0 top-0 grid h-10 w-9 place-items-center text-zinc-500 disabled:opacity-50">
          <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
        </button>
      </div>
      {open && position && typeof document !== 'undefined' ? createPortal(
        <div
          id="account-select-options"
          role="listbox"
          data-account-select-menu="true"
          className="fixed z-[120] overflow-y-auto rounded-md border border-zinc-200 bg-white py-1 shadow-xl"
          style={{
            left: position.left,
            top: position.top,
            bottom: position.bottom,
            width: position.width,
            maxHeight: position.maxHeight,
          }}>
          {options.length ? options.map((option, index) => (
            <button
              key={option.id || '__empty'}
              type="button"
              role="option"
              aria-selected={value === option.id}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => choose(option.id)}
              className={cn(
                'flex min-h-10 w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-800',
                activeIndex === index ? 'bg-emerald-50' : 'hover:bg-zinc-50',
              )}>
              <Check className={cn('h-4 w-4 shrink-0 text-emerald-700', value === option.id ? 'opacity-100' : 'opacity-0')} />
              <span className="min-w-0 break-words">{option.label}</span>
            </button>
          )) : <p className="px-3 py-6 text-center text-sm text-zinc-500">未匹配到账号</p>}
        </div>,
        document.body,
      ) : null}
    </label>
  )
}
