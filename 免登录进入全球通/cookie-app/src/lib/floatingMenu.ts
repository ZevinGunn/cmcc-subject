export type ViewportRect = {
  left: number
  right: number
  top: number
  bottom: number
}

export type ViewportMenuPosition = {
  left: number
  top?: number
  bottom?: number
  maxHeight: number
  placement: 'top' | 'bottom'
}

export function calculateViewportMenuPosition(
  anchor: ViewportRect,
  viewport: { width: number; height: number },
  options: {
    width?: number
    gap?: number
    margin?: number
    maxHeight?: number
    preferredHeight?: number
  } = {},
): ViewportMenuPosition {
  const width = options.width ?? 160
  const gap = options.gap ?? 6
  const margin = options.margin ?? 8
  const maxHeightLimit = Math.min(options.maxHeight ?? 480, Math.max(1, viewport.height - margin * 2))
  const availableBelow = Math.max(0, viewport.height - anchor.bottom - gap - margin)
  const availableAbove = Math.max(0, anchor.top - gap - margin)
  const preferredHeight = Math.min(options.preferredHeight ?? 320, maxHeightLimit)
  const placement = availableBelow < preferredHeight && availableAbove > availableBelow ? 'top' : 'bottom'
  const availableHeight = placement === 'top' ? availableAbove : availableBelow
  const maxHeight = Math.max(1, Math.min(maxHeightLimit, availableHeight))
  const maxLeft = Math.max(margin, viewport.width - width - margin)
  const left = Math.min(Math.max(margin, anchor.right - width), maxLeft)

  return placement === 'top'
    ? { left, bottom: Math.max(margin, viewport.height - anchor.top + gap), maxHeight, placement }
    : { left, top: Math.max(margin, anchor.bottom + gap), maxHeight, placement }
}
