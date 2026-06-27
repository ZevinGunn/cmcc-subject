<template>
  <main class="login-page">
    <TopBar title="北京移动登录" @back="noop" @home="noop" />
    <section class="login-panel">
      <h2>手机号登录</h2>
      <label>
        <span>北京移动手机号</span>
        <input v-model.trim="phone" inputmode="numeric" maxlength="11" placeholder="请输入 11 位手机号" />
      </label>
      <label>
        <span>图形验证码</span>
        <div class="captcha-row">
          <input v-model.trim="captcha" placeholder="请输入图形验证码" />
          <button type="button" class="captcha-img" @click="loadCaptcha">
            <img v-if="captchaImage" :src="captchaImage" alt="验证码" />
            <span v-else>获取</span>
          </button>
        </div>
      </label>
      <label>
        <span>短信验证码</span>
        <div class="sms-row">
          <input v-model.trim="code" inputmode="numeric" maxlength="6" placeholder="6 位随机码" />
          <button type="button" :disabled="sending || countdown > 0" @click="sendSms">
            {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
          </button>
        </div>
      </label>
      <button class="primary-btn" type="button" :disabled="loading" @click="login">
        {{ loading ? '登录中' : '登录并查询' }}
      </button>
      <p v-if="message" class="message" :class="{ error: hasError }">{{ message }}</p>
    </section>
  </main>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import TopBar from '../components/TopBar.vue'
import { api } from '../api/client'
import { setSession } from '../stores/session'

const emit = defineEmits(['logged-in'])

const phone = ref('')
const captcha = ref('')
const code = ref('')
const sessionId = ref('')
const captchaImage = ref('')
const loading = ref(false)
const sending = ref(false)
const countdown = ref(0)
const message = ref('')
const hasError = ref(false)
let timer = null

function noop() {}

function show(text, error = false) {
  message.value = text
  hasError.value = error
}

async function ensureSession() {
  if (sessionId.value) return sessionId.value
  const data = await api.createSession()
  sessionId.value = data.session.id
  await api.prepare({ sessionId: sessionId.value }).catch(() => null)
  setSession({ sessionId: sessionId.value, phone: phone.value })
  return sessionId.value
}

async function loadCaptcha() {
  try {
    const id = await ensureSession()
    const data = await api.getCaptcha(id)
    captchaImage.value = data.image
    show('验证码已刷新')
  } catch (e) {
    show(e.message, true)
  }
}

function startCountdown(seconds) {
  countdown.value = seconds
  clearInterval(timer)
  timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

async function sendSms() {
  if (!/^1\d{10}$/.test(phone.value)) return show('请输入正确手机号', true)
  if (!captcha.value) return show('请先输入图形验证码', true)
  sending.value = true
  try {
    const id = await ensureSession()
    const data = await api.sendSms({ sessionId: id, phone: phone.value, captcha: captcha.value })
    sessionId.value = data.session.id
    startCountdown(data.cooldownSeconds || 60)
    show('短信验证码已发送')
  } catch (e) {
    show(e.message, true)
    if (!captchaImage.value) loadCaptcha()
  } finally {
    sending.value = false
  }
}

async function login() {
  if (!/^1\d{10}$/.test(phone.value)) return show('请输入正确手机号', true)
  if (!/^\d{6}$/.test(code.value)) return show('请输入 6 位短信验证码', true)
  loading.value = true
  try {
    const id = await ensureSession()
    const data = await api.login({ sessionId: id, phone: phone.value, code: code.value })
    emit('logged-in', {
      phone: phone.value,
      session: data.session,
      userInfo: data.userInfo,
    })
  } catch (e) {
    const hint = e.payload?.errorCode === 'PORTAL_TOKEN_FAILED' ? '登录成功但门户会话换取失败，可能需要浏览器防护 token。' : e.message
    show(hint, true)
  } finally {
    loading.value = false
  }
}

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>
