type AnyFn<T> = () => Promise<T>

// Per-key mutex: ensures tasks for same key run sequentially.
const keyLocks = new Map<string, Promise<unknown>>()

export async function withKeyLock<T>(key: string, fn: AnyFn<T>): Promise<T> {
  const prev = keyLocks.get(key) ?? Promise.resolve()
  const next = prev
    .catch(() => undefined)
    .then(fn)
    .finally(() => {
      if (keyLocks.get(key) === next) keyLocks.delete(key)
    })
  keyLocks.set(key, next)
  return (await next) as T
}

// In-flight de-dupe: concurrent callers share the same Promise.
const inflight = new Map<string, Promise<unknown>>()

export async function dedupeInFlight<T>(key: string, fn: AnyFn<T>): Promise<T> {
  const existing = inflight.get(key)
  if (existing) return (await existing) as T
  const p = fn().finally(() => {
    if (inflight.get(key) === p) inflight.delete(key)
  })
  inflight.set(key, p)
  return (await p) as T
}

