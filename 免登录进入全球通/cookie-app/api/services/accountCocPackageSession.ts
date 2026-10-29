import {
  getAccountById,
  setAccountCocPackageSession,
  setAccountCookie,
  type AccountRecord,
} from './accountsStore.js'
import {
  COC_PACKAGE_TARGETS,
  exchange10086CookieToCocPackage,
  validateCocPackageSession,
  type CocPackageSessionRecord,
  type CocPackageTarget,
} from './cocPackageSession.js'
import { ensureUsable10086Cookie } from './cmccCookieRecovery.js'

export async function prepareAccountCocPackageSession(
  rec: AccountRecord,
  target: CocPackageTarget,
): Promise<{
  ok: boolean
  reused: boolean
  status?: number
  message?: string
  session?: CocPackageSessionRecord
  account?: AccountRecord
}> {
  const cached = rec.cocPackageSessions?.[target]
  if (cached) {
    const validated = await validateCocPackageSession(cached)
    if (validated.ok) {
      const session = validated.cookie && validated.cookie !== cached.cookie
        ? { ...cached, cookie: validated.cookie }
        : cached
      if (session !== cached) {
        await setAccountCocPackageSession({ id: rec.id, target, session })
      }
      return {
        ok: true,
        reused: true,
        status: validated.status,
        session,
        account: (await getAccountById(rec.id)) ?? rec,
      }
    }
  }

  const usable = await ensureUsable10086Cookie({
    rec,
    allowRecentSkip: false,
    clearOnYunpanFailure: false,
    preferYunpan: Boolean(rec.yunpanSession),
  })
  if (!usable.ok || !usable.cookie) {
    return {
      ok: false,
      reused: false,
      status: 410,
      message: usable.message || '账号暂无可用于置换的 10086 CK',
    }
  }
  const exchanged = await exchange10086CookieToCocPackage(usable.cookie, target)
  if (!exchanged.ok || !exchanged.session) {
    return {
      ok: false,
      reused: false,
      status: exchanged.status,
      message: exchanged.message || `10086 CK 置换${COC_PACKAGE_TARGETS[target].name}凭证失败`,
    }
  }
  if (exchanged.baseCookieUpdated && exchanged.baseCookie) {
    await setAccountCookie({ id: rec.id, cookie: exchanged.baseCookie })
  }
  await setAccountCocPackageSession({ id: rec.id, target, session: exchanged.session })
  return {
    ok: true,
    reused: false,
    status: exchanged.status,
    session: exchanged.session,
    account: (await getAccountById(rec.id)) ?? rec,
  }
}
