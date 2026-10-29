<template>
  <div class="page table-layout">
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

      <section v-if="!isStarDayMode" class="phase-toolbar">
        <div class="phase-select-wrapper">
          <label>权益分类</label>
          <a-select
            class="phase-select"
            :value="isStarDayMode ? undefined : currentPhase"
            :options="phaseOptions"
            :disabled="isStarDayMode || loadingProducts"
            @change="(value) => handlePhaseChange(value)"
            :placeholder="isStarDayMode ? '星动日固定权益模式' : '权益分类'"
            size="small"
          />
        </div>
        <div class="toolbar-stats">
          <span>已登录：{{ loggedInCount }}</span>
          <span>可领取：{{ selectableCount }}</span>
          <button type="button" class="toolbar-add" @click="addAccount()">
            + 新增账号
          </button>
        </div>
      </section>

      <section v-if="isStarDayMode" class="star-day-toolbar">
        <div class="star-day-main">
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
          <div class="star-day-status">
            <strong>{{ starDayStatusText }}</strong>
            <span>{{ starDayTimeText }}</span>
          </div>
        </div>
        <button
          type="button"
          class="star-day-bulk"
          :disabled="!starDayStartableCount || bulkStarDayRedeeming"
          @click="handleBulkStarDayRedeem"
        >
          {{ bulkStarDayRedeeming ? "星动日领取中..." : "一键领取星动日" }}
        </button>
      </section>

      <div v-if="accounts.length" class="table-wrapper">
        <a-table
          class="account-table"
          :columns="tableColumns"
          :data-source="accounts"
          :scroll="tableScroll"
          :pagination="false"
          row-key="id"
          bordered
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
              <div class="col-index">
                <span>{{ index + 1 }}</span>
              </div>
            </template>
            <template v-else-if="column.key === 'status'">
              <div class="col-status">
                <span class="status-tag" :class="{ success: record.profile }">
                  {{ record.profile ? "登录成功" : "未登录" }}
                </span>
              </div>
            </template>
            <template v-else-if="column.key === 'sms'">
              <div class="col-sms">
                <input
                  v-model.trim="record.phone"
                  type="tel"
                  maxlength="11"
                  placeholder="中国移动号码"
                  :disabled="record.authMode === 'manual'"
                />
                <div class="code-row">
                  <input
                    v-model.trim="record.code"
                    type="text"
                    maxlength="6"
                    placeholder="验证码"
                    :disabled="record.authMode === 'manual'"
                  />
                </div>
              </div>
            </template>
            <template v-else-if="column.key === 'tokenInput'">
              <div class="col-token-input">
                <input
                  v-model.trim="record.manualToken"
                  type="text"
                  placeholder="ACCESS_TOKEN / Cookies"
                  :disabled="record.authMode !== 'manual' || record.applyingToken"
                />
              </div>
            </template>
            <template v-else-if="column.key === 'tokenDisplay'">
              <div class="col-token-display">
                <div v-if="getAccessToken(record)" class="token-box">
                  <input
                    class="token-input"
                    :value="getTokenText(record)"
                    readonly
                  />
                  <button type="button" class="copy-btn" @click="copyToken(record)">
                    复制
                  </button>
                </div>
                <span v-else class="token-empty">登录后可见</span>
              </div>
            </template>
            <template v-else-if="column.key === 'transfer'">
              <div class="col-transfer">
                <ASwitch
                  :checked="record.transferEnabled"
                  checked-children="转赠"
                  un-checked-children="自己"
                  :disabled="isStarDayMode"
                  @change="(checked: boolean) => handleTransferToggle(record, checked)"
                />
              </div>
            </template>
            <template v-else-if="column.key === 'family'">
              <div class="col-family">
                <a-select
                  class="family-select"
                  :value="record.selectedFamilyId"
                  :options="record.familyMembers.map((member) => ({
                    label: formatFamilyMember(member),
                    value: member.familyMemNum,
                  }))"
                  :loading="record.familyLoading"
                  :disabled="isStarDayMode || !record.transferEnabled || record.familyLoading"
                  placeholder="选择家庭圈成员"
                  @change="(value: string | undefined) => handleFamilySelect(record, value)"
                  allow-clear
                />
                <button
                  type="button"
                  class="family-refresh"
                  :disabled="isStarDayMode || !record.transferEnabled || record.familyLoading"
                  @click="refreshFamilyMembers(record, { silent: false, force: true })"
                >
                  {{
                    record.familyLoading ? "加载中..." : "刷新成员"
                  }}
                </button>
                <p
                  v-if="record.transferEnabled && !record.familyLoading && !record.familyMembers.length"
                  class="family-tip"
                >
                  暂无成员
                </p>
              </div>
            </template>
            <template v-else-if="column.key === 'product'">
              <div class="col-product">
                <a-select
                  class="product-select-box"
                  :value="isStarDayMode ? undefined : record.selectedProductId"
                  :options="filteredProductsByPhase"
                  :fieldNames="{ label: 'qyName', value: 'id' }"
                  :disabled="isStarDayMode || loadingProducts || record.locked || !filteredProductsByPhase.length"
                  @change="(value) => handleProductChange(record, value)"
                  :placeholder="isStarDayMode ? '星动日不使用常规权益' : '请选择权益'"
                />
                <span class="info-tip">
                  {{ isStarDayMode ? "星动日仅领取固定ID权益" : `默认锁定：${record.locked ? "是" : "否"}` }}
                </span>
              </div>
            </template>
            <template v-else-if="column.key === 'mode'">
              <div class="col-mode">
                <ASwitch
                  :checked="record.authMode === 'manual'"
                  checked-children="TOKEN"
                  un-checked-children="验证码"
                  @change="(checked: boolean) =>
                    setAuthMode(record, checked ? 'manual' : 'sms')
                  "
                />
              </div>
            </template>
            <template v-else-if="column.key === 'actions'">
              <div class="col-actions">
                <template v-if="!record.profile">

                <button
                  type="button"
                  class="action-btn send"
                  :disabled="
                    record.authMode !== 'sms' ||
                    record.sending ||
                    remainingSeconds(record) > 0 ||
                    !isPhoneValid(record)
                  "
                  @click="handleSendSms(record)"
                >
                  {{ remainingSeconds(record) > 0 ? `${remainingSeconds(record)} 秒` : "发送验证码" }}
                </button>
                <button
                  type="button"
                  class="action-btn login"
                  :disabled="record.authMode !== 'sms' || !canSubmit(record)"
                  @click="handleLogin(record)"
                >
                  {{ record.loggingIn ? "登录中..." : "验证码登录" }}
                </button>
                <button
                  type="button"
                  class="action-btn token"
                  :disabled="
                    record.authMode !== 'manual' ||
                    !record.manualToken ||
                    record.applyingToken
                  "
                  @click="handleManualToken(record)"
                >
                  {{ record.applyingToken ? "验证中..." : "TOKEN登录" }}
                </button>
                </template>
                <button
                  v-if="!isStarDayMode"
                  type="button"
                  class="action-btn redeem"
                  :disabled="!canRedeem(record)"
                  @click="handleRedeem(record)"
                >
                  {{ record.redeeming ? "领取中..." : "领取" }}
                </button>
                <button
                  v-if="isStarDayMode"
                  type="button"
                  class="action-btn star"
                  :disabled="!canStartStarDayRedeem(record)"
                  @click="handleStarDayRedeem(record)"
                >
                  {{ record.starDayRedeeming ? "星动日领取中..." : "星动日" }}
                </button>
                <button
                  v-if="accounts.length > 1"
                  type="button"
                  class="remove-btn"
                  @click="confirmRemoveAccount(record)"
                >
                  删除
                </button>
              </div>
            </template>
          </template>
        </a-table>
      </div>

      <div v-else class="empty-state">
        <p>当前还没有账号，可通过右上角设置或上方按钮新增账号。</p>
        <button type="button" class="primary-btn" @click="addAccount()">立即新增</button>
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
      <div v-else class="log-empty">暂无领取记录</div>
    </a-modal>

    <transition name="floating-fade">
      <div class="floating-bar" v-if="accounts.length">
        <div class="floating-info">
          已登录账号：{{ loggedInCount }}，{{ isStarDayMode ? `可领取星动日：${starDayStartableCount}` : `已选择权益：${selectableCount}` }}
        </div>
        <button
          type="button"
          class="floating-action"
          :disabled="isStarDayMode ? !starDayStartableCount || bulkStarDayRedeeming : !selectableCount"
          @click="handleFloatingBulkRedeem"
        >
          {{ isStarDayMode ? (bulkStarDayRedeeming ? "星动日领取中..." : "一键领取星动日") : "一键领取权益" }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
// Vue 组合式 API 基础方法
import { reactive, ref, onMounted, watch, computed } from "vue";
// Ant Design Vue 组件与全局提示
import {
  Dropdown as ADropdown,
  Menu as AMenu,
  message,
  Select as ASelect,
  Modal as AModal,
  Table as ATable,
  Switch as ASwitch,
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

// 权益列表及分组缓存
const products = ref<ProductItem[]>([]);
const productGroups = ref<Record<string, ProductItem[]>>({});
const currentPhase = ref(DEFAULT_PHASE);
const loadingProducts = ref(false);
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
const settingsMenuOpen = ref(false);
const starDayProductId = ref(DEFAULT_STAR_DAY_PRODUCT_ID);
const bulkStarDayRedeeming = ref(false);
const closeSettingsMenu = () => {
  settingsMenuOpen.value = false;
};

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

// 切换账号的登录模式（短信 / TOKEN）
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
  if (isStarDayDate()) {
    return null;
  }
  const sourceList = list ?? products.value;
  return resolveDefaultProductId(sourceList) ?? DEFAULT_PRODUCT_ID;
}

function clearRegularProductSelections() {
  accounts.value.forEach((account) => {
    account.selectedProductId = null;
    account.transferEnabled = false;
    account.selectedFamilyId = null;
  });
}

function getStoredStarDayProductId() {
  return (
    localStorage.getItem(STAR_DAY_PRODUCT_STORAGE_KEY) ||
    DEFAULT_STAR_DAY_PRODUCT_ID
  );
}

function persistStarDayProductId() {
  const productId = starDayProductId.value.trim();
  if (!productId) {
    starDayProductId.value = DEFAULT_STAR_DAY_PRODUCT_ID;
  }
  localStorage.setItem(STAR_DAY_PRODUCT_STORAGE_KEY, starDayProductId.value);
}

function isStarDayDate(now = dayjs()) {
  const date = now.date();
  return date >= STAR_DAY_START_DAY && date <= STAR_DAY_END_DAY;
}

function getStarDayAvailability(account: AccountState) {
  if (!getAccessToken(account) || !account.profile) {
    return {
      available: false,
      msg: "请先登录并获取用户信息",
    };
  }
  if (!starDayProductId.value.trim()) {
    return {
      available: false,
      msg: "请先填写星动日权益ID",
    };
  }
  return {
    available: true,
    msg: `星动日权益ID ${starDayProductId.value.trim()}`,
  };
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

async function handleTransferToggle(account: AccountState, checked: boolean) {
  account.transferEnabled = checked;
  if (checked) {
    await refreshFamilyMembers(account, { silent: true });
    if (!account.familyMembers.length) {
      message.warning("暂未获取到家庭圈成员");
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

function getAccountLabel(account: AccountState) {
  return account.phone || `账号 ${account.id}`;
}

function createAccount(defaultProductId?: number): AccountState {
  const countdown = useCountdown(60);
  const selectedProductId = isStarDayDate()
    ? null
    : defaultProductId ?? getFallbackProductId();
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
    selectedProductId,
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
      const selectedProductId = isStarDayDate()
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
        transferEnabled: isStarDayDate() ? false : Boolean(item.transferEnabled),
        familyMembers: [] as FamilyMember[],
        familyLoading: false,
        selectedFamilyId: isStarDayDate() ? null : item.selectedFamilyId || null,
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
  const initialProductId = isStarDayDate()
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
    !isStarDayDate() &&
    Boolean(getAccessToken(account)) &&
    Boolean(account.selectedProductId) &&
    Boolean(account.profile) &&
    (!account.transferEnabled || Boolean(account.selectedFamilyId))
  );
}

function canStartStarDayRedeem(account: AccountState) {
  return (
    Boolean(getAccessToken(account)) &&
    Boolean(account.profile) &&
    Boolean(starDayProductId.value.trim()) &&
    !account.starDayRedeeming &&
    !bulkStarDayRedeeming.value
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
    message.info("请先切换到TOKEN登录模式");
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
          message.success("TOKEN验证成功");
        } else {
          account.profile = null;
          const msg =
            profileResp.data?.msg || "TOKEN已设置，获取用户信息失败";
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
      const msg = resp.data?.msg || "TOKEN设置失败";
      message.error(msg);
    }
  } catch (error: any) {
    const msg =
      error?.response?.data?.msg || "TOKEN设置异常，请稍后重试";
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
      message.success(finalMsg);
    } else if (result.rateLimited) {
      message.warning(finalMsg);
    } else {
      message.error(finalMsg);
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
      await wait(RETRY_BASE_DELAY + Math.random() * RETRY_RANDOM_DELAY);
    } while (attempts < MAX_REDEEM_RETRY);
  } finally {
    account.starDayRedeeming = false;
  }

  const baseMsg =
    result.msg ||
    (result.success ? "星动日权益领取成功" : "星动日权益领取失败");
  const logMsg = attempts > 1 ? `${baseMsg}（共尝试${attempts}次）` : baseMsg;

  appendRedeemLog(account, result.product, result.success, logMsg);
  persistAccounts();

  if (!silent) {
    if (result.success) {
      message.success(baseMsg);
    } else if (result.rateLimited) {
      message.warning(baseMsg);
    } else {
      message.error(baseMsg);
    }
  }

  return {
    ...result,
    msg: baseMsg,
    attempts,
  };
}

// 单个账号领取入口
async function handleRedeem(account: AccountState) {
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

async function handleStarDayRedeem(account: AccountState) {
  persistStarDayProductId();
  await redeemStarDayWithRetry(account);
}

// 一键领取入口（并发模式）
// 一键领取入口（并发模式）
async function handleBulkRedeem() {
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
    const phone = account.phone || `账号 ${account.id}`;
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
  const targets = accounts.value.filter((account) =>
    canStartStarDayRedeem(account)
  );
  if (!targets.length) {
    message.info("请先完成登录并填写星动日权益ID");
    return;
  }
  const unavailable = targets.filter(
    (account) => !getStarDayAvailability(account).available
  );
  if (unavailable.length) {
    const first = unavailable[0];
    message.warning(`${getAccountLabel(first)}：${getStarDayAvailability(first).msg}`);
    return;
  }

  bulkStarDayRedeeming.value = true;
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
      const phone = account.phone || `账号 ${account.id}`;
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
    bulkStarDayRedeeming.value = false;
  }
}

function handleFloatingBulkRedeem() {
  if (isStarDayMode.value) {
    handleBulkStarDayRedeem();
    return;
  }
  handleBulkRedeem();
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
    phone: account.phone || `账号 ${account.id}`,
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
  accounts.value = [createAccount(isStarDayDate() ? undefined : getFallbackProductId() ?? undefined)];
  message.success("已清除本地缓存");
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
  if (isStarDayDate()) {
    products.value = [];
    return;
  }
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
  if (isStarDayDate()) {
    clearRegularProductSelections();
    persistAccounts();
  } else {
    await loadProductsByPhase(currentPhase.value);
    const defaultId = getFallbackProductId(products.value);
    accounts.value.forEach((account) => {
      if (!account.selectedProductId && defaultId) {
        account.selectedProductId = defaultId;
      }
    });
  }
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

// 权益数据更新时，补齐账号的默认权益
watch(products, (list) => {
  if (isStarDayDate()) {
    clearRegularProductSelections();
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

const isStarDayMode = computed(() => isStarDayDate());

// 当前分类下的权益列表
const filteredProductsByPhase = computed(() => {
  if (isStarDayMode.value) {
    return [];
  }
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

const tableColumns = computed(() => [
  { title: "序号", dataIndex: "index", key: "index", width: 80, align: "center" },
  { title: "状态", dataIndex: "status", key: "status", width: 120, align: "center" },
  { title: "手机号/验证码", dataIndex: "sms", key: "sms", width: 280, align: "center"  },
  { title: "TOKEN登录", dataIndex: "tokenInput", key: "tokenInput", width: 320, align: "center" },
  { title: "TOKEN展示", dataIndex: "tokenDisplay", key: "tokenDisplay", width: 420, align: "center" },
  ...(
    isStarDayMode.value
      ? []
      : [
          { title: "转赠", dataIndex: "transfer", key: "transfer", width: 120, align: "center" },
          { title: "家庭圈成员", dataIndex: "family", key: "family", width: 260, align: "center" },
          { title: "权益选择", dataIndex: "product", key: "product", width: 260, align: "center" },
        ]
  ),
  { title: "登录方式", dataIndex: "mode", key: "mode", width: 120, align: "center" },
  {
    title: "操作",
    dataIndex: "actions",
    key: "actions",
    width: 330,
  },
]);

const MIN_TABLE_SCROLL_WIDTH = 1200;
const tableScroll = computed(() => {
  const totalWidth = tableColumns.value.reduce((sum, column) => {
    const columnWidth = Number(column.width);
    return sum + (Number.isNaN(columnWidth) ? 0 : columnWidth);
  }, 0);
  return {
    x: Math.max(totalWidth, MIN_TABLE_SCROLL_WIDTH),
  };
});

watch(currentPhase, (phase) => {
  if (isStarDayDate()) {
    clearRegularProductSelections();
    persistAccounts();
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

const starDayStartableCount = computed(() =>
  accounts.value.filter((account) => canStartStarDayRedeem(account)).length
);

const starDayStatusText = computed(() =>
  "星动日固定ID领取"
);

const starDayTimeText = computed(() => {
  const loggedAccount = accounts.value.find((account) => account.profile);
  if (!loggedAccount) {
    return "登录后点击即发送领取请求";
  }
  return `当前示例账号网龄${loggedAccount.profile?.netAge ?? "-"}，点击即发送领取请求`;
});

// 用户切换权益分类时的处理逻辑
async function handlePhaseChange(value: string) {
  if (isStarDayDate()) {
    clearRegularProductSelections();
    persistAccounts();
    return;
  }
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
  if (isStarDayDate()) {
    account.selectedProductId = null;
    persistAccounts();
    return;
  }
  account.selectedProductId = value;
  persistAccounts();
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
.page.table-layout {
  width: 100%;
  min-height: 100vh;
  padding: 36px 24px;
  box-sizing: border-box;
}

.page-inner {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.settings-btn {
  border: none;
  background: #fff;
  border-radius: 999px;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 28px rgba(172, 137, 70, 0.24);
  cursor: pointer;
}

.settings-icon {
  font-size: 18px;
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

.phase-toolbar {
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 14px 30px rgba(209, 181, 126, 0.18);
}

.phase-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.phase-select-wrapper label {
  font-size: 13px;
  color: #a17c3e;
}

.phase-select {
  width: 330px;
}

.toolbar-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: #8a6a2c;
}

.toolbar-add {
  border: none;
  background: linear-gradient(90deg, #ffe6a0 0%, #f8c75f 100%);
  color: #704f00;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(234, 193, 110, 0.4);
}

.star-day-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-radius: 14px;
  background: rgba(250, 253, 255, 0.96);
  border: 1px solid rgba(120, 174, 210, 0.18);
  box-shadow: 0 14px 30px rgba(94, 142, 175, 0.12);
}

.star-day-main {
  display: flex;
  align-items: center;
  gap: 18px;
}

.star-day-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.star-day-field label {
  font-size: 13px;
  color: #32627f;
}

.star-day-field input {
  width: 180px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid #c8ddea;
  background: #fff;
  font-size: 13px;
}

.star-day-status {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: #426b82;
}

.star-day-status strong {
  color: #214f67;
}

.star-day-bulk {
  border: none;
  background: linear-gradient(90deg, #77c8d8 0%, #3f8eb4 100%);
  color: #fff;
  padding: 9px 18px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(74, 142, 177, 0.28);
  white-space: nowrap;
}

.star-day-bulk:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.table-wrapper {
  width: 100%;
  overflow: auto;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 30px 60px rgba(199, 167, 105, 0.2);
}

.account-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
}

.account-table thead th {
  text-align: left;
  padding: 16px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #77541a;
  background: rgba(255, 238, 201, 0.56);
}

.account-table tbody td {
  padding: 14px 12px;
  vertical-align: top;
  border-top: 1px solid rgba(214, 191, 150, 0.35);
}

.account-table tbody tr:hover td {
  background: rgba(255, 248, 230, 0.5);
}

.status-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(203, 164, 94, 0.18);
  font-size: 12px;
  color: #9b772e;
}

.status-tag.success {
  background: rgba(58, 168, 106, 0.12);
  color: #2f9a5a;
}

.col-index {
  font-weight: 600;
  color: #8a6a2c;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.remove-btn {
  border: none;
  background: #f6dfa9;
  color: #694707;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  white-space: nowrap;
}

.col-sms input,
.col-token-input input,
.family-select,
.product-select-box {
  width: 100%;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #e8d9bb;
  background: #fff;
  font-size: 13px;
  min-width: 240px;
}

.code-row {
  margin-top: 6px;
}


.token-box {
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 320px;
}

.token-input {
  width: 100%;
  border: 1px solid #e8d9bb;
  border-radius: 8px;
  padding: 6px 10px;
  background: #fff;
  min-width: 320px;
}

.copy-btn {
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  background: #f6dfa9;
  color: #694707;
  cursor: pointer;
  white-space: nowrap;
}

.token-empty {
  font-size: 12px;
  color: #b08a4f;
}

.col-transfer,
.col-mode {
  display: flex;
  align-items: center;
  justify-content: center;
}

.family-tip {
  font-size: 12px;
  color: #d78b00;
  margin-top: 6px;
}

.family-refresh {
  margin-top: 6px;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  background: rgba(255, 226, 175, 0.7);
  color: #7f5a16;
  cursor: pointer;
}

.family-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.col-product .info-tip {
  display: inline-block;
  margin-top: 4px;
  font-size: 12px;
  color: #a0803f;
}

.mode-switcher {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #8f6a24;
}

.col-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 140px));
  gap: 8px;
}

.action-btn {
  border: none;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: rgba(255, 228, 184, 0.7);
  color: #704f00;
  transition: opacity 0.2s ease;
}

.action-btn.redeem {
  background: linear-gradient(90deg, #ffcc70 0%, #f5a623 100%);
  color: #fff;
  box-shadow: 0 18px 32px rgba(236, 169, 60, 0.3);
}

.action-btn.star {
  background: linear-gradient(90deg, #72c7d5 0%, #3d8bb0 100%);
  color: #fff;
  box-shadow: 0 18px 32px rgba(64, 136, 173, 0.24);
}

.action-btn.token {
  background: rgba(206, 237, 208, 0.8);
  color: #2f9a5a;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 18px;
  box-shadow: 0 24px 48px rgba(198, 168, 105, 0.2);
}

.log-modal-body {
  max-height: 520px;
  overflow-y: auto;
}

.log-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #7b5b20;
}

.log-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.log-list li {
  display: grid;
  grid-template-columns: 160px 140px 1fr 80px 1fr;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid #f0e4c3;
  font-size: 13px;
  color: #7a5a1a;
}

.log-status.success {
  color: #2f9a5a;
}

.log-status.fail {
  color: #cc4a3c;
}

.log-empty {
  text-align: center;
  color: #a78645;
  padding: 20px 0;
}

.floating-bar {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  background: #fff;
  padding: 12px 20px;
  border-radius: 999px;
  box-shadow: 0 16px 30px rgba(171, 140, 70, 0.25);
  display: flex;
  align-items: center;
  gap: 18px;
}

.floating-info {
  font-size: 13px;
  color: #836024;
}

.floating-action {
  border: none;
  padding: 10px 20px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ffe6a0 0%, #f8c75f 100%);
  color: #704f00;
  font-weight: 600;
  cursor: pointer;
}

.floating-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.floating-fade-enter-active,
.floating-fade-leave-active {
  transition: opacity 0.2s ease;
}

.floating-fade-enter-from,
.floating-fade-leave-to {
  opacity: 0;
}
</style>
