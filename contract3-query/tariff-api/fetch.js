'use strict';
/**
 * 全量抓取：把 API 的分层结构展平成业务条目列表
 * ------------------------------------------------------------------
 * 响应结构（实测）：
 *   beans[]                        资费系列分组
 *     ├── nonModuleList[]          直接档位
 *     └── moduleList[]
 *           └── tariffList[]       模组内档位
 * 两个列表都要收，否则会少掉一部分（北京本省实测少 26 条）。
 *
 * 参数语义（由页面切页签时的报文反推）：
 *   tariffAttr  1=全网资费  2=本省资费
 *   type1       1=个人资费  2=政企资费
 *   type2       1=套餐      2=非套餐
 */

const { call, PROVINCE_CODE, CELL_NUM } = require('./client');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 请求节流。接口本身很快，但短时间连打会被风控盯上 ——
// 单省要发 8 次组合请求，全都挤在一起就是个明显的机器人特征。
const COMBO_GAP = 600;    // 组合之间
const PAGE_GAP = 400;     // 分页之间

// 分页上限。正常省份一页（limit=500）就够，这个值只是防止服务端返回异常
// 的 pages 时把请求打成死循环。
const MAX_PAGES = 10;

// 资费类型（type2）。四个值对应页面下拉里的四项，缺一不可 ——
// 早先只用了 1 和 2，结果漏掉「营销活动」与「港澳台/国际资费」共 1331 条。
// 实测北京全网：套餐 43 / 加装包 1551 / 营销活动 13 / 港澳台 1318，累加与页面一致。
// type2=5 及以后返回空，可作上界。
const TYPES = [
  { type2: '1', name: '套餐' },
  { type2: '2', name: '加装包' },
  { type2: '3', name: '营销活动' },
  { type2: '4', name: '港澳台/国际资费' },
];

const CATEGORIES = [
  { type1: '1', name: '个人资费' },
  { type1: '2', name: '政企资费' },
];

const SCOPES = [
  { tariffAttr: '1', name: '全网资费' },
  { tariffAttr: '2', name: '本省资费' },
];

const COMBOS = CATEGORIES.flatMap((c) =>
  SCOPES.flatMap((s) =>
    TYPES.map((t) => ({
      tariffAttr: s.tariffAttr,
      type1: c.type1,
      type2: t.type2,
      label: `${c.name} · ${s.name} · ${t.name}`,
      category: c.name,
      tariffType: t.name,
    }))));

/** 把 20260209 这种紧凑日期转成 2026-02-09 */
function isoFromCompact(s) {
  const m = String(s || '').match(/^(\d{4})(\d{2})(\d{2})$/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : '';
}

/** 把一条 API 条目转成统一结构 */
function normalize(raw, meta) {
  const fees = raw.fees != null && raw.fees !== '' ? `${raw.fees}${raw.feesUnit || ''}` : '';
  const resources = [];
  const push = (label, val, unit) => {
    if (val === null || val === undefined || val === '' || val === '-') return;
    resources.push({ label, value: `${val}${unit || ''}` });
  };
  push('国内通话', raw.call, '分钟');
  push('国内通用流量', raw.data, raw.dataUnit || 'GB');
  push('定向流量', raw.orientTraffic, raw.orientTrafficUnit || 'GB');
  push('短信', raw.sms, '条');
  push('国际通话', raw.internationCall, '分钟');
  push('宽带', raw.iptv, '');
  if (raw.benefits) resources.push({ label: '权益', value: String(raw.benefits) });

  return {
    name: raw.name || raw.tariffName || '',
    code: raw.reportNo || raw.seqno || '',
    price: fees,
    scope: raw.applicablePeople || '',
    region: raw.applicableArea || '',
    channel: raw.channel || '',
    onlineRaw: isoFromCompact(raw.onlineDay),
    offlineRaw: isoFromCompact(raw.offineDay),
    liability: raw.breachDuty || '',
    overage: raw.beyondFees || '',
    extraService: raw.otherService || '',
    extraNote: raw.otherNote || '',
    resources,
    category: meta.category,   // 个人资费 / 政企资费
    rangeTab: meta.rangeTab,   // 全网资费 / 本省资费
    tariffType: meta.tariffType,
  };
}

/** 拉一个参数组合的全部数据（分页） */
async function fetchCombo(provinceCode, combo) {
  const all = [];
  let page = 1;
  for (;;) {
    const r = await call('getTariffListInfo', {
      cellNum: CELL_NUM,
      province: provinceCode,
      isPublic: '1',
      linkScn: '1',
      tariffAttr: combo.tariffAttr,
      type1: combo.type1,
      type2: combo.type2,
      page,
      limit: 500,
    });
    const data = r && r.data;
    if (!data || !Array.isArray(data.beans)) {
      throw new Error('资费列表响应缺少有效的 data.beans，无法确认数据完整');
    }

    for (const bean of data.beans) {
      for (const x of bean.nonModuleList || []) all.push(x);
      for (const mod of bean.moduleList || []) {
        for (const x of mod.tariffList || []) all.push(x);
      }
    }

    const p = data.page || {};
    const pages = Number(p.pages ?? 1);
    if (!Number.isInteger(pages) || pages < 0) throw new Error('资费列表分页数据无效');
    if (page >= pages) break;
    if (page >= MAX_PAGES) throw new Error(`资费列表超过分页上限 ${MAX_PAGES}，数据不完整`);
    page++;
    await sleep(PAGE_GAP);
  }
  return all;
}

/**
 * 抓取一个省份的全部业务。
 * @returns {{ province, items, combos: Array }}
 */
async function fetchProvince(provinceName, opts = {}) {
  const code = PROVINCE_CODE[provinceName];
  if (!Object.hasOwn(PROVINCE_CODE, provinceName)) throw new Error(`未知省份「${provinceName}」，可用 --list-provinces 查看`);

  const combos = opts.combos || COMBOS;
  const items = [];
  const report = [];

  for (let i = 0; i < combos.length; i++) {
    const combo = combos[i];
    if (i > 0) await sleep(COMBO_GAP);
    const meta = {
      category: combo.category,
      // 页面上本省页签写作「北京资费」「江苏资费」，不带「市/省」后缀
      rangeTab: combo.tariffAttr === '2' ? `${provinceName.replace(/[省市]$/, '')}资费` : '全网资费',
      tariffType: combo.tariffType,
    };
    let raw = [];
    let error = null;
    try {
      raw = await fetchCombo(code, combo);
    } catch (e) {
      // 单个组合失败不该拖垮整省：网络抖动是常态，而重试成本高、也更容易触发风控。
      // 失败如实记进 combos 报告，调用方据此判断数据是否完整。
      error = e.message;
    }
    for (const r of raw) items.push(normalize(r, meta));
    report.push({ label: combo.label, count: raw.length, ...(error ? { error } : {}) });
    if (opts.onProgress) opts.onProgress(combo.label, raw.length, error);
  }

  return { province: provinceName, code, items, combos: report };
}

module.exports = { fetchProvince, fetchCombo, normalize, isoFromCompact, COMBOS, TYPES, CATEGORIES, SCOPES };
