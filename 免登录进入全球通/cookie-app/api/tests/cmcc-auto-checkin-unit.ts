import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'

import {
  __test__ as cmccAutoTest,
  executeCmccAutoCheckin,
  listCmccAutoCheckinCapabilities,
  parseCmccAutoCheckinParams,
} from '../services/cmccAutoCheckin.js'
import { __test__ as batchTaskTest } from '../services/batchTasks.js'

const capabilities = listCmccAutoCheckinCapabilities()
assert.equal(capabilities.length, 8)
assert.equal(capabilities.find((item) => item.id === 'fee')?.sideEffect, false)
assert.deepEqual(parseCmccAutoCheckinParams(), { operations: ['sign'], dryRun: true, includeAllSignTasks: true })
assert.deepEqual(
  parseCmccAutoCheckinParams(JSON.stringify({ operations: ['sign', 'unknown', 'sign'], dryRun: false, allowSideEffects: true })),
  { operations: ['sign'], dryRun: false, includeAllSignTasks: true, timeoutSeconds: 300, allowSideEffects: true },
)
assert.deepEqual(
  parseCmccAutoCheckinParams(JSON.stringify({ operations: ['wed'], timeoutSeconds: 1 })),
  { operations: ['wed'], dryRun: true, includeAllSignTasks: true, timeoutSeconds: 30, allowSideEffects: false },
)
assert.deepEqual(
  parseCmccAutoCheckinParams(JSON.stringify({ operations: ['wed'], timeoutSeconds: 99999 })),
  { operations: ['wed'], dryRun: true, includeAllSignTasks: true, timeoutSeconds: 900, allowSideEffects: false },
)
assert.deepEqual(cmccAutoTest.operationArgs('sign', { dryRun: true, includeAllSignTasks: true }), [
  '--dry-run', '--tasks', '--games', '--wed', '--seed', '--gold',
])
assert.deepEqual(cmccAutoTest.operationArgs('wed', { dryRun: false }), [])
assert.match(
  cmccAutoTest.redactOutput('phone=13800138000 app_token=super-secret token=jwt-secret'),
  /手机号\[已隐藏\].*app_token=\[已隐藏\].*token=\[已隐藏\]/,
)
assert.equal(
  batchTaskTest.formatCmccAutoCheckinMessage({
    status: 'success', message: '汇总',
    operationResults: [{ operation: 'sign', status: 'success', message: '签到完成' }],
  }),
  '汇总\nsign:success（签到完成）',
)

assert.equal(
  cmccAutoTest.summarizeOperationResults([
    { operation: 'sign', status: 'success', message: '第一行\n第二行' },
    { operation: 'fee', status: 'skipped', message: '缺少凭据' },
  ]),
  'sign:success（第一行）；fee:skipped（缺少凭据）',
)

const referenceRoot = path.resolve(process.cwd(), '../../参考工具/cmcc-auto-checkin')
const python = path.join(referenceRoot, '.venv310/bin/python')
assert.ok(existsSync(referenceRoot), '参考脚本目录不存在')
assert.ok(existsSync(python), '参考项目 Python 运行时不存在')
assert.equal(cmccAutoTest.getReferenceRoot(), referenceRoot)
for (const capability of capabilities) {
  const scriptPath = path.join(referenceRoot, capability.script)
  assert.ok(existsSync(scriptPath), '能力清单脚本不存在: ' + capability.script)
  const help = spawnSync(python, [scriptPath, '--help'], { cwd: referenceRoot, encoding: 'utf8', timeout: 15_000 })
  assert.equal(help.status, 0, '脚本 --help 失败: ' + capability.script + '\n' + (help.stderr || ''))
}

const fakeRoot = mkdtempSync(path.join(os.tmpdir(), 'cmcc-auto-checkin-test-'))
const fakeScript = path.join(fakeRoot, 'cmcc_sign.py')
writeFileSync(fakeScript, [
  'const fs = require("node:fs")',
  'const config = process.argv[process.argv.indexOf("--config") + 1]',
  'const mode = fs.statSync(config).mode & 0o777',
  'const data = JSON.parse(fs.readFileSync(config, "utf8"))',
  'console.log("CONFIG_PATH=" + config + " MODE=" + mode.toString(8) + " phone=" + data.phone + " app_token=" + data.app_token + " token=secret")',
].join('\n'))
const previousRoot = process.env.CMCC_AUTO_CHECKIN_ROOT
const previousPython = process.env.CMCC_AUTO_CHECKIN_PYTHON
process.env.CMCC_AUTO_CHECKIN_ROOT = fakeRoot
process.env.CMCC_AUTO_CHECKIN_PYTHON = process.execPath
try {
  const result = await executeCmccAutoCheckin({
    account: {
      id: 'test-account', phone: '13800138000', cmccAppCookie: 'app-secret',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    params: { operations: ['sign'], dryRun: true },
  })
  assert.equal(result.status, 'success')
  assert.equal(result.operationResults[0]?.status, 'success')
  assert.match(result.operationResults[0]?.message || '', /MODE=600/)
  assert.doesNotMatch(result.operationResults[0]?.message || '', /app-secret|secret(?=\s|$)/)
  const configPath = (result.operationResults[0]?.message.match(/CONFIG_PATH=(\S+)/) || [])[1]
  assert.ok(configPath, '未记录临时配置路径，无法验证清理')
  assert.equal(existsSync(configPath), false, '临时配置目录未清理')

  const feeOnly = await executeCmccAutoCheckin({
    account: {
      id: 'test-account', phone: '13800138000', cmccAppCookie: 'app-secret',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    params: { operations: ['fee'], dryRun: true },
  })
  assert.equal(feeOnly.status, 'skipped')
  assert.equal(feeOnly.operationResults[0]?.message.includes('jsessionid-cmcc'), true)

  const denied = await executeCmccAutoCheckin({
    account: {
      id: 'test-account', phone: '13800138000', cmccAppCookie: 'app-secret',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    params: { operations: ['sign'], dryRun: false, allowSideEffects: false },
  })
  assert.equal(denied.status, 'failed')
  assert.match(denied.message, /allowSideEffects=true/)
} finally {
  if (previousRoot === undefined) delete process.env.CMCC_AUTO_CHECKIN_ROOT
  else process.env.CMCC_AUTO_CHECKIN_ROOT = previousRoot
  if (previousPython === undefined) delete process.env.CMCC_AUTO_CHECKIN_PYTHON
  else process.env.CMCC_AUTO_CHECKIN_PYTHON = previousPython
  rmSync(fakeRoot, { recursive: true, force: true })
}

const timeoutRoot = mkdtempSync(path.join(os.tmpdir(), 'cmcc-auto-checkin-timeout-'))
const timeoutScript = path.join(timeoutRoot, 'hang.py')
writeFileSync(timeoutScript, 'setTimeout(() => {}, 1000)\n')
try {
  const timeoutResult = await cmccAutoTest.runScript({
    python: process.execPath, script: timeoutScript, configPath: timeoutScript,
    cwd: timeoutRoot, extraArgs: [], timeoutMs: 50,
  })
  assert.equal(timeoutResult.timedOut, true)
} finally {
  rmSync(timeoutRoot, { recursive: true, force: true })
}

console.log('cmcc-auto-checkin unit ok: 参数、脚本清单、帮助命令、脱敏、0600 临时凭据、清理、超时和副作用权限边界均已覆盖')
