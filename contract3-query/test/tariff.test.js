const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { createTariffStore, diffTariffs, statusFor } = require("../tariff-store");
const { createTariffMonitor, buildSummary } = require("../tariff-sync");
const { normalize, plainText } = require("../tariff-api/fetch");

function item(overrides = {}) {
  return {
    code: "A1", name: "测试资费", price: "39元/月", onlineRaw: "2026-01-01", offlineRaw: "2026-12-31",
    scope: "个人", region: "北京", channel: "线上", resources: [{ label: "流量", value: "30GB" }],
    category: "个人资费", rangeTab: "北京资费", tariffType: "套餐", ...overrides,
  };
}

test("tariff diff detects add, removal, date and content changes", () => {
  const before = [item(), item({ code: "A2", name: "已消失" })].map((x) => require("../tariff-store").mergeItems([x])[0]);
  const after = [item({ offlineRaw: "2027-01-01", resources: [{ label: "流量", value: "40GB" }] }), item({ code: "A3", name: "新增" })].map((x) => require("../tariff-store").mergeItems([x])[0]);
  const diff = diffTariffs(after, before);
  assert.equal(diff.added.length, 1);
  assert.equal(diff.removed.length, 1);
  assert.equal(diff.changed.length, 1);
  assert.deepEqual(diff.changed[0].changes.map((x) => x.field), ["offlineRaw", "resources"]);
});

test("tariff status distinguishes online, pending and offline dates", () => {
  assert.equal(statusFor({ onlineRaw: "2026-11-01", offlineRaw: "2026-12-31" }, new Date("2026-11-06T00:00:00+08:00")), "online");
  assert.equal(statusFor({ onlineRaw: "2026-12-01", offlineRaw: "2026-12-31" }, new Date("2026-11-06T00:00:00+08:00")), "pending");
  assert.equal(statusFor({ onlineRaw: "2026-01-01", offlineRaw: "2026-11-01" }, new Date("2026-11-06T00:00:00+08:00")), "offline");
});

test("tariff store writes current, previous and change log atomically", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "contract3-tariff-"));
  const store = createTariffStore({ dataDir: dir });
  const first = store.saveSuccess({ province: "北京市", items: [item()], coverage: [], syncedAt: "2026-11-06T00:00:00.000Z" });
  assert.equal(first.firstRun, true);
  assert.equal(store.load().current.length, 1);
  const second = store.saveSuccess({ province: "北京市", items: [item({ price: "49元/月" })], coverage: [], syncedAt: "2026-11-06T02:00:00.000Z" });
  assert.equal(second.firstRun, false);
  assert.equal(JSON.parse(fs.readFileSync(path.join(dir, "tariffs-previous.json"))).items[0].price, "39元/月");
  assert.equal(store.load().changes.length, 1);
});

test("tariff merge keeps source labels for filters", () => {
  const store = createTariffStore({ dataDir: fs.mkdtempSync(path.join(os.tmpdir(), "contract3-labels-")) });
  const merged = store.mergeItems([item()])[0];
  assert.deepEqual(merged.categories, ["个人资费"]);
  assert.deepEqual(merged.rangeTabs, ["北京资费"]);
  assert.deepEqual(merged.tariffTypes, ["套餐"]);
});

test("tariff normalization keeps complete detail fields and removes markup", () => {
  const normalized = normalize({
    reportNo: "A9", name: "完整资费", fees: "500", feesUnit: "元/年",
    validPeriod: "12个月", duration: "无", unsubscribe: "营业厅、APP", responsibility: "无",
    otherContent: "<p>第一行</p><p>第二行</p>", rights: "会员权益", others: "补充说明",
    extraFees: "超出后 1 元/分钟", otherFees: "其他费用", applicablePeople: "个人",
    applicableArea: "北京", channel: "营业厅", onlineDay: "20250101", offineDay: "20301231",
    call: 200, data: 60, dataUnit: "GB", brandwidth: "1000M",
  }, { category: "个人资费", rangeTab: "北京资费", tariffType: "套餐" });
  assert.equal(normalized.validPeriod, "12个月");
  assert.equal(normalized.networkRequirement, "无");
  assert.equal(normalized.unsubscribe, "营业厅、APP");
  assert.equal(normalized.liability, "无");
  assert.equal(normalized.otherContent, "第一行\n第二行");
  assert.equal(normalized.rights, "会员权益");
  assert.deepEqual(normalized.resources, [
    { label: "国内通话", value: "200分钟" },
    { label: "国内通用流量", value: "60GB" },
    { label: "宽带", value: "1000M" },
    { label: "权益", value: "会员权益" },
  ]);
  assert.equal(plainText("<p>A</p><p>B</p>"), "A\nB");
});

test("tariff diff ignores fields absent from an older snapshot", () => {
  const before = createTariffStore().mergeItems([item()])[0];
  delete before.validPeriod;
  delete before.networkRequirement;
  const after = createTariffStore().mergeItems([item({ validPeriod: "12个月", networkRequirement: "无" })])[0];
  const diff = diffTariffs([after], [before]);
  assert.equal(diff.changed.length, 0);
});

test("monitor skips overlapping runs and does not notify baseline", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "contract3-monitor-"));
  const store = createTariffStore({ dataDir: dir });
  let resolveFetch;
  const fetcher = () => new Promise((resolve) => { resolveFetch = resolve; });
  let notifications = 0;
  const monitor = createTariffMonitor({ store, fetcher, notify: async () => { notifications += 1; }, logger: { error() {} } });
  const running = monitor.runOnce();
  assert.deepEqual(await monitor.runOnce(), { skipped: "running" });
  resolveFetch({ items: [item()], combos: [] });
  const first = await running;
  assert.equal(first.notification.skipped, "baseline");
  assert.equal(notifications, 0);
  assert.match(buildSummary({ added: [item()], removed: [], changed: [] }, "北京市"), /新增 1/);
});
