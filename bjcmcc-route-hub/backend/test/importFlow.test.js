import assert from 'node:assert/strict'
import { copyFile, mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

const dataDir = await mkdtemp(path.join(os.tmpdir(), 'route-hub-test-'))
process.env.ROUTE_HUB_DATA_DIR = dataDir

const { createImport } = await import('../src/services/importService.js')
const { applyPending, publicCatalog, rollbackCatalog } = await import('../src/services/catalogStore.js')

function bundle(routes) {
  return `export default [${routes.map((route) => `{path:'${route.path}',name:'${route.name}',meta:{title:'${route.title}',requireAuth:${route.auth}}}`).join(',')}]`
}

test.after(async () => {
  await rm(dataDir, { recursive: true, force: true })
})

test('previews, applies, incrementally updates and rolls back imports', async () => {
  const first = await createImport(bundle([
    { path: '/a', name: 'a', title: '业务 A', auth: true },
    { path: '/b', name: 'b', title: '业务 B', auth: false },
  ]), { type: 'upload', name: 'first.js' })
  assert.equal(first.diff.added.length, 2)
  assert.equal(first.diff.updated.length, 0)
  await applyPending(first.id)

  const second = await createImport(bundle([
    { path: '/a', name: 'a', title: '业务 A 新', auth: true },
    { path: '/c', name: 'c', title: '业务 C', auth: false },
  ]), { type: 'upload', name: 'second.js' })
  assert.equal(second.diff.added.length, 1)
  assert.equal(second.diff.updated.length, 1)
  assert.equal(second.diff.removed.length, 1)
  await applyPending(second.id)

  let catalog = await publicCatalog()
  assert.equal(catalog.routes.length, 2)
  assert.ok(catalog.routes.some((route) => route.title === '业务 A 新'))
  assert.ok(catalog.routes.some((route) => route.path === '/c'))

  await rollbackCatalog()
  catalog = await publicCatalog()
  assert.equal(catalog.activeImportId, first.id)
  assert.ok(catalog.routes.some((route) => route.path === '/b'))
  assert.ok(catalog.routes.some((route) => route.title === '业务 A'))

  await copyFile(path.join(dataDir, 'catalog.json'), path.join(dataDir, 'seed-catalog.json'))
  await rm(path.join(dataDir, 'catalog.json'))
  catalog = await publicCatalog()
  assert.equal(catalog.activeImportId, first.id)
  assert.equal(catalog.routes.length, 2)

  const rightsSource = `(() => ({
    a:{path:'activity/GoldFeedBack',id:'activity/GoldFeedBack/index',parentId:'@@/global-layout'},
    b:{path:'99plus2',id:'99plus2/index/index',parentId:'@@/global-layout'},
    labels:{pageName:'黄金会员回馈活动',pathName:'activity/GoldFeedBack'}
  }))()`
  const rights = await createImport(rightsSource, { type: 'upload', name: 'umi.js' }, 'rights')
  assert.equal(rights.catalogType, 'rights')
  assert.equal(rights.diff.added.length, 2)
  await applyPending(rights.id)
  const rightsCatalog = await publicCatalog('rights')
  assert.equal(rightsCatalog.routes.length, 2)
  assert.ok(rightsCatalog.routes.some((route) => route.title === '黄金会员回馈活动'))
  assert.equal((await publicCatalog('business')).activeImportId, first.id)
})
