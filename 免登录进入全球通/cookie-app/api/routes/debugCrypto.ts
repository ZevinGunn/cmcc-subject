import crypto from 'node:crypto'
import { Router, type Request, type Response } from 'express'
import {
  CMCC_BUSINESS_CRYPTO,
  debugDecrypt,
  debugEncrypt,
  debugFormat,
  type DebugCryptoMode,
} from '../services/debugCrypto.js'

type CryptoResp = {
  ok: boolean
  output?: string
  kind?: 'json' | 'text'
  mode?: DebugCryptoMode
  error?: string
  requestId?: string
}

function htmlEscape(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function parseMode(value: unknown): DebugCryptoMode {
  return value === 'business-request' || value === 'business-response' || value === 'legacy'
    ? value
    : 'legacy'
}

function renderDebugPage(): string {
  const title = 'CMCC 业务接口解析工具'
  const description = '账单、已订业务等 cmcc-service 业务接口入参/响应 AES-CBC 加解密'
  const meta = CMCC_BUSINESS_CRYPTO
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex,nofollow" />
    <title>${htmlEscape(title)}</title>
    <style>
      :root{
        --bg:#F5F7FB;
        --panel:#FFFFFF;
        --text:#172033;
        --muted:#667085;
        --border:#D9E1EC;
        --soft:#EFF5FF;
        --accent:#2563EB;
        --accent-2:#0EA5E9;
        --danger:#B42318;
        --code:#101828;
      }
      *{box-sizing:border-box}
      body{margin:0;background:var(--bg);color:var(--text);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial}
      .wrap{max-width:1180px;margin:0 auto;padding:24px 18px 56px}
      header{display:flex;gap:12px;justify-content:space-between;align-items:flex-start;margin-bottom:14px}
      h1{margin:0;font-size:22px;line-height:1.25;font-weight:800}
      .sub{margin-top:6px;color:var(--muted);font-size:13px;line-height:1.5}
      a{color:var(--accent);text-decoration:none}
      .cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:14px 0 18px}
      @media (max-width:900px){.cards{grid-template-columns:1fr}.work{grid-template-columns:1fr}}
      .meta-card,.panel{background:var(--panel);border:1px solid var(--border);border-radius:12px;box-shadow:0 8px 24px rgba(16,24,40,.06)}
      .meta-card{padding:14px}
      .meta-card h2,.panel h2{margin:0;font-size:14px;font-weight:800}
      .meta-card dl{margin:10px 0 0;display:grid;grid-template-columns:72px 1fr;gap:8px 10px;font-size:13px}
      .meta-card dt{color:var(--muted)}
      .meta-card dd{margin:0;min-width:0}
      code{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;color:var(--code);background:#F2F4F7;border:1px solid #EAECF0;border-radius:7px;padding:2px 6px;word-break:break-all}
      .work{display:grid;grid-template-columns:1fr 1fr;gap:14px}
      .panel{padding:14px}
      .panel-head{display:flex;align-items:center;gap:10px;margin-bottom:10px}
      .panel-head .spacer,.toolbar .spacer{flex:1}
      .hint{font-size:12px;color:var(--muted);line-height:1.4}
      textarea{width:100%;min-height:260px;resize:vertical;border:1px solid var(--border);border-radius:10px;background:#FBFCFE;color:var(--text);padding:12px;font-size:12px;line-height:1.55;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;outline:none}
      textarea:focus{border-color:#84A9FF;box-shadow:0 0 0 3px rgba(37,99,235,.12)}
      .toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:10px}
      button,select{border:1px solid var(--border);border-radius:10px;background:#FFF;color:var(--text);font-size:13px;line-height:1;padding:9px 11px;outline:none}
      button{cursor:pointer}
      button.primary{background:var(--accent);border-color:var(--accent);color:#FFF}
      button.secondary{background:var(--soft);border-color:#BFDBFE;color:#1D4ED8}
      button:hover{filter:brightness(.98);border-color:#98A2B3}
      button:disabled{opacity:.55;cursor:not-allowed}
      .status{min-height:18px;margin-top:8px;font-size:12px;color:var(--muted)}
      .status.error{color:var(--danger)}
      .split-title{display:flex;align-items:center;gap:8px}
      .pill{font-size:12px;color:#075985;background:#E0F2FE;border:1px solid #BAE6FD;border-radius:999px;padding:3px 8px}
      footer{margin-top:18px;color:var(--muted);font-size:12px;line-height:1.5}
    </style>
  </head>
  <body>
    <div class="wrap">
      <header>
        <div>
          <h1>${htmlEscape(title)}</h1>
          <div class="sub">${htmlEscape(description)}。加密输出为 Base64；JSON 入参加密前会自动压缩成接口真实提交格式。</div>
        </div>
        <a class="hint" href="/api/health" target="_blank" rel="noreferrer">API Health</a>
      </header>

      <section class="cards" aria-label="加密参数">
        <div class="meta-card">
          <h2>业务请求入参</h2>
          <dl>
            <dt>算法</dt><dd><code>${htmlEscape(meta.algorithm)}</code></dd>
            <dt>Padding</dt><dd><code>${htmlEscape(meta.padding)}</code></dd>
            <dt>Key</dt><dd><code>${htmlEscape(meta.request.key)}</code></dd>
            <dt>IV</dt><dd><code>${htmlEscape(meta.request.iv)}</code></dd>
          </dl>
        </div>
        <div class="meta-card">
          <h2>业务响应 body</h2>
          <dl>
            <dt>算法</dt><dd><code>${htmlEscape(meta.algorithm)}</code></dd>
            <dt>编码</dt><dd><code>${htmlEscape(meta.encoding)}</code></dd>
            <dt>Key</dt><dd><code>${htmlEscape(meta.response.key)}</code></dd>
            <dt>IV</dt><dd><code>${htmlEscape(meta.response.iv)}</code></dd>
          </dl>
        </div>
        <div class="meta-card">
          <h2>Cookie 手机号</h2>
          <dl>
            <dt>算法</dt><dd><code>${htmlEscape(meta.algorithm)}</code></dd>
            <dt>编码</dt><dd><code>${htmlEscape(meta.encoding)}</code></dd>
            <dt>Key</dt><dd><code>${htmlEscape(meta.cookie.key)}</code></dd>
            <dt>IV</dt><dd><code>${htmlEscape(meta.cookie.iv)}</code></dd>
          </dl>
        </div>
      </section>

      <main class="work">
        <section class="panel">
          <div class="panel-head">
            <div class="split-title"><h2>请求入参解析</h2><span class="pill">business-request</span></div>
            <div class="spacer"></div>
            <button id="reqSample" type="button">填入示例</button>
          </div>
          <textarea id="reqInput" spellcheck="false" placeholder="粘贴账单/已订业务接口的加密 POST body，点击“解密入参”；或粘贴明文 JSON，点击“加密入参”。"></textarea>
          <div class="toolbar">
            <button id="reqDecrypt" class="primary" type="button">解密入参</button>
            <button id="reqEncrypt" class="secondary" type="button">加密入参</button>
            <button id="reqFormat" type="button">格式化</button>
            <button id="reqClear" type="button">清空</button>
            <div class="spacer"></div>
            <button id="reqCopy" type="button">复制结果</button>
          </div>
          <div id="reqStatus" class="status"></div>
          <textarea id="reqOutput" spellcheck="false" readonly placeholder="请求入参结果"></textarea>
        </section>

        <section class="panel">
          <div class="panel-head">
            <div class="split-title"><h2>响应 body 解析</h2><span class="pill">business-response</span></div>
            <div class="spacer"></div>
            <button id="respSample" type="button">填入示例</button>
          </div>
          <textarea id="respInput" spellcheck="false" placeholder='粘贴完整响应 {"body":"..."} 或直接粘贴 body 密文，点击“解密响应”；也可以粘贴明文 JSON 后“加密响应”。'></textarea>
          <div class="toolbar">
            <button id="respDecrypt" class="primary" type="button">解密响应</button>
            <button id="respEncrypt" class="secondary" type="button">加密响应</button>
            <button id="respFormat" type="button">格式化</button>
            <button id="respClear" type="button">清空</button>
            <div class="spacer"></div>
            <button id="respCopy" type="button">复制结果</button>
          </div>
          <div id="respStatus" class="status"></div>
          <textarea id="respOutput" spellcheck="false" readonly placeholder="响应解密/加密结果"></textarea>
        </section>
      </main>

      <footer>仅用于本地调试。接口 Header 中的 Cookie、x-token、签名类字段不要提交到外网环境。</footer>
    </div>

    <script>
      const $ = (id) => document.getElementById(id)
      const sampleRequest = JSON.stringify({
        ak: '',
        cid: '0',
        en: '0',
        t: '0',
        sn: '0',
        cv: '0',
        st: '0',
        sv: '0',
        sp: '0',
        xk: '4a534a65-36cb-7d5d-02bf-e6d76dcd692c',
        xc: 'web',
        imei: '',
        nt: '',
        sb: '',
        prov: '351',
        city: '0358',
        tel: '18234870679',
        reqBody: {
          cellNum: '18234870679',
          bgnMonth: '2026-07',
          endMonth: '2026-07',
        },
        pageURI: 'https://wx.10086.cn/cmcc-service/app-pages/main/phoneBills',
        lk: 'CKyscfssVfp4V80E61EBj8lbYbaTkhrZ',
      }, null, 2)
      const sampleResponse = JSON.stringify({
        retCode: '000000',
        retDesc: 'SUCCESS',
        rspBody: {
          historyBillInfo: [
            {
              inBill: '202607',
              totalBill: '827.20',
              reductionBill: '-49.00',
              realConsumeBill: '778.20',
              realPayBill: '778.20',
            },
          ],
          oprTime: '2026-07-03 02:03:32',
        },
      }, null, 2)

      async function postJson(url, body){
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const json = await res.json().catch(() => null)
        return { status: res.status, json }
      }

      function status(id, text, error){
        const el = $(id)
        el.textContent = text || ''
        el.className = error ? 'status error' : 'status'
      }

      function apiError(result){
        const json = result.json
        return json && (json.error || json.message) ? (json.error || json.message) : 'HTTP ' + result.status
      }

      async function transform(mode, action, input){
        const result = await postJson('/api/debug/crypto/' + action, { input, mode })
        if(!result.json || !result.json.ok) throw new Error(apiError(result))
        return result.json.output || ''
      }

      async function formatText(text){
        const result = await postJson('/api/debug/crypto/format', { text })
        if(!result.json || !result.json.ok) throw new Error(apiError(result))
        return { output: result.json.output || '', kind: result.json.kind || 'text' }
      }

      async function copy(text){
        try { await navigator.clipboard.writeText(text || '') } catch {}
      }

      function bindPanel(prefix, mode){
        $(prefix + 'Decrypt').addEventListener('click', async () => {
          status(prefix + 'Status', '解密中...', false)
          try {
            const output = await transform(mode, 'decrypt', $(prefix + 'Input').value)
            const formatted = await formatText(output)
            $(prefix + 'Output').value = formatted.output
            status(prefix + 'Status', formatted.kind === 'json' ? '解密完成，已格式化 JSON' : '解密完成', false)
          } catch(e) {
            status(prefix + 'Status', e instanceof Error ? e.message : String(e), true)
          }
        })

        $(prefix + 'Encrypt').addEventListener('click', async () => {
          status(prefix + 'Status', '加密中...', false)
          try {
            $(prefix + 'Output').value = await transform(mode, 'encrypt', $(prefix + 'Input').value)
            status(prefix + 'Status', '加密完成', false)
          } catch(e) {
            status(prefix + 'Status', e instanceof Error ? e.message : String(e), true)
          }
        })

        $(prefix + 'Format').addEventListener('click', async () => {
          status(prefix + 'Status', '格式化中...', false)
          try {
            const r = await formatText($(prefix + 'Input').value)
            $(prefix + 'Output').value = r.output
            status(prefix + 'Status', r.kind === 'json' ? '已识别 JSON' : '非 JSON 原文展示', false)
          } catch(e) {
            status(prefix + 'Status', e instanceof Error ? e.message : String(e), true)
          }
        })

        $(prefix + 'Clear').addEventListener('click', () => {
          $(prefix + 'Input').value = ''
          $(prefix + 'Output').value = ''
          status(prefix + 'Status', '', false)
        })

        $(prefix + 'Copy').addEventListener('click', async () => {
          await copy($(prefix + 'Output').value)
          status(prefix + 'Status', '已复制', false)
        })
      }

      bindPanel('req', 'business-request')
      bindPanel('resp', 'business-response')
      $('reqSample').addEventListener('click', () => { $('reqInput').value = sampleRequest })
      $('respSample').addEventListener('click', () => { $('respInput').value = sampleResponse })
    </script>
  </body>
</html>`
}

const router = Router()

router.post('/encrypt', async (req: Request, res: Response<CryptoResp>) => {
  const requestId = crypto.randomUUID()
  const input = typeof req.body?.input === 'string' ? req.body.input : ''
  const mode = parseMode(req.body?.mode)
  if (!input) {
    res.status(400).json({ ok: false, error: '缺少 input', requestId })
    return
  }
  try {
    const output = await debugEncrypt(input, mode)
    res.json({ ok: true, output, mode, requestId })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    res.status(500).json({ ok: false, error: msg, requestId })
  }
})

router.post('/decrypt', async (req: Request, res: Response<CryptoResp>) => {
  const requestId = crypto.randomUUID()
  const input = typeof req.body?.input === 'string' ? req.body.input : ''
  const mode = parseMode(req.body?.mode)
  if (!input) {
    res.status(400).json({ ok: false, error: '缺少 input', requestId })
    return
  }
  try {
    const output = await debugDecrypt(input, mode)
    res.json({ ok: true, output, mode, requestId })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    res.status(500).json({ ok: false, error: msg, requestId })
  }
})

router.post('/format', (req: Request, res: Response<CryptoResp>) => {
  const requestId = crypto.randomUUID()
  const text = typeof req.body?.text === 'string' ? req.body.text : ''
  try {
    const r = debugFormat(text)
    res.json({ ok: true, output: r.output, kind: r.kind, requestId })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    res.status(500).json({ ok: false, error: msg, requestId })
  }
})

router.get('/meta', (_req: Request, res: Response) => {
  res.json({ ok: true, crypto: CMCC_BUSINESS_CRYPTO })
})

export function debugCryptoPageHandler(req: Request, res: Response): void {
  void req
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  res.status(200).send(renderDebugPage())
}

export default router
