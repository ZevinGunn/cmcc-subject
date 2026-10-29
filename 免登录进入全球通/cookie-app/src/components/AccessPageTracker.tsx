import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

let lastTrackedKey = ''
let lastTrackedAt = 0

export default function AccessPageTracker() {
  const location = useLocation()

  useEffect(() => {
    const path = window.location.pathname
    const queryKeys = Array.from(new URLSearchParams(window.location.search).keys())
    const key = `${path}?${queryKeys.sort().join(',')}`
    const now = Date.now()
    if (key === lastTrackedKey && now - lastTrackedAt < 1500) return
    lastTrackedKey = key
    lastTrackedAt = now
    void fetch('/api/access-logs/page-view', {
      method: 'POST',
      credentials: 'same-origin',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, queryKeys }),
    }).catch(() => undefined)
  }, [location.pathname, location.search])

  return null
}
