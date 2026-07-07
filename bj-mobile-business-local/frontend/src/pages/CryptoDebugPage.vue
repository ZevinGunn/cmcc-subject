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
          <span>AES / portalKey</span>
          <input v-model.trim="form.key" placeholder="AES-ECB key，或通过 sessionId 读取" />
        </label>
        <label v-if="form.mode === 'portal-key-encrypt'">
          <span>portalKey</span>
          <input v-model.trim="form.portalKey" placeholder="要提交给门户的 16 位 portalKey" />
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
import { computed, reactive, ref } from 'vue'
import { ChevronLeft, Copy, KeyRound, RefreshCw, Trash2 } from 'lucide-vue-next'
import { api } from '../api/client'
import { sessionState } from '../stores/session'

defineEmits(['back'])

const modes = [
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
  mode: 'portal-body-decrypt',
  sessionId: sessionState.sessionId || '',
  key: '',
  portalKey: '',
  serverPublicKey: '',
  input: '',
})
const output = ref('')
const loading = ref(false)
const message = ref('')
const isError = ref(false)

const currentMode = computed(() => modes.find((item) => item.value === form.mode) || modes[0])
const actionLabel = computed(() => currentMode.value.action)
const inputLabel = computed(() => (form.mode === 'portal-key-encrypt' ? '也可在这里粘贴服务端 publicKey' : '输入'))
const placeholder = computed(() => {
  if (form.mode === 'portal-body-encrypt') return '{"phoneNum":"13800138000","ywType":"2"}'
  if (form.mode === 'portal-body-decrypt') return '%2B 开头或 Base64 形式的门户响应密文'
  if (form.mode === 'login-rsa-encrypt') return '手机号、短信验证码、图形验证码等明文'
  if (form.mode === 'replay-version-encrypt') return '0'
  return '粘贴需要处理的内容'
})

function setMessage(text, error = false) {
  message.value = text
  isError.value = error
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
    const data = await api.cryptoDebug({ ...form })
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
}
</script>
