<template>
  <main class="activity-page">
    <header class="activity-header">
      <button type="button" class="activity-back" aria-label="返回已订业务" @click="$emit('back')">
        <ChevronLeft :size="20" />
      </button>
      <div>
        <h1>活动办理</h1>
        <span>{{ maskedMobile }}</span>
      </div>
      <button type="button" class="activity-refresh" title="刷新活动" @click="loadActivities">
        <RefreshCw :size="18" :class="{ spinning: loading }" />
      </button>
    </header>

    <nav class="activity-mode-switch" aria-label="活动办理模式">
      <button type="button" :class="{ active: mode === 'configured' }" @click="mode = 'configured'">配置活动</button>
      <button type="button" :class="{ active: mode === 'custom' }" @click="mode = 'custom'">自定义订购</button>
    </nav>

    <CustomOrderPanel v-if="mode === 'custom'" />
    <template v-else>
    <section v-if="loading && !activity" class="activity-loading">正在读取活动配置...</section>
    <section v-else-if="!activity" class="activity-empty">暂无已启用的活动配置</section>
    <template v-else>
      <section class="activity-summary">
        <div class="activity-title-row">
          <div>
            <span class="activity-kicker">配置活动</span>
            <h2>{{ activity.name }}</h2>
          </div>
          <span class="activity-status" :class="checkStatusClass">{{ checkStatusText }}</span>
        </div>
        <p>{{ activity.description }}</p>
        <dl class="activity-facts">
          <div><dt>产品编码</dt><dd>{{ activity.product.itemCode }}</dd></div>
          <div><dt>合约期</dt><dd>{{ activity.product.contractMonths }}个月</dd></div>
          <div><dt>月承诺</dt><dd>{{ activity.product.monthlyCommitmentYuan }}元</dd></div>
          <div><dt>解约费用</dt><dd>{{ activity.product.terminationFeeYuan }}元</dd></div>
        </dl>
        <button class="activity-check" type="button" :disabled="checking" @click="checkEligibility">
          <ShieldCheck :size="18" />
          {{ checking ? '检查中' : '检查活动资格' }}
        </button>
      </section>

      <section class="activity-form-section">
        <header>
          <div>
            <h2>报装信息</h2>
            <p>机主信息取自当前登录账号</p>
          </div>
          <span>{{ ownerName || '未识别机主' }}</span>
        </header>
        <form class="activity-form" @submit.prevent="previewOrder">
          <label v-for="field in activity.form" :key="field.name" :class="{ wide: field.type === 'text' }">
            <span>{{ field.label }}<b v-if="field.required">*</b></span>
            <select v-if="field.type === 'select'" v-model="form[field.name]" :required="field.required">
              <option value="">请选择</option>
              <option v-for="option in field.options" :key="optionValue(option)" :value="optionValue(option)">
                {{ optionLabel(option) }}
              </option>
            </select>
            <input
              v-else
              v-model.trim="form[field.name]"
              :type="field.type === 'tel' ? 'tel' : field.type"
              :required="field.required"
              :maxlength="field.maxLength"
              :inputmode="field.type === 'tel' ? 'numeric' : undefined"
            />
          </label>

          <section class="activity-notices">
            <h3>办理确认</h3>
            <p v-for="notice in activity.notices" :key="notice">{{ notice }}</p>
          </section>
          <label class="activity-agreement">
            <input v-model="agreed" type="checkbox" />
            <span>我已阅读并同意活动规则及家庭宽带业务服务协议</span>
          </label>
          <button class="activity-preview-btn" type="submit" :disabled="previewing || !agreed">
            <ClipboardCheck :size="19" />
            {{ previewing ? '校验中' : '预览并确认办理' }}
          </button>
        </form>
      </section>
    </template>
    </template>

    <section v-if="showConfirm" class="dialog-mask" @click.self="showConfirm = false">
      <div class="dialog activity-confirm-dialog">
        <h3>确认提交真实报装</h3>
        <dl>
          <dt>产品</dt><dd>{{ activity.name }}</dd>
          <dt>安装地址</dt><dd>{{ form.district }} {{ form.address }}</dd>
          <dt>联系人</dt><dd>{{ ownerName }} {{ maskedContact }}</dd>
          <dt>费用约定</dt><dd>月承诺 {{ activity.product.monthlyCommitmentYuan }} 元，合约 {{ activity.product.contractMonths }} 个月</dd>
        </dl>
        <p>提交后将向北京移动发起真实业务受理。最终能否装机以地址覆盖与工作人员确认为准。</p>
        <div class="dialog-actions">
          <button class="secondary" type="button" :disabled="subscribing" @click="showConfirm = false">取消</button>
          <button class="danger" type="button" :disabled="subscribing" @click="subscribe">
            {{ subscribing ? '提交中' : '确认提交' }}
          </button>
        </div>
      </div>
    </section>

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
import { computed, onMounted, reactive, ref } from 'vue'
import { ChevronLeft, ClipboardCheck, RefreshCw, ShieldCheck } from 'lucide-vue-next'
import MessageDialog from '../components/MessageDialog.vue'
import CustomOrderPanel from '../components/CustomOrderPanel.vue'
import { api } from '../api/client'
import { sessionState } from '../stores/session'

defineEmits(['back'])

const activities = ref([])
const mode = ref('configured')
const loading = ref(false)
const checking = ref(false)
const previewing = ref(false)
const subscribing = ref(false)
const eligibility = ref(null)
const agreed = ref(false)
const showConfirm = ref(false)
const messageDialog = ref(null)
const confirmationId = ref('')
const form = reactive({})

const activity = computed(() => activities.value[0] || null)
const mobile = computed(() => sessionState.userInfo?.mobile || sessionState.phone || '')
const ownerName = computed(() => sessionState.userInfo?.raw?.name || sessionState.userInfo?.name || '')
const maskedMobile = computed(() => maskPhone(mobile.value))
const maskedContact = computed(() => maskPhone(form.contactPhone || ''))
const checkStatusText = computed(() => {
  if (!eligibility.value) return '待检查'
  if (!eligibility.value.eligible) return '不符合资格，可尝试'
  if (eligibility.value.existingBroadband) return '已有融合宽带'
  return '资格通过'
})
const checkStatusClass = computed(() => ({
  pass: eligibility.value?.eligible && !eligibility.value?.existingBroadband,
  reject: eligibility.value && (!eligibility.value.eligible || eligibility.value.existingBroadband),
}))

function maskPhone(value) {
  return String(value || '').replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2') || '当前账号'
}

function optionValue(option) {
  return typeof option === 'object' ? option.value : option
}

function optionLabel(option) {
  return typeof option === 'object' ? option.label : option
}

function showMessage(message, type = 'info', title = '提示') {
  messageDialog.value = { message, type, title }
}

function initializeForm(config) {
  for (const field of config.form || []) {
    if (!(field.name in form)) form[field.name] = ''
  }
  if (!form.contactPhone) form.contactPhone = mobile.value
}

async function loadActivities() {
  loading.value = true
  try {
    const data = await api.listActivities()
    activities.value = data.activities || []
    if (activities.value[0]) initializeForm(activities.value[0])
  } catch (error) {
    showMessage(error.message, 'error', '活动配置读取失败')
  } finally {
    loading.value = false
  }
}

async function checkEligibility() {
  if (!activity.value) return
  checking.value = true
  try {
    const data = await api.checkActivity(activity.value.id, { sessionId: sessionState.sessionId })
    eligibility.value = data.check
    const type = data.check.existingBroadband ? 'error' : data.check.eligible ? 'success' : 'info'
    showMessage(data.check.message, type, '资格检查')
  } catch (error) {
    showMessage(error.message, 'error', '资格检查失败')
  } finally {
    checking.value = false
  }
}

async function previewOrder() {
  if (!activity.value || !agreed.value) return
  previewing.value = true
  try {
    await api.previewActivity(activity.value.id, { sessionId: sessionState.sessionId, input: { ...form } })
    confirmationId.value = globalThis.crypto?.randomUUID?.().replaceAll('-', '') || `${Date.now()}_${Math.random().toString(36).slice(2)}`
    showConfirm.value = true
  } catch (error) {
    showMessage(error.message, 'error', '报装信息校验失败')
  } finally {
    previewing.value = false
  }
}

async function subscribe() {
  if (!activity.value) return
  subscribing.value = true
  try {
    const data = await api.subscribeActivity(activity.value.id, {
      sessionId: sessionState.sessionId,
      input: { ...form },
      agreed: agreed.value,
      confirmationId: confirmationId.value,
    })
    showConfirm.value = false
    showMessage(data.result.message, 'success', data.idempotent ? '已提交' : '报装已受理')
  } catch (error) {
    showConfirm.value = false
    showMessage(error.message, 'error', '活动办理未完成')
  } finally {
    subscribing.value = false
  }
}

onMounted(loadActivities)
</script>
