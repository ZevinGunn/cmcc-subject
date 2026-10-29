import crypto from 'node:crypto'
import fs from 'node:fs'
import vm from 'node:vm'
import type { HttpResponse } from './cmccHttp.js'

// Pinned public SDK from cmccjs.har. It is never downloaded or evaluated from an HTTP response.
const SDK_SHA256 = '2b3b008f515b739a71a74addee6fa072f615b744cfffe56bc912f38e8c91079a'
const SDK_URL = 'https://app.10086.cn/cmcc-module/H5module/js/BasicService_H5module.js'
let sdk: vm.Script | undefined

function loadSdk(): vm.Script {
  if (!sdk) {
    const source = fs.readFileSync(new URL('../vendor/cmcc/BasicService_H5module.js', import.meta.url), 'utf8')
    if (crypto.createHash('sha256').update(source).digest('hex') !== SDK_SHA256) throw new Error('CMCC H5 模块完整性校验失败')
    sdk = new vm.Script(source, { filename: 'CMCC-BasicService_H5module.js' })
  }
  return sdk
}

export type PreparedBusinessH5Request = {
  body: string
  headers: Record<string, string>
  decodeResponse: (response: Pick<HttpResponse, 'headers' | 'bodyText'>) => unknown
}

export function prepareBusinessH5Request(args: {
  url: string
  body: Record<string, unknown>
  cookie: string
  pageUrl: string
}): PreparedBusinessH5Request {
  const url = new URL(args.url)
  if (url.origin !== 'https://app.10086.cn' || !/^\/biz-orange\/BH\/(?:unifyQueryService\/getUnifyQuery|sms\/getSmsCode|unifyCancelServiceh5\/getUnifyCancel)$/.test(url.pathname) || url.search) {
    throw new Error('不支持的 CMCC H5 退订接口')
  }
  let captured: { body: string; headers: Record<string, string>; xhr: OfflineXHR } | undefined
  let result: unknown
  let failure = false
  let responseHeaders: HttpResponse['headers'] = {}
  class OfflineXHR {
    headers: Record<string, string> = {}
    response: unknown
    readyState = 0
    status = 0
    onreadystatechange?: () => void
    open(method: string, target: string): void {
      if (method !== 'POST' || target !== args.url) throw new Error('CMCC H5 模块请求不匹配')
    }
    setRequestHeader(name: string, value: unknown): void { this.headers[name.toLowerCase()] = String(value) }
    send(body: string): void {
      if (captured) throw new Error('CMCC H5 模块生成了重复请求')
      captured = { body, headers: this.headers, xhr: this }
    }
    getResponseHeader(name: string): string | null {
      const value = responseHeaders[name.toLowerCase()]
      return Array.isArray(value) ? value[0] || null : value || null
    }
  }
  const sandbox: Record<string, unknown> = {
    XMLHttpRequest: OfflineXHR,
    navigator: { userAgent: 'Mozilla/5.0' },
    location: { href: args.pageUrl, origin: new URL(args.pageUrl).origin, search: '' },
    document: { scripts: [{ src: SDK_URL }], cookie: args.cookie },
    console: { log() {}, error() {} },
    input: { url: args.url, type: 'POST', data: JSON.stringify(args.body), async: false },
    recordResult(value: unknown) { result = value },
    recordFailure() { failure = true },
  }
  sandbox.window = sandbox
  sandbox.self = sandbox
  const context = vm.createContext(sandbox, { codeGeneration: { strings: false, wasm: false } })
  loadSdk().runInContext(context, { timeout: 2000 })
  vm.runInContext('input.success = function (value) { recordResult(value) }; input.error = function () { recordFailure() }; BasicService_H5module.ajaxRequest(input)', context, { timeout: 2000 })
  if (!captured || failure || captured.headers['x-qen'] !== '17') throw new Error('CMCC H5 请求生成失败')
  const prepared = captured
  return {
    body: prepared.body,
    headers: prepared.headers,
    decodeResponse(response) {
      responseHeaders = Object.fromEntries(Object.entries(response.headers).map(([key, value]) => [key.toLowerCase(), value]))
      const pen = prepared.xhr.getResponseHeader('x-pen')
      if (pen && pen !== '17') throw new Error('CMCC 返回了不支持的响应加密版本')
      result = undefined
      failure = false
      prepared.xhr.response = JSON.parse(response.bodyText)
      prepared.xhr.status = 200
      prepared.xhr.readyState = 4
      // Run the SDK response decoder under the same bounded, network-free context.
      sandbox.responseXhr = prepared.xhr
      vm.runInContext('responseXhr.onreadystatechange()', context, { timeout: 2000 })
      if (failure || !result || typeof result !== 'object' || !/^\d{6}$/.test(String((result as Record<string, unknown>).retCode || ''))) {
        throw new Error('CMCC H5 响应未包含有效的业务结果码')
      }
      return JSON.parse(JSON.stringify(result))
    },
  }
}
