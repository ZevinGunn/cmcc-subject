const CUSTOMER_SERVICE_PATH = '/website/zxkf/h5new/index.html'

type CustomerServiceRule = {
  info: string
  code: string
  disableAutoArtificial?: boolean
  emptyExt?: boolean
}

// Sourced from proviceServeUrlJson.js in the supplied 全球通信息查询 source bundle.
const CUSTOMER_SERVICE_RULES: Record<string, CustomerServiceRule> = {
  河南: { info: '5I5cVWvd4Ff8t73ZigtaGkpZtzdAB1lz', code: '371' },
  云南: { info: '5Dl1cyvvwZDgyGwyOnQMOJpLNRoFP6uj', code: '871', disableAutoArtificial: true },
  福建: { info: 'Qqvz4yZszPR7an4uz3VpMTo9pDaLNf4J', code: '591' },
  广西: { info: 'cYef6JtdQsF5gbp6Vxv0slmrP83SQlIo', code: '771' },
  江西: { info: 'RcD1gnHzNSxRkN5AcTV2HsPiB1tn67ml', code: '791' },
  甘肃: { info: 'ketfF0xzZUaCHiIoKIF2jczknIFHngFn', code: '931' },
  北京: { info: 'jmXfnWoTQkzBtuxUq6Pzu10pQbENNt2J', code: '100' },
  上海: { info: 'EjQyS7RYpL2MASI122ai5JvPSPCW7Myk', code: '210' },
  湖北: { info: 'Ygl5neWwSlj27ACSeDL0gvRmBC5el02E', code: '270' },
  安徽: { info: 'ls6CL7yW01Kb0HEFQpddZsMvWspAfe9v', code: '551' },
  贵州: { info: 'fFLpYnKg9El7OljRGkMVEgdhZf8A0hBM', code: '851', disableAutoArtificial: true },
  湖南: { info: 'ydzKdSh2JQ8p9u53y7AmryUmyBr85jkz', code: '731', disableAutoArtificial: true },
  宁夏: { info: 'z063X7ZahlZ8lHGHN1U9C0bL4PIV5udy', code: '951', disableAutoArtificial: true },
  山西: { info: 'GdyyELGEG5t5cuJUaIpDDW3EK4wkGrXn', code: '351' },
  内蒙古: { info: 'rLmxSPSblDJuoRz7z4o33HOd8ZELy3lo', code: '471', disableAutoArtificial: true },
  山东: { info: 'VzjS7qOJoubeptuNKIIdIw6iDtkEaeIC', code: '531', disableAutoArtificial: true },
  江苏: { info: 'dU0bRVZ6q9A0aSDVIlHXqyaa0FfLFu3r', code: '250', disableAutoArtificial: true },
  西藏: { info: 'AIQNuR6Zo6qVVRP33m23Soj0HZqETwY7', code: '891' },
  四川: { info: 'UDivkyqupcCPI8pUtT7VugSxb71aNKS8', code: '280', emptyExt: true },
  青海: { info: 'Azmd6TNJ3pACijPp2cZFIJfTynBZg4Su', code: '971' },
  广东: { info: 'Soli3YS8ZjjS6Q6onqKEkjQFzlJcu6ey', code: '200', emptyExt: true },
}

// Browser/external entries from the same source file. These official short links
// carry the app-launch fallback and the exact province chat destination.
const CUSTOMER_SERVICE_ENTRY_URLS: Record<string, string> = {
  河南: 'https://dx.10086.cn/A/0eQJVvQf',
  云南: 'https://dx.10086.cn/A/0ebiQJJr',
  福建: 'https://dx.10086.cn/A/0dqENfma',
  广西: 'https://dx.10086.cn/A/0eeARrie',
  江西: 'https://dx.10086.cn/A/0bYJNfEz',
  甘肃: 'https://dx.10086.cn/A/0eZFRBB3',
  北京: 'https://dx.10086.cn/A/0eNjy26j',
  上海: 'https://dx.10086.cn/A/0eInKA',
  湖北: 'https://dx.10086.cn/A/0cjYVJbu',
  安徽: 'https://dx.10086.cn/A/0ccgGw',
  贵州: 'https://dx.10086.cn/A/0efQ7jya',
  湖南: 'https://dx.10086.cn/A/0ejYnqim',
  宁夏: 'https://dx.10086.cn/A/0evmEvim',
  山西: 'https://dx.10086.cn/A/0e6ryYfy',
  内蒙古: 'https://dx.10086.cn/A/0eniYFzm',
  山东: 'https://dx.10086.cn/A/dtWfFg',
  江苏: 'https://dx.10086.cn/A/0ezuErEr',
  西藏: 'https://dx.10086.cn/A/dXzAEw',
  四川: 'https://dx.10086.cn/A/dQXjDA',
  青海: 'https://dx.10086.cn/A/dgM_FQ',
  广东: 'https://dx.10086.cn/A/dhUbFg',
}

export type GlobalTelecomCustomerServiceLinkResult = {
  ok: boolean
  status?: number
  message?: string
  province?: string
  ssoUrl?: string
  cookie?: string
  cookieUpdated?: boolean
}

export function normalizeGlobalTelecomProvince(value: string): string {
  const province = value.trim().replace(/(壮族自治区|回族自治区|维吾尔自治区|自治区|特别行政区|省|市)$/u, '')
  return province === '广西壮族' ? '广西'
    : province === '宁夏回族' ? '宁夏'
      : province === '新疆维吾尔' ? '新疆'
        : province
}

export function resolveGlobalTelecomCustomerServiceChatUrl(provinceValue: string): string | undefined {
  const province = normalizeGlobalTelecomProvince(provinceValue)
  const rule = CUSTOMER_SERVICE_RULES[province]
  if (!rule) return undefined
  const url = new URL(CUSTOMER_SERVICE_PATH, 'https://wx.10086.cn')
  url.searchParams.set('zxkfInfo', rule.info)
  url.searchParams.set('zxkfCode', rule.code)
  if (rule.emptyExt) {
    url.searchParams.set('ext', '')
  } else {
    url.searchParams.set('ext', JSON.stringify({
      isstock: '1',
      ...(rule.disableAutoArtificial ? { isAutoArtifical: '0' } : {}),
      scene: '中国移动APP-全球通客户经理（专区页）-YX-固定型入口',
    }))
  }
  return url.toString()
}

function safeCustomerServiceChatUrl(raw: string): string | undefined {
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:' || url.hostname !== 'wx.10086.cn') return undefined
    if (url.pathname !== CUSTOMER_SERVICE_PATH) return undefined
    const provinceUrl = Object.keys(CUSTOMER_SERVICE_RULES)
      .map(resolveGlobalTelecomCustomerServiceChatUrl)
      .find((candidate) => candidate === url.toString())
    return provinceUrl
  } catch {
    return undefined
  }
}

export function resolveGlobalTelecomCustomerServiceEntryUrl(provinceValue: string): string | undefined {
  return CUSTOMER_SERVICE_ENTRY_URLS[normalizeGlobalTelecomProvince(provinceValue)]
}

export function safeGlobalTelecomCustomerServiceEntryUrl(raw: string): string | undefined {
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:' || url.hostname !== 'dx.10086.cn') return undefined
    return Object.values(CUSTOMER_SERVICE_ENTRY_URLS).includes(url.toString())
      ? url.toString()
      : undefined
  } catch {
    return undefined
  }
}

export async function buildGlobalTelecomCustomerServiceLink(args: {
  province: string
}): Promise<GlobalTelecomCustomerServiceLinkResult> {
  const province = normalizeGlobalTelecomProvince(args.province)
  const entryUrl = resolveGlobalTelecomCustomerServiceEntryUrl(province)
  if (!entryUrl) {
    return { ok: false, message: `全球通源码未提供${province || '当前省份'}的网页专属客服入口` }
  }
  return {
    ok: true,
    province,
    ssoUrl: entryUrl,
  }
}

export const __test__ = {
  safeCustomerServiceChatUrl,
}
