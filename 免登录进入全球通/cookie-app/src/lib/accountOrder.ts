export type AccountOrderItem = {
  id: string
  publicPinnedAt?: string
  publicSortOrder?: number
}

export function reorderAccountsForDrop<T extends AccountOrderItem>(
  accounts: T[],
  sourceId: string,
  targetId: string,
  placement: 'before' | 'after',
  pinnedAt = new Date().toISOString(),
): T[] {
  if (!sourceId || !targetId || sourceId === targetId) return accounts
  const source = accounts.find((item) => item.id === sourceId)
  const target = accounts.find((item) => item.id === targetId)
  if (!source || !target) return accounts

  const moved = {
    ...source,
    publicPinnedAt: target.publicPinnedAt ? source.publicPinnedAt || pinnedAt : undefined,
  }
  const remaining = accounts.filter((item) => item.id !== sourceId)
  const targetIndex = remaining.findIndex((item) => item.id === targetId)
  remaining.splice(targetIndex + (placement === 'after' ? 1 : 0), 0, moved as T)

  return [
    ...remaining.filter((item) => item.publicPinnedAt),
    ...remaining.filter((item) => !item.publicPinnedAt),
  ].map((item, index) => ({ ...item, publicSortOrder: index })) as T[]
}
