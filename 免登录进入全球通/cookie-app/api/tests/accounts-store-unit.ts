import assert from 'node:assert/strict'

import { __test__ as runtimeTest } from '../services/runtimeConfig.js'
import { validatePublicAccountOrder } from '../services/accountsStore.js'
import { positiveNumberEnv } from '../services/databaseMaintenance.js'

async function run() {
  runtimeTest.assertPostgresUrl(
    'postgresql://user:pass@127.0.0.1:5432/cmcc_cookie_app?schema=public',
  )
  runtimeTest.assertPostgresUrl(
    'postgres://user:pass@127.0.0.1:5432/cmcc_cookie_app?schema=public',
  )

  assert.throws(
    () => runtimeTest.assertPostgresUrl('mysql://user:pass@127.0.0.1:3306/cmcc'),
    /INVALID_DATABASE_URL/,
  )

  const validKey = Buffer.alloc(32, 7).toString('base64')
  runtimeTest.assertEncryptionKey(validKey)

  assert.throws(
    () => runtimeTest.assertEncryptionKey(Buffer.alloc(8, 1).toString('base64')),
    /INVALID_ENCRYPTION_KEY/,
  )

  validatePublicAccountOrder({
    accountIds: ['account-2', 'account-1'],
    pinnedAccountIds: ['account-2'],
    ownedAccountIds: ['account-1', 'account-2'],
  })
  assert.throws(
    () => validatePublicAccountOrder({ accountIds: ['account-1', 'account-1'], pinnedAccountIds: [], ownedAccountIds: ['account-1'] }),
    /DUPLICATE_ACCOUNT_ID/,
  )
  assert.throws(
    () => validatePublicAccountOrder({ accountIds: ['account-1'], pinnedAccountIds: ['account-2'], ownedAccountIds: ['account-1'] }),
    /INVALID_PINNED_ACCOUNT/,
  )
  assert.throws(
    () => validatePublicAccountOrder({ accountIds: ['account-1'], pinnedAccountIds: [], ownedAccountIds: ['account-1', 'account-2'] }),
    /ACCOUNT_SET_MISMATCH/,
  )

  process.env.TEST_MAINTENANCE_INTERVAL = '-4'
  assert.equal(positiveNumberEnv('TEST_MAINTENANCE_INTERVAL', 24), 24)
  process.env.TEST_MAINTENANCE_INTERVAL = '12'
  assert.equal(positiveNumberEnv('TEST_MAINTENANCE_INTERVAL', 24), 12)
  delete process.env.TEST_MAINTENANCE_INTERVAL
}

run().then(
  () => {
    process.stdout.write('runtime-config-unit: ok\n')
  },
  (e) => {
    process.stderr.write(
      `runtime-config-unit: failed: ${e instanceof Error ? e.message : String(e)}\n`,
    )
    process.exit(1)
  },
)
