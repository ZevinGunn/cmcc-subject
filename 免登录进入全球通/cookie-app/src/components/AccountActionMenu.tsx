import { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ViewportMenuPosition } from '@/lib/floatingMenu'

export type AccountMenuAction = {
  label: string
  icon: LucideIcon
  onSelect: () => void
  disabled?: boolean
  danger?: boolean
}

export default function AccountActionMenu({ phone, position, primary, groups, onClose }: {
  phone: string
  position: ViewportMenuPosition
  primary: AccountMenuAction
  groups: { label: string; actions: AccountMenuAction[] }[]
  onClose: () => void
}) {
  const menuRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    menuRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus({ preventScroll: true })
    return () => { if (trigger?.isConnected) trigger.focus({ preventScroll: true }) }
  }, [])
  const actionButton = (action: AccountMenuAction, full = false) => (
    <button key={action.label} type="button" role="menuitem" disabled={action.disabled}
      onClick={action.onSelect}
      className={cn('flex min-h-10 min-w-0 items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-zinc-200 disabled:cursor-not-allowed disabled:text-zinc-400',
        full ? 'w-full bg-zinc-50 text-sm text-zinc-900' : 'text-zinc-700',
        action.danger && 'text-red-700 hover:bg-red-50 focus-visible:bg-red-50')}>
      <action.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="break-words">{action.label}</span>
    </button>
  )
  return createPortal(<>
    <button type="button" tabIndex={-1} aria-label="关闭操作菜单"
      className="fixed inset-0 z-30 cursor-default bg-transparent" onClick={onClose} />
    <div ref={menuRef} role="menu" aria-label={`${phone}功能菜单`} data-placement={position.placement}
      style={{ left: position.left, top: position.top, bottom: position.bottom, maxHeight: position.maxHeight }}
      className="fixed z-40 w-[304px] max-w-[calc(100vw-16px)] overflow-y-auto overscroll-contain rounded-lg border border-zinc-200 bg-white text-sm shadow-[0_12px_32px_rgba(15,23,42,0.16)]"
      onKeyDown={(event) => {
        if (event.key === 'Escape' || event.key === 'Tab') { onClose(); return }
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
        event.preventDefault()
        const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])
        const index = items.indexOf(document.activeElement as HTMLButtonElement)
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
          : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
        const item = items[next]
        item?.focus({ preventScroll: true })
        const menu = menuRef.current
        if (menu && item) {
          const itemRect = item.getBoundingClientRect()
          const menuRect = menu.getBoundingClientRect()
          const stickyHeight = menu.firstElementChild?.getBoundingClientRect().height ?? 0
          if (itemRect.bottom > menuRect.bottom) menu.scrollTop += itemRect.bottom - menuRect.bottom
          else if (itemRect.top < menuRect.top + stickyHeight) menu.scrollTop -= menuRect.top + stickyHeight - itemRect.top
        }
      }}>
      <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white p-2">{actionButton(primary, true)}</div>
      {groups.filter(group => group.actions.length).map(group => <div key={group.label} role="group" aria-label={group.label}
        className="border-b border-zinc-100 p-2 last:border-b-0">
        <div className="px-2.5 pb-1 pt-0.5 text-[11px] font-medium text-zinc-500">{group.label}</div>
        <div className="grid grid-cols-2 gap-0.5">{group.actions.map(action => actionButton(action))}</div>
      </div>)}
    </div>
  </>, document.body)
}
