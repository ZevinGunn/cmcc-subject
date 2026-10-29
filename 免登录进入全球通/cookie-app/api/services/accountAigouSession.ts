import {
  getAccountById,
  setAccountAigouSession,
  setAccountCookie,
  type AccountRecord,
  type AigouSessionRecord,
} from './accountsStore.js'
import { exchange10086CookieToAigou, validateAigouSession } from './aigouSession.js'
import { ensureUsable10086Cookie } from './cmccCookieRecovery.js'

export type PreparedAigouSession = {
  ok: boolean
  reused: boolean
  status?: number
  message?: string
  session?: AigouSessionRecord
  account?: AccountRecord
}

export async function prepareAccountAigouSession(
  rec: AccountRecord,
  options: { forceRefresh?: boolean } = {},
): Promise<PreparedAigouSession> {
  if (!options.forceRefresh && rec.aigouSession) {
    const validated = await validateAigouSession(rec.aigouSession)
    if (validated.ok) {
      const session = validated.cookie && validated.cookie !== rec.aigouSession.cookie
        ? { ...rec.aigouSession, cookie: validated.cookie }
        : rec.aigouSession
      if (session !== rec.aigouSession) {
        await setAccountAigouSession({ id: rec.id, session })
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

  const exchanged = await exchange10086CookieToAigou(usable.cookie)
  if (!exchanged.ok || !exchanged.session) {
    return {
      ok: false,
      reused: false,
      status: exchanged.status,
      message: exchanged.message || '10086 CK 置换爱购商城凭证失败',
    }
  }
  if (exchanged.baseCookieUpdated && exchanged.baseCookie) {
    await setAccountCookie({ id: rec.id, cookie: exchanged.baseCookie })
  }
  await setAccountAigouSession({ id: rec.id, session: exchanged.session })
  return {
    ok: true,
    reused: false,
    status: exchanged.status,
    session: exchanged.session,
    account: (await getAccountById(rec.id)) ?? rec,
  }
}
