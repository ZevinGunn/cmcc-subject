import test from 'node:test'
import assert from 'node:assert/strict'
import { getActivity, listActivities, publicActivity } from '../src/services/activityConfigService.js'
import { activityInternals } from '../src/services/activityService.js'
import { renderTemplate } from '../src/services/templateService.js'
import { sanitize } from '../src/utils/logger.js'

test('loads the 1000M activity from JSON configuration', () => {
  const activity = getActivity('integrated-broadband-1000m')
  assert.ok(activity)
  assert.equal(activity.product.itemCode, '111602057454')
  assert.equal(activity.steps.commit.path, '/portal-bff/api/ajybz/v1.0/commit1000MYXTC')
  assert.equal(listActivities().length >= 1, true)
  assert.equal('steps' in publicActivity(activity), false)
})

test('renders activity templates without evaluating expressions', () => {
  const rendered = renderTemplate(
    {
      item_code: '{{activity.product.itemCode}}',
      address: '{{input.district}}-{{input.address}}',
      unchanged: 36,
    },
    { activity: { product: { itemCode: '111' } }, input: { district: '朝阳区', address: '测试地址' } },
  )
  assert.deepEqual(rendered, { item_code: '111', address: '朝阳区-测试地址', unchanged: 36 })
})

test('normalizes observed eligibility response shapes', () => {
  assert.equal(activityInternals.isEligible(true), true)
  assert.equal(activityInternals.isEligible({ data: true }), true)
  assert.equal(activityInternals.isEligible({ data: { data: true } }), true)
  assert.equal(activityInternals.isEligible('true'), false)
  assert.equal(activityInternals.hasExistingBroadband({ data: 'Y' }), true)
})

test('validates 18 digit identity checksum', () => {
  assert.equal(activityInternals.validateIdentityNo('11010519491231002X'), true)
  assert.equal(activityInternals.validateIdentityNo('110105194912310021'), false)
})

test('redacts nested subscriber data and keys but keeps product codes', () => {
  const value = sanitize({
    input: { ownerName: '测试用户', contactPhone: '13800138000', address: '测试地址' },
    portalKey: '1234567890abcdef',
    itemCode: '111602057454',
  })
  assert.match(value.input.ownerName, /REDACTED/)
  assert.equal(value.input.contactPhone, '138****8000')
  assert.match(value.input.address, /REDACTED/)
  assert.match(value.portalKey, /REDACTED/)
  assert.equal(value.itemCode, '111602057454')
})
