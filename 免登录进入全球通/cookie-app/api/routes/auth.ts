import { Router, type Request, type Response } from 'express'
import crypto from 'node:crypto'
import {
  consumeInviteLink,
  createSession,
  createAutoLinkUser,
  createUser,
  findCurrentUser,
  getAuthPolicy,
  getSession,
  getUserById,
  getUserByUsername,
  listManagedUsers,
  listUserAccountSummaries,
  revokeSession,
  setAuthPolicy,
  setUserDisabled,
  updateUserPassword,
  updateUserPermissions,
  updateUserUsername,
  verifyUserPassword,
  bindAccountsToUser,
  bindInviteAccountsToUser,
  type UserRecord,
} from '../services/userAuthStore.js'
import { isAdminRequest } from '../services/serviceLoginGuard.js'
import { getPublicLink, listPublicLinks, type PublicLinkRecord } from '../services/publicLinksStore.js'
import {
  getAccountById,
  toAccountSummary,
  upsertAccount,
  updatePublicAccountOrder,
} from '../services/accountsStore.js'
import { createOrReuseBatchTask } from '../services/batchTasks.js'
import { beijingDayKey, listDailyTaskStates } from '../services/dailyTaskState.js'
import { listPublicAnnouncements } from '../services/announcementStore.js'

const router = Router()
const USER_SESSION_COOKIE = 'user_session'

function normalizeUsername(value: string): string {
  return value.trim().toLowerCase()
}

function validateUsername(username: string): string | null {
  if (!/^[a-zA-Z][a-zA-Z0-9_]{3,19}$/.test(username)) {
    return '用户名需为 4-20 位，以字母开头，仅支持字母、数字、下划线'
  }
  return null
}

function validatePassword(password: string): string | null {
  if (password.length < 8 || password.length > 32) return '密码需为 8-32 位'
  const classes = [
    /[a-zA-Z]/.test(password),
    /\d/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ].filter(Boolean).length
  if (classes < 2) return '密码至少包含字母、数字、特殊字符中的两类'
  const weak = ['12345678', 'password', 'qwerty123', 'abc123456']
  if (weak.includes(password.toLowerCase())) return '密码过弱，请更换'
  return null
}

function userPayload(user: UserRecord) {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    permissions: user.permissions,
    disabledAt: user.disabledAt,
    disabledReason: user.disabledReason,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    accountCount: (user as { accountCount?: number }).accountCount,
    inviteCount: (user as { inviteCount?: number }).inviteCount,
    usedInviteCodes: (user as { usedInviteCodes?: string[] }).usedInviteCodes,
  }
}

function buildPublicInviteUrl(inviteCode: string): string {
  const configured = String(process.env.PUBLIC_LINK_BASE_URL || '').trim().replace(/\/+$/, '')
  const base = configured || 'http://home.1008086.xyz'
  return `${base}/public?link=${encodeURIComponent(inviteCode)}`
}

function linkedInvitePayload(link: PublicLinkRecord) {
  return {
    inviteCode: link.id,
    url: buildPublicInviteUrl(link.id),
    accountCount: link.accountIds.length,
    status: link.disabledAt ? 'disabled' : 'active',
    usedAt: link.usedAt,
    disabledAt: link.disabledAt,
    createdAt: link.createdAt,
    updatedAt: link.updatedAt,
  }
}

function readSessionToken(req: Request): string {
  const auth = req.header('authorization') || ''
  if (auth.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim()
  const cookieHeader = req.header('cookie') || ''
  const match = cookieHeader.match(/(?:^|;\s*)user_session=([^;]+)/)
  return match?.[1] ? decodeURIComponent(match[1]) : ''
}

function setSessionCookie(res: Response, token: string) {
  res.cookie(USER_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })
}

function clearSessionCookie(res: Response) {
  res.clearCookie(USER_SESSION_COOKIE, { path: '/' })
}

function messageForCode(code: string): string {
  if (code === 'INVITE_REQUIRED') return '新用户注册需要有效邀请码'
  if (code === 'INVITE_ALREADY_USED') return '该邀请码已被使用'
  if (code === 'USERNAME_EXISTS') return '用户名已存在'
  if (code === 'USERNAME_BLOCKED') return '该用户名不可注册'
  if (code === 'USERNAME_NOT_ALLOWED') return '该用户名不在注册白名单内'
  if (code === 'INVALID_USERNAME') return '用户名格式不正确'
  if (code === 'INVALID_PASSWORD') return '密码格式不正确'
  return '操作失败'
}

async function createAutoLoginDailyTask(userId: string): Promise<void> {
  const accounts = await listUserAccountSummaries(userId)
  const accountIds = accounts.map((item) => item.id).filter(Boolean)
  if (accountIds.length === 0) return
  await createOrReuseBatchTask({
    type: 'refresh_and_sign',
    scopeType: 'selected_accounts',
    accountIds,
    source: 'auto_login',
    sspid: process.env.DEFAULT_QQT_SSPID?.trim() || '75442',
    timezone: 'Asia/Shanghai',
    dedupeKey: `daily:auto_login:${userId}:${beijingDayKey()}`,
    forceDaily: false,
  }).catch(() => undefined)
}

router.post(
  '/login',
  async (
    req: Request,
    res: Response<{
      ok: boolean
      data?: { user: ReturnType<typeof userPayload>; registered: boolean }
      message?: string
      errorCode?: string
      requestId?: string
    }>,
  ) => {
    const requestId = crypto.randomUUID()
    const username = normalizeUsername(String(req.body?.username || ''))
    const password = String(req.body?.password || '')
    const inviteCode =
      String(req.body?.inviteCode || req.body?.publicLinkId || '').trim() || undefined

    const usernameMsg = validateUsername(username)
    if (usernameMsg) {
      res.status(400).json({ ok: false, message: usernameMsg, errorCode: 'INVALID_USERNAME', requestId })
      return
    }
    const passwordMsg = validatePassword(password)
    if (passwordMsg) {
      res.status(400).json({ ok: false, message: passwordMsg, errorCode: 'INVALID_PASSWORD', requestId })
      return
    }

    try {
      let registered = false
      let user = await getUserByUsername(username)
      if (user) {
        if (user.disabledAt) {
          res.status(403).json({ ok: false, message: '用户已被禁用', errorCode: 'USER_DISABLED', requestId })
          return
        }
        const ok = await verifyUserPassword(user, password)
        if (!ok) {
          res.status(401).json({ ok: false, message: '用户名或密码不正确', errorCode: 'BAD_CREDENTIALS', requestId })
          return
        }
        if (inviteCode) {
          const link = await getPublicLink(inviteCode)
          if (link && (!link.usedByUserId || link.usedByUserId === user.id)) {
            await consumeInviteLink({ linkId: inviteCode, userId: user.id })
          }
        }
      } else {
        if (!inviteCode) {
          res.status(400).json({ ok: false, message: messageForCode('INVITE_REQUIRED'), errorCode: 'INVITE_REQUIRED', requestId })
          return
        }
        const link = await getPublicLink(inviteCode)
        if (!link) {
          res.status(404).json({ ok: false, message: '邀请码不存在', errorCode: 'INVITE_NOT_FOUND', requestId })
          return
        }
        if (link.usedAt && link.usedByUserId) {
          res.status(409).json({ ok: false, message: '该邀请码已被使用', errorCode: 'INVITE_ALREADY_USED', requestId })
          return
        }
        user = await createUser({ username, password })
        await consumeInviteLink({ linkId: inviteCode, userId: user.id })
        registered = true
      }
      const session = await createSession({ userId: user.id, sourceLinkId: inviteCode })
      setSessionCookie(res, session.token)
      void createAutoLoginDailyTask(user.id)
      res.json({ ok: true, data: { user: userPayload(user), registered }, requestId })
    } catch (e) {
      const code = e instanceof Error ? e.message : 'SERVER_ERROR'
      res.status(code === 'USERNAME_EXISTS' ? 409 : 500).json({
        ok: false,
        message: messageForCode(code) || '服务端异常',
        errorCode: code,
        requestId,
      })
    }
  },
)

router.post('/link-login', async (req: Request, res: Response): Promise<void> => {
  const requestId = crypto.randomUUID()
  const inviteCode =
    String(req.body?.link || req.body?.inviteCode || req.body?.publicLinkId || '').trim() || undefined
  if (!inviteCode) {
    res.status(400).json({ ok: false, message: '缺少邀请码', errorCode: 'INVITE_REQUIRED', requestId })
    return
  }
  try {
    const link = await getPublicLink(inviteCode)
    if (!link) {
      res.status(404).json({ ok: false, message: '邀请码不存在或已失效', errorCode: 'INVITE_NOT_FOUND', requestId })
      return
    }
    if (link.accountIds.length === 0) {
      res.status(400).json({ ok: false, message: '邀请码未关联账号', errorCode: 'INVITE_EMPTY', requestId })
      return
    }

    let user = link.usedByUserId ? await getUserById(link.usedByUserId) : null
    if (user?.disabledAt) {
      res.status(403).json({ ok: false, message: '用户已被禁用', errorCode: 'USER_DISABLED', requestId })
      return
    }
    let registered = false
    if (!user) {
      user = await createAutoLinkUser(inviteCode)
      await consumeInviteLink({ linkId: inviteCode, userId: user.id })
      registered = true
    } else {
      await consumeInviteLink({ linkId: inviteCode, userId: user.id })
    }
    const session = await createSession({ userId: user.id, sourceLinkId: inviteCode })
    setSessionCookie(res, session.token)
    void createAutoLoginDailyTask(user.id)
    res.json({ ok: true, data: { user: userPayload(user), registered }, requestId })
  } catch (e) {
    const code = e instanceof Error ? e.message : 'SERVER_ERROR'
    const status =
      code === 'INVITE_ALREADY_USED'
        ? 409
        : code === 'NOT_FOUND'
          ? 404
          : 500
    res.status(status).json({
      ok: false,
      message:
        code === 'INVITE_ALREADY_USED'
          ? '该邀请码已被其他用户使用'
          : code === 'NOT_FOUND'
            ? '邀请码不存在或已失效'
            : '服务端异常',
      errorCode: code,
      requestId,
    })
  }
})

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const requestId = crypto.randomUUID()
  const username = normalizeUsername(String(req.body?.username || ''))
  const password = String(req.body?.password || '')
  const inviteCode =
    String(req.body?.inviteCode || req.body?.publicLinkId || '').trim() || undefined
  const usernameMsg = validateUsername(username)
  if (usernameMsg) {
    res.status(400).json({ ok: false, message: usernameMsg, errorCode: 'INVALID_USERNAME', requestId })
    return
  }
  const passwordMsg = validatePassword(password)
  if (passwordMsg) {
    res.status(400).json({ ok: false, message: passwordMsg, errorCode: 'INVALID_PASSWORD', requestId })
    return
  }
  if (!inviteCode) {
    res.status(400).json({ ok: false, message: messageForCode('INVITE_REQUIRED'), errorCode: 'INVITE_REQUIRED', requestId })
    return
  }
  try {
    const link = await getPublicLink(inviteCode)
    if (!link) {
      res.status(404).json({ ok: false, message: '邀请码不存在', errorCode: 'INVITE_NOT_FOUND', requestId })
      return
    }
    if (link.usedAt && link.usedByUserId) {
      res.status(409).json({ ok: false, message: '该邀请码已被使用', errorCode: 'INVITE_ALREADY_USED', requestId })
      return
    }
    const user = await createUser({ username, password })
    await consumeInviteLink({ linkId: inviteCode, userId: user.id })
    const session = await createSession({ userId: user.id, sourceLinkId: inviteCode })
    setSessionCookie(res, session.token)
    res.json({ ok: true, data: { user: userPayload(user), registered: true }, requestId })
  } catch (e) {
    const code = e instanceof Error ? e.message : 'SERVER_ERROR'
    res.status(code === 'USERNAME_EXISTS' ? 409 : 500).json({
      ok: false,
      message: messageForCode(code),
      errorCode: code,
      requestId,
    })
  }
})

router.get('/me', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  try {
    const user = await findCurrentUser(req)
    if (!user) {
      res.status(401).json({ ok: false, message: '未登录', errorCode: 'UNAUTHENTICATED', requestId })
      return
    }
    res.json({ ok: true, data: { user: userPayload(user) }, requestId })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
  }
})

router.get('/bootstrap', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  try {
    const user = await findCurrentUser(req)
    if (!user) {
      res.status(401).json({ ok: false, message: '未登录', errorCode: 'UNAUTHENTICATED', requestId })
      return
    }
    const accounts = await listUserAccountSummaries(user.id)
    const [states, announcementData] = await Promise.all([
      listDailyTaskStates({ accountIds: accounts.map((item) => item.id) }),
      listPublicAnnouncements(user.id),
    ])
    res.json({
      ok: true,
      data: {
        user: userPayload(user),
        accounts,
        taskDate: beijingDayKey(),
        states,
        announcements: announcementData,
      },
      requestId,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
  }
})

router.get('/accounts', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  try {
    const user = await findCurrentUser(req)
    if (!user) {
      res.status(401).json({ ok: false, message: '未登录', errorCode: 'UNAUTHENTICATED', requestId })
      return
    }
    const accounts = await listUserAccountSummaries(user.id)
    res.json({ ok: true, data: { accounts }, requestId })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
  }
})

router.patch('/accounts/order', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  try {
    const user = await findCurrentUser(req)
    if (!user) {
      res.status(401).json({ ok: false, message: '未登录', errorCode: 'UNAUTHENTICATED', requestId })
      return
    }
    const accountIds = Array.isArray(req.body?.accountIds) ? req.body.accountIds.map(String) : []
    const pinnedAccountIds = Array.isArray(req.body?.pinnedAccountIds) ? req.body.pinnedAccountIds.map(String) : []
    if (accountIds.length === 0) {
      res.status(400).json({ ok: false, message: '账号顺序不能为空', errorCode: 'INVALID_ARGS', requestId })
      return
    }
    const accounts = await updatePublicAccountOrder({ userId: user.id, accountIds, pinnedAccountIds })
    res.json({ ok: true, data: { accounts }, requestId })
  } catch (e) {
    const message = e instanceof Error ? e.message : '保存账号顺序失败'
    const invalid = ['DUPLICATE_ACCOUNT_ID', 'INVALID_PINNED_ACCOUNT', 'ACCOUNT_SET_MISMATCH'].includes(message)
    res.status(invalid ? 400 : 500).json({
      ok: false,
      message: invalid ? '账号顺序数据无效，请刷新后重试' : message,
      errorCode: invalid ? 'INVALID_ACCOUNT_ORDER' : 'SERVER_ERROR',
      requestId,
    })
  }
})

router.get('/daily-tasks', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  try {
    const user = await findCurrentUser(req)
    if (!user) {
      res.status(401).json({ ok: false, message: '未登录', errorCode: 'UNAUTHENTICATED', requestId })
      return
    }
    const accounts = await listUserAccountSummaries(user.id)
    const states = await listDailyTaskStates({
      accountIds: accounts.map((item) => item.id),
      taskDate: typeof req.query.date === 'string' ? req.query.date : undefined,
    })
    res.json({
      ok: true,
      data: {
        taskDate: typeof req.query.date === 'string' ? req.query.date : beijingDayKey(),
        states,
      },
      requestId,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
  }
})

router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  const requestId = crypto.randomUUID()
  const token = readSessionToken(req)
  if (token) await revokeSession(token).catch(() => undefined)
  clearSessionCookie(res)
  res.json({ ok: true, requestId })
})

router.get('/invite/:code', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  const code = String(req.params.code || '').trim()
  try {
    const link = await getPublicLink(code, { includeDisabled: true })
    if (!link) {
      res.status(404).json({ ok: false, message: '邀请码不存在', errorCode: 'INVITE_NOT_FOUND', requestId })
      return
    }
    res.json({
      ok: true,
      data: {
        inviteCode: link.id,
        accountCount: link.accountIds.length,
        disabledAt: link.disabledAt,
        usedAt: link.usedAt,
        usedByUserId: link.usedByUserId,
      },
      requestId,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
  }
})

router.get('/admin/users', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  if (!isAdminRequest(req)) {
    res.status(403).json({ ok: false, message: 'Forbidden', errorCode: 'FORBIDDEN', requestId })
    return
  }
  try {
    const users = await listManagedUsers()
    res.json({ ok: true, data: { users: users.map(userPayload) }, requestId })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
  }
})

router.get('/admin/users/:id/accounts', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  if (!isAdminRequest(req)) {
    res.status(403).json({ ok: false, message: 'Forbidden', errorCode: 'FORBIDDEN', requestId })
    return
  }
  const id = String(req.params.id || '').trim()
  try {
    const user = await getUserById(id)
    if (!user) {
      res.status(404).json({ ok: false, message: '用户不存在', errorCode: 'NOT_FOUND', requestId })
      return
    }
    const accounts = await listUserAccountSummaries(id)
    const linkedInvites = (await listPublicLinks({ includeDisabled: true }))
      .filter((link) => link.usedByUserId === id)
      .map(linkedInvitePayload)
    res.json({
      ok: true,
      data: {
        user: {
          ...userPayload(user),
          inviteCount: linkedInvites.length,
          usedInviteCodes: linkedInvites.map((link) => link.inviteCode),
        },
        accounts,
        linkedInvites,
      },
      requestId,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
  }
})

router.post('/admin/users/:id/accounts/bind', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  if (!isAdminRequest(req)) {
    res.status(403).json({ ok: false, message: 'Forbidden', errorCode: 'FORBIDDEN', requestId })
    return
  }
  const id = String(req.params.id || '').trim()
  const accountId = String(req.body?.accountId || '').trim()
  const phone = String(req.body?.phone || '').replace(/\D+/g, '')
  const label = String(req.body?.label || '').trim() || undefined
  if (!accountId && !phone) {
    res.status(400).json({ ok: false, message: '请输入手机号或账号ID', errorCode: 'INVALID_ARGS', requestId })
    return
  }
  if (phone && !/^1\d{10}$/.test(phone)) {
    res.status(400).json({ ok: false, message: '手机号格式不正确', errorCode: 'INVALID_PHONE', requestId })
    return
  }
  try {
    const user = await getUserById(id)
    if (!user) {
      res.status(404).json({ ok: false, message: '用户不存在', errorCode: 'NOT_FOUND', requestId })
      return
    }
    const account = accountId
      ? await getAccountById(accountId)
      : await upsertAccount({ phone, label })
    if (!account) {
      res.status(404).json({ ok: false, message: '账号不存在', errorCode: 'ACCOUNT_NOT_FOUND', requestId })
      return
    }
    await bindAccountsToUser({ userId: id, accountIds: [account.id] })
    const bound = await getAccountById(account.id)
    res.json({
      ok: true,
      data: { user: userPayload(user), account: bound ? toAccountSummary(bound) : toAccountSummary(account) },
      requestId,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    const status = msg === 'INVALID_PHONE' ? 400 : 500
    const message =
      msg === 'INVALID_PHONE'
        ? '手机号格式不正确'
        : msg === 'ACCOUNT_NOT_FOUND'
          ? '账号不存在'
          : msg === 'Unknown error'
            ? '服务端异常'
            : msg
    res.status(status).json({ ok: false, message, errorCode: msg, requestId })
  }
})

router.post('/admin/users/:id/accounts/sync-invites', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  if (!isAdminRequest(req)) {
    res.status(403).json({ ok: false, message: 'Forbidden', errorCode: 'FORBIDDEN', requestId })
    return
  }
  const id = String(req.params.id || '').trim()
  try {
    const user = await getUserById(id)
    if (!user) {
      res.status(404).json({ ok: false, message: '用户不存在', errorCode: 'NOT_FOUND', requestId })
      return
    }
    const count = await bindInviteAccountsToUser(id)
    const accounts = await listUserAccountSummaries(id)
    res.json({ ok: true, data: { user: userPayload(user), boundCount: count, accounts }, requestId })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
  }
})

router.get('/admin/policy', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  if (!isAdminRequest(req)) {
    res.status(403).json({ ok: false, message: 'Forbidden', errorCode: 'FORBIDDEN', requestId })
    return
  }
  try {
    const policy = await getAuthPolicy()
    res.json({ ok: true, data: { policy }, requestId })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
  }
})

router.post('/admin/policy', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  if (!isAdminRequest(req)) {
    res.status(403).json({ ok: false, message: 'Forbidden', errorCode: 'FORBIDDEN', requestId })
    return
  }
  try {
    const allow = Array.isArray(req.body?.usernameAllowlist)
      ? req.body.usernameAllowlist.map((item: unknown) => String(item || '').trim()).filter(Boolean)
      : undefined
    const block = Array.isArray(req.body?.usernameBlocklist)
      ? req.body.usernameBlocklist.map((item: unknown) => String(item || '').trim()).filter(Boolean)
      : undefined
    const defaultResetPassword =
      typeof req.body?.defaultResetPassword === 'string'
        ? req.body.defaultResetPassword.trim()
        : undefined
    if (defaultResetPassword) {
      const passwordMsg = validatePassword(defaultResetPassword)
      if (passwordMsg) {
        res.status(400).json({ ok: false, message: passwordMsg, errorCode: 'INVALID_PASSWORD', requestId })
        return
      }
    }
    const policy = await setAuthPolicy({
      usernameAllowlist: allow,
      usernameBlocklist: block,
      defaultResetPassword,
    })
    res.json({ ok: true, data: { policy }, requestId })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
  }
})

router.post('/admin/users/:id/reset-password', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  if (!isAdminRequest(req)) {
    res.status(403).json({ ok: false, message: 'Forbidden', errorCode: 'FORBIDDEN', requestId })
    return
  }
  const id = String(req.params.id || '').trim()
  try {
    const policy = await getAuthPolicy()
    const password = String(req.body?.password || '').trim() || policy.defaultResetPassword
    const passwordMsg = validatePassword(password)
    if (passwordMsg) {
      res.status(400).json({ ok: false, message: passwordMsg, errorCode: 'INVALID_PASSWORD', requestId })
      return
    }
    const user = await updateUserPassword({ userId: id, password })
    res.json({ ok: true, data: { user: userPayload(user), password }, requestId })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
  }
})

router.post('/admin/users/:id/username', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  if (!isAdminRequest(req)) {
    res.status(403).json({ ok: false, message: 'Forbidden', errorCode: 'FORBIDDEN', requestId })
    return
  }
  const id = String(req.params.id || '').trim()
  const username = normalizeUsername(String(req.body?.username || ''))
  const usernameMsg = validateUsername(username)
  if (usernameMsg) {
    res.status(400).json({ ok: false, message: usernameMsg, errorCode: 'INVALID_USERNAME', requestId })
    return
  }
  try {
    const user = await updateUserUsername({ userId: id, username })
    res.json({ ok: true, data: { user: userPayload(user) }, requestId })
  } catch (e) {
    const code = e instanceof Error ? e.message : 'SERVER_ERROR'
    res.status(code === 'USERNAME_EXISTS' ? 409 : 500).json({
      ok: false,
      message: messageForCode(code),
      errorCode: code,
      requestId,
    })
  }
})

router.post('/admin/users/:id/status', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  if (!isAdminRequest(req)) {
    res.status(403).json({ ok: false, message: 'Forbidden', errorCode: 'FORBIDDEN', requestId })
    return
  }
  const id = String(req.params.id || '').trim()
  const disabled = Boolean(req.body?.disabled)
  const reason = String(req.body?.reason || '').trim() || undefined
  try {
    const user = await setUserDisabled({ userId: id, disabled, reason })
    res.json({ ok: true, data: { user: userPayload(user) }, requestId })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ ok: false, message: msg, errorCode: 'SERVER_ERROR', requestId })
  }
})

router.post('/admin/users/:id/permissions', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  if (!isAdminRequest(req)) {
    res.status(403).json({ ok: false, message: 'Forbidden', errorCode: 'FORBIDDEN', requestId })
    return
  }
  const id = String(req.params.id || '').trim()
  try {
    const existing = await getUserById(id)
    if (!existing) {
      res.status(404).json({ ok: false, message: '用户不存在', errorCode: 'NOT_FOUND', requestId })
      return
    }
    const user = await updateUserPermissions({
      userId: id,
      permissions: {
        businessQuery:
          typeof req.body?.businessQuery === 'boolean' ? req.body.businessQuery : Boolean(existing.permissions.businessQuery),
        shopQuery:
          typeof req.body?.shopQuery === 'boolean' ? req.body.shopQuery : Boolean(existing.permissions.shopQuery),
        businessOrder:
          typeof req.body?.businessOrder === 'boolean'
            ? req.body.businessOrder
            : Boolean(existing.permissions.businessOrder),
        businessIdOverride:
          typeof req.body?.businessIdOverride === 'boolean'
            ? req.body.businessIdOverride
            : Boolean(existing.permissions.businessIdOverride),
        benefitActivity:
          typeof req.body?.benefitActivity === 'boolean'
            ? req.body.benefitActivity
            : Boolean(existing.permissions.benefitActivity),
      },
    })
    res.json({ ok: true, data: { user: userPayload(user) }, requestId })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(msg === 'NOT_FOUND' ? 404 : 500).json({
      ok: false,
      message: msg === 'NOT_FOUND' ? '用户不存在' : msg,
      errorCode: msg === 'NOT_FOUND' ? 'NOT_FOUND' : 'SERVER_ERROR',
      requestId,
    })
  }
})

router.get('/session', async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID()
  const token = readSessionToken(req)
  const session = token ? await getSession(token) : null
  const user = session ? await getUserById(session.userId) : null
  res.json({
    ok: true,
    data: {
      authenticated: Boolean(session && !session.revokedAt && user && !user.disabledAt),
      user: user ? userPayload(user) : undefined,
    },
    requestId,
  })
})

export default router
