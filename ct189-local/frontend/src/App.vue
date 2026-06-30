<template>
  <main class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <span>CT</span>
        <div>
          <strong>北京电信本地助手</strong>
          <small>{{ healthText }}</small>
        </div>
      </div>

      <form class="add-form" @submit.prevent="saveAccount">
        <label>
          <span>手机号</span>
          <input v-model="accountForm.phone" inputmode="numeric" maxlength="11" placeholder="189 / 133 / 153..." />
        </label>
        <label>
          <span>备注</span>
          <input v-model="accountForm.label" placeholder="主号 / 副卡" />
        </label>
        <button class="primary" :disabled="busy || !canSaveAccount">添加账号</button>
      </form>

      <div class="account-list">
        <button
          v-for="item in accounts"
          :key="item.id"
          class="account-item"
          :class="{ active: activeId === item.id }"
          @click="selectAccount(item.id)"
        >
          <strong>{{ item.label || item.maskedPhone }}</strong>
          <span>{{ item.maskedPhone }}</span>
          <em :class="`status-${item.loginStatus}`">{{ statusText(item.loginStatus) }}</em>
        </button>
      </div>
    </aside>

    <section class="workspace">
      <header class="topbar">
        <div>
          <p>本地会话池</p>
          <h1>{{ activeAccount ? activeAccount.label || activeAccount.maskedPhone : "选择或添加账号" }}</h1>
        </div>
        <div class="top-actions">
          <button @click="loadAccounts" :disabled="busy">刷新列表</button>
          <button v-if="activeAccount" class="danger" @click="deleteActive" :disabled="busy">删除账号</button>
        </div>
      </header>

      <section v-if="!activeAccount" class="empty-state">
        <h2>先添加一个电信手机号</h2>
        <p>登录态、cookie 和查询记录都会保存在本机项目目录，不上传云端。</p>
      </section>

      <template v-else>
        <section class="overview-grid">
          <article class="metric">
            <span>登录号码</span>
            <strong>{{ activeAccount.loginNumber || "未确认" }}</strong>
          </article>
          <article class="metric">
            <span>登录状态</span>
            <strong>{{ statusText(activeAccount.loginStatus) }}</strong>
          </article>
          <article class="metric">
            <span>剩余抽奖</span>
            <strong>{{ rollNumText }}</strong>
          </article>
          <article class="metric">
            <span>最近刷新</span>
            <strong>{{ formatTime(activeAccount.lastRefreshAt) }}</strong>
          </article>
        </section>

        <section class="panel login-panel">
          <div class="panel-title">
            <div>
              <h2>服务密码登录</h2>
              <p>使用官方 WAP 页面上下文发起请求，自动复用浏览器 cookie。</p>
            </div>
            <span>{{ activeAccount.maskedPhone }}</span>
          </div>
          <div class="login-row">
            <input
              v-model="password"
              type="password"
              inputmode="numeric"
              placeholder="服务密码"
              @keyup.enter="loginPassword"
            />
            <button class="primary" @click="loginPassword" :disabled="busy || !password">登录</button>
            <button @click="checkLogin" :disabled="busy">确认登录</button>
            <button @click="refreshAll" :disabled="busy">查询余额/权益</button>
          </div>
          <p v-if="activeAccount.lastError" class="error-line">{{ activeAccount.lastError }}</p>
        </section>

        <section class="content-grid">
          <article class="panel">
            <div class="panel-title">
              <div>
                <h2>余额与账单</h2>
                <p>先接入源码中已有余额接口，字段按实测响应逐步映射。</p>
              </div>
              <button @click="queryBill" :disabled="busy">查月账单</button>
            </div>
            <pre class="json-box">{{ pretty(activeAccount.balance) }}</pre>
          </article>

          <article class="panel">
            <div class="panel-title">
              <div>
                <h2>权益活动</h2>
                <p>活动 310：权益俱乐部刮刮乐。</p>
              </div>
              <button class="primary" @click="drawRights" :disabled="busy">手动领取</button>
            </div>
            <div class="rights-summary">
              <strong>{{ activeName }}</strong>
              <span>{{ activeDesc }}</span>
            </div>
            <pre class="json-box">{{ pretty(activeAccount.rights) }}</pre>
          </article>
        </section>

        <section class="panel">
          <div class="panel-title">
            <div>
              <h2>原始结果</h2>
              <p>用于继续补齐 token、账单字段和领取结果判断。</p>
            </div>
            <div class="segmented">
              <button :class="{ selected: resultTab === 'latest' }" @click="resultTab = 'latest'">最新</button>
              <button :class="{ selected: resultTab === 'logs' }" @click="resultTab = 'logs'">日志</button>
            </div>
          </div>
          <pre v-if="resultTab === 'latest'" class="json-box tall">{{ pretty(latestResult) }}</pre>
          <div v-else class="logs">
            <article v-for="log in logs" :key="log.id">
              <strong>{{ log.action }}</strong>
              <span>{{ formatTime(log.createdAt) }}</span>
              <pre>{{ pretty(log.payload) }}</pre>
            </article>
          </div>
        </section>
      </template>
    </section>

    <div v-if="busy" class="busy-mask">
      <div>处理中...</div>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { api } from "./api";

const busy = ref(false);
const accounts = ref([]);
const activeId = ref("");
const logs = ref([]);
const latestResult = ref(null);
const password = ref("");
const health = ref(null);
const resultTab = ref("latest");
const accountForm = reactive({ phone: "", label: "" });

const activeAccount = computed(() => accounts.value.find((item) => item.id === activeId.value) || null);
const canSaveAccount = computed(() => /^1\d{10}$/.test(accountForm.phone));
const healthText = computed(() => (health.value?.ok ? "后端在线" : "等待连接"));
const activeName = computed(() => {
  const object = activeAccount.value?.activityInfo?.object;
  return object?.active_name || object?.wap_warm_tips || "权益活动";
});
const activeDesc = computed(() => activeAccount.value?.activityInfo?.object?.wap_active_desc || "暂无活动说明");
const rollNumText = computed(() => {
  const rights = activeAccount.value?.rights;
  if (!rights) return "未知";
  if (rights.retCode === "101") return "0";
  return rights.retMsg || rights.object?.length || "可查询";
});

onMounted(async () => {
  await loadHealth();
  await loadAccounts();
});

async function run(task) {
  busy.value = true;
  try {
    return await task();
  } catch (error) {
    latestResult.value = { ok: false, message: error.message };
  } finally {
    busy.value = false;
  }
}

async function loadHealth() {
  await run(async () => {
    health.value = await api.health();
  });
}

async function loadAccounts() {
  await run(async () => {
    const data = await api.accounts();
    accounts.value = data.accounts || [];
    if (!activeId.value && accounts.value[0]) activeId.value = accounts.value[0].id;
    if (activeId.value) await loadLogs();
  });
}

async function saveAccount() {
  await run(async () => {
    const data = await api.saveAccount({ ...accountForm });
    latestResult.value = data;
    accountForm.phone = "";
    accountForm.label = "";
    await loadAccounts();
    activeId.value = data.account.id;
  });
}

async function selectAccount(id) {
  activeId.value = id;
  password.value = "";
  latestResult.value = null;
  await loadLogs();
}

async function deleteActive() {
  if (!activeAccount.value) return;
  if (!window.confirm(`确认删除 ${activeAccount.value.maskedPhone} 的本地记录？`)) return;
  await run(async () => {
    await api.deleteAccount(activeAccount.value.id);
    activeId.value = "";
    await loadAccounts();
  });
}

async function loginPassword() {
  await run(async () => {
    const data = await api.loginPassword(activeAccount.value.id, password.value);
    latestResult.value = data;
    password.value = "";
    await loadAccounts();
  });
}

async function checkLogin() {
  await run(async () => {
    latestResult.value = await api.checkLogin(activeAccount.value.id);
    await loadAccounts();
  });
}

async function refreshAll() {
  await run(async () => {
    latestResult.value = await api.refresh(activeAccount.value.id);
    await loadAccounts();
  });
}

async function drawRights() {
  if (!window.confirm("确认现在为当前手机号发起权益领取/抽奖请求？")) return;
  await run(async () => {
    latestResult.value = await api.drawRights(activeAccount.value.id);
    await loadAccounts();
  });
}

async function queryBill() {
  await run(async () => {
    latestResult.value = await api.bill(activeAccount.value.id, {});
    await loadLogs();
  });
}

async function loadLogs() {
  if (!activeId.value) return;
  const data = await api.logs(activeId.value);
  logs.value = data.logs || [];
}

function pretty(value) {
  if (value == null) return "暂无数据";
  return JSON.stringify(value, null, 2);
}

function statusText(status) {
  return (
    {
      new: "未登录",
      valid: "有效",
      invalid: "失效",
      closed: "已关闭"
    }[status] || status || "未知"
  );
}

function formatTime(value) {
  if (!value) return "无";
  return new Date(value).toLocaleString("zh-CN", { hour12: false });
}
</script>
