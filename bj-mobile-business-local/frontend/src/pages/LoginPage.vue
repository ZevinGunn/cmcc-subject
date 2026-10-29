<template>
  <main class="login-page">
    <button v-if="canReturn" class="login-back" type="button" @click="$emit('back')">
      <ChevronLeft :size="18" />
      返回已订业务
    </button>

    <section class="login-panel">
      <div class="cmcc-logo">
        <img class="logo-mark" src="../assets/cmcc-logo.png" alt="中国移动" />
        <strong>中国移动</strong>
        <em>China Mobile</em>
      </div>

      <label class="login-row">
        <Smartphone :size="21" stroke-width="2" />
        <input v-model.trim="phone" inputmode="numeric" maxlength="11" placeholder="请输入手机号" />
        <button type="button" class="row-action" :disabled="!/^1\d{10}$/.test(phone)" @click="loadCaptcha">
          {{ captchaImage ? '刷新' : '获取验证码' }}
        </button>
      </label>

      <label class="login-row captcha-login-row">
        <ImageIcon :size="21" stroke-width="2" />
        <input v-model.trim="captcha" placeholder="输入图形验证码" />
        <button type="button" class="captcha-img" @click="loadCaptcha">
          <img v-if="captchaImage" :src="captchaImage" alt="验证码" />
          <span v-else>图形码</span>
        </button>
      </label>

      <label class="login-row">
        <LockKeyhole :size="21" stroke-width="2" />
        <input v-model.trim="code" inputmode="numeric" maxlength="6" placeholder="输入短信验证码" />
        <button type="button" class="row-action" :disabled="sending || countdown > 0" @click="sendSms">
          {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
        </button>
      </label>

      <p class="agreement">
        <input type="checkbox" checked />
        查看并同意 <a>《服务协议》</a>、<a>《隐私政策》</a>
      </p>

      <button class="primary-btn" type="button" :class="{ ready: hasLoginInput }" :disabled="!canLogin" @click="login">
        {{ loading ? '登录中' : '登录' }}
      </button>

      <p class="voice-link">收不到短信？点此试试 <a>语音验证码</a></p>

      <div class="login-tool-entry">
        <button type="button" @click="$emit('open-quick-order')">
          <ShoppingCart :size="18" />
          新业务订购（xyw.bj）
        </button>
        <button type="button" @click="$emit('open-shop')">
          <ClipboardList :size="18" />
          商城 Cookie 查询
        </button>
        <button type="button" @click="$emit('open-debug')">
          <KeyRound :size="18" />
          加解密调试
        </button>
      </div>
    </section>

    <footer class="login-footer">
      <p><input type="checkbox" checked /> 3天免登录</p>
      <p>自助查询、业务办理、服务优惠尽在手中</p>
      <p>Copyright©2026 中国移动</p>
      <p>备案号：京ICP备05002571号</p>
    </footer>

    <MessageDialog
      v-if="messageDialog"
      :title="messageDialog.title"
      :message="messageDialog.message"
      :type="messageDialog.type"
      @close="messageDialog = null"
    />
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { ChevronLeft, ClipboardList, ImageIcon, KeyRound, LockKeyhole, ShoppingCart, Smartphone } from 'lucide-vue-next'
import MessageDialog from '../components/MessageDialog.vue'
import { api } from '../api/client'
import { setSession } from '../stores/session'

defineProps({
  canReturn: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['back', 'logged-in', 'open-shop', 'open-debug', 'open-quick-order'])

const phone = ref('')
const captcha = ref('')
const code = ref('')
const sessionId = ref('')
const captchaImage = ref('')
const loading = ref(false)
const sending = ref(false)
const countdown = ref(0)
const messageDialog = ref(null)
const hasLoginInput = computed(() => /^1\d{10}$/.test(phone.value) && /^\d{6}$/.test(code.value))
const canLogin = computed(() => hasLoginInput.value && !loading.value)
let timer = null
let captchaTimer = null
const captchaPhone = ref('')

function show(text, error = false) {
  messageDialog.value = {
    title: error ? '操作失败' : '操作成功',
    message: text,
    type: error ? 'error' : 'success',
  }
}

async function ensureSession() {
  if (sessionId.value) return sessionId.value
  const data = await api.createSession()
  sessionId.value = data.session.id
  await api.prepare({ sessionId: sessionId.value }).catch(() => null)
  setSession({ sessionId: sessionId.value, phone: phone.value })
  return sessionId.value
}

async function loadCaptcha(notify = true) {
  try {
    const id = await ensureSession()
    const data = await api.getCaptcha(id)
    captchaImage.value = data.image
    captchaPhone.value = phone.value
    if (notify) show('验证码已刷新')
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
    show(e.message || '登录失败，请稍后重试', true)
  } finally {
    loading.value = false
  }
}

onBeforeUnmount(() => {
  clearInterval(timer)
  clearTimeout(captchaTimer)
})

watch(phone, (value) => {
  clearTimeout(captchaTimer)
  if (!/^1\d{10}$/.test(value) || captchaPhone.value === value) return
  captchaImage.value = ''
  captchaTimer = setTimeout(() => loadCaptcha(false), 350)
})
</script>
