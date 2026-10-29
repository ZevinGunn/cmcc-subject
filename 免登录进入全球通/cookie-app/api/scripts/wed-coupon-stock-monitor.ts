import { loadRuntimeConfig } from '../services/runtimeConfig.js'
import { runWedCouponStockMonitorOnce, getWedCouponStockMonitorStatus } from '../services/wedCouponStockMonitor.js'

loadRuntimeConfig()
try {
  if (process.argv.includes('--once')) await runWedCouponStockMonitorOnce()
  console.log(JSON.stringify(await getWedCouponStockMonitorStatus(), null, 2))
  process.exit(0)
} catch {
  console.error('周三库存监控执行失败，请检查本地配置、账号状态和 PushPlus 配置')
  process.exit(1)
}
