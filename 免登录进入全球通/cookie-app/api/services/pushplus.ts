function getPushPlusToken(): string {
  return String(process.env.PUSHPLUS_TOKEN || '').trim()
}

function getPushPlusChannel(): string | undefined {
  const value = String(process.env.PUSHPLUS_CHANNEL || '').trim()
  return value || undefined
}

export function isPushPlusEnabled(): boolean {
  const token = getPushPlusToken()
  if (!token) return false
  const raw = String(process.env.PUSHPLUS_ENABLED || '1').trim().toLowerCase()
  return !['0', 'false', 'off', 'no'].includes(raw)
}

export async function pushPlusSend(args: {
  title: string
  content: string
  template?: 'txt' | 'html' | 'json' | 'markdown'
  token?: string
  channel?: string
}): Promise<void> {
  const token = String(args.token || '').trim() || getPushPlusToken()
  if (!token) return
  if (!String(args.token || '').trim() && !isPushPlusEnabled()) return
  try {
    const payload: Record<string, unknown> = {
      token,
      title: args.title,
      content: args.content,
      template: args.template || 'markdown',
    }
    const channel = String(args.channel || '').trim() || getPushPlusChannel()
    if (channel) payload.channel = channel
    const res = await fetch('http://www.pushplus.plus/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.error(`PushPlus send failed: HTTP ${res.status}`)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`PushPlus send error: ${message}`)
  }
}
