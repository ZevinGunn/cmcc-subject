<template>
  <section class="custom-order-panel">
    <header class="custom-order-heading">
      <div>
        <span class="activity-kicker">统一订购协议</span>
        <h2>自定义业务参数</h2>
      </div>
      <button type="button" class="custom-example-btn" @click="loadExample">
        <FileInput :size="16" />
        载入示例
      </button>
    </header>

    <form class="custom-order-form" @submit.prevent="preview">
      <label>
        <span>本地活动名称</span>
        <input v-model.trim="config.activityName" placeholder="用于本地识别" maxlength="100" />
      </label>
      <label>
        <span>初始化类型 proType</span>
        <input v-model.trim="config.proType" placeholder="例如 CNDXZYHK" maxlength="128" />
      </label>
      <label>
        <span>活动策划 ID *</span>
        <input v-model.trim="config.packageId" placeholder="packageId" maxlength="128" required />
      </label>
      <label>
        <span>活动编码 *</span>
        <input v-model.trim="config.packageCode" placeholder="packageCode" maxlength="128" required />
      </label>
      <label>
        <span>资源编码</span>
        <input v-model.trim="config.productShowCode" placeholder="productShowCode，可由初始化返回" maxlength="128" />
      </label>
      <label>
        <span>资源动作编码 *</span>
        <input v-model.trim="config.pitemShowCode" placeholder="pitemShowCode" maxlength="128" required />
      </label>
      <label class="wide">
        <span>活动扩展参数 mtOtherParams</span>
        <input v-model.trim="config.mtOtherParams" placeholder="按活动定义填写，可留空" maxlength="1000" />
      </label>
      <label class="wide">
        <span>高级字段 JSON</span>
        <textarea v-model="config.extraContent" rows="4" placeholder='仅支持简单值，例如 {"prodValue":"10"}'></textarea>
      </label>

      <div class="custom-order-actions wide">
        <button type="button" class="custom-secondary-btn" :disabled="initializing || !config.proType" @click="initialize">
          <DatabaseZap :size="17" />
          {{ initializing ? '读取中' : '读取活动信息' }}
        </button>
        <button type="submit" class="activity-preview-btn" :disabled="previewing">
          <ScanSearch :size="18" />
          {{ previewing ? '生成中' : '生成订购预览' }}
        </button>
      </div>
    </form>

    <section v-if="initialization" class="custom-init-result" :class="initializationClass">
      <header>
        <strong>{{ initializationTitle }}</strong>
        <span>resultCode {{ initialization.activityInfo?.resultCode || '-' }}</span>
      </header>
      <dl>
        <div><dt>资源编码</dt><dd>{{ initialization.activityInfo?.productCode || '未返回' }}</dd></div>
        <div><dt>月承诺</dt><dd>{{ initialization.activityInfo?.planFee || '-' }}</dd></div>
        <div><dt>赠送流量</dt><dd>{{ initialization.activityInfo?.LL || '-' }}</dd></div>
        <div><dt>赠送语音</dt><dd>{{ initialization.activityInfo?.voice || '-' }}</dd></div>
        <div><dt>违约金</dt><dd>{{ initialization.activityInfo?.WY || '-' }}</dd></div>
      </dl>
      <p>{{ initialization.message }}</p>
      <button v-if="initialization.activityInfo?.productCode" type="button" @click="useInitializedProduct">使用该资源编码</button>
    </section>

    <section v-if="previewData" class="custom-preview">
      <header>
        <div>
          <span class="activity-kicker">待提交内容</span>
          <h3>compositeCommit payload</h3>
        </div>
        <button type="button" title="复制 payload" @click="copyPreview"><Copy :size="17" /></button>
      </header>
      <pre>{{ previewJson }}</pre>
      <p v-if="initialization && !initialization.eligible" class="custom-risk-note">
        当前初始化结果不符合资格或未返回可办理状态。仍可尝试提交，运营商接口可能拒绝受理。
      </p>
      <label class="activity-agreement custom-agreement">
        <input v-model="agreed" type="checkbox" />
        <span>我已核对活动策划、资源编码和扩展参数，并确认将发起真实业务订购</span>
      </label>
      <button type="button" class="custom-submit-btn" :disabled="!agreed || submitting" @click="showConfirm = true">
        <Send :size="18" />
        {{ submitting ? '提交中' : '提交真实订购' }}
      </button>
    </section>

    <section v-if="pendingOrder" class="custom-sms-panel">
      <header>
        <MessageSquareText :size="20" />
        <div><strong>短信确认</strong><span>{{ pendingOrder.sms?.productItemName || config.activityName }}</span></div>
      </header>
      <p>{{ pendingOrder.sms?.productItemDesc || pendingOrder.message }}</p>
      <p v-if="pendingOrder.sms?.busiTime">生效时间：{{ pendingOrder.sms.busiTime }}</p>
      <div class="custom-sms-row">
        <input v-model.trim="smsCode" inputmode="numeric" maxlength="6" placeholder="6 位短信验证码" />
        <button type="button" :disabled="sendingSms" @click="sendSms">{{ sendingSms ? '发送中' : '发送验证码' }}</button>
        <button type="button" :disabled="verifyingSms || !/^\d{6}$/.test(smsCode)" @click="verifySms">
          {{ verifyingSms ? '校验中' : '确认办理' }}
        </button>
      </div>
    </section>

    <section v-if="finalOrder" class="custom-final-result">
      <CircleCheckBig :size="22" />
      <div>
        <strong>订购请求已受理</strong>
        <p>{{ finalOrder.message }}</p>
        <pre v-if="finalOrder.result">{{ JSON.stringify(finalOrder.result, null, 2) }}</pre>
      </div>
    </section>

    <section v-if="showConfirm" class="dialog-mask" @click.self="showConfirm = false">
      <div class="dialog activity-confirm-dialog">
        <h3>确认提交自定义订购</h3>
        <dl>
          <dt>活动</dt><dd>{{ config.activityName || config.packageCode }}</dd>
          <dt>策划 ID</dt><dd>{{ config.packageId }}</dd>
          <dt>活动编码</dt><dd>{{ config.packageCode }}</dd>
          <dt>资源编码</dt><dd>{{ config.productShowCode || '提交时按 proType 初始化' }}</dd>
          <dt>动作编码</dt><dd>{{ config.pitemShowCode }}</dd>
        </dl>
        <p>这是运营商真实订购操作。即使资格检查未通过，也会按当前参数尝试提交。</p>
        <div class="dialog-actions">
          <button class="secondary" type="button" :disabled="submitting" @click="showConfirm = false">取消</button>
          <button class="danger" type="button" :disabled="submitting" @click="submit">
            {{ submitting ? '提交中' : '确认提交' }}
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
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import {
  CircleCheckBig,
  Copy,
  DatabaseZap,
  FileInput,
  MessageSquareText,
  ScanSearch,
  Send,
} from 'lucide-vue-next'
import MessageDialog from './MessageDialog.vue'
import { api } from '../api/client'
import { sessionState } from '../stores/session'

const config = reactive({
  activityName: '',
  proType: '',
  packageId: '',
  packageCode: '',
  productShowCode: '',
  pitemShowCode: 'KT',
  mtOtherParams: '',
  extraContent: '',
})
const initialization = ref(null)
const previewData = ref(null)
const pendingOrder = ref(null)
const finalOrder = ref(null)
const agreed = ref(false)
const initializing = ref(false)
const previewing = ref(false)
const submitting = ref(false)
const sendingSms = ref(false)
const verifyingSms = ref(false)
const showConfirm = ref(false)
const smsCode = ref('')
const confirmationId = ref('')
const messageDialog = ref(null)

const previewJson = computed(() => JSON.stringify(previewData.value?.payload || {}, null, 2))
const initializationTitle = computed(() => {
  if (initialization.value?.eligible) return '当前号码可办理'
  if (initialization.value?.alreadyOrdered) return '当前号码已办理'
  return '当前号码不符合资格，可尝试提交'
})
const initializationClass = computed(() => ({
  eligible: initialization.value?.eligible,
  ineligible: initialization.value && !initialization.value.eligible,
}))

watch(config, () => {
  previewData.value = null
  agreed.value = false
  finalOrder.value = null
}, { deep: true })

function showMessage(message, type = 'info', title = '提示') {
  messageDialog.value = { message, type, title }
}

function bodyConfig() {
  return { ...config }
}

function newConfirmationId() {
  return globalThis.crypto?.randomUUID?.().replaceAll('-', '') || `${Date.now()}_${Math.random().toString(36).slice(2)}`
}

function loadExample() {
  Object.assign(config, {
    activityName: '承诺低消权益回馈版',
    proType: 'CNDXZYHK',
    packageId: '55412',
    packageCode: 'CNDXZYHK',
    productShowCode: '',
    pitemShowCode: 'KT',
    mtOtherParams: '',
    extraContent: '',
  })
  initialization.value = null
  pendingOrder.value = null
  showMessage('已载入示例策划参数，请先读取活动信息获取当前号码的资源编码。')
}

async function initialize() {
  initializing.value = true
  try {
    const data = await api.initializeCustomOrder({
      sessionId: sessionState.sessionId,
      config: { proType: config.proType },
    })
    initialization.value = data.initialization
    if (data.initialization.activityInfo?.productCode) useInitializedProduct()
  } catch (error) {
    showMessage(error.message, 'error', '活动信息读取失败')
  } finally {
    initializing.value = false
  }
}

function useInitializedProduct() {
  config.productShowCode = initialization.value?.activityInfo?.productCode || config.productShowCode
}

async function preview() {
  previewing.value = true
  try {
    const data = await api.previewCustomOrder({ sessionId: sessionState.sessionId, config: bodyConfig() })
    previewData.value = data.preview
    confirmationId.value = newConfirmationId()
  } catch (error) {
    showMessage(error.message, 'error', '订购参数校验失败')
  } finally {
    previewing.value = false
  }
}

async function copyPreview() {
  await navigator.clipboard.writeText(previewJson.value)
  showMessage('已复制订购 payload')
}

async function submit() {
  submitting.value = true
  try {
    const data = await api.submitCustomOrder({
      sessionId: sessionState.sessionId,
      config: bodyConfig(),
      agreed: agreed.value,
      confirmationId: confirmationId.value || newConfirmationId(),
    })
    showConfirm.value = false
    handleOrderResult(data.order)
  } catch (error) {
    showConfirm.value = false
    showMessage(error.message, 'error', '自定义订购未完成')
  } finally {
    submitting.value = false
  }
}

function handleOrderResult(order) {
  if (order?.status === 'sms_required') {
    pendingOrder.value = order
    finalOrder.value = null
    return
  }
  pendingOrder.value = null
  finalOrder.value = order
}

async function sendSms() {
  sendingSms.value = true
  try {
    const data = await api.sendCustomOrderSms(pendingOrder.value.orderId, { sessionId: sessionState.sessionId })
    showMessage(data.sms.message, 'success', '验证码已发送')
  } catch (error) {
    showMessage(error.message, 'error', '验证码发送失败')
  } finally {
    sendingSms.value = false
  }
}

async function verifySms() {
  verifyingSms.value = true
  try {
    const data = await api.verifyCustomOrderSms(pendingOrder.value.orderId, {
      sessionId: sessionState.sessionId,
      smsCode: smsCode.value,
    })
    handleOrderResult(data.order)
  } catch (error) {
    showMessage(error.message, 'error', '短信确认失败')
  } finally {
    verifyingSms.value = false
  }
}
</script>
