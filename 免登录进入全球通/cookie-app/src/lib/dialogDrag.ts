export type DialogRect = {
  left: number
  top: number
  right: number
  bottom: number
}

export function clampDialogOffset(args: {
  rect: DialogRect
  deltaX: number
  deltaY: number
  viewportWidth: number
  viewportHeight: number
  visibleX?: number
  visibleY?: number
}): { x: number; y: number } {
  const visibleX = args.visibleX ?? 64
  const visibleY = args.visibleY ?? 48
  return {
    x: Math.min(
      args.viewportWidth - visibleX - args.rect.left,
      Math.max(visibleX - args.rect.right, args.deltaX),
    ),
    y: Math.min(
      args.viewportHeight - visibleY - args.rect.top,
      Math.max(visibleY - args.rect.bottom, args.deltaY),
    ),
  }
}
