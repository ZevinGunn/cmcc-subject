<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from "vue";
import { api } from "./api";
const accounts = ref([]),
  search = ref(""),
  status = ref("all"),
  group = ref("all"),
  selected = ref([]);
const loading = ref(true),
  busy = ref(false),
  connected = ref(false),
  notice = ref(""),
  error = ref("");
const modal = ref(null),
  mode = ref(""),
  activeId = ref(""),
  password = ref(""),
  rememberPassword = ref(true);
const form = ref({ phone: "", label: "", group: "", enabled: true }),
  importText = ref(""),
  batchGroup = ref("");
const batch = ref(null),
  batchError = ref(""),
  batchConcurrency = ref(1),
  batchExecutor = ref("native");
const schedules = ref([]),
  operationLogs = ref([]),
  logsLoading = ref(false),
  logsError = ref(""),
  scheduleForm = ref({ action: "friday_wdmei", cron: "0 10 * * 5", executor: "native", concurrency: 1, warmupMinutes: 5, intervalSeconds: 2, maxAttempts: 1 });
const executors = ref([
  { id: "native", label: "Node 内置", description: "服务端内置执行，默认方式" },
  { id: "python", label: "Python", description: "本机 Python 脚本适配器" },
  { id: "javascript", label: "JavaScript", description: "本机 Node.js 脚本适配器" },
  { id: "go", label: "Go", description: "本机 Go 脚本适配器" },
  { id: "java", label: "Java", description: "本机 Java 脚本适配器" },
]);
const accessRequired = ref(false),
  locked = ref(false),
  accessLoading = ref(true),
  accessUsername = ref("admin"),
  accessPassword = ref(""),
  accessRemember = ref(true);
function lockAccess() {
  locked.value = true;
  accounts.value = [];
  selected.value = [];
  batch.value = null;
  password.value = "";
  modal.value?.close();
  mode.value = "";
}
async function enterSite() {
  const secret = accessPassword.value;
  accessPassword.value = "";
  await perform(async () => {
    await api.accessLogin(accessUsername.value, secret, accessRemember.value);
    locked.value = false;
    await reload(true);
  });
}
async function leaveSite() {
  await perform(async () => {
    await api.accessLogout();
    lockAccess();
  });
}
let timer,
  pollInFlight = false;
const active = computed(() =>
  accounts.value.find((a) => a.id === activeId.value),
);
const safeRemark = (a) =>
  a.label && a.label !== a.maskedPhone && !/^\d{1,32}$/.test(a.label)
    ? a.label
    : "";
const groups = computed(() =>
  [...new Set(accounts.value.map((a) => a.group || "未分组"))].sort(),
);
const healthy = computed(
  () =>
    accounts.value.filter(
      (a) => a.enabled !== false && a.loginStatus === "valid",
    ).length,
);
const attention = computed(
  () =>
    accounts.value.filter(
      (a) => a.enabled !== false && a.loginStatus !== "valid",
    ).length,
);
const pending = computed(
  () => batch.value && ["queued", "running"].includes(batch.value.status),
);
const filtered = computed(() =>
  accounts.value.filter((a) => {
    const matches = `${a.phone} ${a.label} ${a.group}`
      .toLowerCase()
      .includes(search.value.toLowerCase());
    const state =
      a.enabled === false
        ? "disabled"
        : a.loginStatus === "valid"
          ? "valid"
          : "attention";
    return (
      matches &&
      (status.value === "all" || status.value === state) &&
      (group.value === "all" || (a.group || "未分组") === group.value)
    );
  }),
);
const allSelected = computed(
  () =>
    filtered.value.length > 0 &&
    filtered.value.every((a) => selected.value.includes(a.id)),
);
const stateLabel = (a) =>
  a.enabled === false
    ? "已停用"
    : a.autoLoginStatus === "running"
      ? "正在补登"
      : {
          valid: "登录有效",
          invalid: "需要登录",
          closed: "会话关闭",
          new: "待登录",
          unknown: "待核验",
        }[a.loginStatus] || "待登录";
const savedLabel = (a) =>
  a.enabled === false
    ? "自动补登已暂停"
    : {
        manual_required: "请更新服务密码",
        running: "正在自动补登",
        retry_wait: "补登稍后重试",
        paused: "自动补登已暂停",
      }[a.autoLoginStatus] ||
      (a.hasSavedPassword ? "已记住密码 · 自动补登" : "尚未记住服务密码");
const resultLabel = (state) =>
  ({
    queued: "等待处理",
    running: "处理中",
    success: "成功",
    failed: "失败",
    partial: "部分完成",
    skipped: "已跳过",
    interrupted: "已中断",
  })[state] || state;
const date = (value) =>
  value
    ? new Date(value).toLocaleString("zh-CN", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "—";
function feedback(message, failed = false) {
  notice.value = failed ? "" : message;
  error.value = failed ? message : "";
}
function replace(account) {
  if (account)
    accounts.value = accounts.value.map((a) =>
      a.id === account.id ? account : a,
    );
}
async function reload(initial = false) {
  if (initial) {
    loading.value = true;
    feedback("");
  }
  const results = await Promise.allSettled([api.accounts(), api.health(), api.schedules(), api.executors()]);
  if (results[0].status === "fulfilled") {
    accounts.value = results[0].value.accounts;
    selected.value = selected.value.filter((id) =>
      accounts.value.some((a) => a.id === id),
    );
  } else if (results[0].reason.status === 401) lockAccess();
  else feedback("账号读取失败，已保留当前列表。请检查服务后重试。", true);
  connected.value = results[1].status === "fulfilled";
  if (results[2].status === "fulfilled") schedules.value = results[2].value.schedules;
  if (results[3].status === "fulfilled" && Array.isArray(results[3].value.executors) && results[3].value.executors.length)
    executors.value = results[3].value.executors;
  loading.value = false;
}
async function poll() {
  if (
    pollInFlight ||
    busy.value ||
    document.hidden ||
    locked.value ||
    accessLoading.value
  )
    return;
  pollInFlight = true;
  try {
    if (pending.value) {
      try {
        batch.value = (await api.task(batch.value.id)).task;
        batchError.value = "";
      } catch {
        batchError.value = "暂时无法读取操作结果，请重试";
      }
    }
    await reload();
  } finally {
    pollInFlight = false;
  }
}
async function perform(fn) {
  if (busy.value) return;
  busy.value = true;
  feedback("");
  try {
    await fn();
  } catch (e) {
    replace(e.account);
    feedback(e.message || "操作失败，请重试", true);
  } finally {
    busy.value = false;
  }
}
function toggleAll(event) {
  const ids = filtered.value.map((a) => a.id);
  selected.value = event.target.checked
    ? [...new Set([...selected.value, ...ids])]
    : selected.value.filter((id) => !ids.includes(id));
}
async function open(which, account) {
  mode.value = which;
  activeId.value = account?.id || "";
  password.value = "";
  rememberPassword.value = true;
  feedback("");
  form.value = account
    ? {
        phone: account.phone,
        label: safeRemark(account),
        group: account.group,
        enabled: account.enabled !== false,
      }
    : { phone: "", label: "", group: "", enabled: true };
  importText.value = "";
  batchGroup.value = "";
  operationLogs.value = [];
  logsLoading.value = which === "detail" && Boolean(account);
  logsError.value = "";
  await nextTick();
  modal.value.showModal();
  if (which === "detail" && account) {
    try {
      operationLogs.value = (await api.logs(account.id)).logs;
    } catch {
      operationLogs.value = [];
      logsError.value = "接口日志读取失败，请刷新后重试";
    } finally {
      logsLoading.value = false;
    }
  }
}
async function showAccountLogs(accountId) {
  const account = accounts.value.find((item) => item.id === accountId);
  if (account) await open("detail", account);
}
function close() {
  if (busy.value) return;
  modal.value.close();
  password.value = "";
  mode.value = "";
}
async function save() {
  await perform(async () => {
    if (/^\d{1,32}$/.test(form.value.label))
      throw new Error("备注不要填写服务密码，请使用账号名称");
    if (mode.value === "edit")
      replace((await api.patchAccount(activeId.value, form.value)).account);
    else {
      await api.saveAccount(form.value);
      await reload();
    }
    modal.value.close();
    feedback("账号已保存");
  });
}
async function importAccounts() {
  await perform(async () => {
    const rows = importText.value
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((line) => {
        const [phone, label = "", group = "未分组", ...extra] = line.split("#");
        if (
          extra.length ||
          !/^1\d{10}$/.test(phone.trim()) ||
          /^\d{1,32}$/.test(label.trim())
        )
          throw new Error(
            "每行格式为 手机号#备注#分组，不包含密码；请检查后重试",
          );
        return {
          phone: phone.trim(),
          label: label.trim(),
          group: group.trim(),
        };
      });
    const data = await api.importAccounts(rows);
    modal.value.close();
    importText.value = "";
    await reload();
    feedback(`导入完成：新增 ${data.added} 个，重复跳过 ${data.skipped} 个`);
  });
}
async function login() {
  const id = activeId.value,
    secret = password.value,
    remember = rememberPassword.value;
  password.value = "";
  await perform(async () => {
    const result = await api.loginPassword(id, secret, remember);
    replace(result.account);
    modal.value.close();
    feedback(
      remember ? "登录成功，已加密记住服务密码" : "登录成功，本次不记住密码",
    );
  });
}
async function reloginSaved() {
  await perform(async () => {
    const result = await api.reloginSaved(activeId.value);
    replace(result.account);
    if (!result.ok) throw Object.assign(new Error(result.message), { account: result.account });
    modal.value.close();
    feedback("已使用服务端保存的密码重新登录");
  });
}
async function task(action, ids = selected.value) {
  await perform(async () => {
    batch.value = (await api.startTask(action, ids, Number(batchConcurrency.value), batchExecutor.value)).task;
    batchError.value = "";
    feedback("操作已开始，结果会在账号列表下方更新");
    await reload();
  });
}
async function createSchedule() {
  await perform(async () => {
    if (!selected.value.length) throw new Error("请先选择至少一个账号，再创建定时任务");
    await api.createSchedule({ ...scheduleForm.value, accountIds: selected.value, concurrency: Number(scheduleForm.value.concurrency), warmupMinutes: Number(scheduleForm.value.warmupMinutes) });
    schedules.value = (await api.schedules()).schedules;
    feedback("定时任务已保存，将在执行前自动预热会话");
  });
}
async function toggleSchedule(schedule) {
  await perform(async () => {
    const result = await api.patchSchedule(schedule.id, { enabled: !schedule.enabled });
    schedules.value = schedules.value.map((item) => item.id === schedule.id ? result.schedule : item);
  });
}
async function removeSchedule(schedule) {
  if (!window.confirm(`删除“${schedule.title}”定时任务？`)) return;
  await perform(async () => {
    await api.deleteSchedule(schedule.id);
    schedules.value = schedules.value.filter((item) => item.id !== schedule.id);
  });
}
const scheduleActionLabel = (action) => action === "friday_wdmei" ? "周五狂欢日 · 味多美" : "权益福袋 · 10 元权益金";
const executorLabel = (id) => executors.value.find((item) => item.id === id)?.label || id || "Node 内置";
const logActionLabel = (action) => ({ password_login: "手动登录", auto_login: "自动补登", api_request: "接口调用", schedule_warmup: "任务预热", friday_wdmei: "领取味多美", rights_bag_cash: "领取权益福袋", relogin_saved: "批量重新登录", schedule_run: "定时调度" }[action] || action);
const logStageLabel = (stage) => ({ login: "登录", session: "会话", activity: "活动", claim: "领取", warmup: "预热", schedule: "调度" }[stage] || stage || "未标记阶段");
const logEndpoint = (payload) => payload?.endpoint || payload?.url || "未记录接口路径";
const logMethod = (payload) => String(payload?.method || "—").toUpperCase();
const logHttpStatus = (payload) => {
  const value = payload?.response?.status ?? payload?.httpStatus ?? payload?.statusCode;
  return Number.isFinite(Number(value)) ? String(value) : "未收到";
};
const logJson = (value) => JSON.stringify(value ?? {}, null, 2);
const isApiLog = (entry) => Boolean(entry.action === "api_request" || entry.payload?.endpoint || entry.payload?.method);
const logFailed = (entry) => Boolean(
  entry.payload?.status === "failed" ||
  entry.payload?.ok === false ||
  entry.payload?.response?.ok === false ||
  Number(entry.payload?.response?.status) >= 400 ||
  entry.payload?.error,
);
async function batchUpdate(patch) {
  await perform(async () => {
    let done = 0,
      failed = 0;
    for (const id of selected.value) {
      try {
        replace((await api.patchAccount(id, patch)).account);
        done++;
      } catch {
        failed++;
      }
    }
    modal.value.close();
    feedback(
      `更新完成：成功 ${done} 个${failed ? `，失败 ${failed} 个` : ""}`,
      failed > 0,
    );
  });
}
async function remove(ids) {
  if (
    !window.confirm(
      `删除 ${ids.length} 个账号、已保存密码及登录会话？此操作不可撤销。`,
    )
  )
    return;
  await perform(async () => {
    let done = 0,
      failed = 0;
    for (const id of ids) {
      try {
        await api.deleteAccount(id);
        done++;
      } catch {
        failed++;
      }
    }
    await reload();
    feedback(
      `删除完成：成功 ${done} 个${failed ? `，失败 ${failed} 个（请等待账号操作完成后重试）` : ""}`,
      failed > 0,
    );
  });
}
function onVisibility() {
  if (!document.hidden) poll();
}
onMounted(async () => {
  window.addEventListener("ct189-access-expired", lockAccess);
  try {
    const health = await api.health();
    connected.value = true;
    accessRequired.value = Boolean(health.accessRequired);
    if (accessRequired.value) {
      const session = await api.accessSession();
      locked.value = !session.authenticated;
    }
    if (!locked.value) await reload(true);
  } catch {
    feedback("服务暂时不可用，请刷新后重试。", true);
  } finally {
    accessLoading.value = false;
    loading.value = false;
  }
  let ticks = 0;
  timer = setInterval(() => {
    ticks++;
    if (pending.value || ticks % 12 === 0) poll();
  }, 2500);
  document.addEventListener("visibilitychange", onVisibility);
});
onUnmounted(() => {
  window.removeEventListener("ct189-access-expired", lockAccess);
  clearInterval(timer);
  document.removeEventListener("visibilitychange", onVisibility);
});
</script>

<template>
  <div class="workspace">
    <header class="brand-header">
      <div class="header-content">
        <a class="brand" href="/" aria-label="北京电信快捷服务首页"
          ><img
            src="/telecom-logo.png"
            alt="北京电信 5G"
            width="48"
            height="38"
          />
          <div>
            <strong>北京电信快捷服务</strong><small>账号与登录会话管理</small>
          </div></a
        ><span class="connection"
          ><i class="dot" :class="connected ? 'good' : 'warning'"></i
          >{{ connected ? "服务已连接" : "服务未连接" }}</span
        >
        <button
          v-if="accessRequired && !locked && !accessLoading"
          class="access-logout"
          :disabled="busy"
          @click="leaveSite"
        >
          退出
        </button>
      </div>
    </header>
    <main v-if="accessLoading" class="access-loading" role="status">
      正在连接服务…
    </main>
    <main v-else-if="locked" class="access-page">
      <section class="access-panel">
        <img src="/telecom-logo.png" alt="北京电信 5G" width="64" height="51" />
        <h1>登录快捷服务</h1>
        <p>使用站点访问账号，管理你的电信号码。</p>
        <form @submit.prevent="enterSite">
          <label
            >访问账号<input
              v-model.trim="accessUsername"
              autocomplete="username"
              maxlength="80"
              :disabled="busy"
              required
          /></label>
          <label
            >访问密码<input
              v-model="accessPassword"
              type="password"
              autocomplete="current-password"
              maxlength="256"
              :disabled="busy"
              required
          /></label>
          <label class="checkbox-label"
            ><input v-model="accessRemember" type="checkbox" :disabled="busy" />
            30 天内保持登录</label
          >
          <div v-if="error" role="alert" class="notice error">{{ error }}</div>
          <button
            class="primary"
            :disabled="busy || !accessUsername || !accessPassword"
          >
            {{ busy ? "正在登录…" : "登录" }}
          </button>
        </form>
        <p class="field-note">
          此处填写站点访问密码，电信服务密码在账号登录时输入。
        </p>
      </section>
    </main>
    <main v-else>
      <div class="page-heading theme-heading">
        <div>
          <span class="eyebrow">北京电信 · 账号工作台</span>
          <h1>账号管理</h1>
          <p>统一管理号码，登录过期自动补登</p>
        </div>
        <div class="heading-actions">
          <button :disabled="busy || loading" @click="reload(true)">刷新</button
          ><button :disabled="busy" @click="open('import')">批量导入</button
          ><button class="primary" :disabled="busy" @click="open('add')">
            ＋ 添加账号
          </button>
        </div>
      </div>
      <div v-if="notice && !mode" role="status" class="notice">
        {{ notice }}
      </div>
      <div v-if="error && !mode" role="alert" class="notice error">
        {{ error }}
      </div>
      <div class="summary">
        <div>
          <span>全部账号</span><strong>{{ accounts.length }}</strong>
        </div>
        <div>
          <span><i class="dot good"></i>登录有效</span
          ><strong>{{ healthy }}</strong>
        </div>
        <div>
          <span><i class="dot warning"></i>待处理</span
          ><strong>{{ attention }}</strong>
        </div>
        <div>
          <span>已停用</span
          ><strong>{{
            accounts.filter((a) => a.enabled === false).length
          }}</strong>
        </div>
      </div>
      <section class="schedule-panel rights-strategy-panel" aria-label="权益领取策略">
        <div class="section-header">
          <div><h2>权益领取策略</h2><p class="section-note">参考抢购控制台：登录始终串行，权益领取按并发数执行；外部脚本只接收一次性任务令牌。</p></div>
          <span class="muted">已选账号 {{ selected.length }} 个</span>
        </div>
        <div class="strategy-actions">
          <button class="primary" :disabled="busy || pending || !selected.length" @click="task('friday_wdmei')">立即领味多美</button>
          <button class="primary" :disabled="busy || pending || !selected.length" @click="task('rights_bag_cash')">立即领权益福袋</button>
          <button :disabled="busy || pending || !selected.length" @click="task(scheduleForm.action)">一键测试</button>
          <span class="strategy-hint">{{ pending ? '任务执行中…' : '当前选择将用于立即执行和测试' }}</span>
        </div>
        <form class="schedule-form" @submit.prevent="createSchedule">
          <label>活动<select v-model="scheduleForm.action"><option value="friday_wdmei">周五狂欢日 · 味多美</option><option value="rights_bag_cash">权益福袋 · 10 元权益金</option></select></label>
          <label>执行器<select v-model="scheduleForm.executor"><option v-for="item in executors" :key="item.id" :value="item.id" :disabled="item.available === false">{{ item.label }}{{ item.available === false ? '（不可用）' : '' }}</option></select></label>
          <label>执行时间（cron）<input v-model.trim="scheduleForm.cron" placeholder="0 10 * * 5" pattern="\S+\s+\S+\s+\S+\s+\S+\s+\S+" required /></label>
          <label>并发数<input v-model.number="scheduleForm.concurrency" type="number" min="1" max="8" /></label>
          <label>提前预热（分钟）<input v-model.number="scheduleForm.warmupMinutes" type="number" min="0" max="30" /></label>
          <label>重试间隔（秒）<input v-model.number="scheduleForm.intervalSeconds" type="number" min="0" max="3600" /></label>
          <label>最多执行次数<input v-model.number="scheduleForm.maxAttempts" type="number" min="1" max="50" /></label>
          <button class="primary" :disabled="busy || !selected.length">创建计划</button>
        </form>
        <div v-if="schedules.length" class="schedule-list">
          <div v-for="schedule in schedules" :key="schedule.id" class="schedule-row">
            <div><strong>{{ schedule.title }}</strong><small>{{ schedule.cron }} · {{ executorLabel(schedule.executor) }} · 并发 {{ schedule.concurrency }} · 间隔 {{ schedule.intervalSeconds }} 秒 · 最多 {{ schedule.maxAttempts }} 次 · 下次 {{ date(schedule.nextRunAt) }}</small></div>
            <span class="status-label" :class="schedule.enabled ? 'good' : 'muted'"><i class="dot"></i>{{ schedule.enabled ? '已启用' : '已停用' }}</span>
            <small v-if="schedule.lastError" class="row-error">{{ schedule.lastError }}</small>
            <div class="row-actions"><button :disabled="busy" @click="toggleSchedule(schedule)">{{ schedule.enabled ? '停用' : '启用' }}</button><button class="danger-text" :disabled="busy" @click="removeSchedule(schedule)">删除</button></div>
          </div>
        </div>
        <p v-else class="empty compact">还没有定时权益任务。先选择账号，再创建计划。</p>
      </section>
      <section class="account-panel" aria-label="账号列表">
        <div class="filters">
          <div class="filter-tabs" aria-label="状态筛选">
            <button
              v-for="[key, label] in [
                ['all', '全部'],
                ['valid', '有效'],
                ['attention', '待处理'],
                ['disabled', '停用'],
              ]"
              :key="key"
              :aria-pressed="status === key"
              :class="{ active: status === key }"
              @click="status = key"
            >
              {{ label }}
            </button>
          </div>
          <div class="filter-inputs">
            <input
              v-model="search"
              type="search"
              aria-label="搜索账号"
              placeholder="搜索号码、备注、分组"
            /><select v-model="group" aria-label="分组筛选">
              <option value="all">全部分组</option>
              <option v-for="g in groups" :key="g">{{ g }}</option>
            </select>
          </div>
        </div>
        <div v-if="selected.length" class="batch-bar">
          <strong>已选 {{ selected.length }} 个</strong
          ><label class="inline-control">并发 <input v-model.number="batchConcurrency" type="number" min="1" max="8" /></label
          ><label class="inline-control">执行器 <select v-model="batchExecutor"><option v-for="item in executors" :key="item.id" :value="item.id" :disabled="item.available === false">{{ item.label }}{{ item.available === false ? '（不可用）' : '' }}</option></select></label
          ><button :disabled="busy || pending" @click="task('check')">
            检查登录</button
          ><button :disabled="busy || pending" @click="task('relogin_saved')" title="逐个账号串行使用已保存的服务密码重新登录">
            批量重新登录</button
          ><button :disabled="busy || pending" @click="task('refresh')">
            更新资料</button
          ><button :disabled="busy || pending" @click="task('friday_wdmei')">
            领味多美</button
          ><button :disabled="busy || pending" @click="task('rights_bag_cash')">
            领权益福袋</button
          ><button :disabled="busy" @click="open('group')">移动分组</button
          ><button :disabled="busy" @click="batchUpdate({ enabled: true })">
            启用</button
          ><button :disabled="busy" @click="batchUpdate({ enabled: false })">
            停用</button
          ><button :disabled="busy || pending" @click="task('close')">
            关闭会话</button
          ><button
            class="danger-text"
            :disabled="busy"
            @click="remove(selected)"
          >
            删除</button
          ><button class="clear-selection" @click="selected = []">
            取消选择
          </button>
        </div>
        <div v-if="loading" class="empty" role="status">正在读取账号…</div>
        <template v-else
          ><table v-if="filtered.length" class="accounts-table">
            <thead>
              <tr>
                <th class="check-cell">
                  <input
                    type="checkbox"
                    aria-label="选择当前筛选的全部账号"
                    :checked="allSelected"
                    :indeterminate="
                      !allSelected &&
                      filtered.some((a) => selected.includes(a.id))
                    "
                    @change="toggleAll"
                  />
                </th>
                <th>手机号 / 备注</th>
                <th class="group-column">分组</th>
                <th>登录状态</th>
                <th class="time-column">最近登录</th>
                <th class="time-column">资料更新</th>
                <th class="actions-column">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="a in filtered"
                :key="a.id"
                :class="{
                  selected: selected.includes(a.id),
                  disabled: a.enabled === false,
                }"
              >
                <td class="check-cell">
                  <input
                    v-model="selected"
                    type="checkbox"
                    :value="a.id"
                    :aria-label="`选择 ${a.maskedPhone}`"
                  />
                </td>
                <td>
                  <button class="account-name" @click="open('detail', a)">
                    {{ a.maskedPhone }}</button
                  ><span v-if="safeRemark(a)" class="account-remark">{{
                    safeRemark(a)
                  }}</span
                  ><span class="mobile-group">{{ a.group || "未分组" }}</span>
                </td>
                <td class="group-column">
                  <span class="group-label">{{ a.group || "未分组" }}</span>
                </td>
                <td>
                  <span
                    class="status-label"
                    :class="
                      a.enabled === false
                        ? 'muted'
                        : a.loginStatus === 'valid'
                          ? 'good'
                          : 'warning'
                    "
                    ><i class="dot"></i>{{ stateLabel(a) }}</span
                  ><small
                    class="saved-state"
                    :class="{
                      attention: a.autoLoginStatus === 'manual_required',
                    }"
                    >{{ savedLabel(a) }}</small
                  ><small
                    v-if="a.lastError"
                    class="row-error"
                    :title="a.lastError"
                    >{{ a.lastError }}</small
                  >
                </td>
                <td class="time-column muted numeric">
                  {{ date(a.lastLoginAt) }}
                </td>
                <td class="time-column muted numeric">
                  {{ date(a.lastRefreshAt) }}
                </td>
                <td class="row-actions">
                  <button
                    :disabled="
                      busy ||
                      a.enabled === false ||
                      a.autoLoginStatus === 'running'
                    "
                    @click="open('login', a)"
                  >
                    {{
                      a.hasSavedPassword ||
                      a.autoLoginStatus === "manual_required"
                        ? "重新登录"
                        : "登录"
                    }}</button
                  ><button :disabled="busy" @click="open('edit', a)">
                    编辑</button
                  ><button class="detail-action" @click="open('detail', a)">
                    详情
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="empty">
            <strong>{{
              accounts.length ? "没有匹配的账号" : "添加第一个北京电信账号"
            }}</strong>
            <p>
              {{
                accounts.length
                  ? "试试其他关键词或筛选条件"
                  : "添加号码后，使用服务密码直接完成登录"
              }}
            </p>
            <button
              v-if="!accounts.length"
              class="primary"
              @click="open('add')"
            >
              添加账号</button
            ><button
              v-else
              @click="
                search = '';
                status = 'all';
                group = 'all';
              "
            >
              清除筛选
            </button>
          </div></template
        >
        <footer class="list-footer">
          <span>显示 {{ filtered.length }} / {{ accounts.length }} 个账号</span
          ><span>服务密码加密保存</span>
        </footer>
      </section>
      <section v-if="batch" class="batch-results" aria-label="本次操作结果">
        <div class="section-header">
          <h2>{{ batch.title }} · {{ resultLabel(batch.status) }}</h2>
          <button v-if="!pending" @click="batch = null">收起</button
          ><span v-else class="muted"
            >正在处理
            {{
              batch.items.filter(
                (i) => !["queued", "running"].includes(i.status),
              ).length
            }}
            / {{ batch.items.length }}</span
          >
        </div>
        <div v-if="batchError" class="notice error">
          {{ batchError }}<button @click="poll">重试</button>
        </div>
        <div
          v-for="item in batch.items"
          :key="item.accountId"
          class="result-row"
        >
          <strong>{{ item.maskedPhone }}</strong
          ><span>{{ resultLabel(item.status) }}</span
          ><small>{{ item.message }}</small
          ><button
            type="button"
            class="log-link"
            @click="showAccountLogs(item.accountId)"
          >
            查看接口调用日志
          </button>
        </div>
      </section>
      <p class="section-note">
        记住服务密码后，会话过期将自动补登；密码错误时，请为对应号码重新登录。
      </p>
    </main>
    <dialog
      ref="modal"
      :class="{ 'wide-dialog': ['detail', 'import'].includes(mode) }"
      @cancel="busy ? $event.preventDefault() : close()"
      @click="$event.target === modal && close()"
      @close="
        password = '';
        mode = '';
      "
    >
      <header class="dialog-header">
        <div>
          <h2>
            {{
              {
                add: "添加账号",
                edit: "编辑账号",
                login: active?.hasSavedPassword ? "重新登录" : "服务密码登录",
                detail: "账号详情",
                import: "批量导入账号",
                group: "移动到分组",
              }[mode]
            }}
          </h2>
          <p v-if="active && mode !== 'login'">{{ active.maskedPhone }}</p>
        </div>
        <button
          type="button"
          aria-label="关闭弹窗"
          :disabled="busy"
          @click="close"
        >
          ×
        </button>
      </header>
      <div class="dialog-body">
        <div v-if="notice" role="status" class="notice">{{ notice }}</div>
        <div v-if="error" role="alert" class="notice error">{{ error }}</div>
        <form
          v-if="['add', 'edit'].includes(mode)"
          id="account-form"
          @submit.prevent="save"
        >
          <label
            >手机号<input
              v-model.trim="form.phone"
              type="tel"
              autocomplete="tel"
              inputmode="numeric"
              pattern="1[0-9]{10}"
              maxlength="11"
              :disabled="mode === 'edit' || busy"
              required
              autofocus /></label
          ><label
            >备注<input
              v-model.trim="form.label"
              maxlength="80"
              :disabled="busy"
              placeholder="例如：主号 / 工作号码" /></label
          ><label
            >分组<input
              v-model.trim="form.group"
              list="group-options"
              maxlength="40"
              placeholder="未分组"
              :disabled="busy" /></label
          ><label class="checkbox-label"
            ><input
              v-model="form.enabled"
              type="checkbox"
              :disabled="busy"
            />启用账号</label
          >
        </form>
        <form
          v-else-if="mode === 'login'"
          id="login-form"
          @submit.prevent="login"
        >
          <label
            >手机号<input
              :value="active?.phone"
              type="tel"
              autocomplete="username"
              readonly /></label
          ><label
            >{{ active?.hasSavedPassword ? "新的服务密码" : "服务密码"
            }}<input
              v-model="password"
              type="password"
              aria-label="服务密码"
              inputmode="numeric"
              autocomplete="new-password"
              pattern="[0-9]{1,32}"
              maxlength="32"
              :disabled="busy"
              required
              autofocus /></label
          ><label class="checkbox-label"
            ><input
              v-model="rememberPassword"
              type="checkbox"
              :disabled="busy"
            />记住服务密码，过期自动补登</label
          >
          <p class="field-note">密码加密保存在服务端，不在账号列表中显示。</p>
          <button
            v-if="active?.hasSavedPassword"
            type="button"
            class="saved-login-button"
            :disabled="busy"
            @click="reloginSaved"
          >
            使用已保存密码重新登录
          </button>
        </form>
        <form
          v-else-if="mode === 'import'"
          id="import-form"
          @submit.prevent="importAccounts"
        >
          <label
            >账号列表<textarea
              v-model="importText"
              rows="8"
              placeholder="手机号#备注#分组&#10;每行一个，不包含密码"
              required
              :disabled="busy"
              autofocus
            ></textarea>
          </label>
          <p class="field-note">
            每批最多 200 个；重复号码跳过，格式错误时整批不保存。
          </p>
        </form>
        <form
          v-else-if="mode === 'group'"
          id="group-form"
          @submit.prevent="batchUpdate({ group: batchGroup })"
        >
          <label
            >目标分组<input
              v-model.trim="batchGroup"
              list="group-options"
              maxlength="40"
              placeholder="留空移入未分组"
              autofocus
          /></label>
        </form>
        <template v-else-if="mode === 'detail' && active"
          ><dl class="detail-grid">
            <div>
              <dt>手机号</dt>
              <dd>{{ active.maskedPhone }}</dd>
            </div>
            <div>
              <dt>备注</dt>
              <dd>{{ safeRemark(active) || "—" }}</dd>
            </div>
            <div>
              <dt>分组</dt>
              <dd>{{ active.group || "未分组" }}</dd>
            </div>
            <div>
              <dt>状态</dt>
              <dd>{{ stateLabel(active) }}</dd>
            </div>
            <div>
              <dt>服务密码</dt>
              <dd>{{ active.hasSavedPassword ? "已加密保存" : "未保存" }}</dd>
            </div>
            <div>
              <dt>自动补登</dt>
              <dd>{{ savedLabel(active) }}</dd>
            </div>
            <div>
              <dt>最近登录</dt>
              <dd>{{ date(active.lastLoginAt) }}</dd>
            </div>
            <div>
              <dt>最近补登</dt>
              <dd>{{ date(active.lastAutoLoginAt) }}</dd>
            </div>
          </dl>
          <div class="detail-tools">
            <button
              :disabled="busy || pending || active.enabled === false"
              @click="task('check', [active.id])"
            >
              检查登录</button
            ><button
              :disabled="busy || pending || active.enabled === false"
              @click="task('refresh', [active.id])"
            >
              更新资料</button
            ><button
              :disabled="busy || pending || active.enabled === false"
              @click="task('friday_wdmei', [active.id])"
            >
              领味多美</button
            ><button
              :disabled="busy || pending || active.enabled === false"
              @click="task('rights_bag_cash', [active.id])"
            >
              领权益福袋</button
            ><button
              :disabled="busy || pending"
              @click="task('close', [active.id])"
              title="关闭后暂停自动补登"
            >
              关闭会话
            </button>
          </div>
          <details
            v-for="[title, data] in [
              ['活动资料', active.activityInfo],
              ['权益资格', active.rights],
              ['余额查询', active.balance],
            ]"
            :key="title"
          >
            <summary>
              {{ title }} · {{ data ? "查看最近结果" : "尚未查询" }}
            </summary>
            <pre v-if="data">{{ JSON.stringify(data, null, 2) }}</pre>
          </details><section v-if="mode === 'detail'" class="operation-logs" aria-label="接口调用日志">
            <div class="section-header"><div><h3>接口调用日志</h3><p class="log-help">展开记录可查看完整请求入参、实际响应值、HTTP 状态和连接诊断。</p></div><span class="muted">{{ logsLoading ? "正在读取…" : `最近 ${operationLogs.length} 条` }}</span></div>
            <div v-if="operationLogs.length" class="log-list">
              <details v-for="(entry, index) in operationLogs" :key="entry.id" class="log-entry" :open="logFailed(entry) && index === 0">
                <summary><span class="log-title">{{ logActionLabel(entry.action) }}<small v-if="entry.payload?.stage"> · {{ logStageLabel(entry.payload.stage) }}</small></span><time>{{ date(entry.createdAt) }}</time><b :class="logFailed(entry) ? 'bad' : 'good'">{{ logFailed(entry) ? '失败' : '已记录' }}</b></summary>
                <div v-if="isApiLog(entry)" class="log-meta"><span>{{ logMethod(entry.payload) }}</span><code>{{ logEndpoint(entry.payload) }}</code><span>HTTP {{ logHttpStatus(entry.payload) }}</span></div>
                <p>{{ entry.payload?.message || entry.payload?.error?.message || (entry.payload?.failure?.retMsg || '后台响应已记录') }}</p>
                <div v-if="isApiLog(entry)" class="log-data"><strong>请求入参</strong><pre>{{ logJson(entry.payload?.request) }}</pre></div>
                <div v-if="isApiLog(entry)" class="log-data"><strong>接口响应 <em v-if="entry.payload?.response == null">（未收到响应体）</em></strong><pre>{{ entry.payload?.response == null ? '未收到响应体' : logJson(entry.payload.response) }}</pre></div>
                <div v-if="entry.payload?.diagnostic" class="log-data"><strong>连接诊断</strong><pre>{{ logJson(entry.payload.diagnostic) }}</pre></div>
                <div v-if="entry.payload?.failure || entry.payload?.error || entry.payload?.details" class="log-data"><strong>失败详情</strong><pre>{{ logJson(entry.payload.failure || entry.payload.error || entry.payload.details) }}</pre></div>
              </details>
            </div>
            <p v-else-if="logsLoading" class="empty compact">正在读取接口调用日志…</p>
            <p v-else-if="logsError" class="empty compact">{{ logsError }}</p>
            <p v-else class="empty compact">暂无操作日志</p>
          </section></template
        >
      </div>
      <footer class="dialog-footer">
        <button type="button" :disabled="busy" @click="close">
          {{ mode === "detail" ? "关闭" : "取消" }}</button
        ><button
          v-if="['add', 'edit'].includes(mode)"
          class="primary"
          form="account-form"
          :disabled="busy"
        >
          {{ busy ? "保存中…" : "保存账号" }}</button
        ><button
          v-if="mode === 'login'"
          class="primary"
          form="login-form"
          :disabled="busy || !/^\d{1,32}$/.test(password)"
        >
          {{ busy ? "正在登录…" : "快捷登录" }}</button
        ><button
          v-if="mode === 'import'"
          class="primary"
          form="import-form"
          :disabled="busy"
        >
          {{ busy ? "导入中…" : "确认导入" }}</button
        ><button
          v-if="mode === 'group'"
          class="primary"
          form="group-form"
          :disabled="busy"
        >
          移动分组
        </button>
      </footer>
    </dialog>
    <datalist id="group-options">
      <option v-for="g in groups" :key="g" :value="g" />
    </datalist>
  </div>
</template>
