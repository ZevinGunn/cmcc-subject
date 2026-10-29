import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { parseRightsRoutes, parseRoutes } from '../src/services/routeParser.js'

const baseUrl = 'https://service.bj.10086.cn/nwt/portal'

test('extracts routes, static metadata, component and duplicate occurrences', () => {
  const source = `
    const routes = [
      { path: '/main', name: 'main', meta: { title: '主业务', requireAuth: !0x0 }, component: () => import('./main.js') },
      { 'path': '/main', 'name': 'main', 'meta': { 'title': '主业务', 'requireAuth': true }, 'component': () => import('./main.js') },
      { path: '/mainSuccess', name: 'mainSuccess', meta: { title: '主业务', requireAuth: false }, component: () => import('./success.js') },
      { path: '/plain', name: 'plain', meta: { title: '' }, component: () => import('./plain.js') }
    ]
  `
  const result = parseRoutes(source, { baseUrl })
  assert.equal(result.stats.rawRoutes, 4)
  assert.equal(result.stats.logicalRoutes, 3)
  assert.equal(result.stats.exactDuplicates, 1)
  assert.equal(result.stats.authRequired, 1)
  assert.equal(result.stats.emptyTitles, 1)
  assert.equal(result.routes.find((route) => route.name === 'main').component, './main.js')
  assert.equal(result.routes.find((route) => route.name === 'mainSuccess').pageType, 'success')
  assert.equal(result.routes.find((route) => route.name === 'plain').url, `${baseUrl}/plain`)
})

test('preserves same-path variants as conflicts', () => {
  const source = `[
    {path:'/same',name:'first',meta:{title:'甲',requireAuth:true}},
    {path:'/same',name:'second',meta:{title:'乙',requireAuth:false}}
  ]`
  const result = parseRoutes(source, { baseUrl })
  assert.equal(result.routes.length, 2)
  assert.equal(result.stats.uniquePaths, 1)
  assert.equal(result.stats.pathConflicts, 1)
  assert.deepEqual(result.conflicts[0].path, '/same')
})

test('rejects invalid bundles and bundles without route objects', () => {
  assert.throws(() => parseRoutes('const = broken', { baseUrl }), { code: 'INVALID_JAVASCRIPT' })
  assert.throws(() => parseRoutes('const value = { path: "/x" }', { baseUrl }), { code: 'NO_ROUTES_FOUND' })
})

test('extracts the supplied Beijing Mobile production bundle', { skip: !process.env.BMCC_BUNDLE_FILE }, async () => {
  const source = await readFile(process.env.BMCC_BUNDLE_FILE, 'utf8')
  const result = parseRoutes(source, { baseUrl })
  assert.equal(result.stats.rawRoutes, 561)
  assert.equal(result.stats.logicalRoutes, 547)
  assert.equal(result.stats.uniquePaths, 545)
  assert.equal(result.stats.exactDuplicates, 14)
  assert.equal(result.stats.pathConflicts, 2)
  assert.ok(result.routes.some((route) => route.name === 'broadbandAcceleration' && route.title === '宽带提速月包'))
  assert.ok(result.routes.some((route) => route.path === '/broadbandSpeedUpPay' && route.title === '宽带提速包'))
})

test('extracts Umi hash routes, applies mapped titles and marks internal modules', () => {
  const source = `(() => {
    const pageNames = {
      '001': { pageName: '黄金会员回馈活动', pathName: 'activity/GoldFeedBack' }
    };
    const routes = {
      a: { path: 'activity/GoldFeedBack', id: 'activity/GoldFeedBack/index', parentId: '@@/global-layout' },
      b: { path: '99plus2', id: '99plus2/index/index', parentId: '@@/global-layout' },
      c: { path: 'demo/offer', id: 'demo/offer/index', parentId: '@@/global-layout' },
      d: { path: 'demo/common/hooks/use-demo', id: 'demo/common/hooks/use-demo/index', parentId: '@@/global-layout' },
      e: { path: '*', id: '404', parentId: '@@/global-layout' }
    };
  })()`
  const result = parseRightsRoutes(source, { baseUrl: 'https://xcxp.bj.10086.cn/rights-front/dist/index.html#' })
  assert.equal(result.stats.rawRoutes, 5)
  assert.equal(result.stats.logicalRoutes, 4)
  assert.equal(result.stats.excludedWildcards, 1)
  assert.equal(result.stats.internalRoutes, 1)
  const gold = result.routes.find((route) => route.path === '/activity/GoldFeedBack')
  assert.equal(gold.title, '黄金会员回馈活动')
  assert.equal(gold.category, 'activity')
  assert.equal(gold.url, 'https://xcxp.bj.10086.cn/rights-front/dist/index.html#/activity/GoldFeedBack')
  assert.equal(result.routes.find((route) => route.path.includes('/common/hooks/')).internal, true)
})

test('extracts the supplied rights-front production bundle', { skip: !process.env.RIGHTS_BUNDLE_FILE }, async () => {
  const source = await readFile(process.env.RIGHTS_BUNDLE_FILE, 'utf8')
  const result = parseRightsRoutes(source, { baseUrl: 'https://xcxp.bj.10086.cn/rights-front/dist/index.html#' })
  assert.equal(result.stats.rawRoutes, 346)
  assert.equal(result.stats.logicalRoutes, 345)
  assert.equal(result.stats.uniquePaths, 345)
  assert.equal(result.stats.internalRoutes, 100)
  assert.ok(result.routes.some((route) => route.path === '/99plus2'))
  assert.ok(result.routes.some((route) => route.path === '/activity/GoldFeedBack' && route.title === '黄金会员回馈活动'))
  assert.ok(result.routes.some((route) => route.path === '/act/gold2608'))
  assert.ok(!result.routes.some((route) => route.path === '/demo/offer'))
})
