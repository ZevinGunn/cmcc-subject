type XdrReceivePayload = {
  data?: {
    enjoycollectabletimes?: number
    freeEnjoy?: number
    enjoy?: number
    prodList?: number[]
  }
  status?: string | number
  msg?: string
  message?: string
}

const PRIZE_MAP_CACHE_KEY = 'xdr_prize_map_v2'

// Current Star Day product IDs captured from the activity's own product list.
export const CURRENT_XDR_PRIZE_MAP: Record<string, string> = {
  '3432': '哔哩哔哩月度大会员',
  '3453': 'QQ音乐豪华绿钻月卡',
  '3454': '酷狗豪华VIP月卡',
  '3458': 'WPS超级会员月卡',
  '3460': '喜马拉雅会员月卡',
  '3464': '腾讯视频VIP月会员',
  '3830': '美团单车30天30次卡',
  '3832': '中石油满200减15加油券',
  '3907': '移动安全管家升级版月卡',
  '3908': '综合意外保障-家庭版',
  '3909': '咪咕视频通看券包',
  '3910': '咪咕音乐天籁VIP月包',
  '3911': '咪咕音乐天籁会员月包',
  '3912': '星巴克20元会员礼包',
  '3913': '咪咕悦读白金会员月卡',
  '3914': '咪咕悦读黄金会员月卡',
  '3941': '移动云盘图文AI权益包月卡',
  '3942': '爱奇艺黄金VIP月卡',
  '3943': '手机碎屏不限额保障',
}

export function resolveXdrPrizeName(id: number, map: Record<string, string>): string {
  return map[String(id)] || CURRENT_XDR_PRIZE_MAP[String(id)] || `权益 #${id}`
}

export function parseXdrPrizeMap(source: string): Record<string, string> {
  const map: Record<string, string> = {}
  // Product entries are flat object literals. Excluding nested braces prevents
  // activity/tab IDs from being paired with the first product in each group.
  const productRegex = /\{\s*id:\s*(\d+)\s*,(?:(?![{}]).)*?qyName:\s*"([^"]+)"/gs
  let match: RegExpExecArray | null
  while ((match = productRegex.exec(source))) {
    const id = match[1]
    const name = match[2]?.trim()
    if (id && name) map[id] = name
  }
  return map
}

export async function loadXdrPrizeMap(): Promise<Record<string, string>> {
  if (typeof window === 'undefined') return {}
  const cached = window.localStorage.getItem(PRIZE_MAP_CACHE_KEY)
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as Record<string, string>
      if (parsed && typeof parsed === 'object') {
        return { ...CURRENT_XDR_PRIZE_MAP, ...parsed }
      }
    } catch {
      // ignore invalid cache
    }
  }
  try {
    const res = await fetch('/xdrnormal.js', { cache: 'force-cache' })
    const text = await res.text()
    const map: Record<string, string> = { ...CURRENT_XDR_PRIZE_MAP, ...parseXdrPrizeMap(text) }
    window.localStorage.setItem(PRIZE_MAP_CACHE_KEY, JSON.stringify(map))
    return map
  } catch {
    return { ...CURRENT_XDR_PRIZE_MAP }
  }
}

export function extractXdrReceive(payload: unknown): {
  prodList: number[]
  enjoycollectabletimes?: number
} | null {
  if (!payload || typeof payload !== 'object') return null
  const obj = payload as XdrReceivePayload
  const data = obj.data
  if (!data || typeof data !== 'object') return null
  const prodListRaw = Array.isArray(data.prodList) ? data.prodList : []
  const prodList = prodListRaw
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item) && item > 0)
  return {
    prodList,
    enjoycollectabletimes:
      typeof data.enjoycollectabletimes === 'number'
        ? data.enjoycollectabletimes
        : undefined,
  }
}

export function formatPrizeNames(
  ids: number[],
  map: Record<string, string>,
): string {
  if (!ids || ids.length === 0) return '—'
  const names = ids.map((id) => resolveXdrPrizeName(id, map))
  return names.join('、')
}
