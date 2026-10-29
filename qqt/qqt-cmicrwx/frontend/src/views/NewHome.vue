<template>
  <div class="page">
    <div class="page-inner">
      <!-- 顶部操作栏：标题与全局设置入口 -->
      <header class="page-header">
        <div class="header-actions">
          <a-dropdown :trigger="['click']" v-model:open="settingsMenuOpen">
            <button class="settings-btn" type="button">
              <span class="settings-icon">⚙️</span>
            </button>
            <template #overlay>
              <a-menu class="settings-menu">
                <a-menu-item
                  key="add"
                  @click="
                    () => {
                      closeSettingsMenu();
                      addAccount();
                    }
                  "
                >
                  新增账号
                </a-menu-item>
                <a-menu-item
                  key="logs"
                  @click="
                    () => {
                      closeSettingsMenu();
                      toggleLogs();
                    }
                  "
                >
                  {{ showLogs ? "隐藏日志" : "查看日志" }}
                </a-menu-item>
                <a-menu-item
                  key="clearCache"
                  @click="
                    () => {
                      closeSettingsMenu();
                      clearCache();
                    }
                  "
                >
                  清除缓存
                </a-menu-item>
                <a-menu-item
                  key="clearLogs"
                  @click="
                    () => {
                      closeSettingsMenu();
                      clearLogs();
                    }
                  "
                >
              清除领取日志
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </header>

      <!-- 高速抢购与时间校准 -->
      <section class="fast-console">
        <div class="fast-left">
          <p class="fast-eyebrow">高速抢购 · 毫秒轮询</p>
          <h2>标准北京时间：{{ beijingTime }}</h2>
          <p class="fast-note">偏移 {{ timeOffsetMs }} ms · {{ lastSyncLabel }}</p>
          <div class="fast-actions">
            <button type="button" class="action-btn primary" @click="syncTime" :disabled="syncingTime">
              {{ syncingTime ? "校准中..." : "校准标准北京时间" }}
            </button>
            <button
              type="button"
              class="action-btn ghost"
              @click="clearFastLogs"
              :disabled="!fastLogs.length"
            >
              清空高速日志
            </button>
          </div>
        </div>
        <div class="fast-right">
          <div class="fast-settings">
            <label>
              轮询间隔 (ms)
              <input v-model.number="fastConfig.intervalMs" type="number" min="5" step="5" />
            </label>
            <label>
              最大轮询次数
              <input v-model.number="fastConfig.maxRounds" type="number" min="1" />
            </label>
            <label>
              每轮并发请求数
              <input v-model.number="fastConfig.batchSize" type="number" min="1" />
            </label>
          </div>
          <div class="fast-buttons">
            <button type="button" class="primary" @click="handleFastOnce" :disabled="fastState.running">
              单次立即领取
            </button>
            <button type="button" class="accent" @click="startFastBurst" :disabled="fastState.running">
              一键抢购（轮询）
            </button>
            <button type="button" class="ghost" @click="stopFastBurst" :disabled="!fastState.running">
              停止
            </button>
          </div>
          <div class="fast-stats">
            <div>
              <span>状态</span>
              <strong>{{ fastState.running ? "运行中" : "待机" }}</strong>
            </div>
            <div>
              <span>轮询次数</span>
              <strong>{{ fastState.round }}/{{ fastConfig.maxRounds }}</strong>
            </div>
            <div>
              <span>已发起</span>
              <strong>{{ fastState.sent }}</strong>
            </div>
            <div>
              <span>进行中</span>
              <strong>{{ fastState.inFlight }}</strong>
            </div>
            <div>
              <span>成功</span>
              <strong class="success">{{ fastState.succeeded }}</strong>
            </div>
            <div>
              <span>失败</span>
              <strong class="danger">{{ fastState.failed }}</strong>
            </div>
          </div>
        </div>
      </section>

      <section v-if="isStarDayMode" class="star-day-card">
        <div class="star-day-field">
          <label>星动日权益ID</label>
          <input
            v-model.trim="starDayProductId"
            type="text"
            inputmode="numeric"
            placeholder="例如 3537"
            @change="persistStarDayProductId"
          />
        </div>
        <div class="star-day-meta">
          <strong>星动日固定ID领取</strong>
          <span>{{ starDayHint }}</span>
        </div>
        <button
          type="button"
          class="star-day-bulk"
          :disabled="!starDaySelectableCount || starDayBulkRedeeming"
          @click="handleBulkStarDayRedeem"
        >
          {{ starDayBulkRedeeming ? "星动日领取中..." : "一键领取星动日" }}
        </button>
      </section>

      <a-modal
        v-model:open="showAccountLogs"
        :title="accountLogTitle"
        width="760px"
        :footer="null"
        @cancel="showAccountLogs = false"
      >
        <div v-if="accountLogList.length" class="fast-log-list">
          <div v-for="log in accountLogList" :key="log.time + log.id" class="fast-log-item">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-id">#{{ log.id }}</span>
            <span class="log-status" :class="log.statusClass">
              {{ log.statusLabel }}
            </span>
            <span class="log-meta">
              {{ log.statusCode ? `状态 ${log.statusCode}` : "等待响应" }} ·
              {{ log.latency ? `${log.latency}ms` : "处理中" }}
            </span>
            <span class="log-msg" v-if="log.msg">{{ log.msg }}</span>
          </div>
        </div>
        <div v-else class="fast-log-empty">当前账号暂无领取记录</div>
      </a-modal>

      <!-- 账号卡片列表：容纳所有登录账户的操作面板 -->
      <div class="card-list">
        <section
          v-for="(account, index) in accounts"
          :key="account.id"
          class="login-card"
        >
          <!-- 登录模式控制：短信/令牌切换与状态提示 -->
          <div class="row row-control">
          <div class="cell control-left">
            <template v-if="!account.profile">
              <div class="mode-switch">
                <button
                  type="button"
                    :class="['mode-btn', account.authMode === 'sms' && 'active']"
                    @click="setAuthMode(account, 'sms')"
                  >
                    短信登录
                  </button>
                  <button
                    type="button"
                    :class="['mode-btn', account.authMode === 'manual' && 'active']"
                    @click="setAuthMode(account, 'manual')"
                  >
                    令牌登录
                  </button>
                </div>
              </template>
              <template v-else>
                <span class="login-status success">登录成功</span>
              </template>
            </div>

            <!-- 移除账号按钮：置于卡片右上 -->
            <button
                v-if="accounts.length > 1"
                type="button"
                class="remove-btn"
                @click="confirmRemoveAccount(account)"
                aria-label="移除账号"
              >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M3.2 4.2h9.6M6.2 3.2h3.6c.3 0 .5.2.6.5l.3 1.5H5.3l.3-1.5c.1-.3.3-.5.6-.5Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                  />
                  <path
                    d="M5.4 6.2v5.4M8 6.2v5.4m2.6-5.4v5.4m-6.2 0c.1.7.6 1.2 1.3 1.2h4.6c.7 0 1.2-.5 1.3-1.2l.4-5.4H4.4l.4 5.4Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                class="view-log-btn"
                @click="openAccountLogs(account)"
                aria-label="查看账号日志"
              >
                查看日志
              </button>
          </div>
            <!-- 短信登录区域：手机号+验证码输入 -->
            <div
              class="row row-login"
              v-if="!account.profile && account.authMode === 'sms' && account.showLogin"
            >
              <div class="cell">
                <input
                  v-model.trim="account.phone"
                  type="tel"
                  maxlength="11"
                  placeholder="请输入中国移动号码"
                />
              </div>
              <div class="cell">
                <div class="sms-group">
                  <input
                    v-model.trim="account.code"
                    type="text"
                    maxlength="6"
                    placeholder="验证码"
                  />
                  <button
                    type="button"
                    :disabled="account.sending || remainingSeconds(account) > 0 || !isPhoneValid(account)"
                    @click="handleSendSms(account)"
                  >
                    <span v-if="remainingSeconds(account) > 0">
                      {{ remainingSeconds(account) }} 秒
                    </span>
                    <span v-else>发送验证码</span>
                  </button>
                </div>
              </div>
              <div class="cell actions">
                <button
                  type="button"
                  :disabled="!canSubmit(account)"
                  @click="handleLogin(account)"
                >
                  {{ account.loggingIn ? "用户登录中..." : "用户登录" }}
                </button>
              </div>
            </div>

            <!-- 令牌登录提示与输入区 -->
            <span v-if="account.authMode === 'manual' && !account.profile" class="manual-indicator">请输入ACCESS_TOKEN</span>
          <div
              v-if="!account.profile && account.authMode === 'manual'"
              class="cell manual-token-cell"
            >
              <div class="manual-token-box">
                <input
                  v-model.trim="account.manualToken"
                  type="text"
                  placeholder="在此输入Cookies，适用于无法接收验证码的账号"
                />
                <button
                  type="button"
                  :disabled="account.applyingToken || !account.manualToken"
                  @click="handleManualToken(account)"
                >
                  {{ account.applyingToken ? "验证中..." : "登录验证" }}
                </button>
              </div>
            </div>
          <!-- 权益操作区域：类型选择、转赠配置、领取按钮 -->
          <div class="row row-bottom">
            <div v-if="!isStarDayMode" class="cell product-cell">
              <!-- 权益类型选择 -->
              <div class="phase-select-wrapper">
                <span>权益类型</span>
                <a-select
                  class="phase-select"
                  :value="currentPhase"
                  :options="phaseOptions"
                  disabled
                  @change="(value) => handlePhaseChange(value)"
                  size="small"
                />
              </div>
              
              <!-- 转赠操作：开关、列表刷新、成员选择 -->
              <div class="transfer-wrapper">
                <div class="transfer-controls">
                  <label class="transfer-toggle">
                    <input
                      type="checkbox"
                      :checked="account.transferEnabled"
                      @change="(event) => handleTransferToggle(account, event)"
                    />
                    <span>转赠权益</span>
                  </label>
                  <button
                    type="button"
                    class="family-refresh"
                    :disabled="account.familyLoading"
                    @click="refreshFamilyMembers(account, { silent: false, force: true })"
                  >
                    {{
                      account.familyLoading
                        ? "成员加载中..."
                        : account.familyMembers.length
                        ? "刷新家庭圈"
                        : "获取家庭圈"
                    }}
                  </button>
                </div>
                
                <a-select
                  v-if="account.transferEnabled"
                  class="family-select"
                  :value="account.selectedFamilyId"
                  :options="account.familyMembers.map((member) => ({
                    label: formatFamilyMember(member),
                    value: member.familyMemNum,
                  }))"
                  :loading="account.familyLoading"
                  :disabled="account.familyLoading || !account.familyMembers.length"
                  placeholder="选择需要转赠的家庭圈成员"
                  @change="(value: string | undefined) => handleFamilySelect(account, value)"
                  allow-clear
                />
                <p
                  v-if="account.transferEnabled && !account.familyLoading && !account.familyMembers.length"
                  class="family-tip"
                >
                  暂无可转赠的家庭圈成员
                </p>
              </div>
            </div>
            <div v-if="!isStarDayMode" class="product-select">


            <!-- 权益锁定开关 -->
            <div class="redeem-label">
                <label class="lock-toggle">
                  <input
                    type="checkbox"
                    disabled
                    v-model="account.locked"
                    @change="persistAccounts()"
                  />
                  <span>{{ account.locked ? "已锁定权益" : "锁定权益" }}</span>
                </label>
              </div>
                <a-select
                  class="product-select-box"
                  :value="account.selectedProductId"
                  :options="filteredProductsByPhase"
                  :fieldNames="{ label: 'qyName', value: 'id' }"
                  :disabled="loadingProducts || account.locked || !filteredProductsByPhase.length"
                  @change="(value) => handleProductChange(account, value)"
                  placeholder="请选择权益"
                />
                <button
                  type="button"
                  class="redeem-btn"
                  :disabled="!canRedeem(account)"
                  @click="handleRedeem(account)"
                >
                  {{ account.redeeming ? "领取中..." : "领取" }}   (奖品ID:{{account.selectedProductId}})
                </button>
              </div>
            <div v-else class="product-select star-day-account">
                <span class="redeem-label">星动日权益 ID {{ starDayProductId || "-" }}</span>
                <button
                  type="button"
                  class="redeem-btn star"
                  :disabled="!canRedeemStarDay(account)"
                  @click="handleStarDayRedeem(account)"
                >
                  {{ account.starDayRedeeming ? "星动日领取中..." : "领取星动日权益" }}
                </button>
              </div>
            <!-- 登录凭证展示与复制 -->
            <div class="cell token-cell" v-if="getAccessToken(account)">
              <label class="manual-indicator">有效用户令牌TOKEN</label>
              <div class="token-box">
                <input
                  class="token-input"
                  :value="getTokenText(account)"
                  readonly
                  @click="copyToken(account)"
                />
                <button type="button" class="copy-btn" @click="copyToken(account)">
                  复制
                </button>
              </div>
            </div>
            <!-- 用户信息展示 -->
            <div class="cell profile-cell" v-if="account.profile">
              <label>用户信息</label>
              <div class="profile-grid">
                <span>手机号：{{ account.profile?.phone || "-" }}</span>
                <span>等级：{{ account.profile?.levelName || "-" }}</span>
                <span>省份：{{ account.profile?.province || "-" }}</span>
                <span>网龄：{{ account.profile?.netAge ?? "-" }}</span>
                <span>加密号：{{ account.profile?.insertionMobile || "-" }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <a-modal
      v-model:open="showLogs"
      title="领取日志"
      width="760px"
      :footer="null"
      @cancel="showLogs = false"
    >
      <div v-if="redeemLogs.length" class="log-modal-body">
        <div class="log-header">
          <h3>日志明细</h3>
          <span>共 {{ redeemLogs.length }} 条</span>
        </div>
        <ul class="log-list">
          <li v-for="log in redeemLogs" :key="log.time + log.id">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-phone">{{ log.phone }}</span>
            <span class="log-product">{{ log.productName || "--" }}</span>
            <span
              class="log-status"
              :class="{ success: log.success, fail: !log.success }"
            >
              {{ log.success ? "成功" : "失败" }}
            </span>
            <span class="log-msg">{{ log.msg }}</span>
          </li>
        </ul>
      </div>
      <div v-else class="log-empty">
        暂无领取记录
      </div>
    </a-modal>

    <!-- 底部浮动操作条：批量领取入口 -->
    <transition name="floating-fade">
      <div class="floating-bar" v-if="accounts.length">
        <div class="floating-info">
          已登录账号：{{ loggedInCount }}，{{ isStarDayMode ? `可领取星动日：${starDaySelectableCount}` : `已选择权益：${selectableCount}` }}
        </div>
        <button
          type="button"
          class="floating-action"
          :disabled="isStarDayMode ? !starDaySelectableCount || starDayBulkRedeeming : !selectableCount"
          @click="handleBulkRedeem"
        >
          {{ isStarDayMode ? (starDayBulkRedeeming ? "星动日领取中..." : "一键领取星动日") : "一键领取权益" }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
// Vue 组合式 API 基础方法
import { reactive, ref, onMounted, watch, computed, onBeforeUnmount } from "vue";
// Ant Design Vue 组件与全局提示
import {
  Dropdown as ADropdown,
  Menu as AMenu,
  message,
  Select as ASelect,
  Modal as AModal,
} from "ant-design-vue";
// 时间处理：用于日志时间展示
import dayjs from "dayjs";
// 自定义倒计时逻辑
import { useCountdown } from "@/composables/useCountdown";
import {
  // 查询用户基本信息
  fetchUserProfile,
  // 发送短信验证码
  sendSmsCode,
  // 短信验证码登录
  smsLogin,
  // 查询权益列表
  fetchProducts,
  // 领取权益（含转赠）
  redeemProduct,
  redeemStarDayProduct,
  // 手动设置 access_token
  applyManualToken,
  // 查询家庭圈成员
  fetchFamilyMembers,
  ProductItem,
  PRODUCT_PHASE_LABEL,
  PRODUCT_PHASE_LIST,
  FamilyMember,
} from "@/services/auth";

// 账号状态结构定义
interface AccountState {
  id: number;
  phone: string;
  code: string;
  sending: boolean;
  loggingIn: boolean;
  smsSent: boolean;
  profile: Record<string, any> | null;
  cookies: Record<string, string>[];
  countdown: ReturnType<typeof useCountdown>;
  selectedProductId: number | null;
  redeeming: boolean;
  locked: boolean;
  showLogin: boolean;
  manualToken: string;
  applyingToken: boolean;
  authMode: "sms" | "manual";
  transferEnabled: boolean;
  familyMembers: FamilyMember[];
  familyLoading: boolean;
  selectedFamilyId: string | null;
  starDayRedeeming: boolean;
}

// 手机号校验正则（中国大陆11位）
const PHONE_REGEX = /^1[3-9]\d{9}$/;
let accountId = 1;

const STORAGE_KEY = "qqt-login-accounts";
const LOG_STORAGE_KEY = "qqt-redeem-logs";
const FAST_SETTINGS_KEY = "qqt-fast-settings";
const FAST_LOG_LIMIT = 300;
const FAST_LOG_STORAGE_KEY = "qqt-fast-logs";
const STAR_DAY_PRODUCT_STORAGE_KEY = "qqt-star-day-product-id";
// 默认权益分类与默认权益ID
const DEFAULT_PHASE = "2";
const DEFAULT_PRODUCT_ID = 3442;
const DEFAULT_STAR_DAY_PRODUCT_ID = "3537";
// 判断限流时的提示关键字
const RATE_LIMIT_KEYWORDS = ["频繁", "稍后再试", "操作过快", "过快"];
// 领取重试配置
const MAX_REDEEM_RETRY = 3;
const RETRY_BASE_DELAY = 320;
const RETRY_RANDOM_DELAY = 520;
const BULK_REDEEM_GAP = 0;
const BULK_REDEEM_JITTER = 0;
const STAR_DAY_START_DAY = 26;
const STAR_DAY_END_DAY = 28;

type FastLogEntry = {
  id: number;
  accountId: number;
  accountLabel: string;
  issuedAt: number;
  time: string;
  msg?: string;
  latency?: number;
  statusCode?: number;
  status?: "pending" | "success" | "fail";
};

// 权益列表及分组缓存
const products = ref<ProductItem[]>([]);
const productGroups = ref<Record<string, ProductItem[]>>({});
const currentPhase = ref(DEFAULT_PHASE);
const loadingProducts = ref(false);
const starDayProductId = ref(DEFAULT_STAR_DAY_PRODUCT_ID);
const starDayBulkRedeeming = ref(false);
// 领取日志：最多保留100条
const redeemLogs = ref<
  {
    id: number;
    phone: string;
    productName: string;
    success: boolean;
    msg: string;
    time: string;
  }[]
>([]);
// 是否展示领取日志
const showLogs = ref(false);
// 设置下拉菜单显隐
const settingsMenuOpen = ref(false);
const closeSettingsMenu = () => {
  settingsMenuOpen.value = false;
};

// 高速抢购配置与状态
const fastConfig = reactive({
  intervalMs: 50,
  maxRounds: 50,
  batchSize: 1,
});
const fastState = reactive({
  running: false,
  round: 0,
  sent: 0,
  succeeded: 0,
  failed: 0,
  inFlight: 0,
});
const fastLogs = ref<FastLogEntry[]>([]);
const now = ref(Date.now());
const timeOffset = ref(0);
const lastSyncAt = ref<number | null>(null);
const syncingTime = ref(false);
const showAccountLogs = ref(false);
const activeLogAccountId = ref<number | null>(null);
let nowTimer: number | null = null;
let fastRequestId = 0;
const fastIntervals = new Map<number, number>();
const fastRounds = new Map<number, number>();

// 短信登录区域折叠
function toggleLoginArea(account: AccountState) {
  if (account.authMode !== "sms" || account.profile) return;
  account.showLogin = !account.showLogin;
  persistAccounts();
}

// Promise 版延迟工具
function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getStoredStarDayProductId() {
  return localStorage.getItem(STAR_DAY_PRODUCT_STORAGE_KEY) || DEFAULT_STAR_DAY_PRODUCT_ID;
}

function persistStarDayProductId() {
  if (!starDayProductId.value.trim()) {
    starDayProductId.value = DEFAULT_STAR_DAY_PRODUCT_ID;
  }
  localStorage.setItem(STAR_DAY_PRODUCT_STORAGE_KEY, starDayProductId.value);
}

function isStarDayDate(current = dayjs()) {
  const day = current.date();
  return day >= STAR_DAY_START_DAY && day <= STAR_DAY_END_DAY;
}

const isStarDayMode = computed(() => isStarDayDate());

function getStarDayAvailability(account: AccountState) {
  if (!getAccessToken(account) || !account.profile) {
    return { available: false, msg: "请先登录并获取用户信息" };
  }
  if (!starDayProductId.value.trim()) {
    return { available: false, msg: "请先填写星动日权益ID" };
  }
  return { available: true, msg: `星动日权益ID ${starDayProductId.value.trim()}` };
}

const timeOffsetMs = computed(() => Math.round(timeOffset.value));
const beijingTime = computed(() =>
  dayjs(now.value + timeOffset.value).format("YYYY-MM-DD HH:mm:ss.SSS")
);
const lastSyncLabel = computed(() => {
  if (!lastSyncAt.value) return "尚未校准";
  return `最近校准 ${dayjs(lastSyncAt.value).format("HH:mm:ss")}`;
});

function tickNow() {
  now.value = Date.now();
}

function persistFastSettings() {
  const payload = {
    intervalMs: fastConfig.intervalMs,
    maxRounds: fastConfig.maxRounds,
    batchSize: fastConfig.batchSize,
  };
  localStorage.setItem(FAST_SETTINGS_KEY, JSON.stringify(payload));
}

function restoreFastSettings() {
  try {
    const raw = localStorage.getItem(FAST_SETTINGS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed.intervalMs) fastConfig.intervalMs = parsed.intervalMs;
    if (parsed.maxRounds) fastConfig.maxRounds = parsed.maxRounds;
    // 强制单次发起，避免接口提示频繁
    fastConfig.batchSize = 1;
  } catch (error) {
    console.warn("[fast-settings] restore error", error);
  }
}

function persistFastLogs() {
  try {
    localStorage.setItem(FAST_LOG_STORAGE_KEY, JSON.stringify(fastLogs.value));
  } catch (error) {
    console.warn("[fast-logs] persist error", error);
  }
}

function restoreFastLogs() {
  try {
    const raw = localStorage.getItem(FAST_LOG_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      fastLogs.value = parsed.slice(0, FAST_LOG_LIMIT);
    }
  } catch (error) {
    console.warn("[fast-logs] restore error", error);
  }
}

function appendFastLog(entry: FastLogEntry) {
  fastLogs.value = [entry, ...fastLogs.value].slice(0, FAST_LOG_LIMIT);
  persistFastLogs();
}

function updateFastLog(id: number, updates: Partial<FastLogEntry>) {
  fastLogs.value = fastLogs.value.map((item) =>
    item.id === id ? { ...item, ...updates } : item
  );
  persistFastLogs();
}

async function syncTime() {
  try {
    syncingTime.value = true;
    const start = Date.now();
    const resp = await fetch("https://worldtimeapi.org/api/timezone/Asia/Shanghai", {
      cache: "no-store",
    });
    const end = Date.now();
    const data = await resp.json();
    const serverMs = new Date(data.datetime).getTime();
    const latency = (end - start) / 2;
    const clientMid = start + latency;
    timeOffset.value = serverMs - clientMid;
    lastSyncAt.value = Date.now();
  } catch (error) {
    console.warn("[time-sync] failed", error);
  } finally {
    syncingTime.value = false;
  }
}

function resetFastState() {
  fastState.round = 0;
  fastState.sent = 0;
  fastState.succeeded = 0;
  fastState.failed = 0;
  fastState.inFlight = 0;
  fastIntervals.forEach((timer) => clearInterval(timer));
  fastIntervals.clear();
  fastRounds.clear();
}

async function dispatchFastRequest(account: AccountState) {
  const id = ++fastRequestId;
  const issuedAt = Date.now() + timeOffset.value;
  fastState.sent += 1;
  fastState.inFlight += 1;
  appendFastLog({
    id,
    accountId: account.id,
    accountLabel: getAccountLabel(account),
    issuedAt,
    time: dayjs(issuedAt).format("HH:mm:ss.SSS"),
    status: "pending",
  });
  try {
    const result = isStarDayMode.value
      ? await redeemStarDayAccountOnce(account)
      : await redeemAccountOnce(account);
    const latency = Math.max(
      0,
      Math.round(Date.now() + timeOffset.value - issuedAt)
    );
    if (result.success) {
      fastState.succeeded += 1;
      updateFastLog(id, {
        status: "success",
        statusCode: result.status as number | undefined,
        latency,
      });
    } else {
      fastState.failed += 1;
      updateFastLog(id, {
        status: "fail",
        statusCode: result.status as number | undefined,
        latency,
        msg: result.msg,
      });
      const errorMsg = result.msg || "领取失败，请稍后再试";
      message.error(`${getAccountLabel(account)}：${errorMsg}`);
    }
  } catch (error) {
    fastState.failed += 1;
    updateFastLog(id, { status: "fail", statusCode: 500 });
    message.error(`${getAccountLabel(account)}：领取失败，请稍后再试`);
  } finally {
    fastState.inFlight = Math.max(0, fastState.inFlight - 1);
  }
}

function dispatchFastBatch() {
  const targets = getFastTargets();
  if (!targets.length) {
    message.warning(
      isStarDayMode.value
        ? "请先完成登录并填写星动日权益ID"
        : "请先完成登录并选择权益后再进行高速抢购"
    );
    stopFastBurst();
    return;
  }
  // 单次只发一条，避免频率过高
  const account = targets[fastState.sent % targets.length];
  dispatchFastRequest(account);
}

function handleFastOnce() {
  if (fastState.running) return;
  resetFastState();
  const targets = getFastTargets();
  if (!targets.length) {
    message.warning(
      isStarDayMode.value
        ? "请先完成登录并填写星动日权益ID"
        : "请先完成登录并选择权益后再进行高速抢购"
    );
    return;
  }
  targets.forEach((account) => dispatchFastRequest(account));
  fastState.round = 1;
}

function startFastBurst() {
  stopFastBurst();
  resetFastState();
  const interval = Math.max(5, Math.floor(fastConfig.intervalMs));
  const maxRounds = Math.max(1, Math.floor(fastConfig.maxRounds));
  const targets = getFastTargets();
  if (!targets.length) {
    message.warning(
      isStarDayMode.value
        ? "请先完成登录并填写星动日权益ID"
        : "请先完成登录并选择权益后再进行高速抢购"
    );
    return;
  }
  fastState.running = true;
  fastState.round = 0;
  targets.forEach((account) => {
    const accountId = account.id;
    fastRounds.set(accountId, 0);
    dispatchFastRequest(account);
    fastRounds.set(accountId, 1);
    fastState.round = Math.max(fastState.round, 1);
    const timer = window.setInterval(() => {
      const currentRound = fastRounds.get(accountId) || 0;
      if (currentRound >= maxRounds) {
        const t = fastIntervals.get(accountId);
        if (t) clearInterval(t);
        fastIntervals.delete(accountId);
        fastRounds.delete(accountId);
        if (!fastIntervals.size) {
          fastState.running = false;
        }
        return;
      }
      fastRounds.set(accountId, currentRound + 1);
      fastState.round = Math.max(fastState.round, currentRound + 1);
      dispatchFastRequest(account);
    }, interval);
    fastIntervals.set(accountId, timer);
  });
}

function stopFastBurst() {
  fastIntervals.forEach((timer) => clearInterval(timer));
  fastIntervals.clear();
  fastRounds.clear();
  fastState.running = false;
}

function clearFastLogs() {
  fastLogs.value = [];
  localStorage.removeItem(FAST_LOG_STORAGE_KEY);
}

// 判断是否触发接口限流
function isRateLimited(msg?: string, status?: any) {
  if (status !== undefined && status !== null) {
    const code = String(status);
    if (["-40", "-41", "-42", "-43", "-44"].includes(code)) {
      return true;
    }
  }
  if (!msg) return false;
  return RATE_LIMIT_KEYWORDS.some((keyword) => msg.includes(keyword));
}

// 切换账号的登录模式（短信 / 令牌）
function setAuthMode(account: AccountState, mode: "sms" | "manual") {
  if (account.authMode === mode) return;
  account.authMode = mode;
  if (mode === "manual") {
    account.showLogin = false;
    account.smsSent = false;
    account.code = "";
    account.countdown.reset();
  } else {
    account.manualToken = "";
    account.showLogin = true;
  }
  if (!account.profile) {
    persistAccounts();
  }
}

// 从用户输入的 Cookie 字符串中提取 access_token
function extractAccessToken(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const segments = trimmed
    .split(";")
    .map((segment) => segment.trim())
    .filter(Boolean);
  for (const segment of segments) {
    const equalIndex = segment.indexOf("=");
    if (equalIndex === -1) continue;
    const key = segment.slice(0, equalIndex).trim();
    if (key.toLowerCase() !== "access_token") continue;
    const valueRaw = segment.slice(equalIndex + 1).trim();
    if (!valueRaw) continue;
    try {
      return decodeURIComponent(valueRaw);
    } catch {
      return valueRaw;
    }
  }
  if (trimmed.toLowerCase().startsWith("access_token=")) {
    const value = trimmed.slice("access_token=".length).trim();
    if (value) {
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    }
  }
  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
}

// 格式化家庭圈成员的显示名称
function formatFamilyMember(member: FamilyMember) {
  const displayNumber = member.showFamilyMemNum || member.familyMemNum;
  const name = member.familyMemName ? `（${member.familyMemName}）` : "";
  return `${displayNumber}${name}`;
}

// 获取当前权益列表中的默认权益 ID
function resolveDefaultProductId(list: ProductItem[]) {
  return (
    list.find((item) => item.id === DEFAULT_PRODUCT_ID)?.id ??
    list[0]?.id ??
    null
  );
}

// 始终回退到名创默认权益，避免创建账号或恢复缓存时失效
function getFallbackProductId(list?: ProductItem[]) {
  const sourceList = list ?? products.value;
  return resolveDefaultProductId(sourceList) ?? DEFAULT_PRODUCT_ID;
}

async function refreshFamilyMembers(
  account: AccountState,
  { silent = false, force = false } = {}
) {
  if (!force && account.familyMembers.length) {
    return;
  }
  const token = getAccessToken(account);
  if (!token) {
    account.familyMembers = [];
    if (!silent) {
      message.error("请先登录后再获取家庭圈成员");
    }
    return;
  }
  try {
    account.familyLoading = true;
    const resp = await fetchFamilyMembers(token);
    if (resp.data?.status != 1) {
      if (!silent) {
        message.error(resp.data?.msg || "家庭圈成员获取失败");
      }
      account.familyMembers = [];
    } else {
      const list =
        (resp.data?.data?.familyList as FamilyMember[]) ||
        (Array.isArray(resp.data?.familyList)
          ? (resp.data?.familyList as FamilyMember[])
          : []);
      account.familyMembers = Array.isArray(list) ? list : [];
      if (!account.familyMembers.length && !silent) {
        message.info("未获取到家庭圈成员");
      }
    }
    if (
      account.selectedFamilyId &&
      !account.familyMembers.some(
        (member) => member.familyMemNum === account.selectedFamilyId
      )
    ) {
      account.selectedFamilyId = null;
      persistAccounts();
    }
  } catch (error: any) {
    if (!silent) {
      const msg =
        error?.response?.data?.msg || "家庭圈成员获取失败，请稍后再试";
      message.error(msg);
    }
    account.familyMembers = [];
  } finally {
    account.familyLoading = false;
  }
}

async function handleTransferToggle(
  account: AccountState,
  event: Event
) {
  if (isStarDayMode.value) {
    account.transferEnabled = false;
    account.selectedFamilyId = null;
    persistAccounts();
    return;
  }
  const target = event.target as HTMLInputElement;
  const checked = Boolean(target?.checked);
  account.transferEnabled = checked;
  if (checked) {
    await refreshFamilyMembers(account, { silent: true });
    if (!account.familyMembers.length) {
      message.warning("暂未获取到家庭圈成员，已恢复个人领取");
      account.transferEnabled = false;
      account.selectedFamilyId = null;
    }
  } else {
    account.selectedFamilyId = null;
  }
  persistAccounts();
}

// 选择转赠的家庭成员
function handleFamilySelect(account: AccountState, value?: string) {
  account.selectedFamilyId = value || null;
  persistAccounts();
}

function getAccountPhone(account: AccountState) {
  return account.profile?.phone || account.phone || "";
}

function getAccountLabel(account: AccountState) {
  return getAccountPhone(account) || `账号 ${account.id}`;
}

function createAccount(defaultProductId?: number): AccountState {
  const countdown = useCountdown(60);
  return reactive({
    id: accountId++,
    phone: "",
    code: "",
    sending: false,
    loggingIn: false,
    smsSent: false,
    profile: null as Record<string, any> | null,
    cookies: [] as Record<string, string>[],
    countdown,
    selectedProductId: isStarDayMode.value
      ? null
      : defaultProductId ?? getFallbackProductId(),
    redeeming: false,
    locked: false,
    showLogin: true,
    manualToken: "",
    applyingToken: false,
authMode: "sms",
    transferEnabled: false,
    familyMembers: [] as FamilyMember[],
    familyLoading: false,
    selectedFamilyId: null,
    starDayRedeeming: false,
  }) as AccountState;
}

const accounts = ref<AccountState[]>([createAccount()]);

function serializeAccount(account: AccountState) {
  return {
    id: account.id,
    phone: account.phone,
    selectedProductId: account.selectedProductId,
    cookies: account.cookies,
    locked: account.locked,
    showLogin: account.showLogin,
    authMode: account.authMode,
    transferEnabled: account.transferEnabled,
    selectedFamilyId: account.selectedFamilyId,
  };
}

function persistAccounts() {
  const payload = accounts.value.map((account) => serializeAccount(account));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

// 保存领取日志信息
function persistLogs() {
  localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(redeemLogs.value));
}

// 恢复账号数据
function restoreAccounts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) return;
    accounts.value = parsed.map((item: any) => {
      const countdown = useCountdown(60);
      const locked = false;
      const fallbackProductId = getFallbackProductId();
      const selectedProductId = isStarDayMode.value
        ? null
        : locked
        ? fallbackProductId
        : item.selectedProductId ?? fallbackProductId;
      const state = reactive({
        id: item.id || accountId++,
        phone: item.phone || "",
        code: "",
        sending: false,
        loggingIn: false,
        smsSent: false,
        profile: null as Record<string, any> | null,
        cookies: item.cookies || [],
        countdown,
        selectedProductId,
        redeeming: false,
        locked,
        showLogin:
          typeof item.showLogin === "boolean" ? item.showLogin : true,
        manualToken: "",
        applyingToken: false,
        authMode: item.authMode === "manual" ? "manual" : "sms",
        transferEnabled: Boolean(item.transferEnabled),
        familyMembers: [] as FamilyMember[],
        familyLoading: false,
        selectedFamilyId: item.selectedFamilyId || null,
        starDayRedeeming: false,
      }) as AccountState;
      return state;
    });
    if (accounts.value.length) {
      accountId = Math.max(...accounts.value.map((x) => x.id)) + 1;
    }
  } catch (error) {
    console.warn("[storage] restore error", error);
  }
}

// 恢复领取日志数据
function restoreLogs() {
  try {
    const raw = localStorage.getItem(LOG_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      redeemLogs.value = parsed;
    }
  } catch (error) {
    console.warn("[logs] restore error", error);
  }
}

// 新增一个登录账号卡片
function addAccount(defaultProductId?: number) {
  const initialProductId = isStarDayMode.value
    ? undefined
    : defaultProductId ?? getFallbackProductId();
  accounts.value.unshift(createAccount(initialProductId));
  message.info("已新增账号卡片");
  persistAccounts();
}

// 删除指定账号
function removeAccount(id: number) {
  accounts.value = accounts.value.filter((item) => item.id !== id);
  message.success("已移除账号卡片");
  persistAccounts();
}

function confirmRemoveAccount(account: AccountState) {
  const label = getAccountLabel(account);
  AModal.confirm({
    title: "确认移除账号",
    content: `确定要移除 ${label} 吗？移除后需要重新登录。`,
    okText: "确认移除",
    cancelText: "取消",
    onOk: () => removeAccount(account.id),
  });
}

// 获取验证码按钮倒计时剩余秒数
function remainingSeconds(account: AccountState) {
  return account.countdown.seconds.value;
}

// 校验手机号格式
function isPhoneValid(account: AccountState) {
  return PHONE_REGEX.test(account.phone);
}

// 校验验证码长度
function isCodeValid(account: AccountState) {
  return account.code.length === 6;
}

// 从 cookie 列表中读取 access_token
function getAccessToken(account: AccountState) {
  const tokenItem = account.cookies.find((item) => item.access_token);
  return tokenItem?.access_token || "";
}

// 拼接用于复制的 token 文本
function getTokenText(account: AccountState) {
  const token = getAccessToken(account);
  return token ? `access_token=${token}` : "";
}

// 校验短信登录按钮是否可用
function canSubmit(account: AccountState) {
  return (
    isPhoneValid(account) &&
    isCodeValid(account) &&
    account.smsSent &&
    !account.loggingIn
  );
}

// 判断领取按钮是否可用
// 判断领取按钮是否可用
function canRedeem(account: AccountState) {
  return (
    !isStarDayMode.value &&
    Boolean(getAccessToken(account)) &&
    Boolean(account.selectedProductId) &&
    Boolean(account.profile) &&
    (!account.transferEnabled || Boolean(account.selectedFamilyId))
  );
}

function canRedeemStarDay(account: AccountState) {
  return (
    Boolean(getAccessToken(account)) &&
    Boolean(account.profile) &&
    Boolean(starDayProductId.value.trim()) &&
    !account.starDayRedeeming &&
    !starDayBulkRedeeming.value
  );
}

function getFastTargets() {
  return accounts.value.filter((account) =>
    isStarDayMode.value ? canRedeemStarDay(account) : canRedeem(account)
  );
}

// 发送短信验证码请求
async function handleSendSms(account: AccountState) {
  if (!isPhoneValid(account)) {
    message.error("请输入正确的中国移动手机号");
    return;
  }
  try {
    account.sending = true;
    await sendSmsCode(account.phone);
    account.smsSent = true;
    account.countdown.reset();
    account.countdown.start();
    message.success("验证码已发送");
    console.log("[sms-send-success]", dayjs().format("YYYY-MM-DD HH:mm:ss"));
  } catch (error: any) {
    const msg = error?.response?.data?.msg || "验证码发送失败，请稍后重试";
    message.error(msg);
    account.countdown.reset();
    account.smsSent = false;
  } finally {
    account.sending = false;
  }
}

async function handleLogin(account: AccountState) {
  if (!canSubmit(account)) {
    message.error("请填写正确的手机号并输入验证码");
    return;
  }
  try {
    account.loggingIn = true;
    const resp = await smsLogin(account.phone, account.code);
    if (resp.data?.status == 1) {
      account.cookies = resp.data?.cookies || [];
      account.smsSent = false;
      account.countdown.reset();
      const token = getAccessToken(account);
      if (token) {
        const profileResp = await fetchUserProfile(token);
        account.profile = profileResp.data?.data || null;
      } else {
        account.profile = null;
        message.warning("登录成功，但未获取到 access_token");
      }
      message.success("登录成功");
      if (account.transferEnabled) {
        await refreshFamilyMembers(account, { silent: true, force: true });
      }
    } else {
      account.cookies = [];
      const msg = resp.data?.msg || "登录失败，请检查验证码";
      message.error(msg);
    }
    persistAccounts();
  } catch (error: any) {
    account.cookies = [];
    const msg = error?.response?.data?.msg || "登录异常，请稍后重试";
    message.error(msg);
  } finally {
    account.loggingIn = false;
  }
}

async function handleManualToken(account: AccountState) {
  const rawInput = account.manualToken.trim();
  account.manualToken = rawInput;
  if (account.authMode !== "manual" || account.profile) {
    message.info("请先切换到令牌登录模式");
    return;
  }
  const accessToken = extractAccessToken(rawInput);
  if (!accessToken) {
    message.error("未解析到有效的 access_token");
    return;
  }
  try {
    account.applyingToken = true;
    const resp = await applyManualToken(accessToken);
    if (resp.data?.status == 1) {
      const cookies =
        resp.data?.cookies && resp.data.cookies.length
          ? resp.data.cookies
          : [{ access_token: accessToken }];
      account.cookies = cookies;
      account.smsSent = false;
      account.countdown.reset();
      const token = getAccessToken(account);
      if (token) {
        const profileResp = await fetchUserProfile(token);
        if (profileResp.data?.data) {
          account.profile = profileResp.data.data;
          message.success("凭证验证成功");
        } else {
          account.profile = null;
          const msg =
            profileResp.data?.msg || "凭证已设置，获取用户信息失败";
          message.warning(msg);
        }
      } else {
        account.profile = null;
        message.warning("未能解析到 access_token");
      }
      account.showLogin = false;
      if (account.transferEnabled) {
        await refreshFamilyMembers(account, { silent: true, force: true });
      }
      persistAccounts();
    } else {
      const msg = resp.data?.msg || "凭证设置失败";
      message.error(msg);
    }
  } catch (error: any) {
    const msg =
      error?.response?.data?.msg || "凭证设置异常，请稍后重试";
    message.error(msg);
  } finally {
    account.applyingToken = false;
  }
}

type RedeemAttemptResult = {
  success: boolean;
  msg: string;
  account: AccountState;
  rateLimited: boolean;
  product?: ProductItem;
  status?: any;
};

type RedeemFinalResult = RedeemAttemptResult & {
  attempts: number;
};

// 发起一次权益领取请求（自动拼接转赠参数）
async function redeemAccountOnce(
  account: AccountState
): Promise<RedeemAttemptResult> {
  const token = getAccessToken(account);
  if (!token) {
    return {
      success: false,
      msg: "请先登录后再领取",
      account,
      rateLimited: false,
    };
  }
  const product = products.value.find(
    (item) => item.id === account.selectedProductId
  );
  if (!product) {
    return {
      success: false,
      msg: "请选择有效的权益",
      account,
      rateLimited: false,
    };
  }
  if (account.transferEnabled && !account.selectedFamilyId) {
    return {
      success: false,
      msg: "请先选择转赠的家庭圈成员",
      account,
      rateLimited: false,
      product,
    };
  }
  try {
    const resp = await redeemProduct({
      productId: product.id,
      isRandom: product.isRandom ? 1 : 0,
      sourece: 1,
      receivePhone:
        account.transferEnabled && account.selectedFamilyId
          ? account.selectedFamilyId
          : "",
    }, token);
    const status = resp.data?.status;
    const success = status == 1;
    const msg =
      resp.data?.msg || (success ? "领取成功" : "领取失败，请稍后再试");
    return {
      success,
      msg,
      account,
      rateLimited: !success && isRateLimited(msg, status),
      product,
      status,
    };
  } catch (error: any) {
    const msg =
      error?.response?.data?.msg || "权益领取失败，请稍后再试";
    return {
      success: false,
      msg,
      account,
      rateLimited: isRateLimited(msg),
      product,
    };
  }
}

async function redeemStarDayAccountOnce(
  account: AccountState
): Promise<RedeemAttemptResult> {
  const token = getAccessToken(account);
  const availability = getStarDayAvailability(account);
  const productId = starDayProductId.value.trim();
  const product = {
    id: Number(productId) || 0,
    qyName: `星动日权益 ID ${productId}`,
    stock: 0,
    transferable: 0,
    levelable: "",
    phase: "star-day",
    isRandom: false,
    status: 0,
  } as ProductItem;

  if (!token || !availability.available) {
    return {
      success: false,
      msg: availability.msg,
      account,
      rateLimited: false,
      product,
    };
  }

  try {
    const numericProductId = Number(productId);
    const resp = await redeemStarDayProduct({ productId: numericProductId }, token);
    const status = resp.data?.status;
    const success = status == 1;
    const msg =
      resp.data?.msg || (success ? "星动日权益领取成功" : "星动日权益领取失败");
    return {
      success,
      msg,
      account,
      rateLimited: !success && isRateLimited(msg, status),
      product,
      status,
    };
  } catch (error: any) {
    const msg =
      error?.response?.data?.msg || "星动日权益领取失败，请稍后再试";
    return {
      success: false,
      msg,
      account,
      rateLimited: isRateLimited(msg),
      product,
    };
  }
}

async function redeemStarDayWithRetry(
  account: AccountState,
  options: { silent?: boolean } = {}
): Promise<RedeemFinalResult> {
  const { silent = false } = options;
  const phoneLabel = account.phone || `账号 ${account.id}`;
  let attempts = 0;
  let result: RedeemAttemptResult = {
    success: false,
    msg: "未满足星动日领取条件",
    account,
    rateLimited: false,
  };
  const availability = getStarDayAvailability(account);
  if (!availability.available) {
    if (!silent) message.warning(availability.msg);
    return { ...result, msg: availability.msg, attempts };
  }

  account.starDayRedeeming = true;
  try {
    do {
      attempts += 1;
      result = await redeemStarDayAccountOnce(account);
      if (!result.rateLimited || attempts >= MAX_REDEEM_RETRY) {
        break;
      }
      if (!silent) {
        message.warning(
          `${phoneLabel}：${result.msg || "请求频繁"}，准备重试 (${attempts}/${MAX_REDEEM_RETRY})`
        );
      }
      await wait(
        RETRY_BASE_DELAY + Math.random() * RETRY_RANDOM_DELAY
      );
    } while (attempts < MAX_REDEEM_RETRY);
  } finally {
    account.starDayRedeeming = false;
  }

  const baseMsg =
    result.msg || (result.success ? "星动日权益领取成功" : "星动日权益领取失败");
  const logMsg =
    attempts > 1 ? `${baseMsg}（共尝试${attempts}次）` : baseMsg;
  appendRedeemLog(account, result.product, result.success, logMsg);
  persistAccounts();

  if (!silent) {
    if (result.success) {
      message.success(`${getAccountLabel(account)}：${baseMsg}`);
    } else if (result.rateLimited) {
      message.warning(`${getAccountLabel(account)}：${baseMsg}`);
    } else {
      message.error(`${getAccountLabel(account)}：${baseMsg}`);
    }
  }

  return {
    ...result,
    msg: baseMsg,
    attempts,
    product: result.product,
  };
}

// 对单个账号执行领取并带重试策略
async function redeemWithRetry(
  account: AccountState,
  options: { silent?: boolean } = {}
): Promise<RedeemFinalResult> {
  const { silent = false } = options;
  const phoneLabel = account.phone || `账号 ${account.id}`;
  let attempts = 0;
  let result: RedeemAttemptResult = {
    success: false,
    msg: "请选择有效的权益",
    account,
    rateLimited: false,
  };

  if (!canRedeem(account)) {
    if (!silent) message.error("请先登录并选择要领取的权益");
    return { ...result, msg: "未满足领取条件", attempts };
  }

  account.redeeming = true;
  try {
    do {
      attempts += 1;
      result = await redeemAccountOnce(account);
      if (!result.rateLimited || attempts >= MAX_REDEEM_RETRY) {
        break;
      }
      if (!silent) {
        message.warning(
          `${phoneLabel}：${result.msg || "请求频繁"}，准备重试 (${attempts}/${MAX_REDEEM_RETRY})`
        );
      }
      await wait(
        RETRY_BASE_DELAY + Math.random() * RETRY_RANDOM_DELAY
      );
    } while (attempts < MAX_REDEEM_RETRY);
  } finally {
    account.redeeming = false;
  }

  const product =
    result.product ||
    products.value.find((item) => item.id === account.selectedProductId);

  const memberLabel =
    account.transferEnabled && account.selectedFamilyId
      ? (() => {
          const member =
            account.familyMembers.find(
              (item) => item.familyMemNum === account.selectedFamilyId
            ) ||
            ({
              familyMemNum: account.selectedFamilyId,
              showFamilyMemNum: account.selectedFamilyId,
              familyMemName: "",
            } as FamilyMember);
          return `（转赠给 ${formatFamilyMember(member)}）`;
        })()
      : "";
  const baseMsg =
    result.msg || (result.success ? "领取成功" : "领取失败，请稍后再试");
  const finalMsg = `${baseMsg}${memberLabel}`;
  const logMsg =
    attempts > 1 ? `${finalMsg}（共尝试${attempts}次）` : finalMsg;

  appendRedeemLog(account, product, result.success, logMsg);
  persistAccounts();

  if (!silent) {
    if (result.success) {
      message.success(`${getAccountLabel(account)}：${finalMsg}`);
    } else if (result.rateLimited) {
      message.warning(`${getAccountLabel(account)}：${finalMsg}`);
    } else {
      message.error(`${getAccountLabel(account)}：${finalMsg}`);
    }
  }

  const finalResult: RedeemFinalResult = {
    ...result,
    msg: finalMsg,
    attempts,
    product,
  };
  return finalResult;
}

// 单个账号领取入口
async function handleStarDayRedeem(account: AccountState) {
  persistStarDayProductId();
  await redeemStarDayWithRetry(account);
}

async function handleRedeem(account: AccountState) {
  if (isStarDayMode.value) {
    await handleStarDayRedeem(account);
    return;
  }
  if (!canRedeem(account)) {
    if (account.transferEnabled && !account.selectedFamilyId) {
      message.error("请选择要转赠的家庭圈成员");
    } else {
      message.error("请先登录并选择要领取的权益");
    }
    return;
  }
  const confirmed = await confirmNonDefaultProduct(account);
  if (!confirmed) {
    message.info("已取消领取操作");
    return;
  }
  await redeemWithRetry(account);
}

// 一键领取入口（并发模式）
// 一键领取入口（并发模式）
async function handleBulkRedeem() {
  if (isStarDayMode.value) {
    await handleBulkStarDayRedeem();
    return;
  }
  const targets = accounts.value.filter((account) => canRedeem(account));
  if (!targets.length) {
    message.info("请先完成登录并选择权益");
    closeSettingsMenu();
    return;
  }
  const bulkConfirmed = await confirmBulkNonDefaultProducts(targets);
  if (!bulkConfirmed) {
    message.info("已取消批量领取");
    closeSettingsMenu();
    return;
  }
  message.loading({
    content: "批量领取中...",
    key: "bulk-redeem",
    duration: 0,
  });
  const tasks = targets.map((account, index) =>
    (async () => {
      if (index > 0 && BULK_REDEEM_GAP > 0) {
        await wait(BULK_REDEEM_GAP + Math.random() * BULK_REDEEM_JITTER);
      }
      return redeemWithRetry(account, { silent: true });
    })()
  );
  const results = await Promise.all(tasks);
  closeSettingsMenu();
  message.destroy("bulk-redeem");
  results.forEach((result) => {
    const account = result.account;
    const phone = getAccountLabel(account);
    const attemptsText =
      result.attempts && result.attempts > 1
        ? `（尝试${result.attempts}次）`
        : "";
    if (result.success) {
      message.success(`${phone}：${result.msg}${attemptsText}`);
    } else if (result.rateLimited) {
      message.warning(`${phone}：${result.msg}${attemptsText}`);
    } else {
      message.error(`${phone}：${result.msg}${attemptsText}`);
    }
  });
  persistAccounts();
}

async function handleBulkStarDayRedeem() {
  persistStarDayProductId();
  const targets = accounts.value.filter((account) => canRedeemStarDay(account));
  if (!targets.length) {
    message.info("请先完成登录并填写星动日权益ID");
    closeSettingsMenu();
    return;
  }
  const unavailable = targets.filter(
    (account) => !getStarDayAvailability(account).available
  );
  if (unavailable.length) {
    const account = unavailable[0];
    message.warning(
      `${getAccountLabel(account)}：${getStarDayAvailability(account).msg}`
    );
    closeSettingsMenu();
    return;
  }

  starDayBulkRedeeming.value = true;
  message.loading({
    content: "星动日批量领取中...",
    key: "bulk-star-day-redeem",
    duration: 0,
  });
  try {
    const tasks = targets.map((account, index) =>
      (async () => {
        if (index > 0 && BULK_REDEEM_GAP > 0) {
          await wait(BULK_REDEEM_GAP + Math.random() * BULK_REDEEM_JITTER);
        }
        return redeemStarDayWithRetry(account, { silent: true });
      })()
    );
    const results = await Promise.all(tasks);
    results.forEach((result) => {
      const account = result.account;
      const phone = getAccountLabel(account);
      const attemptsText =
        result.attempts && result.attempts > 1
          ? `（尝试${result.attempts}次）`
          : "";
      if (result.success) {
        message.success(`${phone}：${result.msg}${attemptsText}`);
      } else if (result.rateLimited) {
        message.warning(`${phone}：${result.msg}${attemptsText}`);
      } else {
        message.error(`${phone}：${result.msg}${attemptsText}`);
      }
    });
  } finally {
    message.destroy("bulk-star-day-redeem");
    starDayBulkRedeeming.value = false;
    closeSettingsMenu();
  }
}

// 写入领取日志记录
function appendRedeemLog(
  account: AccountState,
  product: ProductItem | undefined,
  success: boolean,
  msg: string
) {
  const entry = {
    id: account.id,
    phone: getAccountLabel(account),
    productName: product?.qyName || "",
    success,
    msg,
    time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  };
  redeemLogs.value.unshift(entry);
  redeemLogs.value = redeemLogs.value.slice(0, 100);
  persistLogs();
}

// 清除所有领取日志
function clearLogs() {
  redeemLogs.value = [];
  persistLogs();
  message.success("已清空领取日志");
}

// 降级复制实现，兼容旧环境
function legacyCopy(text: string) {
  const input = document.createElement("input");
  input.value = text;
  input.style.position = "absolute";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, text.length);
  const success = document.execCommand("copy");
  document.body.removeChild(input);
  return success;
}

function confirmNonDefaultProduct(account: AccountState) {
  if (
    !account.selectedProductId ||
    account.selectedProductId === DEFAULT_PRODUCT_ID
  ) {
    return Promise.resolve(true);
  }
  const label = getAccountLabel(account);
  return new Promise<boolean>((resolve) => {
    AModal.confirm({
      title: "确认领取非名创优品权益",
      content: `${label} 当前选择的权益不是名创优品（ID 3442），是否继续领取？`,
      okText: "继续领取",
      cancelText: "取消",
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
}

function confirmBulkNonDefaultProducts(targets: AccountState[]) {
  const nonDefault = targets.filter(
    (account) =>
      account.selectedProductId && account.selectedProductId !== DEFAULT_PRODUCT_ID
  );
  if (!nonDefault.length) {
    return Promise.resolve(true);
  }
  const names = nonDefault
    .slice(0, 5)
    .map((account) => getAccountLabel(account))
    .join("、");
  const extra =
    nonDefault.length > 5 ? ` 等 ${nonDefault.length} 个账号` : "";
  return new Promise<boolean>((resolve) => {
    AModal.confirm({
      title: "确认批量领取非名创优品权益",
      content: `以下账号选择的权益不是名创优品（ID 3442）：${names}${extra}，是否继续批量领取？`,
      okText: "继续领取",
      cancelText: "取消",
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
}

// 复制 access_token 到剪贴板
async function copyToken(account: AccountState) {
  const tokenText = getTokenText(account);
  if (!tokenText) return;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(tokenText);
    } else {
      const ok = legacyCopy(tokenText);
      if (!ok) throw new Error("fallback failed");
    }
    message.success("复制成功");
    persistAccounts();
  } catch (error) {
    message.error("复制失败，请手动复制");
  }
}

// 清除所有账号缓存并重置
function clearCache() {
  localStorage.removeItem(STORAGE_KEY);
  accounts.value = [createAccount(getFallbackProductId())];
  message.success("已清除本地缓存");
  clearFastLogs();
  closeSettingsMenu();
}

// 展示/隐藏领取日志面板
function toggleLogs() {
  showLogs.value = !showLogs.value;
  if (showLogs.value) {
    closeSettingsMenu();
  }
}

async function loadProductsByPhase(phase: string) {
  if (productGroups.value[phase]) {
    products.value = productGroups.value[phase];
    return;
  }
  try {
    loadingProducts.value = true;
    const resp = await fetchProducts(phase);
    if (resp.data?.status == 1) {
      const list = resp.data?.data?.prodList || [];
      console.log(list);
      productGroups.value[phase] = list;
      products.value = list;
    } else {
      message.error(resp.data?.msg || `权益列表(${phase})获取失败`);
      products.value = [];
    }
  } catch (error) {
    message.error("权益列表获取失败，请稍后再试");
    products.value = [];
  } finally {
    loadingProducts.value = false;
  }
}

onMounted(async () => {
  starDayProductId.value = getStoredStarDayProductId();
  restoreAccounts();
  restoreLogs();
  restoreFastSettings();
  restoreFastLogs();
  nowTimer = window.setInterval(tickNow, 50);
  syncTime();
  if (!isStarDayMode.value) {
    await loadProductsByPhase(currentPhase.value);
  }
  const defaultId = getFallbackProductId(products.value);
  accounts.value.forEach((account) => {
    if (isStarDayMode.value) {
      account.selectedProductId = null;
      account.transferEnabled = false;
      account.selectedFamilyId = null;
    } else if (!account.selectedProductId && defaultId) {
      account.selectedProductId = defaultId;
    }
  });
  try {
    await Promise.all(
      accounts.value.map(async (account) => {
        const token = getAccessToken(account);
        if (!token) {
          account.profile = null;
          return;
        }
        try {
          const profileResp = await fetchUserProfile(token);
          account.profile = profileResp.data?.data || null;
        } catch (error) {
          console.warn("[auto-profile-token]", error);
        }
        if (account.transferEnabled) {
          await refreshFamilyMembers(account, { silent: true });
        }
      })
    );
  } catch (error) {
    console.warn("[auto-profile-token]", error);
  }
});

onBeforeUnmount(() => {
  fastIntervals.forEach((timer) => clearInterval(timer));
  fastIntervals.clear();
  fastRounds.clear();
  if (nowTimer) {
    clearInterval(nowTimer);
    nowTimer = null;
  }
});

// 权益数据更新时，补齐账号的默认权益
watch(products, (list) => {
  if (isStarDayMode.value) {
    accounts.value.forEach((account) => {
      account.selectedProductId = null;
      account.transferEnabled = false;
      account.selectedFamilyId = null;
    });
    persistAccounts();
    return;
  }
  if (!list.length) return;
  const defaultId = resolveDefaultProductId(list);
  accounts.value.forEach((account) => {
    const exists = list.some((item) => item.id === account.selectedProductId);
    if (!exists) {
      account.selectedProductId = defaultId;
    }
  });
  persistAccounts();
});

watch(
  () => ({
    intervalMs: fastConfig.intervalMs,
    maxRounds: fastConfig.maxRounds,
    batchSize: 1,
  }),
  () => persistFastSettings(),
  { deep: true }
);

// 监听 token 变化，自动刷新用户信息与家庭圈
watch(
  () => accounts.value.map((account) => getAccessToken(account)),
  async () => {
    await Promise.all(
      accounts.value.map(async (account) => {
        const token = getAccessToken(account);
        if (!token) {
          account.profile = null;
          return;
        }
        try {
          const profileResp = await fetchUserProfile(token);
          account.profile = profileResp.data?.data || null;
          if (account.transferEnabled && account.profile) {
            await refreshFamilyMembers(account, { silent: true });
          }
        } catch (error) {
          console.warn("[auto-profile-token]", error);
        }
      })
    );
  }
);

// 供权益类型下拉使用的选项列表
const phaseOptions = computed(() =>
  PRODUCT_PHASE_LIST.map((phase) => ({
    value: phase,
    label: PRODUCT_PHASE_LABEL[phase],
  }))
);

// 当前分类下的权益列表
const filteredProductsByPhase = computed(() => {
  const phase = currentPhase.value;
  return productGroups.value[phase] || [];
});

// 结构化权益选项（预留给后续扩展）
const groupedOptions = computed(() => {
  return [
    {
      phase: currentPhase.value,
      label: PRODUCT_PHASE_LABEL[currentPhase.value] || "权益",
      items: filteredProductsByPhase.value,
    },
  ];
});

watch(currentPhase, (phase) => {
  if (isStarDayMode.value) {
    return;
  }
  loadProductsByPhase(phase).then(() => {
    const list = productGroups.value[phase] || [];
    const defaultId = resolveDefaultProductId(list);
    accounts.value.forEach((account) => {
      const exists = list.some(
        (item) => item.id === account.selectedProductId
      );
      if (!exists) {
        account.selectedProductId = defaultId;
      }
    });
    persistAccounts();
  });
});

const loggedInCount = computed(() =>
  accounts.value.filter((account) => Boolean(getAccessToken(account))).length
);

const selectableCount = computed(() =>
  accounts.value.filter((account) => canRedeem(account)).length
);

const starDaySelectableCount = computed(() =>
  accounts.value.filter((account) => canRedeemStarDay(account)).length
);

const starDayHint = computed(() => {
  const account = accounts.value.find((item) => item.profile);
  if (account) {
    return `当前示例账号网龄${account.profile?.netAge ?? "-"}，点击即发送领取请求`;
  }
  return "登录后点击即发送领取请求";
});

const fastLogStatusMap: Record<
  NonNullable<FastLogEntry["status"]>,
  { label: string; className: string }
> = {
  pending: { label: "进行中", className: "pending" },
  success: { label: "成功", className: "success" },
  fail: { label: "失败", className: "danger" },
};

const mappedFastLogs = computed(() =>
  fastLogs.value.map((log) => {
    const map = log.status ? fastLogStatusMap[log.status] : fastLogStatusMap.pending;
    return {
      ...log,
      statusLabel: map.label,
      statusClass: map.className,
    };
  })
);

const accountLogList = computed(() => {
  if (!activeLogAccountId.value) return [];
  return mappedFastLogs.value.filter((log) => log.accountId === activeLogAccountId.value);
});

const accountLogTitle = computed(() => {
  const first = accountLogList.value[0];
  return first ? `账号日志 - ${first.accountLabel}` : "账号日志";
});

// 用户切换权益分类时的处理逻辑
async function handlePhaseChange(value: string) {
  if (isStarDayMode.value) return;
  if (currentPhase.value === value) return;
  currentPhase.value = value;
  await loadProductsByPhase(value);
  const list = productGroups.value[value] || [];
  const defaultId = resolveDefaultProductId(list);
  accounts.value.forEach((account) => {
    const exists = list.some(
      (item) => item.id === account.selectedProductId
    );
    if (!exists) {
      account.selectedProductId = defaultId;
    }
  });
  persistAccounts();
}

// 手动指定权益时更新账号配置
function handleProductChange(account: AccountState, value: number) {
  if (isStarDayMode.value) {
    account.selectedProductId = null;
    persistAccounts();
    return;
  }
  account.selectedProductId = value;
  persistAccounts();
}

function openAccountLogs(account: AccountState) {
  activeLogAccountId.value = account.id;
  showAccountLogs.value = true;
}

// 权益下拉搜索过滤
function filterProductOption(input: string, option: any) {
  const text = option?.label || option?.children || "";
  return text.toLowerCase().includes(input.toLowerCase());
}

watch(
  () => accounts.value.map((account) => getAccessToken(account)),
  async () => {
    await Promise.all(
      accounts.value.map(async (account) => {
        const token = getAccessToken(account);
        if (!token) {
          account.profile = null;
          return;
        }
        try {
          const profileResp = await fetchUserProfile(token);
          account.profile = profileResp.data?.data || null;
        } catch (error) {
          console.warn("[auto-profile-token]", error);
        }
      })
    );
  }
);
</script>

<style scoped>
.page {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
}

.page-inner {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 96px;
}

.page-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 16px 0;
}

.fast-console {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 14px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
}

.star-day-card {
  display: grid;
  grid-template-columns: minmax(180px, 260px) 1fr auto;
  gap: 12px;
  align-items: end;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 10px 24px rgba(194, 65, 12, 0.08);
}

.star-day-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.star-day-field label,
.star-day-meta strong {
  font-weight: 800;
  color: #7c2d12;
}

.star-day-field input {
  height: 42px;
  border: 1px solid #fdba74;
  border-radius: 10px;
  padding: 0 12px;
  background: #fff;
}

.star-day-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #9a3412;
}

.star-day-bulk {
  min-height: 42px;
  border: none;
  border-radius: 10px;
  padding: 0 16px;
  background: #ea580c;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
}

.star-day-bulk:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.star-day-account {
  justify-content: center;
}

.redeem-btn.star {
  background: linear-gradient(135deg, #f97316, #dc2626);
}

.fast-left h2 {
  margin: 0;
}
.fast-eyebrow {
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 4px;
  color: #6366f1;
  font-weight: 700;
}
.fast-note {
  margin: 6px 0;
  color: #475569;
}
.fast-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.fast-actions .action-btn {
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.fast-actions .action-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 20px rgba(79, 70, 229, 0.14);
}
.fast-actions .action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
.fast-actions .primary {
  background: #4f46e5;
  color: #fff;
}
.fast-actions .ghost {
  background: #fff;
  border: 1px solid #cbd5e1;
  color: #0f172a;
}
.fast-right {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.fast-settings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}
.fast-settings label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-weight: 600;
  color: #334155;
}
.fast-settings input {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
}
.fast-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.fast-buttons button {
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.fast-buttons button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 20px rgba(79, 70, 229, 0.14);
}
.fast-buttons .primary {
  background: #4f46e5;
  color: #fff;
}
.fast-buttons .accent {
  background: #0ea5e9;
  color: #fff;
}
.fast-buttons .ghost {
  background: #fff;
  border: 1px solid #cbd5e1;
  color: #0f172a;
}
.fast-buttons button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
.fast-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}
.fast-stats div {
  background: #f8fafc;
  padding: 10px;
  border-radius: 10px;
}
.fast-stats span {
  display: block;
  color: #475569;
  font-size: 12px;
}
.fast-stats strong {
  font-size: 18px;
}
.fast-stats .success {
  color: #10b981;
}
.fast-stats .danger {
  color: #ef4444;
}
.fast-log-panel {
  margin-top: 14px;
  background: #fff;
  border-radius: 14px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}
.fast-log-head h3 {
  margin: 0 0 6px;
}
.fast-log-head p {
  margin: 0;
  color: #475569;
}
.fast-log-tip {
  margin: 8px 0 0;
  color: #475569;
}
.fast-log-list {
  max-height: 260px;
  overflow: auto;
  margin-top: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
}
.fast-log-item {
  display: flex;
  gap: 10px;
  padding: 8px 12px;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}
.fast-log-item:last-child {
  border-bottom: none;
}
.fast-log-item .log-time {
  font-family: "SFMono-Regular", Consolas, monospace;
  color: #0f172a;
}
.fast-log-item .log-account {
  color: #0f172a;
  font-weight: 600;
}
.fast-log-item .log-status {
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 700;
}
.fast-log-item .log-status.success {
  background: #dcfce7;
  color: #15803d;
}
.fast-log-item .log-status.pending {
  background: #e0f2fe;
  color: #0369a1;
}
.fast-log-item .log-status.danger {
  background: #fee2e2;
  color: #b91c1c;
}
.fast-log-item .log-meta {
  color: #475569;
  font-size: 12px;
}
.fast-log-item .log-msg {
  color: #b91c1c;
  font-size: 12px;
}
.fast-log-empty {
  color: #94a3b8;
  text-align: center;
}

.settings-btn {
  border: none;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.settings-btn:hover {
  transform: translateY(-1px);
}

.settings-icon {
  font-size: 16px;
}

button.ghost {
  background: #fff;
  border: 1px solid #cbd5e1;
  color: #0f172a;
}
button.primary {
  background: #4f46e5;
  color: #fff;
}
.view-log-btn {
  border: none;
  background: #eef2ff;
  color: #4f46e5;
  padding: 6px 10px;
  border-radius: 8px;
  margin-left: 8px;
  cursor: pointer;
  font-weight: 600;
}

.redeem-label {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #a0844a;
  white-space: nowrap;
}
.settings-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(235, 209, 168, 0.35);
  padding: 10px;
}
.settings-menu a-menu-item {
  cursor: pointer;
  list-style: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.settings-menu a-menu-item:hover {
  background: rgba(243, 224, 186, 0.35);
}

.card-list {
  display: grid;
  gap: 14px;
  flex: 1;
  align-content: start;
}

.login-card {
  position: relative;
  padding: 16px 18px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 12px 26px rgba(218, 189, 126, 0.14);
  border: 1px solid rgba(235, 209, 168, 0.25);
  display: grid;
  gap: 12px;
}

.row {
  display: grid;
  gap: 10px;
}

.row-login {
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr) auto;
  align-items: center;
}

.row-control {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
}

.control-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.mode-switch {
  display: inline-flex;
  padding: 4px;
  gap: 4px;
}

.mode-btn {
  border: none;
  padding: 4px 12px;
  border-radius: 999px;
  background: transparent;
  color: #9b772e;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.mode-btn.active {
  background: linear-gradient(90deg, #fbe7a1 0%, #f1cd60 100%);
  color: #704f00;
  box-shadow: 0 6px 14px rgba(231, 198, 124, 0.35);
}

.mode-btn:hover:not(.active) {
  background: rgba(243, 224, 186, 0.6);
}

.manual-indicator {
  font-size: 12px;
  color: #a0844a;
}

.login-status {
  font-size: 12px;
  color: #2f9a5a;
  background: rgba(58, 168, 106, 0.12);
  padding: 4px 10px;
  border-radius: 999px;
}

.row-bottom {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  align-items: center;
}

.row-bottom .cell:only-child {
  grid-column: 1 / -1;
}

.cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cell input[type="tel"],
.cell input[type="text"] {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e8d9bb;
  background: #fff;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.cell input:focus {
  border-color: #ecc77a;
  box-shadow: 0 0 0 2px rgba(238, 205, 134, 0.35);
}

.sms-group {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 108px;
  gap: 8px;
  align-items: center;
}

.sms-group button {
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #fbe7a1 0%, #f1cd60 100%);
  color: #704f00;
  font-weight: 600;
  padding: 0 10px;
  height: 32px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.sms-group button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.collapse-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: none;
  color: #9b772e;
  font-size: 13px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.collapse-btn:hover {
  background: rgba(243, 224, 186, 0.35);
}

.collapse-icon {
  font-size: 12px;
}


.account-label {
  font-size: 12px;
  color: #a0844a;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.actions button {
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #fbe7a1 0%, #f1cd60 100%);
  color: #704f00;
  font-weight: 600;
  padding: 0 16px;
  height: 34px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  box-shadow: 0 8px 16px rgba(231, 198, 124, 0.24);
}

.actions button:first-child:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.remove-btn {
  position: absolute;
  right: 0;
  top: 0;
  border: none !important;
  width: 28px !important;
  height: 28px !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: none !important;
  background: rgba(244, 219, 173, 0.28) !important;
  color: #704f00 !important;
  border-radius: 8px !important;
  padding: 0 !important;
}

.remove-btn svg {
  width: 14px;
  height: 14px;
}

.token-box {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 110px;
  gap: 8px;
}

.product-select {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.product-select-box {
  width: 100%;
}

.transfer-wrapper {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.transfer-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.transfer-toggle {
  width: 100%;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #a0844a;
}

.transfer-toggle input {
  accent-color: #e5b972;
}

.family-refresh {
  width: 100%;
  border: none;
  border-radius: 999px;
  padding: 0 12px;
  height: 30px;
  background: linear-gradient(90deg, #f7e2a7 0%, #ecc56f 100%);
  color: #704f00;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 10px 18px rgba(243, 184, 109, 0.18);
}

.family-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.family-select {
  width: 100%;
}

.family-tip {
  margin: 0;
  font-size: 11px;
  color: #b19963;
}

.lock-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #a0844a;
  white-space: nowrap;
}

.lock-toggle input {
  accent-color: #e5b972;
}

.redeem-btn {
  width: 100%;
  border: none;
  border-radius: 999px;
  background: linear-gradient(90deg, #ffd7a9 0%, #f4b76c 100%);
  color: #704f00;
  font-weight: 600;
  padding: 0 14px;
  height: 32px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  box-shadow: 0 10px 20px rgba(243, 184, 109, 0.22);
}

.redeem-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 16px 26px rgba(243, 184, 109, 0.35);
}

.redeem-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.manual-token-cell .manual-token-box {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 110px;
  gap: 8px;
  align-items: center;
}

.manual-token-cell input {
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid #e8d9bb;
  background: #fffdfa;
  font-size: 13px;
}

.manual-token-cell button {
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #fbe7a1 0%, #f1cd60 100%);
  color: #704f00;
  font-weight: 600;
  padding: 0 12px;
  height: 32px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.manual-token-cell button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.manual-token-tip {
  margin: 0;
  font-size: 11px;
  color: #b19963;
}

.token-input {
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid #f1d27a;
  background: rgba(255, 249, 230, 0.9);
  color: #8a661d;
  font-size: 13px;
  outline: none;
}

.token-input:focus {
  border-color: #f1cd60;
  box-shadow: 0 0 0 2px rgba(241, 205, 96, 0.25);
}

.copy-btn {
  height: 32px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #fbe7a1 0%, #f1cd60 100%);
  color: #704f00;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.copy-btn:active {
  opacity: 0.8;
}

.profile-grid {
  display: grid;
  gap: 4px 14px;
  font-size: 12px;
  color: #704f00;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
}

.phase-filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.phase-btn {
  border: none;
  border-radius: 999px;
  padding: 8px 18px;
  font-size: 13px;
  color: #8f6b2f;
  background: rgba(240, 225, 199, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
}

.phase-btn.active,
.phase-btn:hover {
  background: linear-gradient(90deg, #fbe7a1 0%, #f1cd60 100%);
  box-shadow: 0 8px 16px rgba(233, 195, 110, 0.25);
  color: #704f00;
}

.phase-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-btn {
  border: none;
  border-radius: 999px;
  padding: 8px 18px;
  font-size: 13px;
  color: #a34738;
  background: rgba(255, 96, 96, 0.12);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.clear-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(255, 96, 96, 0.15);
}

.phase-select-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #8f6b2f;
  font-size: 14px;
}

.phase-select {
  min-width: 120px;
}

.floating-bar {
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  width: min(720px, calc(100% - 32px));
  background: rgba(255, 255, 255, 0.96);
  border-radius: 14px;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(235, 209, 168, 0.4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  gap: 12px;
  z-index: 20;
}

.floating-info {
  font-size: 13px;
  color: #8f6b2f;
}

.floating-action {
  border: none;
  border-radius: 999px;
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 600;
  color: #704f00;
  background: linear-gradient(90deg, #ffd7a9 0%, #f4b76c 100%);
  box-shadow: 0 10px 20px rgba(243, 184, 109, 0.28);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.floating-action:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 16px 28px rgba(243, 184, 109, 0.4);
}

.floating-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.floating-fade-enter-active,
.floating-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.floating-fade-enter-from,
.floating-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

.log-modal-body {
  max-height: 420px;
  overflow-y: auto;
  padding-right: 8px;
}

.log-empty {
  text-align: center;
  padding: 36px 0;
  color: #8b7b64;
  font-size: 13px;
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.2s ease;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.log-panel {
  margin-top: 24px;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 14px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(235, 209, 168, 0.3);
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  color: #8f6b2f;
}

.log-header h3 {
  margin: 0;
  font-size: 14px;
}

.log-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.log-list li {
  display: grid;
  grid-template-columns: 140px 120px 1fr 60px 1.2fr;
  gap: 10px;
  font-size: 12px;
  color: #704f00;
  align-items: center;
}

.log-time {
  color: #b59b6a;
}

.log-status.success {
  color: #2f9a5a;
}

.log-status.fail {
  color: #d96154;
}

.log-msg {
  color: #8b7b64;
}

@media (max-width: 640px) {
  .page {
    width: 100%;
  }
  .page-header {
    flex-direction: row;
    gap: 8px;
    align-items: flex-start;
  }
  .row-login,
  .row-control {
    grid-template-columns: 1fr;
  }
  .control-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .mode-switch {
    width: 100%;
    justify-content: center;
  }
  .transfer-controls {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .family-refresh {
    width: 100%;
    text-align: center;
  }
  .row-bottom {
    grid-template-columns: 1fr;
  }
  .sms-group {
    grid-template-columns: 1fr;
  }
  .actions {
    justify-content: flex-start;
  }
  .token-box {
    grid-template-columns: 1fr;
  }
  .product-select {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .star-day-card {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
  .star-day-bulk {
    width: 100%;
  }
  .manual-token-cell .manual-token-box {
    grid-template-columns: 1fr;
  }
  .profile-grid {
    grid-template-columns: 1fr;
  }
  .log-list li {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px 12px;
  }
  .floating-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding: 12px;
  }
  .floating-action {
    width: 100%;
    text-align: center;
  }
}
</style>
