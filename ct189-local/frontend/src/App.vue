<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from "vue";
import { api } from "./api";

const accounts = ref([]),
  tasks = ref([]),
  view = ref("accounts");
const search = ref(""),
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
  logs = ref([]);
const form = ref({ phone: "", label: "", group: "", enabled: true }),
  importText = ref(""),
  batchGroup = ref("");
const taskDetail = ref(null);
let timer;
const active = computed(() =>
  accounts.value.find((a) => a.id === activeId.value),
);
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
const pending = computed(() =>
  tasks.value.some((t) => ["queued", "running"].includes(t.status)),
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
    : {
        valid: "登录有效",
        invalid: "需要登录",
        closed: "会话关闭",
        new: "待登录",
      }[a.loginStatus] || "待登录";
const taskLabel = (state) =>
  ({
    queued: "排队中",
    running: "执行中",
    success: "成功",
    failed: "失败",
    partial: "部分完成",
    skipped: "已跳过",
    interrupted: "已中断",
  })[state] || state;
const actionLabel = (action) =>
  ({
    password_login: "账密登录",
    check_login: "检查登录",
    close_session: "关闭会话",
    check: "检查登录",
    refresh: "更新资料",
    close: "关闭会话",
    rights_draw: "领取权益",
  })[action] || action;
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
  if (initial) loading.value = true;
  const results = await Promise.allSettled([
    api.accounts(),
    api.tasks(),
    api.health(),
  ]);
  if (results[0].status === "fulfilled") {
    accounts.value = results[0].value.accounts;
    selected.value = selected.value.filter((id) =>
      accounts.value.some((a) => a.id === id),
    );
  } else feedback("账号读取失败，已保留当前列表。请检查本地服务后重试。", true);
  if (results[1].status === "fulfilled") {
    tasks.value = results[1].value.tasks;
    if (taskDetail.value)
      taskDetail.value =
        tasks.value.find((t) => t.id === taskDetail.value.id) ||
        taskDetail.value;
  } else feedback("任务记录读取失败，请稍后重试。", true);
  connected.value = results[2].status === "fulfilled";
  loading.value = false;
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
  const visible = filtered.value.map((a) => a.id);
  selected.value = event.target.checked
    ? [...new Set([...selected.value, ...visible])]
    : selected.value.filter((id) => !visible.includes(id));
}
async function open(which, account) {
  mode.value = which;
  activeId.value = account?.id || "";
  password.value = "";
  logs.value = [];
  feedback("");
  form.value = account
    ? {
        phone: account.phone,
        label: account.label,
        group: account.group,
        enabled: account.enabled !== false,
      }
    : { phone: "", label: "", group: "", enabled: true };
  importText.value = "";
  batchGroup.value = "";
  await nextTick();
  modal.value.showModal();
  if (which === "detail" && account) {
    try {
      const data = await api.logs(account.id);
      if (activeId.value === account.id) logs.value = data.logs;
    } catch {
      feedback("操作记录读取失败", true);
    }
  }
}
function close() {
  if (busy.value) return;
  modal.value.close();
  password.value = "";
  mode.value = "";
}
async function save() {
  await perform(async () => {
    if (mode.value === "edit")
      replace((await api.patchAccount(activeId.value, form.value)).account);
    else {
      await api.saveAccount(form.value);
      await reload();
    }
    modal.value.close();
    password.value = "";
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
        if (extra.length || !/^1\d{10}$/.test(phone.trim()))
          throw new Error(
            "每行格式为 手机号#备注#分组，不包含密码；请检查后重试",
          );
        return {
          phone: phone.trim(),
          label: label.trim(),
          group: group.trim(),
        };
      });
    const result = await api.importAccounts(rows);
    modal.value.close();
    importText.value = "";
    await reload();
    feedback(
      `导入完成：新增 ${result.added} 个，重复跳过 ${result.skipped} 个`,
    );
  });
}
async function login() {
  const id = activeId.value,
    secret = password.value;
  password.value = "";
  await perform(async () => {
    const result = await api.loginPassword(id, secret);
    replace(result.account);
    modal.value.close();
    feedback("登录成功，已核验号码");
  });
}
async function task(action, ids = selected.value) {
  await perform(async () => {
    await api.startTask(action, ids);
    await reload();
    feedback("任务已加入队列，可在任务记录查看每个账号的结果");
  });
}
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
    !window.confirm(`删除 ${ids.length} 个账号及本地登录会话？此操作不可撤销。`)
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
      `删除完成：成功 ${done} 个${failed ? `，失败 ${failed} 个（请等待账号任务完成后重试）` : ""}`,
      failed > 0,
    );
  });
}
function showTask(t) {
  taskDetail.value = t;
  open("task");
}
onMounted(async () => {
  await reload(true);
  timer = setInterval(() => {
    if (pending.value && !busy.value) reload();
  }, 2500);
});
onUnmounted(() => clearInterval(timer));
</script>

<template>
  <div class="workspace">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-mark">CT</span>
        <div><strong>北京电信</strong><small>本地账号工作台</small></div>
      </div>
      <div class="nav-caption">工作空间</div>
      <nav aria-label="主导航">
        <button
          :class="{ current: view === 'accounts' }"
          @click="view = 'accounts'"
        >
          <span>账号管理</span
          ><span class="nav-count">{{ accounts.length }}</span>
        </button>
        <button :class="{ current: view === 'tasks' }" @click="view = 'tasks'">
          <span>任务记录</span><span v-if="pending" class="live-dot"></span>
        </button>
        <button
          :class="{ current: view === 'automation' }"
          @click="view = 'automation'"
        >
          青龙自动化
        </button>
      </nav>
      <div class="sidebar-bottom">
        <span class="live-dot" :class="{ offline: !connected }"></span
        >{{ connected ? "本地服务已连接" : "本地服务未连接"
        }}<small>会话在本机隔离运行</small>
      </div>
    </aside>
    <div class="main-shell">
      <header class="topbar">
        <span
          >工作台 <span class="slash">/</span>
          {{
            {
              accounts: "账号管理",
              tasks: "任务记录",
              automation: "青龙自动化",
            }[view]
          }}</span
        ><span class="local-tag">本地运行</span>
      </header>
      <main>
        <div class="page-heading">
          <div>
            <h1>
              {{
                {
                  accounts: "账号管理",
                  tasks: "任务记录",
                  automation: "青龙自动化",
                }[view]
              }}
            </h1>
            <p>
              {{
                {
                  accounts: "管理号码、登录会话与批量任务",
                  tasks: "查看批量任务进度与每个号码的执行结果",
                  automation: "批量账号与定时任务，在青龙独立运行",
                }[view]
              }}
            </p>
          </div>
          <div class="heading-actions">
            <button :disabled="busy || loading" @click="reload(true)">
              刷新</button
            ><template v-if="view === 'accounts'"
              ><button :disabled="busy" @click="open('import')">批量导入</button
              ><button class="primary" :disabled="busy" @click="open('add')">
                ＋ 添加账号
              </button></template
            >
          </div>
        </div>
        <div v-if="notice" class="notice" role="status">{{ notice }}</div>
        <div v-if="error && !mode" class="notice error" role="alert">
          {{ error }}
        </div>
        <template v-if="view === 'accounts'">
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
              ><button :disabled="busy" @click="task('check')">检查登录</button
              ><button :disabled="busy" @click="task('refresh')">
                更新资料</button
              ><button :disabled="busy" @click="open('group')">移动分组</button
              ><button :disabled="busy" @click="batchUpdate({ enabled: true })">
                启用</button
              ><button
                :disabled="busy"
                @click="batchUpdate({ enabled: false })"
              >
                停用</button
              ><button :disabled="busy" @click="task('close')">关闭会话</button
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
            <template v-else>
              <table v-if="filtered.length" class="accounts-table">
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
                    <th>账号 / 备注</th>
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
                        {{ a.label }}</button
                      ><span class="phone"
                        >{{ a.maskedPhone
                        }}<span class="mobile-group">
                          · {{ a.group || "未分组" }}</span
                        ></span
                      >
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
                        :disabled="busy || a.enabled === false"
                        @click="open('login', a)"
                      >
                        登录</button
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
                      : "添加号码后，使用服务密码在本地完成登录"
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
              </div>
            </template>
            <footer class="list-footer">
              <span
                >显示 {{ filtered.length }} / {{ accounts.length }} 个账号</span
              ><span>密码仅用于当次登录</span>
            </footer>
          </section>
          <div class="section-note">
            <span>批量任务</span>勾选账号可检查登录、更新资料或关闭会话。<button
              class="text-button"
              @click="view = 'tasks'"
            >
              查看任务记录 →
            </button>
          </div>
        </template>
        <template v-else-if="view === 'tasks'">
          <section class="account-panel">
            <div class="section-header">
              <h2>最近任务</h2>
              <span class="muted">保留最近 100 批</span>
            </div>
            <div v-if="!tasks.length" class="empty">
              <strong>还没有批量任务</strong>
              <p>在账号管理中选择号码，即可开始检查登录或更新资料。</p>
              <button @click="view = 'accounts'">前往账号管理</button>
            </div>
            <div v-for="t in tasks" :key="t.id" class="task-row">
              <div>
                <strong>{{ t.title }}</strong
                ><small
                  >{{ date(t.createdAt) }} · {{ t.items.length }} 个账号</small
                >
              </div>
              <div class="task-progress">
                <span
                  >{{
                    t.items.filter(
                      (i) => !["queued", "running"].includes(i.status),
                    ).length
                  }}
                  / {{ t.items.length }}</span
                ><progress
                  :value="
                    t.items.filter(
                      (i) => !['queued', 'running'].includes(i.status),
                    ).length
                  "
                  :max="t.items.length"
                ></progress>
              </div>
              <span
                class="status-label"
                :class="t.status === 'success' ? 'good' : 'warning'"
                >{{ taskLabel(t.status) }}</span
              ><button @click="showTask(t)">结果</button>
            </div>
          </section>
        </template>
        <section v-else class="automation account-panel">
          <div class="section-header">
            <h2>独立 Python 脚本</h2>
            <span class="local-tag">QingLong</span>
          </div>
          <div class="automation-content">
            <h3>1. 安装运行依赖</h3>
            <p>
              将项目内
              <code>qinglong/ct189.py</code>
              上传到青龙脚本目录。在同一运行环境安装依赖和无头 Chromium：
            </p>
            <pre>
pip3 install -r requirements.txt
python3 -m playwright install --with-deps chromium</pre>
            <h3>2. 配置账号变量</h3>
            <p>
              变量名 <code>CT189_ACCOUNTS</code>，每行一个账号，密码保留前导零：
            </p>
            <pre>
手机号#服务密码#备注
手机号#服务密码#备注</pre>
            <p>
              也支持 JSON 数组，字段为
              <code>phone</code
              >、<code>password</code>、<code>label</code>、<code>enabled</code>。网页账号与青龙会话各自独立。
            </p>
            <h3>3. 创建定时任务</h3>
            <pre>python3 ct189.py --tasks login</pre>
            <p>
              <code>login</code> 核验缓存会话，失效时使用密码登录。<code
                >activity</code
              >
              在核验号码后查询活动资格。建议先手动运行验证环境，再设置定时执行。
            </p>
            <div class="feature-line">
              <strong>签到 / 领取权益</strong
              ><span>待接入 · 当前脚本不执行领取操作</span>
            </div>
            <p>
              后续任务通过脚本中的
              <code>TASKS</code>
              注册表接入；未知任务会在登录前拒绝执行。安装、变量和缓存配置详见
              <code>qinglong/README.md</code>。
            </p>
          </div>
        </section>
      </main>
    </div>
    <dialog
      ref="modal"
      :class="{ 'wide-dialog': ['detail', 'task', 'import'].includes(mode) }"
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
                login: "服务密码登录",
                detail: "账号详情",
                import: "批量导入账号",
                group: "移动到分组",
                task: "任务结果",
              }[mode]
            }}
          </h2>
          <p v-if="active">{{ active.maskedPhone }}</p>
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
          <p class="muted">
            使用手机号对应的数字服务密码，登录后自动核验号码。
          </p>
          <label
            >服务密码<input
              v-model="password"
              type="password"
              inputmode="numeric"
              autocomplete="current-password"
              pattern="[0-9]{1,32}"
              maxlength="32"
              :disabled="busy"
              required
              autofocus
          /></label>
          <p class="field-note">密码不保存，登录全程在本地应用内完成。</p>
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
              <dt>备注</dt>
              <dd>{{ active.label }}</dd>
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
              <dt>最近登录</dt>
              <dd>{{ date(active.lastLoginAt) }}</dd>
            </div>
          </dl>
          <div class="detail-tools">
            <button
              :disabled="busy || active.enabled === false"
              @click="task('check', [active.id])"
            >
              检查登录</button
            ><button
              :disabled="busy || active.enabled === false"
              @click="task('refresh', [active.id])"
            >
              更新资料</button
            ><button :disabled="busy" @click="task('close', [active.id])">
              关闭会话
            </button>
          </div>
          <h3>操作记录</h3>
          <p v-if="!logs.length" class="muted">暂无记录</p>
          <div v-for="log in logs" :key="log.id" class="log-row">
            <span>{{ actionLabel(log.action) }}</span
            ><span>{{
              log.payload?.message ||
              (log.payload?.ok === false
                ? "失败"
                : log.payload?.ok === true
                  ? "成功"
                  : "已记录")
            }}</span
            ><time>{{ date(log.createdAt) }}</time>
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
          </details></template
        >
        <template v-else-if="mode === 'task' && taskDetail"
          ><p class="muted">
            {{ taskDetail.title }} · {{ taskLabel(taskDetail.status) }} ·
            {{ date(taskDetail.createdAt) }}
          </p>
          <div
            v-for="item in taskDetail.items"
            :key="item.accountId"
            class="result-row"
          >
            <strong>{{ item.maskedPhone }}</strong
            ><span>{{ taskLabel(item.status) }}</span
            ><small>{{ item.message }}</small>
          </div></template
        >
      </div>
      <footer class="dialog-footer">
        <button type="button" :disabled="busy" @click="close">
          {{ ["detail", "task"].includes(mode) ? "关闭" : "取消" }}</button
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
