export function formatBeijingDateTime(value?: string): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export function formatRelativeTime(value?: string, now = Date.now()): string {
  if (!value) return '从未'
  const timestamp = Date.parse(value)
  if (!Number.isFinite(timestamp)) return value
  const diff = Math.max(0, now - timestamp)
  if (diff < 60_000) return '刚刚'
  if (diff < 60 * 60_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 24 * 60 * 60_000) return `${Math.floor(diff / (60 * 60_000))} 小时前`
  return `${Math.floor(diff / (24 * 60 * 60_000))} 天前`
}

export function formatCountdown(value?: string, now = Date.now()): string {
  if (!value) return '未记录'
  const timestamp = Date.parse(value)
  if (!Number.isFinite(timestamp)) return '时间未知'
  const diff = timestamp - now
  if (diff <= 0) return '已到期'
  const hours = Math.floor(diff / (60 * 60_000))
  if (hours >= 24) return `${Math.floor(hours / 24)} 天后`
  if (hours >= 1) return `${hours} 小时后`
  return `${Math.max(1, Math.ceil(diff / 60_000))} 分钟后`
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '0%'
  return `${Math.max(0, Math.min(100, value)).toFixed(value >= 10 ? 0 : 1)}%`
}

