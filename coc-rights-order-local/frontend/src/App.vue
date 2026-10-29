<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import {
  directOrder,
  getC1,
  getProducts,
  getSkuType,
  packageLoginCheck,
  resolveLayout,
  sendSms
} from './api.js';

const products = ref([]);
const selectedPreset = ref('');
const countdown = ref(0);
let countdownTimer = null;

const form = reactive({
  input: 'bojinyear',
  skuId: '',
  name: '',
  channelCode: 'P00000139704',
  selfChannelCode: 'P00000139704',
  referer: 'bojinyear',
  orderMode: 'rights',
  productCode: '',
  pageId: '',
  touchCode: '',
  protocolSequenceId: '',
  smsCodeTypeEnum: '',
  userId: '',
  phone: '',
  smsCode: '',
  operDfp: '',
  receipt: true,
  receiptModule: true
});

const loading = reactive({
  products: false,
  resolve: false,
  skuType: false,
  sms: false,
  c1: false,
  order: false
});

const results = reactive({
  layout: null,
  skuType: null,
  sms: null,
  loginCheck: null,
  c1: null,
  order: null,
  error: ''
});

const canSendSms = computed(() => form.phone && form.skuId && !loading.sms && countdown.value === 0);
const canQuerySkuType = computed(() => form.orderMode !== 'package' && form.skuId && !loading.skuType);
const canOrder = computed(() => form.phone && form.smsCode && form.skuId && !loading.order);

function setError(error) {
  results.error = error?.message || String(error || '');
}

function applyProduct(product) {
  if (!product) return;
  form.input = product.code || product.skuId || form.input;
  form.skuId = product.skuId || form.skuId;
  form.name = product.name || form.name;
  form.channelCode = product.channelCode || form.channelCode;
  form.selfChannelCode = product.selfChannelCode || product.channelCode || form.selfChannelCode;
  form.referer = product.referer || product.code || form.referer;
  form.orderMode = product.orderMode || 'rights';
  form.productCode = product.productCode || product.skuId || '';
  form.pageId = product.pageId || '';
  form.touchCode = product.touchCode || product.channelCode || '';
  form.protocolSequenceId = product.protocolSequenceId || '';
  form.smsCodeTypeEnum = product.smsCodeTypeEnum || '';
}

function selectPreset() {
  const product = products.value.find((item) => item.code === selectedPreset.value);
  applyProduct(product);
}

async function loadProducts() {
  loading.products = true;
  try {
    const response = await getProducts();
    products.value = response.data || [];
    applyProduct(products.value[0]);
  } catch (error) {
    setError(error);
  } finally {
    loading.products = false;
  }
}

async function handleResolve() {
  loading.resolve = true;
  results.error = '';
  try {
    const response = await resolveLayout(form.input);
    const data = response.data;
    form.skuId = data.skuId || form.skuId;
    form.name = data.name || data.title || form.name;
    form.channelCode = data.channelCode || form.channelCode;
    form.selfChannelCode = data.selfChannelCode || data.channelCode || form.selfChannelCode;
    form.referer = data.referer || data.code || form.referer;
    form.orderMode = data.orderMode || form.orderMode || 'rights';
    form.productCode = data.productCode || data.skuId || form.productCode;
    form.pageId = data.pageId || form.pageId;
    form.touchCode = data.touchCode || data.channelCode || form.touchCode;
    form.protocolSequenceId = data.protocolSequenceId || form.protocolSequenceId;
    form.smsCodeTypeEnum = data.smsCodeTypeEnum || form.smsCodeTypeEnum;
    results.layout = data;
    if (!data.skuId) {
      results.error = '当前权益详情未包含可订购 skuId，请补充对应订购接口或商品 SKU 后再发送验证码。';
    }
  } catch (error) {
    setError(error);
  } finally {
    loading.resolve = false;
  }
}

async function handleSkuType() {
  loading.skuType = true;
  results.error = '';
  try {
    const response = await getSkuType({
      skuId: form.skuId,
      referer: form.referer,
      channelCode: form.channelCode
    });
    results.skuType = response.data;
  } catch (error) {
    setError(error);
  } finally {
    loading.skuType = false;
  }
}

function startCountdown() {
  countdown.value = 60;
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer);
      countdown.value = 0;
    }
  }, 1000);
}

async function handleSendSms() {
  loading.sms = true;
  results.error = '';
  try {
    const response = await sendSms({
      phone: form.phone,
      skuId: form.skuId,
      code: form.referer,
      channelCode: form.channelCode,
      referer: form.referer,
      orderMode: form.orderMode,
      productCode: form.productCode || form.skuId,
      pageId: form.pageId,
      touchCode: form.touchCode || form.channelCode,
      smsCodeTypeEnum: form.smsCodeTypeEnum
    });
    results.sms = response.data;
    startCountdown();
  } catch (error) {
    setError(error);
  } finally {
    loading.sms = false;
  }
}

async function handleC1() {
  loading.c1 = true;
  results.error = '';
  try {
    const response = await getC1({
      code: form.referer,
      channelCode: form.channelCode
    });
    results.c1 = response.data;
  } catch (error) {
    setError(error);
  } finally {
    loading.c1 = false;
  }
}

async function handleOrder() {
  loading.order = true;
  results.error = '';
  try {
    if (form.orderMode === 'package') {
      const loginResponse = await packageLoginCheck({
        phone: form.phone,
        smsCode: form.smsCode,
        userId: form.userId,
        referer: form.referer,
        pageId: form.pageId,
        channelCode: form.channelCode,
        touchCode: form.touchCode || form.channelCode
      });
      results.loginCheck = loginResponse.data;
      if (loginResponse.data?.success === false || loginResponse.data?.code !== '0') {
        return;
      }
      form.userId = loginResponse.data?.data?.userId || form.userId;
    }
    const response = await directOrder({
      phone: form.phone,
      smsCode: form.smsCode,
      skuId: form.skuId,
      channelCode: form.channelCode,
      selfChannelCode: form.selfChannelCode,
      referer: form.referer,
      orderMode: form.orderMode,
      productCode: form.productCode || form.skuId,
      pageId: form.pageId,
      touchCode: form.touchCode || form.channelCode,
      protocolSequenceId: form.protocolSequenceId,
      userId: form.userId,
      receipt: form.receipt,
      receiptModule: form.receiptModule,
      operDfp: form.operDfp || null
    });
    results.order = response.data;
  } catch (error) {
    setError(error);
  } finally {
    loading.order = false;
  }
}

function resultStatus(value) {
  if (!value) return '';
  const code = value.resultCode ?? value.code ?? value.status;
  const message = value.msg || value.message || value.data?.msg || '';
  return [code !== undefined ? `结果码：${code}` : '', message].filter(Boolean).join(' / ');
}

onMounted(loadProducts);
</script>

<template>
  <main class="shell">
    <header class="topbar">
      <div>
        <p class="eyebrow">COC Rights Order</p>
        <h1>权益订购本地工具</h1>
      </div>
      <div class="status-pill">Vue3 + Local API</div>
    </header>

    <section class="workspace">
      <form class="panel controls" @submit.prevent>
        <div class="section-title">
          <h2>权益信息</h2>
          <button class="ghost" type="button" :disabled="loading.resolve" @click="handleResolve">
            {{ loading.resolve ? '解析中' : '解析权益' }}
          </button>
        </div>

        <label>
          <span>预设权益</span>
          <select v-model="selectedPreset" @change="selectPreset">
            <option value="">手动输入</option>
            <option v-for="item in products" :key="item.code" :value="item.code">
              {{ item.name }} / {{ item.code }}
            </option>
          </select>
        </label>

        <div class="grid two">
          <label>
            <span>权益 code / skuId</span>
            <input v-model.trim="form.input" placeholder="bojinyear 或 77626" />
          </label>
          <label>
            <span>skuId</span>
            <input v-model.trim="form.skuId" placeholder="解析后自动填入" />
          </label>
        </div>

        <label>
          <span>权益名称</span>
          <input v-model.trim="form.name" placeholder="解析后展示" />
        </label>

        <div class="grid two">
          <label>
            <span>channelCode</span>
            <input v-model.trim="form.channelCode" />
          </label>
          <label>
            <span>selfChannelCode</span>
            <input v-model.trim="form.selfChannelCode" />
          </label>
        </div>

          <label>
            <span>referer</span>
            <input v-model.trim="form.referer" />
          </label>

        <div class="grid two">
          <label>
            <span>orderMode</span>
            <select v-model="form.orderMode">
              <option value="rights">rights</option>
              <option value="package">package</option>
            </select>
          </label>
          <label>
            <span>productCode</span>
            <input v-model.trim="form.productCode" />
          </label>
        </div>

        <div v-if="form.orderMode === 'package'" class="grid two">
          <label>
            <span>pageId</span>
            <input v-model.trim="form.pageId" />
          </label>
          <label>
            <span>touchCode</span>
            <input v-model.trim="form.touchCode" />
          </label>
        </div>

        <div v-if="form.orderMode === 'package'" class="grid two">
          <label>
            <span>protocolSequenceId</span>
            <input v-model.trim="form.protocolSequenceId" />
          </label>
          <label>
            <span>smsCodeTypeEnum</span>
            <input v-model.trim="form.smsCodeTypeEnum" placeholder="505" />
          </label>
        </div>

        <div class="section-title">
          <h2>预检</h2>
          <button class="ghost" type="button" :disabled="!canQuerySkuType" @click="handleSkuType">
            {{ loading.skuType ? '查询中' : '查询 SKU 类型' }}
          </button>
        </div>

        <div class="section-title">
          <h2>验证码</h2>
          <button class="primary" type="button" :disabled="!canSendSms" @click="handleSendSms">
            {{ loading.sms ? '发送中' : countdown ? `${countdown}s` : '发送验证码' }}
          </button>
        </div>

        <div class="grid two">
          <label>
            <span>手机号</span>
            <input v-model.trim="form.phone" inputmode="numeric" placeholder="本人手机号" />
          </label>
          <label>
            <span>验证码</span>
            <input v-model.trim="form.smsCode" inputmode="numeric" placeholder="短信验证码" />
          </label>
        </div>

        <label>
          <span>operDfp</span>
          <input v-model.trim="form.operDfp" placeholder="可空，风控失败时再填写" />
        </label>

        <div class="toggles">
          <label class="check">
            <input v-model="form.receipt" type="checkbox" />
            <span>receipt</span>
          </label>
          <label class="check">
            <input v-model="form.receiptModule" type="checkbox" />
            <span>receiptModule</span>
          </label>
        </div>

        <div class="actions">
          <button class="ghost" type="button" :disabled="loading.c1" @click="handleC1">
            {{ loading.c1 ? '获取中' : '获取 c1' }}
          </button>
          <button class="primary wide" type="button" :disabled="!canOrder" @click="handleOrder">
            {{ loading.order ? '订购中' : '确认订购' }}
          </button>
        </div>
      </form>

      <aside class="panel results">
        <div class="section-title">
          <h2>结果</h2>
        </div>

        <p v-if="results.error" class="error">{{ results.error }}</p>

        <div v-if="results.layout" class="result-block">
          <h3>layout</h3>
          <p>{{ results.layout.title || results.layout.name }} / skuId {{ results.layout.skuId }}</p>
          <img v-if="results.layout.orderImg" :src="results.layout.orderImg" alt="权益订购图" />
          <pre>{{ JSON.stringify(results.layout, null, 2) }}</pre>
        </div>

        <div v-if="results.skuType" class="result-block">
          <h3>skuType</h3>
          <p>{{ resultStatus(results.skuType) }}</p>
          <pre>{{ JSON.stringify(results.skuType, null, 2) }}</pre>
        </div>

        <div v-if="results.sms" class="result-block">
          <h3>sms</h3>
          <p>{{ resultStatus(results.sms) }}</p>
          <pre>{{ JSON.stringify(results.sms, null, 2) }}</pre>
        </div>

        <div v-if="results.c1" class="result-block">
          <h3>c1</h3>
          <p>{{ resultStatus(results.c1) }}</p>
          <pre>{{ JSON.stringify(results.c1, null, 2) }}</pre>
        </div>

        <div v-if="results.loginCheck" class="result-block">
          <h3>loginCheck</h3>
          <p>{{ resultStatus(results.loginCheck) }}</p>
          <pre>{{ JSON.stringify(results.loginCheck, null, 2) }}</pre>
        </div>

        <div v-if="results.order" class="result-block">
          <h3>order</h3>
          <p>{{ resultStatus(results.order) }}</p>
          <pre>{{ JSON.stringify(results.order, null, 2) }}</pre>
        </div>

        <div v-if="!results.error && !results.layout && !results.skuType && !results.sms && !results.c1 && !results.order" class="empty">
          等待操作结果
        </div>
      </aside>
    </section>
  </main>
</template>
