const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { createTariffStore, diffTariffs, statusFor } = require("../tariff-store");
const { createTariffMonitor, buildSummary } = require("../tariff-sync");

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
