const fetchBtn = document.getElementById("fetch-btn");
const listEl = document.getElementById("result-list");
const metaEl = document.getElementById("result-meta");
const countMetaEl = document.getElementById("count-meta");
const filterKeywordEl = document.getElementById("filter-keyword");
const filterProvinceEl = document.getElementById("filter-province");
const filterClearEl = document.getElementById("filter-clear");
const filterMetaEl = document.getElementById("filter-meta");
const sortButtons = document.querySelectorAll(".sort-btn");

let RESP_KEY = "UVic06tpXgMNiApm";
let RESP_IV = "9791027341711819";
const GRAY_KEYS = {
  respKey: "t6MoEZ94s0bDOaws",
  iv: "1234567890123456",
};
let fullList = [];
let currentList = [];
let sortState = { key: null, dir: null };

function setMeta(text) {
  if (!metaEl) return;
  metaEl.textContent = text;
}

function setCount(count) {
  countMetaEl.textContent = `${count} 条`;
}

function renderResults(items) {
  currentList = items;
  listEl.innerHTML = "";
  if (!items || !items.length) {
    const emptyRow = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "暂无数据";
    emptyRow.appendChild(cell);
    listEl.appendChild(emptyRow);
    setCount(0);
    return;
  }

  items.forEach((item, index) => {
    const row = document.createElement("tr");
    row.classList.add("row-click");
    row.dataset.index = index;
    const title = item.noticeTitle || item.title || "未命名公告";
    const markId = item.markId || item.noticeId || item.id || "--";
    const startTime = formatTime(item.startTime);
    const stateTime = formatTime(item.stateTime);

    row.innerHTML = `
      <td data-label="标题">
        <div class="title-cell">
          <strong>${title}</strong>
        </div>
      </td>
      <td data-label="开始时间">${startTime}</td>
      <td data-label="状态时间">${stateTime}</td>
      <td data-label="编号">${markId}</td>
    `;
    listEl.appendChild(row);
  });
  setCount(items.length);
}

function base64ToBytes(base64) {
  const normalized = normalizeBase64(base64);
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function normalizeBase64(value) {
  const trimmed = String(value || "").trim();
  const noSpace = trimmed.replace(/\s+/g, "");
  if (!noSpace) return "";
  if (/^[A-Za-z0-9+/=]+$/.test(noSpace)) {
    return noSpace;
  }
  const urlSafe = noSpace.replace(/-/g, "+").replace(/_/g, "/");
  if (!/^[A-Za-z0-9+/=]+$/.test(urlSafe)) {
    return noSpace;
  }
  const padding = urlSafe.length % 4;
  if (padding === 2) return `${urlSafe}==`;
  if (padding === 3) return `${urlSafe}=`;
  if (padding === 1) return `${urlSafe}===`;
  return urlSafe;
}

function isBase64Like(value) {
  const normalized = normalizeBase64(value);
  return Boolean(normalized && /^[A-Za-z0-9+/=]+$/.test(normalized));
}

function coerceJson(value) {
  if (!value) return null;
  if (typeof value === "object") return value;
  const text = String(value).trim();
  if (!text) return null;
  if (text.startsWith("{") || text.startsWith("[")) {
    return JSON.parse(text);
  }
  return null;
}

function formatTime(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "--";
  const date = new Date(num);
  if (Number.isNaN(date.getTime())) return "--";
  const pad = (val) => String(val).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    ` ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`
  );
}

function parseNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function updateSortButtons() {
  sortButtons.forEach((btn) => {
    const isActive = sortState.key === btn.dataset.sort;
    btn.classList.toggle("active", isActive);
    if (!isActive) {
      btn.textContent = "↕";
      return;
    }
    btn.textContent = sortState.dir === "desc" ? "↓" : "↑";
  });
}

function applyFilter() {
  const keyword = (filterKeywordEl.value || "").trim().toLowerCase();
  let results = [...fullList];

  if (keyword) {
    results = results.filter((item) => {
      const title = String(item.noticeTitle || item.title || "").toLowerCase();
      return title.includes(keyword);
    });
  }

  if (sortState.key) {
    results.sort((a, b) => {
      const aValue = parseNumber(a[sortState.key]);
      const bValue = parseNumber(b[sortState.key]);
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      return sortState.dir === "desc" ? bValue - aValue : aValue - bValue;
    });
  }

  renderResults(results);
  if (!fullList.length) {
    filterMetaEl.textContent = "暂无数据";
  } else if (keyword) {
    filterMetaEl.textContent = `筛选命中 ${results.length} / ${fullList.length}`;
  } else {
    filterMetaEl.textContent = `展示全部 ${fullList.length} 条`;
  }
}
function pkcs7Unpad(bytes) {
  if (!bytes.length) return bytes;
  const pad = bytes[bytes.length - 1];
  if (pad < 1 || pad > 16) return bytes;
  return bytes.slice(0, bytes.length - pad);
}

async function decryptAES(base64Cipher, key, iv) {
  const cipherBytes = base64ToBytes(base64Cipher);
  const keyBytes = new TextEncoder().encode(key);
  const ivBytes = new TextEncoder().encode(iv);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: ivBytes },
    cryptoKey,
    cipherBytes
  );

  const plainBytes = pkcs7Unpad(new Uint8Array(decrypted));
  return new TextDecoder().decode(plainBytes);
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "请求失败");
  }
  return res.json();
}

async function updateHealth() {
  try {
    const data = await fetchJson("/api/health");
    if (data.env && data.env.toLowerCase() === "gray") {
      RESP_KEY = GRAY_KEYS.respKey;
      RESP_IV = GRAY_KEYS.iv;
    }
  } catch (err) {
  }
}

async function handleFetchLatest() {
  setMeta("正在拉取并解密...");
  try {
    const provinceCode = (filterProvinceEl.value || "").trim();
    const params = new URLSearchParams();
    if (provinceCode) params.set("provinceCode", provinceCode);
    const url = params.toString()
      ? `/api/announcements?${params.toString()}`
      : "/api/announcements";
    const data = await fetchJson(url);
    if (!data.body && !data.parsedBody) {
      setMeta("接口返回异常，未获取到 body");
      renderResults([]);
      return;
    }
    let parsed = coerceJson(data.parsedBody || data.body);
    if (!(parsed && (parsed.rspBody || parsed.retCode))) {
      parsed = null;
    }
    if (!parsed) {
      if (!(window.crypto && window.crypto.subtle)) {
        throw new Error("当前通过非安全上下文访问，浏览器无法在前端解密。请改用 HTTPS，或继续使用当前服务端解密返回。");
      }
      if (!isBase64Like(data.body)) {
        throw new Error("响应内容不是有效的 base64 字符串");
      }
      const decrypted = await decryptAES(data.body, RESP_KEY, RESP_IV);
      parsed = JSON.parse(decrypted);
    }
    const list = Array.isArray(parsed.rspBody) ? parsed.rspBody : [];
    fullList = list;
    applyFilter();

    const retCode = parsed.retCode || "--";
    const retDesc = parsed.retDesc || "完成";
    setMeta(`${retDesc} (${retCode})`);

    if (data.request && data.request.payload) {
      try {
        console.log("[request decrypted]", JSON.parse(data.request.payload));
      } catch (err) {
        console.log("[request decrypted]", data.request);
      }
    } else if (data.request) {
      console.log("[request decrypted]", data.request);
    }
    console.log("[response decrypted]", parsed);
  } catch (err) {
    setMeta(`解密或解析失败：${err.message}`);
    setCount(0);
  }
}

fetchBtn.addEventListener("click", handleFetchLatest);
filterKeywordEl.addEventListener("input", applyFilter);
filterProvinceEl.addEventListener("change", () => {
  handleFetchLatest();
});
filterClearEl.addEventListener("click", () => {
  filterKeywordEl.value = "";
  filterProvinceEl.value = "";
  sortState = { key: null, dir: null };
  updateSortButtons();
  handleFetchLatest();
});

listEl.addEventListener("click", (event) => {
  const row = event.target.closest("tr");
  if (!row || !row.dataset.index) return;
  const index = Number(row.dataset.index);
  if (Number.isNaN(index)) return;
  const item = currentList[index];
  if (!item || !item.noticeText) return;
  const url = `/detail.html?url=${encodeURIComponent(item.noticeText)}`;
  window.location.assign(url);
});

sortButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.sort;
    if (sortState.key !== key) {
      sortState = { key, dir: "asc" };
    } else if (sortState.dir === "asc") {
      sortState = { key, dir: "desc" };
    } else {
      sortState = { key: null, dir: null };
    }
    updateSortButtons();
    applyFilter();
  });
});

updateSortButtons();
updateHealth().finally(handleFetchLatest);
