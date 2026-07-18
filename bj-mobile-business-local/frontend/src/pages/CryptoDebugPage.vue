<template>
  <main class="debug-page">
    <header class="debug-header">
      <button class="debug-back" type="button" @click="$emit('back')">
        <ChevronLeft :size="18" />
        返回
      </button>
      <h1>加解密调试</h1>
      <button class="debug-icon-btn" type="button" title="清空" @click="clearAll">
        <Trash2 :size="18" />
      </button>
    </header>

    <section class="debug-shell">
      <section class="debug-import">
        <div class="debug-import-heading">
          <div>
            <strong>导入请求或响应</strong>
            <span>HAR、JSON、TXT 文件仅在当前浏览器中解析</span>
          </div>
          <label class="debug-file-btn">
            <FileUp :size="17" />
            选择文件
            <input type="file" accept=".har,.json,.txt,application/json,text/plain" @change="importFile" />
          </label>
        </div>
        <div v-if="importName" class="debug-import-meta">
          <FileJson :size="16" />
          <span>{{ importName }}</span>
          <small>{{ importSummary }}</small>
        </div>
        <div v-if="harEntries.length" class="debug-import-selectors">
          <label>
            <span>接口条目</span>
            <select v-model.number="selectedHarIndex" @change="selectHarEntry">
              <option v-for="item in harEntries" :key="item.index" :value="item.index">{{ item.label }}</option>
            </select>
          </label>
          <label>
            <span>数据方向</span>
            <select v-model="selectedDirection" @change="extractHarValue">
              <option v-if="selectedHarEntry?.requestValue" value="request">请求入参</option>
              <option v-if="selectedHarEntry?.responseValue" value="response">响应值</option>
            </select>
          </label>
        </div>
      </section>

      <div class="debug-toolbar">
        <label>
          <span>类型</span>
          <select v-model="form.mode">
            <option v-for="item in modes" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </label>
        <label>
          <span>sessionId</span>
          <div class="debug-inline">
            <input v-model.trim="form.sessionId" placeholder="可选，用于读取 portalKey" />
            <button type="button" class="debug-icon-btn bordered" title="读取会话密钥" @click="loadSessionKey">
              <KeyRound :size="18" />
            </button>
          </div>
        </label>
      </div>

      <div class="debug-fields">
        <label>
          <span>{{ genericMode ? '密钥' : 'AES / portalKey' }}</span>
          <input v-model.trim="form.key" :placeholder="genericMode ? '按所选编码输入密钥' : 'AES-ECB key，或通过 sessionId 读取'" />
        </label>
        <label v-if="form.mode === 'portal-key-encrypt'">
          <span>portalKey</span>
          <input v-model.trim="form.portalKey" placeholder="要提交给门户的 16 位 portalKey" />
        </label>
      </div>

      <div v-if="genericMode" class="debug-crypto-options">
        <label>
          <span>模式</span>
          <select v-model="form.cipherMode">
            <option value="ecb">ECB</option>
            <option value="cbc">CBC</option>
          </select>
        </label>
        <label>
          <span>密钥编码</span>
          <select v-model="form.keyEncoding">
            <option value="utf8">UTF-8</option>
            <option value="hex">Hex</option>
            <option value="base64">Base64</option>
          </select>
        </label>
        <label>
          <span>输入编码</span>
          <select v-model="form.inputEncoding">
            <option v-for="encoding in inputEncodings" :key="encoding" :value="encoding">{{ encodingLabel(encoding) }}</option>
          </select>
        </label>
        <label>
          <span>输出编码</span>
          <select v-model="form.outputEncoding">
            <option v-for="encoding in outputEncodings" :key="encoding" :value="encoding">{{ encodingLabel(encoding) }}</option>
          </select>
        </label>
        <label v-if="form.cipherMode === 'cbc'">
          <span>IV</span>
          <input v-model.trim="form.iv" placeholder="CBC 需要 16 字节 IV" />
        </label>
        <label v-if="form.cipherMode === 'cbc'">
          <span>IV 编码</span>
          <select v-model="form.ivEncoding">
            <option value="utf8">UTF-8</option>
            <option value="hex">Hex</option>
            <option value="base64">Base64</option>
          </select>
        </label>
        <label class="debug-check">
          <input v-model="form.uriComponent" type="checkbox" />
          <span>同时进行 URI component 编解码</span>
        </label>
      </div>

      <label v-if="form.mode === 'portal-key-encrypt'" class="debug-textarea">
        <span>服务端 publicKey</span>
        <textarea v-model="form.serverPublicKey" placeholder="keys/v1.0/get 解出的 publicKey，也可直接粘贴 PEM"></textarea>
      </label>

      <div class="debug-columns">
        <label class="debug-textarea">
          <span>{{ inputLabel }}</span>
          <textarea v-model="form.input" :placeholder="placeholder"></textarea>
        </label>
        <label class="debug-textarea">
          <span>输出</span>
          <textarea v-model="output" readonly placeholder="结果会显示在这里"></textarea>
        </label>
      </div>

      <div class="debug-actions">
        <button class="primary-btn debug-run" type="button" :disabled="loading" @click="run">
          <RefreshCw :size="18" :class="{ spinning: loading }" />
          {{ loading ? '处理中' : actionLabel }}
        </button>
        <button class="debug-secondary" type="button" :disabled="!output" @click="copyOutput">
          <Copy :size="18" />
          复制结果
        </button>
      </div>

      <p v-if="message" class="debug-message" :class="{ error: isError }">{{ message }}</p>
      <p class="debug-note">{{ currentMode.note }}</p>
    </section>
  </main>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ChevronLeft, Copy, FileJson, FileUp, KeyRound, RefreshCw, Trash2 } from 'lucide-vue-next'
import { api } from '../api/client'
import { sessionState } from '../stores/session'

defineEmits(['back'])

const modes = [
  { value: 'shop-wire-decrypt', label: '移动商城传输值解密', action: '解密', note: '自动提取 inParam、msgId、data.outParam 或 URL 末段；先解外层 Base64，再以 AES-128-CBC/PKCS7 解密。' },
  { value: 'shop-wire-encrypt', label: '移动商城传输值加密', action: '加密', note: 'AES-128-CBC/PKCS7 加密后输出 Base64，再对该文本做一层 Base64；IV 与 key 相同。' },
  { value: 'configurable-aes-encrypt', label: '可配置 AES 加密', action: '加密', note: '可选择 ECB/CBC、密钥/IV 编码及输入输出编码；使用 PKCS7 填充。' },
  { value: 'configurable-aes-decrypt', label: '可配置 AES 解密', action: '解密', note: '按显式配置解密，密钥和 IV 不会写入响应。' },
  { value: 'login-rsa-encrypt', label: '登录 RSA 加密', action: '加密', note: '用于 userName/account/password/inputCode 等登录接口字段；公钥加密不可逆。' },
  { value: 'portal-body-encrypt', label: '门户 body 加密', action: '加密', note: '等同 encryptPortalBody：JSON.stringify 后 AES-ECB 加密，再 encodeURIComponent。' },
  { value: 'portal-body-decrypt', label: '门户响应解密', action: '解密', note: '等同 decryptPortalBody：支持粘贴带引号的响应字符串。' },
  { value: 'aes-encrypt', label: 'AES-ECB 加密', action: '加密', note: '裸 AES-ECB/PKCS7，输出 Base64。' },
  { value: 'aes-decrypt', label: 'AES-ECB 解密', action: '解密', note: '裸 AES-ECB/PKCS7，输入 Base64。' },
  { value: 'replay-version-encrypt', label: 'X-REPLAY-VERSION', action: '加密', note: '用 portalKey 加密递增 replayVersion。' },
  { value: 'portal-key-payload-decode', label: '门户 key payload 解码', action: '解码', note: '解析 keys/v1.0/get 返回的 data/result，提取 publicKey 等内容。' },
  { value: 'portal-key-encrypt', label: 'dataToken 加密', action: '加密', note: '用门户返回的 server publicKey 加密本地 portalKey，生成 X-DATA-TOKEN。' },
  { value: 'base64-normalize', label: 'Base64 文本解码', action: '解码', note: '用于登录接口里可能 Base64 包裹的 true/false/JSON/数字响应。' },
  { value: 'json-parse-base64', label: 'Base64 JSON 解析', action: '解析', note: '先按 JSON 解析，失败后尝试 Base64 解码再解析 JSON。' },
  { value: 'url-encode', label: 'URL encode', action: '编码', note: 'encodeURIComponent。' },
  { value: 'url-decode', label: 'URL decode', action: '解码', note: 'decodeURIComponent。' },
]

const form = reactive({
  mode: 'shop-wire-decrypt',
  sessionId: sessionState.sessionId || '',
  key: '043AOQGK6ykklyZA',
  portalKey: '',
  serverPublicKey: '',
  input: '',
  cipherMode: 'ecb',
  keyEncoding: 'utf8',
  iv: '',
  ivEncoding: 'utf8',
  inputEncoding: 'utf8',
  outputEncoding: 'base64',
  uriComponent: false,
})
const output = ref('')
const loading = ref(false)
const message = ref('')
const isError = ref(false)
const importName = ref('')
const importSummary = ref('')
const harEntries = ref([])
const selectedHarIndex = ref(-1)
const selectedDirection = ref('request')

const currentMode = computed(() => modes.find((item) => item.value === form.mode) || modes[0])
const genericMode = computed(() => form.mode.startsWith('configurable-aes-'))
const genericOperation = computed(() => (form.mode.endsWith('decrypt') ? 'decrypt' : 'encrypt'))
const inputEncodings = computed(() => (genericOperation.value === 'encrypt' ? ['utf8', 'hex', 'base64'] : ['base64', 'hex']))
const outputEncodings = computed(() => (genericOperation.value === 'encrypt' ? ['base64', 'hex'] : ['utf8', 'hex', 'base64']))
const selectedHarEntry = computed(() => harEntries.value.find((item) => item.index === selectedHarIndex.value) || null)
const actionLabel = computed(() => currentMode.value.action)
const inputLabel = computed(() => (form.mode === 'portal-key-encrypt' ? '也可在这里粘贴服务端 publicKey' : '输入'))
const placeholder = computed(() => {
  if (genericMode.value) return genericOperation.value === 'encrypt' ? '输入需要加密的内容' : '输入 Base64 或 Hex 密文'
  if (form.mode === 'portal-body-encrypt') return '{"phoneNum":"13800138000","ywType":"2"}'
  if (form.mode === 'portal-body-decrypt') return '%2B 开头或 Base64 形式的门户响应密文'
  if (form.mode === 'login-rsa-encrypt') return '手机号、短信验证码、图形验证码等明文'
  if (form.mode === 'replay-version-encrypt') return '0'
  return '粘贴需要处理的内容'
})

watch(
  () => form.mode,
  () => {
    if (form.mode.startsWith('shop-wire-') && !form.key) form.key = '043AOQGK6ykklyZA'
    if (!genericMode.value) return
    form.inputEncoding = genericOperation.value === 'encrypt' ? 'utf8' : 'base64'
    form.outputEncoding = genericOperation.value === 'encrypt' ? 'base64' : 'utf8'
  },
)

function encodingLabel(value) {
  return value === 'utf8' ? 'UTF-8' : value === 'hex' ? 'Hex' : 'Base64'
}

function setMessage(text, error = false) {
  message.value = text
  isError.value = error
}

function decodeBase64Utf8(value) {
  const binary = atob(String(value || '').replace(/\s/g, ''))
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function requestValueFromEntry(entry) {
  const body = entry?.request?.postData?.text
  if (typeof body === 'string' && body.trim()) return body
  const p = entry?.request?.queryString?.find?.((item) => item?.name === 'p')?.value
  if (p) return p
  try {
    return new URL(entry?.request?.url || '').searchParams.get('p') || ''
  } catch {
    return ''
  }
}

function responseValueFromEntry(entry) {
  const content = entry?.response?.content
  if (typeof content?.text !== 'string' || !content.text) return ''
  return content.encoding === 'base64' ? decodeBase64Utf8(content.text) : content.text
}

function harEntryLabel(entry, index) {
  const method = entry?.request?.method || 'HTTP'
  try {
    const url = new URL(entry?.request?.url || '')
    return `${index + 1}. ${method} ${url.pathname}`
  } catch {
    return `${index + 1}. ${method} ${entry?.request?.url || '未命名接口'}`
  }
}

function parseHar(parsed) {
  const entries = Array.isArray(parsed?.log?.entries) ? parsed.log.entries : []
  const available = []
  for (const [index, entry] of entries.entries()) {
    let responseValue = ''
    try {
      responseValue = responseValueFromEntry(entry)
    } catch {
      responseValue = ''
    }
    const requestValue = requestValueFromEntry(entry)
    if (!requestValue && !responseValue) continue
    available.push({ index, label: harEntryLabel(entry, index), requestValue, responseValue })
  }
  return { total: entries.length, available }
}

async function importFile(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  if (file.size > 30 * 1024 * 1024) return setMessage('文件不能超过 30 MB', true)
  try {
    const text = await file.text()
    importName.value = file.name
    harEntries.value = []
    selectedHarIndex.value = -1
    let parsed = null
    try {
      parsed = JSON.parse(text)
    } catch {
      parsed = null
    }
    if (parsed?.log?.entries) {
      const result = parseHar(parsed)
      harEntries.value = result.available
      importSummary.value = `${result.total} 条记录，${result.available.length} 条包含可导入数据`
      if (!result.available.length) return setMessage('HAR 中没有可导入的请求参数或响应值', true)
      selectedHarIndex.value = result.available[0].index
      selectHarEntry()
      setMessage('HAR 已解析，请选择接口和数据方向')
      return
    }
    form.input = parsed ? JSON.stringify(parsed, null, 2) : text
    importSummary.value = `${file.size.toLocaleString()} 字节`
    setMessage('文件内容已载入输入框')
  } catch (error) {
    setMessage(error.message || '文件解析失败', true)
  }
}

function selectHarEntry() {
  const entry = selectedHarEntry.value
  if (!entry) return
  if (selectedDirection.value === 'request' && !entry.requestValue) selectedDirection.value = 'response'
  if (selectedDirection.value === 'response' && !entry.responseValue) selectedDirection.value = 'request'
  extractHarValue()
}

function extractHarValue() {
  const entry = selectedHarEntry.value
  if (!entry) return
  form.input = selectedDirection.value === 'response' ? entry.responseValue : entry.requestValue
  output.value = ''
}

async function loadSessionKey() {
  if (!form.sessionId) return setMessage('请输入 sessionId', true)
  loading.value = true
  try {
    const data = await api.getCryptoDebugSession(form.sessionId)
    form.key = data.portalKey || ''
    form.portalKey = data.portalKey || form.portalKey
    setMessage(data.portalKey ? '已读取当前会话 portalKey' : '当前会话还没有 portalKey', !data.portalKey)
  } catch (e) {
    setMessage(e.message || '读取会话密钥失败', true)
  } finally {
    loading.value = false
  }
}

async function run() {
  loading.value = true
  output.value = ''
  try {
    const data = genericMode.value
      ? await api.cryptoTransform({
          operation: genericOperation.value,
          algorithm: 'aes',
          mode: form.cipherMode,
          padding: 'pkcs7',
          key: form.key,
          keyEncoding: form.keyEncoding,
          iv: form.iv,
          ivEncoding: form.ivEncoding,
          input: form.input,
          inputEncoding: form.inputEncoding,
          outputEncoding: form.outputEncoding,
          uriComponent: form.uriComponent,
        })
      : await api.cryptoDebug({ ...form })
    output.value = data.output || ''
    setMessage(data.details?.note || '处理完成')
  } catch (e) {
    setMessage(e.message || '处理失败', true)
  } finally {
    loading.value = false
  }
}

async function copyOutput() {
  await navigator.clipboard.writeText(output.value)
  setMessage('已复制')
}

function clearAll() {
  form.input = ''
  form.serverPublicKey = ''
  output.value = ''
  message.value = ''
  importName.value = ''
  importSummary.value = ''
  harEntries.value = []
  selectedHarIndex.value = -1
}
</script>
