export const AGE_FEED_DEFAULTS = {
  pageId: '1889487239237201920',
  touchCode: 'P00000115802',
  productCode: '100000099780',
} as const

// 官方生产环境映射；沙箱产品不能用于正式订购。
export const AGE_FEED_TIERS = [
  { tag: '001', level: 1, name: '银卡', productCode: '100000099780', goodsId: '2025999900045799' },
  { tag: '002', level: 2, name: '金卡', productCode: '100000099781', goodsId: '2025999900045800' },
  { tag: '003', level: 3, name: '白金卡', productCode: '100000099779', goodsId: '2025999900045801' },
] as const

export function findAgeFeedTier(productCode: string) {
  return AGE_FEED_TIERS.find((tier) => tier.productCode === productCode)
}

export const AGE_FEED_SOURCE_URL = `https://dev.coc.10086.cn/coc/web6/ageFeedPackage/?pageId=${AGE_FEED_DEFAULTS.pageId}&channelId=${AGE_FEED_DEFAULTS.touchCode}`
