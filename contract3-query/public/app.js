const elements = {
  form: document.getElementById("filters"),
  query: document.getElementById("query"),
  primaryWrap: document.getElementById("primary-filter-wrap"),
  primaryLabel: document.getElementById("primary-filter-label"),
  primary: document.getElementById("primary-filter"),
  secondaryWrap: document.getElementById("secondary-filter-wrap"),
  secondaryLabel: document.getElementById("secondary-filter-label"),
  secondary: document.getElementById("secondary-filter"),
  statusWrap: document.getElementById("status-filter-wrap"),
  status: document.getElementById("status-filter"),
  pageSize: document.getElementById("page-size"),
  priceFilters: document.getElementById("price-filters"),
  minPrice: document.getElementById("min-price"),
  maxPrice: document.getElementById("max-price"),
  priceSort: document.getElementById("price-sort"),
  reset: document.getElementById("reset"),
  export: document.getElementById("export"),
  tabs: [...document.querySelectorAll(".dataset-tab")],
  views: [...document.querySelectorAll("[data-view]")],
  comparison: document.getElementById("comparison"),
  table: document.getElementById("results-table"),
  headers: document.getElementById("table-headers"),
  results: document.getElementById("results"),
  empty: document.getElementById("empty"),
  loading: document.getElementById("loading"),
  resultCount: document.getElementById("result-count"),
  totalCount: document.getElementById("total-count"),
  tableTitle: document.getElementById("table-title"),
  filteredTotal: document.getElementById("filtered-total"),
  pageStatus: document.getElementById("page-status"),
  pageRange: document.getElementById("page-range"),
  previous: document.getElementById("previous"),
  next: document.getElementById("next"),
  toast: document.getElementById("toast"),
  themeSelect: document.getElementById("theme-select"),
  gridAdmin: document.getElementById("grid-admin"),
  gridAdminKey: document.getElementById("grid-admin-key"),
  gridAdminIds: document.getElementById("grid-admin-ids"),
  gridConfigure: document.getElementById("grid-configure"),
  gridCollectAll: document.getElementById("grid-collect-all"),
  gridDiscover: document.getElementById("grid-discover"),
  gridAdminStatus: document.getElementById("grid-admin-status"),
  gridModeBar: document.getElementById("grid-mode-bar"),
  gridListMode: document.getElementById("grid-list-mode"),
  gridKnowledgeMode: document.getElementById("grid-knowledge-mode"),
  knowledgePanel: document.getElementById("knowledge-panel"),
  knowledgeQuery: document.getElementById("knowledge-query"),
  knowledgeStatus: document.getElementById("knowledge-status"),
  knowledgePageSize: document.getElementById("knowledge-page-size"),
  knowledgeReset: document.getElementById("knowledge-reset"),
  knowledgeSummary: document.getElementById("knowledge-summary"),
  knowledgeResults: document.getElementById("knowledge-results"),
  knowledgeEmpty: document.getElementById("knowledge-empty"),
  knowledgeLoading: document.getElementById("knowledge-loading"),
  knowledgePrevious: document.getElementById("knowledge-previous"),
  knowledgeNext: document.getElementById("knowledge-next"),
  knowledgePageRange: document.getElementById("knowledge-page-range"),
  knowledgeDetail: document.getElementById("knowledge-detail"),
  knowledgeDetailBackdrop: document.getElementById("knowledge-detail-backdrop"),
  knowledgeDetailClose: document.getElementById("knowledge-detail-close"),
  knowledgeDetailId: document.getElementById("knowledge-detail-id"),
  knowledgeDetailTitle: document.getElementById("knowledge-detail-title"),
  knowledgeDetailBody: document.getElementById("knowledge-detail-body"),
  tableRegion: document.querySelector(".table-region"),
  advancedToggle: document.getElementById("advanced-toggle"),
  advancedClose: document.getElementById("advanced-close"),
  advancedFilters: document.getElementById("advanced-filters"),
  advancedBackdrop: document.getElementById("advanced-backdrop"),
};

const params = new URLSearchParams(window.location.search);
const themeRoot = document.documentElement;
themeRoot.dataset.theme = "mobile";
const requestedType = params.get("type");
const state = {
  type: ["2", "3", "low", "grid", "tariff"].includes(requestedType) ? requestedType : "2",
  view: ["current", "added", "removed", "changed"].includes(params.get("view")) ? params.get("view") : "current",
  query: params.get("q") || "",
  prefix: params.get("prefix") || "",
  category: params.get("category") || "",
  range: params.get("range") || "",
  tariffType: params.get("tariffType") || "",
  tariffStatus: params.get("status") || "",
  grade: params.get("grade") || "",
  minPrice: params.get("minPrice") || "",
  maxPrice: params.get("maxPrice") || "",
  sort: ["price-asc", "price-desc"].includes(params.get("sort")) ? params.get("sort") : "",
  page: Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1),
  pageSize: [25, 50, 100, 200].includes(Number(params.get("pageSize"))) ? Number(params.get("pageSize")) : 50,
  knowledge: params.get("knowledge") === "1",
  knowledgeStatus: params.get("status") || "",
  knowledgePage: Math.max(1, Number.parseInt(params.get("kpage") || "1", 10) || 1),
  knowledgePageSize: [20, 40, 80].includes(Number(params.get("kpageSize"))) ? Number(params.get("kpageSize")) : 20,
  totalPages: 1,
  knowledgeTotalPages: 1,
  controller: null,
  knowledgeController: null,
  knowledgeDetails: new Map(),
  tariffDetails: new Map(),
  advancedOpen: params.get("advanced") === "1",
};

const tableSchemas = {
  "2": [
    { key: "row", label: "序号", className: "col-row optional-mobile" },
    { key: "id", label: "合约编码", className: "col-id" },
    { key: "name", label: "合约名称", className: "col-name" },
    { key: "category", label: "分类", className: "col-category optional-mobile" },
    { key: "price", label: "价格（元）", className: "col-amount" },
    { key: "duration", label: "合约期(月)", className: "col-duration optional-mobile" },
    { key: "validity", label: "有效期", className: "col-validity optional-mobile" },
    { key: "status", label: "状态", className: "col-status optional-mobile" },
    { key: "action", label: "操作", className: "col-action optional-mobile", hiddenLabel: true },
  ],
  "3": [
    { key: "row", label: "序号", className: "col-row optional-mobile" },
    { key: "id", label: "策划 ID", className: "col-id" },
    { key: "prefix", label: "前缀", className: "col-prefix optional-mobile" },
    { key: "name", label: "策划名称", className: "col-name" },
    { key: "category", label: "分类", className: "col-category optional-mobile" },
    { key: "price", label: "价格（元）", className: "col-amount" },
    { key: "validity", label: "有效期", className: "col-validity optional-mobile" },
    { key: "action", label: "操作", className: "col-action optional-mobile", hiddenLabel: true },
  ],
  low: [
    { key: "row", label: "序号", className: "col-row optional-mobile" },
    { key: "name", label: "低消合约方案", className: "col-name" },
    { key: "category", label: "分类", className: "col-category optional-mobile" },
    { key: "price", label: "价格（元）", className: "col-amount" },
    { key: "grade", label: "生效全球通等级", className: "col-grade" },
    { key: "rule", label: "多档规则", className: "col-rule optional-mobile" },
  ],
  grid: [
    { key: "row", label: "序号", className: "col-row optional-mobile" },
    { key: "id", label: "业务 ID", className: "col-grid-id" },
    { key: "name", label: "业务名称 / 档位明细", className: "col-name" },
    { key: "optionCount", label: "档位数", className: "col-duration optional-mobile" },
    { key: "gridAction", label: "入口", className: "col-grid-action" },
  ],
  tariff: [
    { key: "row", label: "序号", className: "col-row optional-mobile" },
    { key: "code", label: "资费编号", className: "col-id" },
    { key: "name", label: "资费名称", className: "col-name" },
    { key: "price", label: "资费标准", className: "col-amount" },
    { key: "onlineRaw", label: "上架日期", className: "col-validity optional-mobile" },
    { key: "offlineRaw", label: "下架日期", className: "col-validity optional-mobile" },
    { key: "status", label: "状态", className: "col-status" },
  ],
};

elements.query.value = state.query;
elements.pageSize.value = String(state.pageSize);
elements.minPrice.value = state.minPrice;
elements.maxPrice.value = state.maxPrice;
elements.priceSort.value = state.sort;
elements.knowledgeQuery.value = state.query;
elements.knowledgeStatus.value = state.knowledgeStatus;
elements.knowledgePageSize.value = String(state.knowledgePageSize);

function debounce(callback, wait = 180) {
  let timer;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => callback(...args), wait);
  };
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => { elements.toast.hidden = true; }, 1800);
}

function knowledgeModeActive() {
  return state.type === "grid" && state.knowledge;
}

function syncAdvancedFilters() {
  const open = state.advancedOpen && !knowledgeModeActive();
  elements.form.classList.toggle("advanced-open", open);
  elements.advancedToggle.setAttribute("aria-expanded", String(open));
  elements.advancedToggle.textContent = open ? "收起高级筛选" : "高级筛选";
  elements.advancedBackdrop.hidden = !open;
  elements.advancedFilters.setAttribute("aria-hidden", String(!open));
}

function syncGridMode() {
  const active = knowledgeModeActive();
  elements.knowledgePanel.hidden = !active;
  elements.tableRegion.hidden = active;
  elements.form.hidden = active;
  elements.comparison.hidden = state.type === "grid";
  elements.gridAdmin.hidden = true;
  elements.gridModeBar.hidden = state.type !== "grid";
  elements.gridListMode.setAttribute("aria-pressed", String(!active));
  elements.gridKnowledgeMode.setAttribute("aria-pressed", String(active));
  elements.gridListMode.classList.toggle("active", !active);
  elements.gridKnowledgeMode.classList.toggle("active", active);
  syncAdvancedFilters();
}

function knowledgeStatusLabel(status) {
  return ({ ok: "已采集", partial: "部分内容", unavailable: "不可用", error: "读取失败", pending: "待采集" })[status] || status || "未知";
}

function formatDate(value) {
  if (!value) return "未采集";
  return value.replace("T", " ").replace(/([+-]\d\d:\d\d|\.\d+Z)$/, "");
}

function renderKnowledgeCards(items) {
  const fragment = document.createDocumentFragment();
  for (const item of items) {
    const card = document.createElement("article");
    card.className = "knowledge-card";
    card.dataset.id = item.package_id;
    const heading = document.createElement("div");
    heading.className = "knowledge-card-heading";
    const title = document.createElement("div");
    title.className = "knowledge-card-title";
    const name = document.createElement("h3");
    name.textContent = item.title || item.configured_name || item.package_id;
    const id = document.createElement("span");
    id.className = "knowledge-id";
    id.textContent = item.package_id;
    title.append(name, id);
    const status = document.createElement("span");
    status.className = `knowledge-status ${item.status || "unknown"}`;
    status.textContent = knowledgeStatusLabel(item.status);
    heading.append(title, status);
    const meta = document.createElement("p");
    meta.className = "knowledge-card-meta";
    meta.textContent = `${item.business_count || 0} 项业务 · 最近采集 ${formatDate(item.last_success_at)}`;
    const action = document.createElement("button");
    action.type = "button";
    action.className = "knowledge-open button secondary";
    action.textContent = "查看知识详情";
    action.dataset.id = item.package_id;
    if (item.status === "unavailable" || item.status === "error") action.textContent = "查看采集状态";
    card.append(heading, meta, action);
    if (item.error) {
      const error = document.createElement("p");
      error.className = "knowledge-card-error";
      error.textContent = item.error;
      card.append(error);
    }
    fragment.append(card);
  }
  elements.knowledgeResults.replaceChildren(fragment);
}

function setKnowledgeLoading(loading) {
  elements.knowledgeLoading.hidden = !loading;
  if (loading) {
    elements.knowledgeEmpty.hidden = true;
    elements.knowledgeResults.replaceChildren();
    elements.knowledgeSummary.textContent = "查询中…";
  }
}

async function loadKnowledge() {
  state.knowledgeController?.abort();
  const controller = new AbortController();
  state.knowledgeController = controller;
  setKnowledgeLoading(true);
  const query = new URLSearchParams({ page: String(state.knowledgePage), pageSize: String(state.knowledgePageSize) });
  if (state.query) query.set("q", state.query);
  if (state.knowledgeStatus) query.set("status", state.knowledgeStatus);
  try {
    const [response, catalogsResponse] = await Promise.all([
      fetch(`/api/grid-catalog?${query}`, { signal: controller.signal, cache: "no-store" }),
      fetch("/api/catalogs", { signal: controller.signal, cache: "no-store" }),
    ]);
    if (!response.ok || !catalogsResponse.ok) throw new Error(`HTTP ${response.status}`);
    const [payload, catalogsPayload] = await Promise.all([response.json(), catalogsResponse.json()]);
    if (controller !== state.knowledgeController) return;
    renderTabs(catalogsPayload.catalogs);
    state.knowledgePage = payload.page;
    state.knowledgePageSize = payload.pageSize;
    state.knowledgeTotalPages = Math.max(1, Math.ceil(payload.total / payload.pageSize));
    renderKnowledgeCards(payload.items);
    elements.knowledgeSummary.textContent = `共 ${payload.total.toLocaleString("zh-CN")} 条入口`;
    const first = payload.total ? (payload.page - 1) * payload.pageSize + 1 : 0;
    const last = payload.total ? first + payload.items.length - 1 : 0;
    elements.knowledgePageRange.textContent = `${first.toLocaleString("zh-CN")} - ${last.toLocaleString("zh-CN")}`;
    elements.knowledgePrevious.disabled = payload.page <= 1;
    elements.knowledgeNext.disabled = payload.page >= state.knowledgeTotalPages;
    elements.knowledgeEmpty.hidden = payload.items.length !== 0;
    syncUrl();
  } catch (error) {
    if (error.name === "AbortError") return;
    elements.knowledgeResults.replaceChildren();
    elements.knowledgeSummary.textContent = "查询失败";
    elements.knowledgeEmpty.textContent = "知识库暂时不可用，请稍后重试";
    elements.knowledgeEmpty.hidden = false;
  } finally {
    if (controller === state.knowledgeController) {
      elements.knowledgeLoading.hidden = true;
    }
  }
}

function addTextBlock(parent, label, text) {
  if (!text) return;
  const section = document.createElement("section");
  section.className = "knowledge-text-section";
  const heading = document.createElement("h4");
  heading.textContent = label;
  const content = document.createElement("p");
  content.textContent = text;
  section.append(heading, content);
  parent.append(section);
}

function tariffValue(value) {
  if (Array.isArray(value)) value = value.filter(Boolean).join(" · ");
  const text = String(value ?? "").trim();
  return text || "未标注";
}

function addTariffField(grid, label, value) {
  const field = document.createElement("div");
  field.className = "tariff-detail-field";
  const heading = document.createElement("h4");
  heading.textContent = label;
  const content = document.createElement("p");
  content.textContent = tariffValue(value);
  field.append(heading, content);
  grid.append(field);
}

function addTariffTextSection(parent, label, value) {
  const section = document.createElement("section");
  section.className = "tariff-detail-text-section";
  const heading = document.createElement("h3");
  heading.textContent = label;
  const content = document.createElement("p");
  content.textContent = tariffValue(value);
  section.append(heading, content);
  parent.append(section);
}

function addTariffResources(parent, resources) {
  const section = document.createElement("section");
  section.className = "tariff-detail-text-section";
  const heading = document.createElement("h3");
  heading.textContent = "资源内容";
  const table = document.createElement("table");
  table.className = "tariff-resource-table";
  const body = document.createElement("tbody");
  const rows = resources?.length ? resources : [{ label: "资源", value: "未标注" }];
  for (const resource of rows) {
    const row = document.createElement("tr");
    const label = document.createElement("th");
    label.scope = "row";
    label.textContent = resource.label || "资源";
    const value = document.createElement("td");
    value.textContent = tariffValue(resource.value);
    row.append(label, value);
    body.append(row);
  }
  table.append(body);
  section.append(heading, table);
  parent.append(section);
}

function renderKnowledgeDetail(detail) {
  elements.knowledgeDetailId.textContent = detail.package_id;
  elements.knowledgeDetailTitle.textContent = detail.title || detail.configured_name || "业务知识详情";
  const body = document.createDocumentFragment();
  const summary = document.createElement("div");
  summary.className = "knowledge-detail-summary";
  summary.textContent = `${knowledgeStatusLabel(detail.status)} · ${detail.businesses.length} 项业务 · 最近采集 ${formatDate(detail.last_success_at)}`;
  body.append(summary);
  if (detail.error) addTextBlock(body, "采集状态", detail.error);
  for (const business of detail.businesses) {
    const businessSection = document.createElement("section");
    businessSection.className = "knowledge-business";
    const heading = document.createElement("h3");
    heading.textContent = `${business.name}（${business.type_id}）`;
    businessSection.append(heading);
    addTextBlock(businessSection, "业务介绍", business.introduction);
    addTextBlock(businessSection, "业务规则", business.rules);
    for (const section of business.sections || []) {
      const sectionBlock = document.createElement("section");
      sectionBlock.className = "knowledge-source-section";
      const sectionHeading = document.createElement("h4");
      sectionHeading.textContent = section.heading || "业务资料";
      sectionBlock.append(sectionHeading);
      if (section.content && section.content !== business.introduction && section.content !== business.rules) {
        const content = document.createElement("p");
        content.textContent = section.content;
        sectionBlock.append(content);
      }
      for (const table of section.tables || []) {
        const tableElement = document.createElement("table");
        tableElement.className = "knowledge-tariff-table";
        for (const [rowIndex, cells] of table.entries()) {
          const row = document.createElement("tr");
          for (const value of cells) {
            const cell = document.createElement(rowIndex === 0 ? "th" : "td");
            cell.textContent = value;
            row.append(cell);
          }
          tableElement.append(row);
        }
        sectionBlock.append(tableElement);
      }
      businessSection.append(sectionBlock);
    }
    if (business.dynamic_pricing) {
      const dynamic = document.createElement("p");
      dynamic.className = "knowledge-dynamic-note";
      dynamic.textContent = "该业务包含动态资费，实际档位以官方页面和办理条件为准。";
      businessSection.append(dynamic);
    }
    body.append(businessSection);
  }
  const entry = document.createElement("a");
  entry.className = "button primary knowledge-source-link";
  entry.href = `/api/grid/open?businessId=${encodeURIComponent(detail.package_id)}`;
  entry.target = "_blank";
  entry.rel = "noopener noreferrer";
  entry.textContent = "打开官方业务入口 ↗";
  body.append(entry);
  elements.knowledgeDetailBody.replaceChildren(body);
}

function renderTariffDetail(item) {
  elements.knowledgeDetailId.textContent = item.code || "资费详情";
  elements.knowledgeDetailTitle.textContent = item.name || "资费详情";
  const body = document.createDocumentFragment();
  const summary = document.createElement("div");
  summary.className = "knowledge-detail-summary";
  summary.textContent = [
    tariffValue(item.price),
    ({ online: "在售", pending: "待上架", offline: "已下架" })[item.status] || item.status || "状态未标注",
  ].join(" · ");
  body.append(summary);
  const fields = document.createElement("section");
  fields.className = "tariff-detail-fields";
  const categories = [...(item.categories || []), ...(item.rangeTabs || []), ...(item.tariffTypes || [])].filter(Boolean);
  [
    ["资费标准", item.price], ["方案编号", item.code],
    ["资费类型", item.tariffTypes], ["资费范围", item.rangeTabs],
    ["适用范围", item.scope], ["适用地区", item.region],
    ["销售渠道", item.channel], ["上架日期", item.onlineRaw],
    ["下架日期", item.offlineRaw], ["有效期限", item.validPeriod],
    ["在网要求", item.networkRequirement], ["退订方式", item.unsubscribe],
    ["违约责任", item.liability], ["归类信息", categories],
  ].forEach(([label, value]) => addTariffField(fields, label, value));
  body.append(fields);
  addTariffResources(body, item.resources);
  addTariffTextSection(body, "其他服务内容", item.otherContent);
  addTariffTextSection(body, "权益内容", item.rights);
  addTariffTextSection(body, "其他说明", item.others);
  addTariffTextSection(body, "额外资费", item.extraFees);
  addTariffTextSection(body, "其他资费", item.otherFees);
  elements.knowledgeDetailBody.replaceChildren(body);
}

async function openKnowledgeDetail(id) {
  elements.knowledgeDetail.hidden = false;
  elements.knowledgeDetailBody.textContent = "正在读取详情…";
  const cached = state.knowledgeDetails.get(id);
  if (cached) {
    renderKnowledgeDetail(cached);
    elements.knowledgeDetailClose.focus();
    return;
  }
  try {
    const response = await fetch(`/api/grid-catalog/detail?id=${encodeURIComponent(id)}`, { cache: "no-store" });
    if (!response.ok) throw new Error();
    const detail = await response.json();
    state.knowledgeDetails.set(id, detail);
    renderKnowledgeDetail(detail);
    elements.knowledgeDetailClose.focus();
  } catch {
    elements.knowledgeDetailBody.textContent = "详情读取失败，请关闭后重试。";
  }
}

function closeKnowledgeDetail() {
  elements.knowledgeDetail.hidden = true;
}

function openTariffDetail(id) {
  const item = state.tariffDetails.get(id);
  if (!item) return;
  elements.knowledgeDetail.hidden = false;
  renderTariffDetail(item);
  elements.knowledgeDetailClose.focus();
}

function syncUrl() {
  const next = new URLSearchParams();
  next.set("type", state.type);
  if (state.view !== "current") next.set("view", state.view);
  if (state.query) next.set("q", state.query);
  if (state.prefix) next.set("prefix", state.prefix);
  if (state.category) next.set("category", state.category);
  if (state.range) next.set("range", state.range);
  if (state.tariffType) next.set("tariffType", state.tariffType);
  if (state.tariffStatus) next.set("status", state.tariffStatus);
  if (state.grade) next.set("grade", state.grade);
  if (state.minPrice !== "") next.set("minPrice", state.minPrice);
  if (state.maxPrice !== "") next.set("maxPrice", state.maxPrice);
  if (state.sort) next.set("sort", state.sort);
  if (state.page !== 1) next.set("page", String(state.page));
  if (state.pageSize !== 50) next.set("pageSize", String(state.pageSize));
  if (state.advancedOpen && !knowledgeModeActive()) next.set("advanced", "1");
  if (knowledgeModeActive()) {
    next.set("knowledge", "1");
    if (state.knowledgeStatus) next.set("status", state.knowledgeStatus);
    if (state.knowledgePage !== 1) next.set("kpage", String(state.knowledgePage));
    if (state.knowledgePageSize !== 20) next.set("kpageSize", String(state.knowledgePageSize));
  }
  window.history.replaceState(null, "", `?${next}`);
}

function selectOptions(select, values, emptyLabel, activeValue) {
  const fragment = document.createDocumentFragment();
  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = emptyLabel;
  fragment.append(empty);
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    fragment.append(option);
  }
  select.replaceChildren(fragment);
  select.value = values.includes(activeValue) ? activeValue : "";
}

function configureFilters(filters) {
  elements.export.hidden = state.type === "tariff";
  if (state.type === "tariff") {
    elements.statusWrap.removeAttribute("hidden");
    selectOptions(elements.status, ["online", "pending", "offline"], "全部状态", state.tariffStatus);
    for (const option of elements.status.options) option.textContent = ({ online: "在售", pending: "待上架", offline: "已下架" })[option.value] || option.textContent;
  } else {
    elements.statusWrap.setAttribute("hidden", "");
  }
  elements.priceFilters.hidden = state.type === "grid" || state.type === "tariff";
  elements.priceFilters.disabled = state.type === "grid" || state.type === "tariff";
  if (state.type === "grid") {
    elements.primaryWrap.hidden = true;
    elements.secondaryWrap.hidden = true;
    return;
  }
  if (state.type === "tariff") {
    elements.primaryWrap.hidden = false;
    elements.primaryLabel.textContent = "资费范围";
    selectOptions(elements.primary, filters.ranges || [], "全部范围", state.range);
    elements.secondaryWrap.hidden = false;
    elements.secondaryLabel.textContent = "资费类型";
    selectOptions(elements.secondary, filters.tariffTypes || [], "全部类型", state.tariffType);
    return;
  }
  elements.secondaryWrap.hidden = false;
  elements.secondaryLabel.textContent = "分类";
  selectOptions(elements.secondary, filters.categories || [], "全部分类", state.category);
  if (state.type === "2") {
    elements.primaryWrap.hidden = false;
    elements.primaryLabel.textContent = "ID 前缀";
    selectOptions(elements.primary, filters.prefixes || [], "全部前缀", state.prefix);
    return;
  }
  if (state.type === "3") {
    elements.primaryWrap.hidden = false;
    elements.primaryLabel.textContent = "ID 前缀";
    selectOptions(elements.primary, filters.prefixes || [], "全部前缀", state.prefix);
    return;
  }
  elements.primaryWrap.hidden = false;
  elements.primaryLabel.textContent = "全球通等级";
  selectOptions(elements.primary, filters.grades || [], "全部等级", state.grade);
}

function renderTabs(catalogs) {
  for (const tab of elements.tabs) {
    const selected = tab.dataset.type === state.type;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    tab.setAttribute("aria-controls", "results-panel");
  }
  for (const [key, catalog] of Object.entries(catalogs)) {
    const count = document.querySelector(`[data-count="${key}"]`);
    if (count) count.textContent = catalog.total.toLocaleString("zh-CN");
  }
}

function renderComparison(payload) {
  const comparison = payload.comparison || (state.type === "tariff" ? { counts: {
    current: payload.meta?.count || 0,
    added: payload.changes?.added || 0,
    removed: payload.changes?.removed || 0,
    changed: payload.changes?.changed || 0,
  } } : null);
  elements.comparison.hidden = !comparison;
  if (comparison) {
    for (const button of elements.views) {
      button.setAttribute("aria-pressed", String(button.dataset.view === state.view));
      button.querySelector("span").textContent = comparison.counts[button.dataset.view].toLocaleString("zh-CN");
    }
  }
  elements.query.placeholder = state.type === "grid" ? "搜索业务 ID、名称或档位关键词" : state.type === "low" ? "搜索方案名称、策划 ID、等级或生效说明" : "搜索合约编码、名称或关键词";
  elements.gridAdmin.hidden = true;
  if (state.type === "grid") refreshGridAdminStatus();
}

async function refreshGridAdminStatus() {
  if (!elements.gridAdminStatus) return;
  try {
    const response = await fetch("/api/grid-catalog/status", { cache: "no-store" });
    if (!response.ok) throw new Error();
    const payload = await response.json();
    const summary = payload.summary || {};
    const statuses = summary.statuses || {};
    elements.gridAdminStatus.textContent = `入口 ${summary.total ?? 0} 个 · 已提取 ${summary.businesses ?? 0} 项业务 · 成功 ${statuses.ok ?? 0} · 部分 ${statuses.partial ?? 0} · 不可用 ${statuses.unavailable ?? 0}${payload.job?.running ? ` · 采集中 ${payload.job.progress || 0}/${payload.job.total || ""}` : ""}`;
  } catch {
    elements.gridAdminStatus.textContent = "采集状态暂时不可用";
  }
}

async function runGridAdmin(endpoint, payload) {
  const key = elements.gridAdminKey.value.trim();
  if (!key) { showToast("请输入业务配置管理密钥"); elements.gridAdminKey.focus(); return; }
  const button = endpoint === "/collect" ? (payload.mode === "discover" ? elements.gridDiscover : elements.gridCollectAll) : elements.gridConfigure;
  button.disabled = true;
  try {
    const response = await fetch(`/api/grid-catalog${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "操作失败");
    showToast(endpoint === "/configure" ? "业务配置已保存" : "采集任务已启动");
    refreshGridAdminStatus();
  } catch (error) { showToast(error.message || "采集操作失败"); }
  finally { button.disabled = false; }
}

function renderHeaders() {
  const fragment = document.createDocumentFragment();
  for (const column of tableSchemas[state.type]) {
    const header = document.createElement("th");
    header.scope = "col";
    header.className = column.className;
    if (column.hiddenLabel) {
      const text = document.createElement("span");
      text.className = "sr-only";
      text.textContent = column.label;
      header.append(text);
    } else {
      header.textContent = column.label;
    }
    fragment.append(header);
  }
  elements.headers.replaceChildren(fragment);
  elements.table.dataset.type = state.type;
}

function createCopyButton(id) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "copy-button";
  button.textContent = "复制";
  button.title = `复制编码 ${id}`;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(id);
      showToast(`已复制 ${id}`);
    } catch {
      showToast("复制失败，请手动选择编码");
    }
  });
  return button;
}

function gradeClass(grade) {
  return ({ 银卡: "silver", 金卡: "gold", 白金卡: "platinum", 钻石卡: "diamond" })[grade] || "neutral";
}

function cellValue(item, key) {
  if (state.type === "tariff" && key === "status") return ({ online: "在售", pending: "待上架", offline: "已下架" })[item.status] || item.status || "-";
  if (state.type === "tariff" && ["onlineRaw", "offlineRaw"].includes(key)) return item[key] || "-";
  if (state.type === "tariff" && key === "price") return item.price || "-";
  if (key === "price") return item.price == null ? "-" : item.price.toLocaleString("zh-CN", { maximumFractionDigits: 2 });
  if (key === "validity") return [item.start, item.end].filter(Boolean).join(" 至 ") || "-";
  if (key === "duration") return item.duration || "-";
  return item[key] || "-";
}

function renderRows(items) {
  const fragment = document.createDocumentFragment();
  if (state.type === "tariff") state.tariffDetails.clear();
  for (const [index, originalItem] of items.entries()) {
    let item = originalItem;
    if (state.type === "tariff") {
      item = { row: index + 1, ...item };
      state.tariffDetails.set(item.code, item);
    }
    const row = document.createElement("tr");
    for (const column of tableSchemas[state.type]) {
      const cell = document.createElement("td");
      cell.className = column.className;
      if (column.key === "gridAction") {
        const link = document.createElement("a");
        link.className = "business-link";
        link.textContent = "打开入口 ↗";
        link.href = item.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", `打开${item.name}业务入口（新窗口，需有效工号）`);
        cell.append(link);
      } else if (column.key === "action") {
        cell.append(createCopyButton(item.id));
      } else if (column.key === "grade") {
        const badge = document.createElement("span");
        badge.className = `grade-badge ${gradeClass(item.grade)}`;
        badge.textContent = item.grade;
        cell.append(badge);
      } else if (column.key === "name") {
        const name = document.createElement("span");
        name.textContent = item.name;
        cell.append(name);
        if (item.changeStatus && item.changeStatus !== "unchanged") {
          const badge = document.createElement("span");
          badge.className = `change-badge ${item.changeStatus}`;
          badge.textContent = ({ added: "新增", removed: "旧版移除", changed: "已变更" })[item.changeStatus];
          cell.append(badge);
        }
        for (const change of item.changes || []) {
          const detail = document.createElement("small");
          detail.className = "change-detail";
          detail.textContent = `${change.label}：${change.before || "未标注"} → ${change.after || "未标注"}`;
          cell.append(detail);
        }
        if (state.type === "low" && item.rule) {
          const rule = document.createElement("small");
          rule.className = "mobile-rule";
          rule.textContent = item.rule;
          cell.append(rule);
        }
        if (state.type === "low" && item.variants?.length) {
          const details = document.createElement("details");
          details.className = "variant-details";
          const summary = document.createElement("summary");
          summary.textContent = `策划 ID 及生效详情（${item.variants.length} 项）`;
          details.append(summary);
          for (const variant of item.variants) {
            const line = document.createElement("p");
            line.textContent = `${variant.id} · ${variant.kind} · 承诺金额：${variant.amount || "未标注"} · 合约期(月)：${variant.duration || "未标注"} · 是否立即生效：${variant.immediate || "未标注"}${variant.note ? ` · ${variant.note}` : ""}`;
            details.append(line);
          }
          cell.append(details);
        }
        if (state.type === "tariff") {
          const summary = document.createElement("small");
          summary.className = "mobile-summary tariff-meta";
          summary.textContent = [
            (item.categories || []).join(" / "),
            (item.rangeTabs || []).join(" / "),
            (item.tariffTypes || []).join(" / "),
          ].filter(Boolean).join(" · ");
          if (summary.textContent) cell.append(summary);
          const detailsButton = document.createElement("button");
          detailsButton.type = "button";
          detailsButton.className = "row-details-button tariff-detail-button";
          detailsButton.dataset.id = item.code;
          detailsButton.textContent = "查看资费详情";
          detailsButton.setAttribute("aria-label", `查看${item.name || item.code}资费详情`);
          cell.append(detailsButton);
        }
        if (state.type !== "grid" && state.type !== "tariff") {
          const summary = document.createElement("small");
          summary.className = "mobile-summary";
          const values = [
            item.category && `分类：${item.category}`,
            item.grade && `等级：${item.grade}`,
            item.duration && `合约期：${item.duration}个月`,
            item.validity && `有效期：${item.validity}`,
            item.status && `状态：${item.status}`,
          ].filter(Boolean);
          summary.textContent = values.join(" · ");
          if (values.length) cell.append(summary);
          const details = document.createElement("details");
          details.className = "row-details";
          const detailsSummary = document.createElement("summary");
          detailsSummary.textContent = "查看详情";
          const detailsText = document.createElement("p");
          detailsText.textContent = values.join("\n") || "暂无更多详情";
          details.append(detailsSummary, detailsText);
          cell.append(details);
        }
        if (state.type === "grid") {
          const details = document.createElement("details");
          details.className = "variant-details";
          const summary = document.createElement("summary");
          summary.textContent = `${item.optionCount} 个档位 / 子业务${item.note ? ` · ${item.note}` : ""}`;
          const detail = document.createElement("p");
          detail.textContent = item.details;
          details.append(summary, detail);
          cell.append(details);
        }
      } else {
        cell.textContent = cellValue(item, column.key);
      }
      row.append(cell);
    }
    fragment.append(row);
  }
  elements.results.replaceChildren(fragment);
}

function setLoading(isLoading) {
  elements.loading.hidden = !isLoading;
  elements.table.setAttribute("aria-busy", String(isLoading));
  if (isLoading) {
    elements.filteredTotal.textContent = "筛选中…";
    elements.resultCount.textContent = "-";
    elements.empty.hidden = true;
    elements.results.replaceChildren();
  }
}

function activeQueryParams(includePage = true) {
  const query = new URLSearchParams({ type: state.type });
  query.set("view", state.view);
  if (state.query) query.set("q", state.query);
  if (state.prefix) query.set("prefix", state.prefix);
  if (state.category) query.set("category", state.category);
  if (state.range) query.set("range", state.range);
  if (state.tariffType) query.set("tariffType", state.tariffType);
  if (state.tariffStatus) query.set("status", state.tariffStatus);
  if (state.grade) query.set("grade", state.grade);
  if (state.minPrice !== "") query.set("minPrice", state.minPrice);
  if (state.maxPrice !== "") query.set("maxPrice", state.maxPrice);
  if (state.sort) query.set("sort", state.sort);
  if (includePage) {
    query.set("page", String(state.page));
    query.set("pageSize", String(state.pageSize));
  }
  return query;
}

async function loadContracts() {
  if (state.type === "tariff") {
    await loadTariffs();
    return;
  }
  syncGridMode();
  if (knowledgeModeActive()) {
    await loadKnowledge();
    return;
  }
  state.controller?.abort();
  const controller = new AbortController();
  state.controller = controller;
  setLoading(true);

  try {
    const response = await fetch(`/api/contracts?${activeQueryParams()}`, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (controller !== state.controller) return;
    state.page = payload.page;
    state.view = payload.view;
    state.prefix = payload.activeFilters.prefix;
    state.category = payload.activeFilters.category;
    state.grade = payload.activeFilters.grade;
    state.minPrice = payload.activeFilters.minPrice ?? "";
    state.maxPrice = payload.activeFilters.maxPrice ?? "";
    state.sort = payload.sort;
    state.totalPages = payload.totalPages;
    renderTabs(payload.catalogs);
    renderComparison(payload);
    syncGridMode();
    configureFilters(payload.filters);
    renderHeaders();
    renderRows(payload.items);

    elements.resultCount.textContent = payload.total.toLocaleString("zh-CN");
    elements.filteredTotal.textContent = `共 ${payload.total.toLocaleString("zh-CN")} 条`;
    elements.totalCount.textContent = payload.meta.total.toLocaleString("zh-CN");
    elements.tableTitle.textContent = `${payload.label} · ${payload.viewLabel}`;
    elements.pageStatus.textContent = `第 ${payload.page} / ${payload.totalPages} 页`;
    const first = payload.total ? (payload.page - 1) * payload.pageSize + 1 : 0;
    const last = payload.total ? first + payload.items.length - 1 : 0;
    elements.pageRange.textContent = `${first.toLocaleString("zh-CN")} - ${last.toLocaleString("zh-CN")}`;
    elements.previous.disabled = payload.page <= 1;
    elements.next.disabled = payload.page >= payload.totalPages;
    elements.empty.textContent = payload.total === 0 && !state.query && !state.prefix && !state.category && !state.grade && state.minPrice === "" && state.maxPrice === ""
      ? ({ added: "本次对比没有新增记录", removed: "本次对比没有删减记录", changed: "本次对比没有内容变更" })[state.view] || "没有匹配的记录" : "没有匹配的记录";
    elements.empty.hidden = payload.items.length !== 0;
    syncUrl();
  } catch (error) {
    if (error.name === "AbortError") return;
    elements.empty.textContent = "数据加载失败，请稍后重试";
    elements.empty.hidden = false;
    elements.resultCount.textContent = "-";
    elements.filteredTotal.textContent = "查询失败";
    showToast("查询服务暂时不可用");
  } finally {
    if (controller === state.controller) setLoading(false);
  }
}

function resetDatasetFilters() {
  state.prefix = "";
  state.category = "";
  state.range = "";
  state.tariffType = "";
  state.tariffStatus = "";
  state.grade = "";
  state.minPrice = "";
  state.maxPrice = "";
  state.sort = "";
  elements.minPrice.value = "";
  elements.maxPrice.value = "";
  elements.maxPrice.setCustomValidity("");
  elements.priceSort.value = "";
  state.page = 1;
}

function applySearch() {
  elements.maxPrice.setCustomValidity(elements.minPrice.value !== "" && elements.maxPrice.value !== "" && Number(elements.minPrice.value) > Number(elements.maxPrice.value) ? "最高价格不能低于最低价格" : "");
  if (!elements.form.checkValidity()) return;
  state.query = elements.query.value.trim();
  state.minPrice = elements.minPrice.value === "" ? "" : String(Number(elements.minPrice.value));
  state.maxPrice = elements.maxPrice.value === "" ? "" : String(Number(elements.maxPrice.value));
  state.page = 1;
  state.advancedOpen = false;
  syncAdvancedFilters();
  loadContracts();
}
const search = debounce(applySearch);

async function loadTariffs() {
  state.controller?.abort();
  const controller = new AbortController();
  state.controller = controller;
  setLoading(true);
  try {
    const params = new URLSearchParams({ view: state.view, page: String(state.page), pageSize: String(state.pageSize) });
    if (state.query) params.set("q", state.query);
    if (state.range) params.set("range", state.range);
    if (state.tariffType) params.set("tariffType", state.tariffType);
    if (state.tariffStatus) params.set("status", state.tariffStatus);
    const response = await fetch("/api/tariffs?" + params, { signal: controller.signal, cache: "no-store" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const payload = await response.json();
    if (controller !== state.controller) return;
    state.page = payload.page;
    state.totalPages = payload.totalPages;
    renderTabs(payload.catalogs);
    renderComparison(payload);
    configureFilters(payload.filters);
    renderHeaders();
    renderRows(payload.items);
    elements.resultCount.textContent = payload.total.toLocaleString("zh-CN");
    elements.filteredTotal.textContent = "共 " + payload.total.toLocaleString("zh-CN") + " 条";
    elements.totalCount.textContent = (payload.meta.count || 0).toLocaleString("zh-CN");
    elements.tableTitle.textContent = payload.label + " · " + payload.viewLabel;
    elements.pageStatus.textContent = "第 " + payload.page + " / " + payload.totalPages + " 页";
    const first = payload.total ? (payload.page - 1) * payload.pageSize + 1 : 0;
    const last = payload.total ? first + payload.items.length - 1 : 0;
    elements.pageRange.textContent = first.toLocaleString("zh-CN") + " - " + last.toLocaleString("zh-CN");
    elements.previous.disabled = payload.page <= 1;
    elements.next.disabled = payload.page >= payload.totalPages;
    elements.empty.textContent = payload.total ? "没有匹配的记录" : (payload.meta.updatedAt ? "当前没有匹配的资费" : "资费尚未完成首次同步，请稍后刷新");
    elements.empty.hidden = payload.items.length !== 0;
    syncUrl();
  } catch (error) {
    if (error.name === "AbortError") return;
    elements.empty.textContent = "资费数据加载失败，请稍后重试";
    elements.empty.hidden = false;
    showToast("资费查询服务暂时不可用");
  } finally {
    if (controller === state.controller) setLoading(false);
  }
}

for (const tab of elements.tabs) {
  tab.addEventListener("click", () => {
    if (state.type === tab.dataset.type) return;
    state.type = tab.dataset.type;
    state.view = "current";
    state.knowledge = false;
    state.knowledgePage = 1;
    resetDatasetFilters();
    loadContracts();
  });
}
for (const button of elements.views) {
  button.addEventListener("click", () => {
    state.view = button.dataset.view;
    state.page = 1;
    loadContracts();
  });
}
elements.tabs.forEach((tab, index) => {
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % elements.tabs.length;
    if (event.key === "ArrowLeft") next = (index + elements.tabs.length - 1) % elements.tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = elements.tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    elements.tabs[next].focus();
    elements.tabs[next].click();
  });
});
elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  applySearch();
});
elements.advancedToggle.addEventListener("click", () => {
  state.advancedOpen = !state.advancedOpen;
  syncAdvancedFilters();
});
elements.advancedClose.addEventListener("click", () => {
  state.advancedOpen = false;
  syncAdvancedFilters();
});
elements.advancedBackdrop.addEventListener("click", () => {
  state.advancedOpen = false;
  syncAdvancedFilters();
});
elements.query.addEventListener("input", search);
elements.knowledgeQuery.addEventListener("input", debounce(() => {
  if (!knowledgeModeActive()) return;
  state.query = elements.knowledgeQuery.value.trim();
  state.knowledgePage = 1;
  loadKnowledge();
}, 180));
for (const input of [elements.minPrice, elements.maxPrice]) {
  input.addEventListener("input", () => {
    elements.maxPrice.setCustomValidity("");
    search();
  });
  input.addEventListener("change", () => {
    applySearch();
    elements.form.reportValidity();
  });
}
elements.priceSort.addEventListener("change", () => {
  state.sort = elements.priceSort.value;
  applySearch();
});
elements.primary.addEventListener("change", () => {
  if (state.type === "tariff") state.range = elements.primary.value;
  else if (state.type === "low") state.grade = elements.primary.value;
  else state.prefix = elements.primary.value;
  state.page = 1;
  loadContracts();
});
elements.secondary.addEventListener("change", () => {
  if (state.type === "tariff") state.tariffType = elements.secondary.value;
  else state.category = elements.secondary.value;
  state.page = 1;
  loadContracts();
});
elements.status.addEventListener("change", () => {
  state.tariffStatus = elements.status.value;
  state.page = 1;
  loadContracts();
});
elements.pageSize.addEventListener("change", () => {
  state.pageSize = Number(elements.pageSize.value);
  state.page = 1;
  loadContracts();
});
elements.reset.addEventListener("click", () => {
  state.query = "";
  elements.query.value = "";
  resetDatasetFilters();
  loadContracts();
  elements.query.focus();
});
elements.gridListMode.addEventListener("click", () => {
  state.knowledge = false;
  state.knowledgePage = 1;
  state.knowledgeStatus = "";
  state.query = "";
  elements.query.value = "";
  elements.knowledgeQuery.value = "";
  loadContracts();
});
elements.gridKnowledgeMode.addEventListener("click", () => {
  state.knowledge = true;
  state.knowledgePage = 1;
  state.query = elements.query.value.trim();
  elements.knowledgeQuery.value = state.query;
  loadContracts();
});
elements.knowledgeStatus.addEventListener("change", () => {
  state.knowledgeStatus = elements.knowledgeStatus.value;
  state.knowledgePage = 1;
  loadKnowledge();
});
elements.knowledgePageSize.addEventListener("change", () => {
  state.knowledgePageSize = Number(elements.knowledgePageSize.value);
  state.knowledgePage = 1;
  loadKnowledge();
});
elements.knowledgeReset.addEventListener("click", () => {
  state.query = "";
  state.knowledgeStatus = "";
  state.knowledgePage = 1;
  elements.knowledgeQuery.value = "";
  elements.knowledgeStatus.value = "";
  loadKnowledge();
  elements.knowledgeQuery.focus();
});
elements.knowledgeResults.addEventListener("click", (event) => {
  const button = event.target.closest(".knowledge-open");
  if (button) openKnowledgeDetail(button.dataset.id);
});
elements.results.addEventListener("click", (event) => {
  const button = event.target.closest(".tariff-detail-button");
  if (button) openTariffDetail(button.dataset.id);
});
elements.knowledgePrevious.addEventListener("click", () => {
  if (state.knowledgePage <= 1) return;
  state.knowledgePage -= 1;
  loadKnowledge();
});
elements.knowledgeNext.addEventListener("click", () => {
  if (state.knowledgePage >= state.knowledgeTotalPages) return;
  state.knowledgePage += 1;
  loadKnowledge();
});
elements.knowledgeDetailClose.addEventListener("click", closeKnowledgeDetail);
elements.knowledgeDetailBackdrop.addEventListener("click", closeKnowledgeDetail);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !elements.knowledgeDetail.hidden) closeKnowledgeDetail();
});
elements.export.addEventListener("click", () => {
  window.location.assign(`/api/contracts.csv?${activeQueryParams(false)}`);
});
elements.previous.addEventListener("click", () => {
  if (state.page <= 1) return;
  state.page -= 1;
  loadContracts();
});
elements.next.addEventListener("click", () => {
  if (state.page >= state.totalPages) return;
  state.page += 1;
  loadContracts();
});

if (elements.gridConfigure) elements.gridConfigure.addEventListener("click", () => {
  const ids = elements.gridAdminIds.value.split(/[\s,，]+/).map((id) => id.trim()).filter(Boolean);
  runGridAdmin("/configure", { ids });
});
if (elements.gridCollectAll) elements.gridCollectAll.addEventListener("click", () => runGridAdmin("/collect", { mode: "all" }));
if (elements.gridDiscover) elements.gridDiscover.addEventListener("click", () => runGridAdmin("/collect", { mode: "discover" }));

loadContracts();
