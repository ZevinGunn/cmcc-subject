const elements = {
  form: document.getElementById("filters"),
  query: document.getElementById("query"),
  primaryWrap: document.getElementById("primary-filter-wrap"),
  primaryLabel: document.getElementById("primary-filter-label"),
  primary: document.getElementById("primary-filter"),
  secondaryWrap: document.getElementById("secondary-filter-wrap"),
  secondaryLabel: document.getElementById("secondary-filter-label"),
  secondary: document.getElementById("secondary-filter"),
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
};

const params = new URLSearchParams(window.location.search);
const requestedType = params.get("type");
const state = {
  type: ["2", "3", "low", "grid"].includes(requestedType) ? requestedType : "2",
  view: ["current", "added", "removed", "changed"].includes(params.get("view")) ? params.get("view") : "current",
  query: params.get("q") || "",
  prefix: params.get("prefix") || "",
  category: params.get("category") || "",
  grade: params.get("grade") || "",
  minPrice: params.get("minPrice") || "",
  maxPrice: params.get("maxPrice") || "",
  sort: ["price-asc", "price-desc"].includes(params.get("sort")) ? params.get("sort") : "",
  page: Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1),
  pageSize: [25, 50, 100, 200].includes(Number(params.get("pageSize"))) ? Number(params.get("pageSize")) : 50,
  totalPages: 1,
  controller: null,
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
    { key: "price", label: "价格（元）", className: "col-amount" },
    { key: "validity", label: "有效期", className: "col-validity optional-mobile" },
    { key: "action", label: "操作", className: "col-action optional-mobile", hiddenLabel: true },
  ],
  low: [
    { key: "row", label: "序号", className: "col-row optional-mobile" },
    { key: "name", label: "低消合约方案", className: "col-name" },
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
};

elements.query.value = state.query;
elements.pageSize.value = String(state.pageSize);
elements.minPrice.value = state.minPrice;
elements.maxPrice.value = state.maxPrice;
elements.priceSort.value = state.sort;

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

function syncUrl() {
  const next = new URLSearchParams();
  next.set("type", state.type);
  if (state.view !== "current") next.set("view", state.view);
  if (state.query) next.set("q", state.query);
  if (state.prefix) next.set("prefix", state.prefix);
  if (state.category) next.set("category", state.category);
  if (state.grade) next.set("grade", state.grade);
  if (state.minPrice !== "") next.set("minPrice", state.minPrice);
  if (state.maxPrice !== "") next.set("maxPrice", state.maxPrice);
  if (state.sort) next.set("sort", state.sort);
  if (state.page !== 1) next.set("page", String(state.page));
  if (state.pageSize !== 50) next.set("pageSize", String(state.pageSize));
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
  elements.priceFilters.hidden = state.type === "grid";
  elements.priceFilters.disabled = state.type === "grid";
  if (state.type === "grid") {
    elements.primaryWrap.hidden = true;
    elements.secondaryWrap.hidden = true;
    return;
  }
  if (state.type === "2") {
    elements.primaryWrap.hidden = false;
    elements.primaryLabel.textContent = "ID 前缀";
    selectOptions(elements.primary, filters.prefixes || [], "全部前缀", state.prefix);
    elements.secondaryWrap.hidden = false;
    elements.secondaryLabel.textContent = "分类";
    selectOptions(elements.secondary, filters.categories || [], "全部分类", state.category);
    return;
  }
  if (state.type === "3") {
    elements.primaryWrap.hidden = false;
    elements.primaryLabel.textContent = "ID 前缀";
    selectOptions(elements.primary, filters.prefixes || [], "全部前缀", state.prefix);
    elements.secondaryWrap.hidden = true;
    return;
  }
  elements.primaryWrap.hidden = false;
  elements.primaryLabel.textContent = "全球通等级";
  selectOptions(elements.primary, filters.grades || [], "全部等级", state.grade);
  elements.secondaryWrap.hidden = true;
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
  const comparison = payload.comparison;
  elements.comparison.hidden = !comparison;
  if (comparison) {
    for (const button of elements.views) {
      button.setAttribute("aria-pressed", String(button.dataset.view === state.view));
      button.querySelector("span").textContent = comparison.counts[button.dataset.view].toLocaleString("zh-CN");
    }
  }
  elements.query.placeholder = state.type === "grid" ? "搜索业务 ID、名称或档位关键词" : state.type === "low" ? "搜索方案名称、策划 ID、等级或生效说明" : "搜索合约编码、名称或关键词";
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
  if (key === "price") return item.price == null ? "-" : item.price.toLocaleString("zh-CN", { maximumFractionDigits: 2 });
  if (key === "validity") return [item.start, item.end].filter(Boolean).join(" 至 ") || "-";
  if (key === "duration") return item.duration || "-";
  return item[key] || "-";
}

function renderRows(items) {
  const fragment = document.createDocumentFragment();
  for (const item of items) {
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
  loadContracts();
}
const search = debounce(applySearch);

for (const tab of elements.tabs) {
  tab.addEventListener("click", () => {
    if (state.type === tab.dataset.type) return;
    state.type = tab.dataset.type;
    state.view = "current";
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
elements.query.addEventListener("input", search);
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
  if (state.type === "low") state.grade = elements.primary.value;
  else state.prefix = elements.primary.value;
  state.page = 1;
  loadContracts();
});
elements.secondary.addEventListener("change", () => {
  state.category = elements.secondary.value;
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

loadContracts();
