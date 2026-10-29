import Sortable from 'sortablejs'

type AccountSortingOptions = {
  getIds: () => string[]
  onStart: () => void
  onDrop: (sourceId: string, targetIndex: number) => void
}

// Keep pointer tracking outside React. Sortable owns the DOM only for the gesture;
// restore its original order before handing the result back to React.
export function createAccountSortable(container: HTMLElement, options: AccountSortingOptions) {
  const coarsePointer = window.matchMedia('(pointer: coarse)')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let active = false
  let chosen = false
  let cancelled = false
  let originalIds: string[] = []
  let landing: HTMLElement | null = null
  let landingRect: DOMRect | null = null
  let clearLanding = () => {}
  let scrollFrame = 0
  let lastFrame = 0
  let pointerY = 0

  function stripCloneIdentity(clone: HTMLElement) {
    for (const node of [clone, ...clone.querySelectorAll<HTMLElement>('[id], [data-account-id], [data-account-sortable], [data-onboarding]')]) {
      for (const attribute of ['id', 'data-account-id', 'data-account-sortable', 'data-onboarding']) node.removeAttribute(attribute)
    }
    clone.setAttribute('aria-hidden', 'true')
    clone.inert = true
  }

  function rememberPointer(event: PointerEvent | TouchEvent | MouseEvent) {
    pointerY = 'touches' in event ? event.touches[0]?.clientY ?? pointerY : event.clientY
  }

  function scroll(time: number) {
    if (!active) return
    const elapsed = lastFrame ? Math.min(time - lastFrame, 32) : 16.7
    lastFrame = time
    const edge = Math.min(80, window.innerHeight / 5)
    const proximity = pointerY < edge
      ? -(1 - Math.max(pointerY, 0) / edge)
      : pointerY > window.innerHeight - edge
        ? 1 - Math.max(window.innerHeight - pointerY, 0) / edge
        : 0
    if (proximity) window.scrollBy({ top: proximity * Math.abs(proximity) * elapsed * 0.85, behavior: 'instant' })
    scrollFrame = requestAnimationFrame(scroll)
  }

  // Runs in capture phase, before Sortable removes its floating element.
  function captureLanding() {
    if (!active || landing || reducedMotion.matches) return
    const ghost = Sortable.ghost
    if (!ghost) return
    landingRect = ghost.getBoundingClientRect()
    landing = ghost.cloneNode(true) as HTMLElement
    stripCloneIdentity(landing)
    landing.className = ghost.className
    landing.classList.remove('account-sort-chosen', 'account-sort-dragging', 'account-sort-fallback')
    landing.classList.add('account-sort-overlay')
    Object.assign(landing.style, {
      position: 'fixed', margin: '0', left: `${landingRect.left}px`, top: `${landingRect.top}px`,
      width: `${landingRect.width}px`, height: `${landingRect.height}px`, transform: 'none',
      transition: 'none', pointerEvents: 'none',
    })
  }

  function finishLanding(sourceId: string) {
    const overlay = landing
    const from = landingRect
    landing = null
    landingRect = null
    if (!overlay || !from) return
    const target = Array.from(container.children).find((node) => (node as HTMLElement).dataset.accountId === sourceId) as HTMLElement | undefined
    if (!target) return
    const to = target.getBoundingClientRect()
    document.body.appendChild(overlay)
    target.classList.add('account-sort-settling')
    const animation = overlay.animate([
      { transform: 'translate3d(0, 0, 0)' },
      { transform: `translate3d(${to.left - from.left}px, ${to.top - from.top}px, 0) scale(${to.width / from.width}, ${to.height / from.height})` },
    ], { duration: 170, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' })
    clearLanding = () => {
      target.classList.remove('account-sort-settling')
      overlay.remove()
      animation.cancel()
      clearLanding = () => {}
    }
    animation.finished.then(() => clearLanding(), () => {})
  }

  function stopScroll() {
    active = false
    cancelAnimationFrame(scrollFrame)
    lastFrame = 0
  }

  const sortable = Sortable.create(container, {
    animation: reducedMotion.matches ? 0 : 160,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    draggable: '[data-account-sortable="true"]',
    dataIdAttr: 'data-account-id',
    handle: coarsePointer.matches ? '[data-account-drag-handle]' : undefined,
    fallbackTolerance: 5,
    forceFallback: true,
    fallbackOnBody: true,
    fallbackClass: 'account-sort-fallback',
    chosenClass: 'account-sort-chosen',
    ghostClass: 'account-sort-ghost',
    dragClass: 'account-sort-dragging',
    filter: 'button, a, input, select, textarea, label, [role="button"], [data-no-account-drag]',
    preventOnFilter: false,
    scroll: false,
    swapThreshold: 0.65,
    // Use the central hit zone for stable placement in both grids and rows.
    invertSwap: false,
    onChoose: () => { clearLanding(); originalIds = options.getIds(); cancelled = false; chosen = true },
    onUnchoose: () => { chosen = false },
    onStart: () => {
      active = true
      if (Sortable.ghost) stripCloneIdentity(Sortable.ghost)
      options.onStart()
      scrollFrame = requestAnimationFrame(scroll)
    },
    onEnd: (event) => {
      stopScroll()
      const sourceId = event.item.dataset.accountId || ''
      const index = event.newDraggableIndex
      const reactIds = options.getIds()
      // An account refresh/removal during a gesture invalidates the drop index.
      if (reactIds.join('\n') !== originalIds.join('\n')) cancelled = true
      // Flush all gesture transforms and restore the exact React-owned DOM,
      // including list headers and notices which are not draggable children.
      const cards = new Map(Array.from(container.children).map((node) => [(node as HTMLElement).dataset.accountId, node]))
      const markers = Array.from(container.children).filter((node) => (node as HTMLElement).dataset.accountId).map((card) => {
        const marker = document.createComment('account-slot')
        card.replaceWith(marker)
        return marker
      })
      reactIds.forEach((id, i) => {
        const card = cards.get(id) as HTMLElement | undefined
        if (card) { card.style.transform = ''; card.style.transition = ''; markers[i]?.replaceWith(card) }
        else markers[i]?.remove()
      })
      if (!cancelled && index !== undefined && index >= 0 && originalIds[index] !== sourceId) options.onDrop(sourceId, index)
      finishLanding(sourceId)
    },
  })

  function cancel() {
    if (!active && !chosen) return
    cancelled = true
    // Use the public event path rather than depending on Sortable internals.
    document.dispatchEvent(new Event('pointerup', { bubbles: true, cancelable: true }))
    document.dispatchEvent(new Event('mouseup', { bubbles: true, cancelable: true }))
    document.dispatchEvent(new Event('touchend', { bubbles: true, cancelable: true }))
  }
  function onKey(event: KeyboardEvent) { if (event.key === 'Escape') cancel() }
  function onPointerCancel() { cancelled = true }
  function updateInput() { cancel(); sortable.option('handle', coarsePointer.matches ? '[data-account-drag-handle]' : undefined) }
  function updateMotion() { sortable.option('animation', reducedMotion.matches ? 0 : 160) }
  document.addEventListener('pointermove', rememberPointer, { passive: true })
  document.addEventListener('touchmove', rememberPointer, { passive: true })
  document.addEventListener('pointerdown', rememberPointer, { passive: true })
  for (const name of ['pointerup', 'mouseup', 'touchend']) document.addEventListener(name, captureLanding, true)
  document.addEventListener('pointercancel', onPointerCancel, true)
  document.addEventListener('touchcancel', onPointerCancel, true)
  document.addEventListener('keydown', onKey)
  window.addEventListener('blur', cancel)
  window.addEventListener('resize', cancel)
  coarsePointer.addEventListener('change', updateInput)
  reducedMotion.addEventListener('change', updateMotion)
  return () => {
    cancelled = true
    cancel()
    stopScroll()
    clearLanding()
    sortable.destroy()
    document.removeEventListener('pointermove', rememberPointer)
    document.removeEventListener('touchmove', rememberPointer)
    document.removeEventListener('pointerdown', rememberPointer)
    for (const name of ['pointerup', 'mouseup', 'touchend']) document.removeEventListener(name, captureLanding, true)
    document.removeEventListener('pointercancel', onPointerCancel, true)
    document.removeEventListener('touchcancel', onPointerCancel, true)
    document.removeEventListener('keydown', onKey)
    window.removeEventListener('blur', cancel)
    window.removeEventListener('resize', cancel)
    coarsePointer.removeEventListener('change', updateInput)
    reducedMotion.removeEventListener('change', updateMotion)
  }
}
