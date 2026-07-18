import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const backendDir = path.resolve(__dirname, '..')
const projectDir = path.resolve(backendDir, '..')

function loadEnv(filePath) {
  if (!existsSync(filePath)) return
  const text = readFileSync(filePath, 'utf8')
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf('=')
    if (index < 1) continue
    const key = trimmed.slice(0, index).trim()
    const value = trimmed.slice(index + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnv(path.join(backendDir, '.env'))
loadEnv(path.resolve(projectDir, '../project-manager/.env'))

export const config = {
  host: process.env.HOST || '127.0.0.1',
  port: Number(process.env.PORT || 8790),
  isProduction: process.env.NODE_ENV === 'production',
  adminPassword: process.env.ROUTE_HUB_ADMIN_PASSWORD || process.env.MANAGER_PASSWORD || '',
  dataDir: process.env.ROUTE_HUB_DATA_DIR || path.join(backendDir, 'data'),
  frontendDist: path.resolve(projectDir, 'frontend/dist'),
  portalOrigin: 'https://service.bj.10086.cn',
  portalHomeUrl: 'https://service.bj.10086.cn/nwt/portal/index.html',
  fallbackBundleUrl: 'https://service.bj.10086.cn/nwt/portal/assets/js/index-7a608eaf.js',
  businessBaseUrl: 'https://service.bj.10086.cn/nwt/portal',
  rightsOrigin: 'https://xcxp.bj.10086.cn',
  rightsBundleUrl: 'https://xcxp.bj.10086.cn/rights-front/dist/umi.js',
  rightsBaseUrl: 'https://xcxp.bj.10086.cn/rights-front/dist/index.html#',
  maxBundleBytes: 5 * 1024 * 1024,
  sessionTtlMs: 2 * 60 * 60 * 1000,
}
