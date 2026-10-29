export type PoolWorkerResult = {
  ok: boolean
  message?: string
  errorCode?: string
  status?: number
}

export async function runPool<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, idx: number) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) return []
  const results: R[] = new Array(items.length)
  let cursor = 0
  const runners = Array.from({ length: Math.min(limit, items.length) }).map(
    async () => {
      while (cursor < items.length) {
        const idx = cursor
        cursor += 1
        results[idx] = await worker(items[idx], idx)
      }
    },
  )
  await Promise.all(runners)
  return results
}

