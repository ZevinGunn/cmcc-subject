type LoginCredentials = {
  hasCookie: boolean
  hasYunpanSession?: boolean
  yunpanSessionCheckedAt?: string
  yunpanSessionInvalidAt?: string
  qqtAccessToken?: string
  cookieInvalidAt?: string
  cookieExpireAt?: string
  smsLoginExpireAt?: string
  disabledAt?: string
  lastLoginMethod?: string
}

// 10086 的期限和失效标记只描述 10086 CK，不能否定独立的云盘会话。
export function getAccountLoginState(account: LoginCredentials, now = Date.now()) {
  const cmccExpireAt = account.cookieExpireAt || account.smsLoginExpireAt
  const expiry = cmccExpireAt ? Date.parse(cmccExpireAt) : NaN
  const hasYunpan = Boolean(account.hasYunpanSession && !account.yunpanSessionInvalidAt && !account.disabledAt)
  const hasCmcc = Boolean(account.hasCookie && !account.cookieInvalidAt &&
    !account.disabledAt && (!Number.isFinite(expiry) || expiry > now))
  const loggedIn = !account.disabledAt && Boolean(hasCmcc || hasYunpan || account.qqtAccessToken)
  return {
    hasCmcc, hasYunpan, loggedIn,
    yunpanOnly: hasYunpan && !hasCmcc,
    // 云盘登录没有已证实的固定期限；保留旧 CK 元数据但不借用它提示云盘过期。
    primaryExpireAt: hasYunpan && (!hasCmcc || account.lastLoginMethod === 'yunpan')
      ? undefined : cmccExpireAt,
  }
}

export function getYunpanCredentialStatus(account: {
  hasYunpanSession?: boolean
  yunpanSessionCheckedAt?: string
  yunpanSessionInvalidAt?: string
}) {
  if (!account.hasYunpanSession) return { label: '未登录', tone: 'neutral' as const }
  if (account.yunpanSessionInvalidAt) return { label: '失效', tone: 'danger' as const }
  if (account.yunpanSessionCheckedAt && Number.isFinite(Date.parse(account.yunpanSessionCheckedAt))) {
    return { label: '有效', tone: 'success' as const }
  }
  return { label: '待验证', tone: 'warning' as const }
}
