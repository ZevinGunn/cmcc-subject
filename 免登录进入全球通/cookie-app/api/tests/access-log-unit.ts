import assert from 'node:assert/strict'
import {
  classifyAccessFeature,
  describeAccessAction,
  sanitizeAccessReferer,
  sanitizeAccessPath,
} from '../services/accessLog.js'

assert.equal(
  sanitizeAccessPath('/api/accounts/550e8400-e29b-41d4-a716-446655440000/summary?token=secret'),
  '/api/accounts/:id/summary',
)
assert.equal(sanitizeAccessPath('/public?link=private-code'), '/public')
assert.equal(sanitizeAccessPath('/api/accounts/13800138000/summary'), '/api/accounts/:phone/summary')
assert.equal(
  sanitizeAccessReferer('https://bmcc.example/public?link=private-code#account'),
  'https://bmcc.example/public',
)
assert.equal(classifyAccessFeature('/api/auth/accounts/order'), '账号管理')
assert.equal(classifyAccessFeature('/v2/business/order'), '业务订购')
assert.equal(classifyAccessFeature('/shop-query'), '商城查询退订')
assert.equal(describeAccessAction('PATCH', '/api/auth/accounts/order'), '调整账号顺序')
assert.equal(describeAccessAction('POST', '/api/admin/login'), '登录')
assert.equal(describeAccessAction('GET', '/api/tasks/list', '任务中心'), '查看任务中心')

console.log('access-log-unit: ok')
