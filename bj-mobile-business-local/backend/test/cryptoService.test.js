import test from 'node:test'
import assert from 'node:assert/strict'
import { decryptPortalBody, encryptPortalBody, symmetricTransform } from '../src/services/cryptoService.js'

test('AES-ECB configurable transform round trips UTF-8', () => {
  const encrypted = symmetricTransform({
    operation: 'encrypt',
    mode: 'ecb',
    key: '1234567890abcdef',
    input: '北京移动 activity',
  })
  const decrypted = symmetricTransform({
    operation: 'decrypt',
    mode: 'ecb',
    key: '1234567890abcdef',
    input: encrypted.output,
  })
  assert.equal(decrypted.output, '北京移动 activity')
  assert.equal(encrypted.details.keyBytes, 16)
})

test('AES-CBC supports hex key and IV', () => {
  const options = {
    mode: 'cbc',
    key: '00112233445566778899aabbccddeeff',
    keyEncoding: 'hex',
    iv: '000102030405060708090a0b0c0d0e0f',
    ivEncoding: 'hex',
  }
  const encrypted = symmetricTransform({ ...options, operation: 'encrypt', input: 'payload' })
  const decrypted = symmetricTransform({ ...options, operation: 'decrypt', input: encrypted.output })
  assert.equal(decrypted.output, 'payload')
})

test('portal body profile round trips JSON and URI encoding', () => {
  const source = { itemCode: '111602057454', enabled: true }
  const encrypted = encryptPortalBody(source, '1234567890abcdef')
  assert.deepEqual(decryptPortalBody(JSON.stringify(encrypted), '1234567890abcdef'), source)
})

test('configurable AES rejects invalid key and IV sizes', () => {
  assert.throws(
    () => symmetricTransform({ operation: 'encrypt', mode: 'ecb', key: 'short', input: 'x' }),
    /AES key/,
  )
  assert.throws(
    () => symmetricTransform({ operation: 'encrypt', mode: 'cbc', key: '1234567890abcdef', iv: 'short', input: 'x' }),
    /iv/,
  )
})
