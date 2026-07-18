import { Router } from 'express'
import { getSession } from '../services/sessionStore.js'
import {
  aesEcbDecrypt,
  aesEcbEncrypt,
  decodePortalKeyPayload,
  decryptPortalBody,
  encryptPortalBody,
  encryptPortalKeyWithServerKey,
  encryptReplayVersion,
  rsaEncryptLogin,
  decryptShopWireInput,
  shopWireEncrypt,
  SHOP_BUSINESS_KEY,
  symmetricTransform,
} from '../services/cryptoService.js'
import { normalizeBase64Maybe, parseJsonMaybeBase64 } from '../utils/http.js'
import { fail, ok } from '../utils/response.js'

const router = Router()

function isLocalDebugRequest(req) {
  if (process.env.BMCC_ENABLE_CRYPTO_DEBUG === '1') return true
  const host = String(req.headers.host || '').split(':')[0]
  return ['localhost', '127.0.0.1', '::1', '[::1]'].includes(host)
}

router.use((req, res, next) => {
  if (isLocalDebugRequest(req)) return next()
  return fail(res, 403, '加解密调试工具仅允许本机访问', 'LOCAL_DEBUG_ONLY')
})

function readSessionKey(sessionId) {
  if (!sessionId) return ''
  const session = getSession(sessionId)
  return session?.portalKey || ''
}

function readKey(req) {
  return String(req.body?.key || readSessionKey(req.body?.sessionId) || '').trim()
}

function parseJsonOrText(input) {
  const text = String(input ?? '').trim()
  if (!text) return ''
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function formatResult(value) {
  if (typeof value === 'string') return value
  return JSON.stringify(value, null, 2)
}

router.get('/crypto/session/:id', (req, res) => {
  const session = getSession(req.params.id)
  if (!session) return fail(res, 404, '登录会话不存在或已过期', 'SESSION_NOT_FOUND')
  ok(res, {
    sessionId: session.id,
    portalKey: session.portalKey || '',
    dataToken: session.dataToken || '',
    replayVersion: session.replayVersion ?? '',
    hasAccessToken: Boolean(session.accessToken),
    hasWafToken: Boolean(session.wafToken),
  })
})

router.post('/crypto/transform', (req, res) => {
  try {
    const result = symmetricTransform(req.body || {})
    ok(res, result)
  } catch (error) {
    fail(res, 400, error instanceof Error ? error.message : '加解密失败', 'CRYPTO_TRANSFORM_FAILED')
  }
})

router.post('/crypto', (req, res) => {
  try {
    const mode = String(req.body?.mode || '').trim()
    const input = req.body?.input ?? ''
    const key = readKey(req)
    let result
    const details = {}

    if (mode === 'login-rsa-encrypt') {
      result = rsaEncryptLogin(input)
      details.note = '登录侧 RSA 公钥加密不可逆，无法本地解密。'
    } else if (mode === 'aes-encrypt') {
      if (!key) return fail(res, 400, '请输入 AES key 或有效 sessionId', 'MISSING_KEY')
      result = aesEcbEncrypt(input, key)
    } else if (mode === 'aes-decrypt') {
      if (!key) return fail(res, 400, '请输入 AES key 或有效 sessionId', 'MISSING_KEY')
      result = aesEcbDecrypt(input, key)
    } else if (mode === 'portal-body-encrypt') {
      if (!key) return fail(res, 400, '请输入门户 AES key 或有效 sessionId', 'MISSING_KEY')
      result = encryptPortalBody(parseJsonOrText(input), key)
      details.wireBody = JSON.stringify(result)
    } else if (mode === 'portal-body-decrypt') {
      if (!key) return fail(res, 400, '请输入门户 AES key 或有效 sessionId', 'MISSING_KEY')
      result = decryptPortalBody(input, key)
    } else if (mode === 'replay-version-encrypt') {
      if (!key) return fail(res, 400, '请输入门户 AES key 或有效 sessionId', 'MISSING_KEY')
      result = encryptReplayVersion(input, key)
    } else if (mode === 'portal-key-payload-decode') {
      result = decodePortalKeyPayload(input)
    } else if (mode === 'portal-key-encrypt') {
      const portalKey = String(req.body?.portalKey || key || '').trim()
      const serverPublicKey = String(req.body?.serverPublicKey || input || '').trim()
      if (!portalKey) return fail(res, 400, '请输入 portalKey', 'MISSING_PORTAL_KEY')
      if (!serverPublicKey) return fail(res, 400, '请输入服务端 publicKey', 'MISSING_SERVER_PUBLIC_KEY')
      result = encryptPortalKeyWithServerKey(portalKey, serverPublicKey)
    } else if (mode === 'base64-normalize') {
      result = normalizeBase64Maybe(input)
    } else if (mode === 'json-parse-base64') {
      result = parseJsonMaybeBase64(input)
    } else if (mode === 'url-encode') {
      result = encodeURIComponent(String(input ?? ''))
    } else if (mode === 'url-decode') {
      result = decodeURIComponent(String(input ?? ''))
    } else if (mode === 'shop-wire-encrypt') {
      result = shopWireEncrypt(input, key || SHOP_BUSINESS_KEY)
      details.algorithm = 'AES-128-CBC / PKCS7 / Base64(AES-Base64)'
      details.iv = 'same-as-key'
    } else if (mode === 'shop-wire-decrypt') {
      result = decryptShopWireInput(input, key || SHOP_BUSINESS_KEY)
      details.algorithm = 'Base64 decode -> AES-128-CBC / PKCS7'
      details.iv = 'same-as-key'
    } else {
      return fail(res, 400, '请选择调试类型', 'INVALID_MODE')
    }

    ok(res, {
      mode,
      result,
      output: formatResult(result),
      details,
    })
  } catch (error) {
    fail(res, 200, error instanceof Error ? error.message : '加解密失败', 'CRYPTO_DEBUG_FAILED', {
      raw: { mode: req.body?.mode || '' },
    })
  }
})

export default router
