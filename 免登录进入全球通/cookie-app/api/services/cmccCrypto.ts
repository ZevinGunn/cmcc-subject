import fs from 'node:fs/promises'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

type CryptoContext = {
  aesEncrypt: (input: string) => string
  aesDecrypt: (input: string) => string
}

let cryptoContextPromise: Promise<CryptoContext> | null = null

async function loadCryptoContext(): Promise<CryptoContext> {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const cryptoFilePath = path.resolve(
    __dirname,
    '../../../10086登录页/wx.10086.cn/website/js/shared/crypto20251103.js',
  )

  const script = await fs.readFile(cryptoFilePath, 'utf8')

  const sandbox: Record<string, unknown> = { console: console }
  sandbox.window = sandbox
  sandbox.self = sandbox
  vm.createContext(sandbox)
  vm.runInContext(script, sandbox, { timeout: 2000 })

  const aesEncrypt = sandbox.aesEncrypt
  const aesDecrypt = sandbox.aesDecrypt
  if (typeof aesEncrypt !== 'function' || typeof aesDecrypt !== 'function') {
    throw new Error('crypto20251103.js did not expose aesEncrypt/aesDecrypt')
  }

  return {
    aesEncrypt: aesEncrypt as CryptoContext['aesEncrypt'],
    aesDecrypt: aesDecrypt as CryptoContext['aesDecrypt'],
  }
}

async function getCryptoContext(): Promise<CryptoContext> {
  if (!cryptoContextPromise) {
    cryptoContextPromise = loadCryptoContext()
  }
  return cryptoContextPromise
}

export async function aesEncrypt(input: string): Promise<string> {
  const ctx = await getCryptoContext()
  return ctx.aesEncrypt(input)
}

export async function aesDecrypt(input: string): Promise<string> {
  const ctx = await getCryptoContext()
  return ctx.aesDecrypt(input)
}

