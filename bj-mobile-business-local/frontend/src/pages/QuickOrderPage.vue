<template>
  <main class="qo-page">
    <header class="qo-header">
      <button type="button" class="qo-icon-btn" aria-label="返回" title="返回" @click="$emit('back')"><ArrowLeft :size="20" /></button>
      <div><h1>快捷业务订购</h1><span>{{ session?.maskedPhone || '选择平台并建立安全会话' }}</span></div>
      <button type="button" class="qo-icon-btn" aria-label="重新开始" title="重新开始" :disabled="busy" @click="resetFlow"><RotateCcw :size="18" /></button>
    </header>

    <div class="qo-layout">
      <aside class="qo-sidebar">
        <div class="qo-platform-switch" role="tablist" aria-label="订购平台">
          <button v-for="item in platforms" :key="item.id" type="button" :class="{ active: platform === item.id }" :disabled="busy" @click="changePlatform(item.id)">{{ item.shortName }}</button>
        </div>
        <ol class="qo-steps">
          <li v-for="(item, index) in steps" :key="item.key" :class="{ active: activeStep === index, done: activeStep > index }">
            <span><Check v-if="activeStep > index" :size="14" /><template v-else>{{ index + 1 }}</template></span>
            <div><strong>{{ item.name }}</strong><small>{{ item.caption }}</small></div>
          </li>
        </ol>
        <p class="qo-side-warning"><ShieldAlert :size="17" />{{ selectedPlatform?.warning }}</p>
      </aside>

      <section class="qo-workspace">
        <div v-if="errorMessage" class="qo-alert error"><CircleAlert :size="18" /><span>{{ errorMessage }}</span><button type="button" aria-label="关闭" @click="errorMessage = ''"><X :size="16" /></button></div>

        <section v-if="!session" class="qo-section qo-access">
          <header><span>01</span><div><h2>接入 {{ selectedPlatform?.name }}</h2><p>{{ selectedPlatform?.authentication }}</p></div></header>
          <div v-if="platform === 'north'" class="qo-session-state" :class="{ ready: hasPortalSession }">
            <UserRoundCheck :size="22" /><div><strong>{{ hasPortalSession ? '北京移动会话可用' : '尚未登录北京移动' }}</strong><span>{{ hasPortalSession ? maskedPortalPhone : '请先从登录页完成登录，再返回此工作台' }}</span></div>
          </div>
          <label v-else-if="platform === 'retail'" class="qo-field wide"><span>商城 Cookie</span><textarea v-model="auth.cookie" rows="5" autocomplete="off" spellcheck="false" placeholder="粘贴当前 wx.10086.cn 登录会话 Cookie"></textarea><small>仅发送到本机后端内存，不写入浏览器存储。</small></label>
          <label v-else-if="platform === 'cloud'" class="qo-field wide"><span>中国移动 App 一键登录 Token</span><textarea v-model.trim="auth.appToken" rows="5" autocomplete="off" spellcheck="false" placeholder="粘贴 decryptPhoneByTokenJt 请求中的新鲜 token"></textarea><small>仅发送到本机后端内存；建立会话后立即从页面和认证上下文清除。</small></label>
          <label v-else-if="platform === 'xyw'" class="qo-field"><span>办理手机号</span><input v-model.trim="auth.phone" inputmode="numeric" maxlength="11" autocomplete="tel" placeholder="11 位北京移动手机号" /><small>手机号仅保存在 15 分钟服务端内存会话中，页面只显示脱敏号码。</small></label>
          <div v-else class="qo-field-grid">
            <label class="qo-field"><span>办理手机号</span><input v-model.trim="auth.phone" inputmode="numeric" maxlength="11" placeholder="11 位手机号" /></label>
            <label class="qo-field wide"><span>完整网格通入口 URL</span><textarea v-model.trim="auth.entryUrl" rows="4" autocomplete="off" spellcheck="false" placeholder="https://ysmapp.bj.10086.cn/app/channel-web/busiCore/showCustomIndex.action?..."></textarea><small>必须包含平台原始 code、empCode 和 nbc。</small></label>
          </div>
          <button class="qo-primary" type="button" :disabled="busy || !canConnect" @click="connect"><Link2 :size="18" />{{ busy ? '连接中' : platform === 'xyw' ? '进入登录验证' : '建立订购会话' }}</button>
        </section>

        <template v-else>
          <section v-if="['LOGIN_REQUIRED', 'LOGIN_SMS_SENT'].includes(session.stage)" class="qo-section qo-auth-verification">
            <header><span>02</span><div><h2>验证办理手机号</h2><p>先完成登录验证，之后还会单独发送一次订购确认验证码。</p></div></header>
            <div class="qo-session-state ready"><UserRoundCheck :size="22" /><div><strong>{{ session.maskedPhone }}</strong><span>{{ session.authSummary }}</span></div></div>
            <button v-if="session.stage === 'LOGIN_REQUIRED'" class="qo-primary" type="button" :disabled="busy" @click="sendAuthSms"><Send :size="18" />{{ busy ? '发送中' : '发送登录验证码' }}</button>
            <section v-else class="qo-sms">
              <div><h3>输入登录验证码</h3><p>此验证码只用于建立 xyw.bj 登录会话，不会直接订购业务。</p></div>
              <label><KeyRound :size="19" /><input v-model.trim="loginSmsCode" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="6 位登录验证码" /></label>
              <div class="qo-sms-actions"><button type="button" class="qo-secondary" :disabled="busy || authCooldown > 0" @click="sendAuthSms">{{ authCooldown > 0 ? `${authCooldown}s 后可重发` : '重新发送' }}</button><button type="button" class="qo-primary compact" :disabled="busy || !/^\d{6}$/.test(loginSmsCode)" @click="verifyAuth"><ShieldCheck :size="18" />{{ busy ? '验证中' : '验证并登录' }}</button></div>
            </section>
          </section>

          <section v-if="session.stage === 'AUTHENTICATED'" class="qo-section qo-ready">
            <header><span>{{ platform === 'xyw' ? '03' : '02' }}</span><div><h2>读取实时产品</h2><p>{{ session.authSummary }}</p></div></header>
            <div class="qo-state-line"><BadgeCheck :size="21" /><div><strong>平台接入完成</strong><span>下一步将读取当前号码的实时资格、产品和可办档位。</span></div></div>
            <button class="qo-primary" type="button" :disabled="busy" @click="prepare"><RefreshCw :size="18" :class="{ spinning: busy }" />{{ busy ? '读取中' : '读取实时产品' }}</button>
          </section>

          <section v-if="session.product" class="qo-section qo-product">
            <header class="qo-product-heading"><span>{{ platform === 'xyw' ? '04' : '03' }}</span><div><h2>{{ session.product.name }}</h2><p>{{ session.product.description }}</p></div><b :class="session.product.eligible ? 'pass' : 'reject'">{{ session.product.eligible ? '可继续' : '不可办理' }}</b></header>
            <dl class="qo-facts"><div><dt>平台</dt><dd>{{ selectedPlatform?.shortName }}</dd></div><div><dt>号码</dt><dd>{{ session.maskedPhone }}</dd></div><div><dt>业务编码</dt><dd>{{ session.product.code || '-' }}</dd></div><div><dt>资格结果</dt><dd>{{ session.product.eligibilityMessage }}</dd></div></dl>
            <div v-if="session.product.warnings?.length" class="qo-warnings"><p v-for="warning in session.product.warnings" :key="warning"><TriangleAlert :size="16" />{{ warning }}</p></div>

            <div v-if="['PRODUCT_READY', 'SELECTION_READY'].includes(session.stage)" class="qo-options">
              <h3>选择实时档位</h3>
              <button v-for="option in session.product.options" :key="option.id" type="button" :class="{ selected: selectedOptionId === option.id }" @click="selectedOptionId = option.id"><span class="qo-radio"><Check v-if="selectedOptionId === option.id" :size="13" /></span><strong>{{ option.name }}</strong><small>{{ option.feeText }}</small></button>
              <button v-if="session.stage === 'PRODUCT_READY'" class="qo-primary" type="button" :disabled="busy || !selectedOptionId || !session.product.eligible" @click="selectOption"><ListChecks :size="18" />{{ busy ? '校验中' : '确认档位并预校验' }}</button>
            </div>

            <div v-if="session.stage === 'SELECTION_READY'" class="qo-selection-summary"><CheckCircle2 :size="20" /><div><strong>{{ session.selection.name }}</strong><span>{{ session.selection.feeText }} · {{ session.selection.effectText }}</span><small v-if="session.selection.eligibilityMessage">{{ session.selection.eligibilityMessage }}</small></div></div>

            <section v-if="['SELECTION_READY', 'SMS_SENT'].includes(session.stage)" class="qo-protocol">
              <h3>{{ session.product.protocol?.name || '业务办理规则' }}</h3>
              <div class="qo-protocol-copy">{{ session.product.protocol?.content || '上游未返回单独协议，最终业务规则以实时产品信息和运营商受理结果为准。' }}</div>
              <label><input v-model="agreed" type="checkbox" /><span>我已阅读并同意上述实时业务规则，已核对号码、产品、档位、费用和生效方式。</span></label>
            </section>

            <div v-if="session.stage === 'SELECTION_READY'" class="qo-actions"><button class="qo-danger" type="button" :disabled="busy || !agreed || session.product.eligible === false" @click="openRealConfirm"><Send :size="18" />获取订购验证码</button></div>

            <section v-if="session.stage === 'SMS_SENT'" class="qo-sms">
              <div><h3>输入订购验证码</h3><p>验证码只用于本次 {{ selectedPlatform?.shortName }} 订购会话。</p></div>
              <label><KeyRound :size="19" /><input v-model.trim="smsCode" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="6 位订购验证码" /></label>
              <div class="qo-sms-actions"><button type="button" class="qo-secondary" :disabled="busy || cooldown > 0" @click="openRealConfirm">{{ cooldown > 0 ? `${cooldown}s 后可重发` : '重新发送' }}</button><button type="button" class="qo-danger" :disabled="busy || !/^\d{6}$/.test(smsCode)" @click="submitOrder"><ShieldCheck :size="18" />{{ busy ? '提交中' : '提交验证码并确认订购' }}</button></div>
            </section>
          </section>

          <section v-if="isFinal" class="qo-result" :class="session.stage.toLowerCase()">
            <CircleCheckBig v-if="session.stage === 'FINISHED'" :size="34" />
            <CircleX v-else-if="session.stage === 'FAILED'" :size="34" />
            <CircleHelp v-else :size="34" />
            <div><span>{{ resultTitle }}</span><h2>{{ session.lastResult?.message }}</h2><p>结果代码 {{ session.lastResult?.code || '-' }}<template v-if="session.lastResult?.orderId"> · 订单号 {{ session.lastResult.orderId }}</template></p><strong v-if="session.stage === 'UNKNOWN'">请先通过中国移动官方渠道查询，当前会话禁止重复提交。</strong></div>
          </section>
        </template>
      </section>
    </div>

    <section v-if="showConfirm" class="qo-dialog-mask" @click.self="closeRealConfirm">
      <div class="qo-dialog" role="dialog" aria-modal="true" aria-labelledby="qo-confirm-title">
        <header><div><span>真实业务操作</span><h2 id="qo-confirm-title">确认获取订购验证码</h2></div><button type="button" aria-label="关闭" @click="closeRealConfirm"><X :size="18" /></button></header>
        <dl><div><dt>平台</dt><dd>{{ selectedPlatform?.name }}</dd></div><div><dt>号码</dt><dd>{{ session?.maskedPhone }}</dd></div><div><dt>产品</dt><dd>{{ session?.product?.name }}</dd></div><div><dt>档位</dt><dd>{{ session?.selection?.name }}</dd></div><div><dt>费用</dt><dd>{{ session?.selection?.feeText }}</dd></div></dl>
        <p>该动作会进入运营商真实订购链路。北移平台可能在首次提交时直接受理；其他平台将在短信验证后执行最终提交。</p>
        <label class="qo-real-check"><input v-model="realConfirmed" type="checkbox" /><span>我确认这是运营商真实订购操作，并已核对以上信息。</span></label>
        <footer><button type="button" class="qo-secondary" @click="closeRealConfirm">取消</button><button type="button" class="qo-danger" :disabled="busy || !realConfirmed" @click="sendSms">确认并继续</button></footer>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { ArrowLeft, BadgeCheck, Check, CheckCircle2, CircleAlert, CircleCheckBig, CircleHelp, CircleX, KeyRound, Link2, ListChecks, RefreshCw, RotateCcw, Send, ShieldAlert, ShieldCheck, TriangleAlert, UserRoundCheck, X } from 'lucide-vue-next'
import { api } from '../api/client'
import { sessionState } from '../stores/session'

const props = defineProps({
  initialPlatform: {
    type: String,
    default: 'xyw',
  },
})

defineEmits(['back'])

const catalog = ref(null)
const supportedPlatforms = new Set(['xyw', 'north', 'retail', 'grid', 'cloud'])
const platform = ref(supportedPlatforms.has(props.initialPlatform) ? props.initialPlatform : 'xyw')
const session = ref(null)
const selectedOptionId = ref('')
const loginSmsCode = ref('')
const smsCode = ref('')
const agreed = ref(false)
const busy = ref(false)
const errorMessage = ref('')
const showConfirm = ref(false)
const realConfirmed = ref(false)
const confirmationId = ref('')
const cooldown = ref(0)
const authCooldown = ref(0)
const auth = reactive({ cookie: '', phone: '', entryUrl: '', appToken: '' })
let timer = null
let authTimer = null

const platforms = computed(() => catalog.value?.platforms || [])
const selectedPlatform = computed(() => platforms.value.find((item) => item.id === platform.value))
const hasPortalSession = computed(() => Boolean(sessionState.sessionId))
const maskedPortalPhone = computed(() => String(sessionState.userInfo?.mobile || sessionState.phone || '').replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2') || '当前登录账号')
const canConnect = computed(() => platform.value === 'north'
  ? hasPortalSession.value
  : platform.value === 'retail'
    ? auth.cookie.trim().length >= 8
    : platform.value === 'cloud'
      ? auth.appToken.trim().length >= 16
      : platform.value === 'xyw'
        ? /^1\d{10}$/.test(auth.phone)
        : /^1\d{10}$/.test(auth.phone) && auth.entryUrl.startsWith('https://'))
const isFinal = computed(() => ['FINISHED', 'FAILED', 'UNKNOWN'].includes(session.value?.stage))
const resultTitle = computed(() => session.value?.stage === 'FINISHED' ? '业务已受理' : session.value?.stage === 'FAILED' ? '业务未受理' : '结果需要核验')
const steps = [
  { key: 'access', name: '平台接入', caption: '认证与会话' }, { key: 'product', name: '实时产品', caption: '资格与档位' },
  { key: 'confirm', name: '办理确认', caption: '协议与核对' }, { key: 'sms', name: '短信确认', caption: '验证码' }, { key: 'result', name: '受理结果', caption: '成功或核验' },
]
const activeStep = computed(() => {
  const stage = session.value?.stage
  if (!stage || stage === 'LOGIN_REQUIRED' || stage === 'LOGIN_SMS_SENT') return 0
  if (stage === 'AUTHENTICATED') return 1
  if (stage === 'PRODUCT_READY') return 2
  if (stage === 'SELECTION_READY') return 2
  if (stage === 'SMS_SENT' || stage === 'SUBMITTING') return 3
  return 4
})

function fail(error) { errorMessage.value = error?.message || '操作失败'; if (error?.payload?.errorCode === 'QUICK_ORDER_SESSION_NOT_FOUND') session.value = null }
function newConfirmationId() { return globalThis.crypto?.randomUUID?.().replaceAll('-', '') || `${Date.now()}_${Math.random().toString(36).slice(2)}` }
function startCooldown(seconds = 60) { cooldown.value = seconds; clearInterval(timer); timer = setInterval(() => { cooldown.value = Math.max(0, cooldown.value - 1); if (!cooldown.value) clearInterval(timer) }, 1000) }
function startAuthCooldown(seconds = 60) { authCooldown.value = seconds; clearInterval(authTimer); authTimer = setInterval(() => { authCooldown.value = Math.max(0, authCooldown.value - 1); if (!authCooldown.value) clearInterval(authTimer) }, 1000) }
async function run(action) { busy.value = true; errorMessage.value = ''; try { await action() } catch (error) { fail(error) } finally { busy.value = false } }

async function changePlatform(id) {
  if (id === platform.value) return
  if (session.value && !isFinal.value && !window.confirm('切换平台会销毁当前未完成订购会话，是否继续？')) return
  await resetFlow(false)
  platform.value = id
}

async function resetFlow(confirmReset = true) {
  if (confirmReset && session.value && !isFinal.value && !window.confirm('确定销毁当前订购会话并重新开始？')) return
  if (session.value?.id) await api.deleteQuickOrderSession(session.value.id).catch(() => null)
  session.value = null; selectedOptionId.value = ''; loginSmsCode.value = ''; smsCode.value = ''; agreed.value = false; confirmationId.value = ''; showConfirm.value = false; realConfirmed.value = false; errorMessage.value = ''; clearInterval(timer); clearInterval(authTimer); cooldown.value = 0; authCooldown.value = 0
}

function connect() {
  run(async () => {
    const authPayload = platform.value === 'north'
      ? { portalSessionId: sessionState.sessionId }
      : platform.value === 'retail'
        ? { cookie: auth.cookie }
        : platform.value === 'cloud'
          ? { appToken: auth.appToken }
          : platform.value === 'xyw'
            ? { phone: auth.phone }
            : { phone: auth.phone, entryUrl: auth.entryUrl }
    const data = await api.createQuickOrderSession({ platform: platform.value, auth: authPayload })
    session.value = data.session
    auth.cookie = ''
    auth.appToken = ''
    if (platform.value === 'xyw') auth.phone = ''
    if (platform.value === 'grid') auth.entryUrl = ''
  })
}
function sendAuthSms() { run(async () => { session.value = (await api.sendQuickOrderAuthSms(session.value.id)).session; startAuthCooldown(session.value.authSmsCooldownSeconds || 60) }) }
function verifyAuth() { run(async () => { session.value = (await api.verifyQuickOrderAuth(session.value.id, { smsCode: loginSmsCode.value })).session; loginSmsCode.value = ''; clearInterval(authTimer); authCooldown.value = 0 }) }
function prepare() { run(async () => { session.value = (await api.prepareQuickOrder(session.value.id)).session; selectedOptionId.value = session.value.product?.options?.length === 1 ? session.value.product.options[0].id : '' }) }
function selectOption() { run(async () => { session.value = (await api.selectQuickOrder(session.value.id, { optionId: selectedOptionId.value })).session }) }
function openRealConfirm() { if (!agreed.value) return; if (!confirmationId.value) confirmationId.value = newConfirmationId(); realConfirmed.value = false; showConfirm.value = true }
function closeRealConfirm() { showConfirm.value = false; realConfirmed.value = false; if (session.value?.stage === 'SELECTION_READY') confirmationId.value = '' }
function sendSms() { run(async () => { const data = await api.sendQuickOrderSms(session.value.id, { agreed: agreed.value, realOrderConfirmed: realConfirmed.value, confirmationId: confirmationId.value }); session.value = data.session; showConfirm.value = false; if (session.value.stage === 'SMS_SENT') startCooldown(session.value.smsCooldownSeconds || 60) }) }
function submitOrder() { run(async () => { const data = await api.confirmQuickOrder(session.value.id, { smsCode: smsCode.value, agreed: agreed.value, realOrderConfirmed: true, confirmationId: confirmationId.value }); session.value = data.session; smsCode.value = '' }) }

onMounted(() => run(async () => { catalog.value = (await api.getQuickOrderCatalog()).catalog }))
onBeforeUnmount(() => { clearInterval(timer); clearInterval(authTimer) })
</script>
