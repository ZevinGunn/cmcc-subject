import { useEffect } from 'react'
import { clampDialogOffset } from '@/lib/dialogDrag'

const INTERACTIVE_SELECTOR =
  'button, a, input, textarea, select, option, label, [contenteditable="true"], [role="button"]'

export function shouldStartDialogDrag(args: {
  button: number
  explicitHandle: boolean
  inHeader: boolean
  interactive: boolean
}): boolean {
  return args.button === 0 && !args.interactive && (args.explicitHandle || args.inHeader)
}

function findBackdrop(target: Element): HTMLElement | null {
  const backdrop = target.closest('.fixed.inset-0')
  return backdrop instanceof HTMLElement ? backdrop : null
}

function findTopLevelPanel(backdrop: HTMLElement, target: Element): HTMLElement | null {
  let panel: Element = target
  while (panel.parentElement && panel.parentElement !== backdrop) panel = panel.parentElement
  if (panel.parentElement !== backdrop || !(panel instanceof HTMLElement)) return null
  if (panel.tagName === 'BUTTON' || panel.classList.contains('cursor-default')) return null
  return panel
}

function markDialogPanels(): void {
  document.querySelectorAll<HTMLElement>('.fixed.inset-0').forEach((backdrop) => {
    for (const child of Array.from(backdrop.children)) {
      if (!(child instanceof HTMLElement)) continue
      if (child.tagName === 'BUTTON' || child.classList.contains('cursor-default')) continue
      child.dataset.globalDialogPanel = 'true'
      if (window.getComputedStyle(child).position === 'static') child.style.position = 'relative'
    }
  })
}

export default function GlobalDialogDrag() {
  useEffect(() => {
    let active:
      | {
          panel: HTMLElement
          pointerId: number
          startX: number
          startY: number
          baseX: number
          baseY: number
          rect: DOMRect
        }
      | undefined

    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return
      const backdrop = findBackdrop(event.target)
      if (!backdrop) return
      const panel = findTopLevelPanel(backdrop, event.target)
      if (!panel) return
      const rect = panel.getBoundingClientRect()
      const explicitHandle = Boolean(event.target.closest('[data-dialog-drag-handle]'))
      const inHeader = event.clientY >= rect.top && event.clientY <= rect.top + Math.min(82, rect.height)
      const interactive = Boolean(event.target.closest(INTERACTIVE_SELECTOR))
      if (!shouldStartDialogDrag({ button: event.button, explicitHandle, inHeader, interactive })) return

      const baseX = Number(panel.dataset.dialogOffsetX || 0)
      const baseY = Number(panel.dataset.dialogOffsetY || 0)
      panel.dataset.globalDialogPanel = 'true'
      panel.dataset.dialogDragging = 'true'
      active = {
        panel,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        baseX,
        baseY,
        rect,
      }
      panel.setPointerCapture?.(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!active || active.pointerId !== event.pointerId) return
      const rawX = event.clientX - active.startX
      const rawY = event.clientY - active.startY
      const next = clampDialogOffset({
        rect: active.rect,
        deltaX: rawX,
        deltaY: rawY,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      })
      const x = active.baseX + next.x
      const y = active.baseY + next.y
      active.panel.dataset.dialogOffsetX = String(x)
      active.panel.dataset.dialogOffsetY = String(y)
      active.panel.style.transform = `translate3d(${x}px, ${y}px, 0)`
      event.preventDefault()
    }

    const finishDrag = (event: PointerEvent) => {
      if (!active || active.pointerId !== event.pointerId) return
      active.panel.dataset.dialogDragging = 'false'
      active.panel.releasePointerCapture?.(event.pointerId)
      active = undefined
    }

    const onDoubleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const backdrop = findBackdrop(event.target)
      if (!backdrop) return
      const panel = findTopLevelPanel(backdrop, event.target)
      if (!panel) return
      const rect = panel.getBoundingClientRect()
      if (event.clientY > rect.top + Math.min(82, rect.height)) return
      panel.dataset.dialogOffsetX = '0'
      panel.dataset.dialogOffsetY = '0'
      panel.style.transform = ''
    }

    markDialogPanels()
    const observer = new MutationObserver(markDialogPanels)
    observer.observe(document.body, { childList: true, subtree: true })
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('pointermove', onPointerMove, { passive: false })
    document.addEventListener('pointerup', finishDrag)
    document.addEventListener('pointercancel', finishDrag)
    document.addEventListener('dblclick', onDoubleClick)
    return () => {
      observer.disconnect()
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', finishDrag)
      document.removeEventListener('pointercancel', finishDrag)
      document.removeEventListener('dblclick', onDoubleClick)
    }
  }, [])

  return null
}
