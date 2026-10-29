import { randomUUID } from 'node:crypto'
import { config } from '../../config.js'
import { logEvent } from '../../utils/logger.js'
import { findPlatform, quickOrderCatalog } from './catalog.js'
import { assertQuickOrder, isUncertainNetworkError, QuickOrderError } from './errors.js'
import { QuickOrderSessionStore, publicQuickOrderSession } from './sessionStore.js'
import { gridAdapter } from './adapters/grid.js'
import { cloudComputerAdapter } from './adapters/cloudComputer.js'
import { northAdapter } from './adapters/north.js'
import { retailAdapter } from './adapters/retail.js'
import { xywAdapter } from './adapters/xyw.js'

const FINAL_STAGES = new Set(['FINISHED', 'FAILED', 'UNKNOWN'])

export class QuickOrderService {
  constructor({ adapters = { xyw: xywAdapter, north: northAdapter, retail: retailAdapter, grid: gridAdapter, cloud: cloudComputerAdapter }, store = new QuickOrderSessionStore(), logger = logEvent } = {}) {
    this.adapters = adapters
    this.store = store
    this.logger = logger
    this.locks = new Set()
  }

  catalog() {
    return quickOrderCatalog()
  }

  requireSession(id) {
    const session = this.store.get(id)
    if (!session) throw new QuickOrderError('订购会话不存在或已过期，请重新开始', 'QUICK_ORDER_SESSION_NOT_FOUND', 404)
    return session
  }

  adapter(session) {
    const adapter = this.adapters[session.platform]
    if (!adapter) throw new QuickOrderError('订购平台适配器不可用', 'QUICK_ORDER_ADAPTER_MISSING', 500)
    return adapter
  }

  async create(input, dependencies = {}) {
    const platform = findPlatform(input?.platform)
    assertQuickOrder(platform, '请选择受支持的订购平台', 'QUICK_ORDER_PLATFORM_INVALID')
    const adapter = this.adapters[platform.id]
    const created = await adapter.create({ auth: input?.auth || {}, portalSession: dependencies.portalSession, userAgent: config.userAgent })
    const session = this.store.create(platform.id, created.privateContext, { ...created.publicContext, businessId: platform.businessId })
    await this.audit(session, 'session-created')
    return publicQuickOrderSession(session)
  }

  read(id) {
    return publicQuickOrderSession(this.requireSession(id))
  }

  async sendAuthSms(id) {
    const session = this.requireSession(id)
    assertQuickOrder(['LOGIN_REQUIRED', 'LOGIN_SMS_SENT'].includes(session.stage), '当前会话不需要登录短信验证', 'QUICK_ORDER_AUTH_STAGE_INVALID', 409)
    const adapter = this.adapter(session)
    assertQuickOrder(typeof adapter.sendLoginSms === 'function', '该平台不支持独立登录短信', 'QUICK_ORDER_AUTH_UNSUPPORTED', 409)
    const remaining = session.authSmsSentAt ? session.authSmsSentAt + 60_000 - Date.now() : 0
    assertQuickOrder(remaining <= 0, `请在 ${Math.ceil(remaining / 1000)} 秒后重发登录短信`, 'QUICK_ORDER_AUTH_SMS_COOLDOWN', 429)
    const lockKey = `auth-sms:${session.id}`
    if (this.locks.has(lockKey)) throw new QuickOrderError('登录验证码正在发送，请勿重复操作', 'QUICK_ORDER_ALREADY_SUBMITTING', 409)
    this.locks.add(lockKey)
    try {
      const result = await adapter.sendLoginSms(session.privateContext)
      session.stage = 'LOGIN_SMS_SENT'
      session.authSmsSentAt = Date.now()
      session.authSummary = result?.message || '登录验证码已发送'
    } finally {
      this.locks.delete(lockKey)
      this.store.touch(session)
    }
    await this.audit(session, 'auth-sms-sent')
    return publicQuickOrderSession(session)
  }

  async verifyAuth(id, input = {}) {
    const session = this.requireSession(id)
    assertQuickOrder(session.stage === 'LOGIN_SMS_SENT', '请先发送登录验证码', 'QUICK_ORDER_AUTH_STAGE_INVALID', 409)
    const smsCode = String(input.smsCode || '').trim()
    assertQuickOrder(/^\d{6}$/.test(smsCode), '请输入 6 位登录验证码', 'QUICK_ORDER_AUTH_SMS_CODE_INVALID')
    const adapter = this.adapter(session)
    assertQuickOrder(typeof adapter.verifyLogin === 'function', '该平台不支持独立登录短信', 'QUICK_ORDER_AUTH_UNSUPPORTED', 409)
    const lockKey = `auth:${session.id}`
    if (this.locks.has(lockKey)) throw new QuickOrderError('登录验证正在处理中，请勿重复操作', 'QUICK_ORDER_ALREADY_SUBMITTING', 409)
    this.locks.add(lockKey)
    try {
      const result = await adapter.verifyLogin(session.privateContext, smsCode)
      session.stage = 'AUTHENTICATED'
      session.maskedPhone = result?.maskedPhone || session.maskedPhone
      session.authSummary = result?.authSummary || '短信登录已认证'
      session.authSmsSentAt = 0
    } finally {
      this.locks.delete(lockKey)
      this.store.touch(session)
    }
    await this.audit(session, 'auth-verified')
    return publicQuickOrderSession(session)
  }

  async prepare(id) {
    const session = this.requireSession(id)
    assertQuickOrder(['AUTHENTICATED', 'PRODUCT_READY'].includes(session.stage), '当前阶段不能重新读取产品', 'QUICK_ORDER_STAGE_INVALID', 409)
    const product = await this.adapter(session).prepare(session.privateContext)
    session.product = product
    session.selection = null
    session.stage = 'PRODUCT_READY'
    this.store.touch(session)
    await this.audit(session, 'product-prepared', { optionCount: product.options?.length || 0, eligible: product.eligible })
    return publicQuickOrderSession(session)
  }

  async select(id, optionId) {
    const session = this.requireSession(id)
    assertQuickOrder(['PRODUCT_READY', 'SELECTION_READY'].includes(session.stage), '当前阶段不能选择档位', 'QUICK_ORDER_STAGE_INVALID', 409)
    const option = session.product?.options?.find((item) => item.id === String(optionId || ''))
    assertQuickOrder(option, '请选择当次实时返回的有效档位', 'QUICK_ORDER_OPTION_INVALID', 400)
    const selection = await this.adapter(session).select(session.privateContext, option)
    session.selection = selection
    if (selection.protocol) session.product = { ...session.product, protocol: selection.protocol }
    if (selection.eligible !== undefined) session.product = { ...session.product, eligible: selection.eligible, eligibilityMessage: selection.eligibilityMessage }
    session.stage = 'SELECTION_READY'
    session.smsSentAt = 0
    this.store.touch(session)
    await this.audit(session, 'option-selected', { optionId: option.id, eligible: session.product.eligible })
    return publicQuickOrderSession(session)
  }

  async sendSms(id, { agreed, realOrderConfirmed, confirmationId } = {}) {
    const session = this.requireSession(id)
    const normalizedConfirmationId = String(confirmationId || '').trim()
    if (FINAL_STAGES.has(session.stage)) {
      if (session.confirmationId === normalizedConfirmationId) return publicQuickOrderSession(session)
      throw new QuickOrderError('该会话已有最终结果，不能更换确认标识重复提交', 'QUICK_ORDER_ALREADY_FINAL', 409)
    }
    assertQuickOrder(['SELECTION_READY', 'SMS_SENT'].includes(session.stage), '请先完成产品和档位选择', 'QUICK_ORDER_STAGE_INVALID', 409)
    assertQuickOrder(agreed === true, '请先阅读并同意实时业务规则或协议', 'QUICK_ORDER_AGREEMENT_REQUIRED')
    assertQuickOrder(realOrderConfirmed === true, '请确认这是运营商真实订购操作', 'QUICK_ORDER_FINAL_CONFIRMATION_REQUIRED')
    assertQuickOrder(/^[A-Za-z0-9_-]{8,80}$/.test(normalizedConfirmationId), '订购确认标识无效', 'QUICK_ORDER_CONFIRMATION_INVALID')
    if (session.confirmationId && session.confirmationId !== normalizedConfirmationId) {
      throw new QuickOrderError('当前会话的确认标识已经锁定', 'QUICK_ORDER_CONFIRMATION_MISMATCH', 409)
    }
    const remaining = session.smsSentAt ? session.smsSentAt + 60_000 - Date.now() : 0
    assertQuickOrder(remaining <= 0, `请在 ${Math.ceil(remaining / 1000)} 秒后重发短信`, 'QUICK_ORDER_SMS_COOLDOWN', 429)
    const lockKey = `sms:${session.id}`
    if (this.locks.has(lockKey)) throw new QuickOrderError('短信或首次提交正在处理中，请勿重复操作', 'QUICK_ORDER_ALREADY_SUBMITTING', 409)
    this.locks.add(lockKey)
    session.confirmationId = normalizedConfirmationId
    try {
      const output = await this.adapter(session).sendSms(session.privateContext)
      if (output.finalResult) {
        this.applyFinalResult(session, output.finalResult)
      } else {
        session.stage = 'SMS_SENT'
        session.smsSentAt = Date.now()
      }
    } catch (error) {
      if (error?.details?.uncertain) {
        this.applyFinalResult(session, { accepted: true, uncertain: true, code: 'RESULT_UNKNOWN', message: '首次提交的响应未确认，请通过官方渠道核验，不要重复提交。' })
      } else {
        throw error
      }
    } finally {
      this.locks.delete(lockKey)
    }
    this.store.touch(session)
    await this.audit(session, 'sms-sent', { stage: session.stage })
    return publicQuickOrderSession(session)
  }

  async confirm(id, input = {}) {
    const session = this.requireSession(id)
    const confirmationId = String(input.confirmationId || '').trim()
    assertQuickOrder(/^[A-Za-z0-9_-]{8,80}$/.test(confirmationId), '订购确认标识无效', 'QUICK_ORDER_CONFIRMATION_INVALID')
    if (FINAL_STAGES.has(session.stage)) {
      if (session.confirmationId === confirmationId) return { session: publicQuickOrderSession(session), idempotent: true }
      throw new QuickOrderError('该会话已有最终结果，不能更换确认标识重复提交', 'QUICK_ORDER_ALREADY_FINAL', 409)
    }
    assertQuickOrder(session.stage === 'SMS_SENT', '请先发送订购验证码', 'QUICK_ORDER_STAGE_INVALID', 409)
    assertQuickOrder(!session.confirmationId || session.confirmationId === confirmationId, '订购确认标识与短信阶段不一致', 'QUICK_ORDER_CONFIRMATION_MISMATCH', 409)
    assertQuickOrder(input.agreed === true && input.realOrderConfirmed === true, '请完成真实订购二次确认', 'QUICK_ORDER_FINAL_CONFIRMATION_REQUIRED')
    const smsCode = String(input.smsCode || '').trim()
    assertQuickOrder(/^\d{6}$/.test(smsCode), '请输入 6 位短信验证码', 'QUICK_ORDER_SMS_CODE_INVALID')
    const lockKey = session.id
    if (this.locks.has(lockKey)) throw new QuickOrderError('该会话正在提交，请勿重复操作', 'QUICK_ORDER_ALREADY_SUBMITTING', 409)
    this.locks.add(lockKey)
    session.stage = 'SUBMITTING'
    session.confirmationId = confirmationId
    session.finalStartedAt = Date.now()
    this.store.touch(session)
    await this.audit(session, 'final-submit-started', { confirmationId })
    try {
      const result = await this.adapter(session).confirm(session.privateContext, smsCode)
      this.applyFinalResult(session, result)
    } catch (error) {
      if (error instanceof QuickOrderError && error.details?.recoverable) {
        session.stage = 'SMS_SENT'
        await this.audit(session, 'final-submit-recoverable-error', { errorCode: error.code })
        throw error
      }
      if (error?.details?.uncertain || isUncertainNetworkError(error)) {
        this.applyFinalResult(session, { accepted: true, uncertain: true, code: 'RESULT_UNKNOWN', message: '最终请求的响应未确认，请通过官方渠道核验，不要重复提交。' })
      } else {
        this.applyFinalResult(session, { accepted: false, uncertain: false, code: error?.code || 'QUICK_ORDER_FAILED', message: error instanceof Error ? error.message : '业务订购失败' })
      }
    } finally {
      this.locks.delete(lockKey)
      this.store.touch(session)
    }
    await this.audit(session, 'final-submit-completed', { resultCode: session.lastResult?.code, uncertain: session.lastResult?.uncertain })
    return { session: publicQuickOrderSession(session), idempotent: false }
  }

  applyFinalResult(session, result) {
    session.lastResult = {
      accepted: Boolean(result.accepted), uncertain: Boolean(result.uncertain), code: result.code || '', message: result.message || '',
      orderId: result.orderId || undefined, retryAllowed: false, completedAt: new Date().toISOString(),
    }
    session.stage = result.uncertain ? 'UNKNOWN' : result.accepted ? 'FINISHED' : 'FAILED'
  }

  delete(id) {
    this.locks.delete(String(id || ''))
    return this.store.delete(id)
  }

  async audit(session, action, extra = {}) {
    await this.logger('quickOrder:event', { executionId: randomUUID().replaceAll('-', ''), quickOrderSessionId: session.id, platform: session.platform, stage: session.stage, action, ...extra })
  }
}

export const quickOrderService = new QuickOrderService()
