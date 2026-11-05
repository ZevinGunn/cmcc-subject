const assert = require("node:assert/strict");
const test = require("node:test");
const { createApp, datasets } = require("../server");

async function withServer(callback) {
  const server = createApp();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  try {
    await callback(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
      server.closeAllConnections();
    });
  }
}

test("loads four normalized datasets without duplicate IDs or scheme names", () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(datasets).map(([key, dataset]) => [key, dataset.items.length])),
    { "2": 2043, "3": 1567, low: 819, grid: 358 },
  );
  assert.equal(new Set(datasets["2"].items.map((item) => item.id)).size, 2043);
  assert.equal(new Set(datasets["3"].items.map((item) => item.id)).size, 1567);
  assert.equal(new Set(datasets.low.items.map((item) => item.key)).size, 819);
  const lowIds = datasets.low.items.flatMap((item) => item.ids);
  assert.equal(lowIds.length, 970);
  assert.equal(new Set(lowIds).size, 970);
  assert.equal(datasets["2"].items.every((item) => /^\d{12}$/.test(item.id) && item.prefix === item.id.slice(0, 6)), true);
  assert.equal(datasets["3"].items.every((item) => /^11160[23]\d{6}$/.test(item.id)), true);
  assert.deepEqual(datasets.low.meta.gradeCounts, {
    银卡: 122,
    金卡: 201,
    白金卡: 169,
    钻石卡: 291,
    多档规则: 31,
    卓越钻石卡: 1,
    普卡: 4,
  });
});

test("health and catalog endpoints report the unified service", async () => {
  await withServer(async (origin) => {
    const response = await fetch(`${origin}/api/health`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.service, "contract-query");
    assert.deepEqual(body.records, { "2": 2043, "3": 1567, low: 819, grid: 358 });
    assert.equal(body.version, "20261105-catalogs-1");

    const catalogsResponse = await fetch(`${origin}/api/catalogs`);
    const catalogs = (await catalogsResponse.json()).catalogs;
    assert.equal(catalogsResponse.status, 200);
    assert.equal(catalogs["2"].label, "二类合约");
    assert.equal(catalogs["3"].meta.sourceDate, "2026-09-07");
    assert.equal(catalogs.low.meta.sourceDate, "2026-07-30");
    assert.equal(catalogs.grid.total, 358);
  });
});

test("default query remains compatible with the former type-3 API", async () => {
  await withServer(async (origin) => {
    const response = await fetch(`${origin}/api/contracts?q=${encodeURIComponent("云宽带 169")}&prefix=111602&pageSize=200`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.type, "3");
    assert.ok(body.total > 0);
    assert.equal(body.items.every((item) => item.prefix === "111602"), true);
    assert.equal(body.items.every((item) => item.name.includes("云宽带") && item.name.includes("169")), true);
  });
});

test("type-2 query supports keyword, prefix, and category filtering", async () => {
  await withServer(async (origin) => {
    const query = new URLSearchParams({ type: "2", q: "抖音 59元", prefix: "111603", category: "专属卡/号卡" });
    const response = await fetch(`${origin}/api/contracts?${query}`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.ok(body.total > 0);
    assert.equal(body.items.every((item) => item.prefix === "111603"), true);
    assert.equal(body.items.every((item) => item.category === "专属卡/号卡"), true);
    assert.equal(body.items.every((item) => item.name.includes("抖音") && item.name.includes("59元")), true);
  });
});

test("low-consumption query supports grade and multi-level rule search", async () => {
  await withServer(async (origin) => {
    const gradeResponse = await fetch(`${origin}/api/contracts?type=low&grade=${encodeURIComponent("钻石卡")}&pageSize=200`);
    const gradeBody = await gradeResponse.json();
    assert.equal(gradeBody.total, 291);
    assert.equal(gradeBody.items.every((item) => item.grade === "钻石卡"), true);

    const ruleResponse = await fetch(`${origin}/api/contracts?type=low&q=${encodeURIComponent("20GB 388元")}`);
    const ruleBody = await ruleResponse.json();
    assert.equal(ruleBody.total, 4);
    const member = ruleBody.items.find((item) => item.name === "全网优惠享特权-20GB会员");
    assert.ok(member);
    assert.equal(member.grade, "多档规则");
    assert.match(member.rule, /388元.*钻石卡/);
  });
});

test("irrelevant filters are ignored when changing datasets", async () => {
  await withServer(async (origin) => {
    const response = await fetch(`${origin}/api/contracts?type=low&prefix=111602&category=nope&grade=${encodeURIComponent("银卡")}`);
    const body = await response.json();
    assert.equal(body.total, 122);
    assert.deepEqual(body.activeFilters, { prefix: "", category: "", grade: "银卡" });
  });
});

test("pagination clamps oversized page size and returns stable rows", async () => {
  await withServer(async (origin) => {
    const response = await fetch(`${origin}/api/contracts?page=2&pageSize=9999`);
    const body = await response.json();
    assert.equal(body.pageSize, 200);
    assert.equal(body.items.length, 200);
    assert.equal(body.items[0].row, 201);
  });
});

test("CSV exports are Excel-friendly and dataset-specific", async () => {
  await withServer(async (origin) => {
    const cases = [
      ["3", "策划ID", "prefix=111602", /111603\d{6}/],
      ["2", "合约编码", `type=2&category=${encodeURIComponent("专属卡/号卡")}`, null],
      ["low", "生效全球通等级", `type=low&grade=${encodeURIComponent("多档规则")}`, null],
    ];
    for (const [type, heading, query, excluded] of cases) {
      const response = await fetch(`${origin}/api/contracts.csv?${query}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      const body = new TextDecoder().decode(bytes);
      assert.equal(response.status, 200, type);
      assert.match(response.headers.get("content-type"), /text\/csv/, type);
      assert.deepEqual([...bytes.slice(0, 3)], [0xef, 0xbb, 0xbf], type);
      assert.match(body, new RegExp(heading), type);
      if (excluded) assert.doesNotMatch(body, excluded, type);
    }
  });
});

test("static entry point uses restrictive security headers", async () => {
  await withServer(async (origin) => {
    const response = await fetch(origin);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-security-policy"), /default-src 'self'/);
    assert.equal(response.headers.get("x-frame-options"), "DENY");
    const html = await response.text();
    assert.match(html, /北京移动合约查询/);
    assert.match(html, /二类合约/);
    assert.match(html, /三类合约/);
    assert.match(html, /低消方案等级/);
    assert.match(html, /网格通业务大全/);
    assert.match(html, /更新区（新增）/);
    assert.match(html, /删减区/);
    assert.match(html, /href="https:\/\/arpu\.1008086\.xyz\/"/);
  });
});

test("version comparisons keep additions, removals, and same-ID changes distinct", async () => {
  assert.deepEqual(datasets["2"].comparison.counts, { current: 2043, added: 499, changed: 0, removed: 0 });
  assert.deepEqual(datasets["3"].comparison.counts, { current: 1567, added: 309, changed: 473, removed: 45 });
  assert.deepEqual(datasets.low.comparison.counts, { current: 819, added: 47, changed: 33, removed: 0 });
  assert.equal(datasets.low.comparison.baseline.total, 772);
  for (const key of ["2", "3", "low"]) {
    const dataset = datasets[key];
    const counts = dataset.comparison.counts;
    assert.equal(counts.current - counts.added + counts.removed, dataset.comparison.baseline.total);
    const currentKeys = new Set(dataset.items.map((item) => key === "low" ? item.key : item.id));
    assert.ok(dataset.views.removed.every((item) => !currentKeys.has(key === "low" ? item.key : item.id)));
  }
  await withServer(async (origin) => {
    const response = await fetch(`${origin}/api/contracts?type=3&view=changed&q=111603019221`);
    const body = await response.json();
    assert.equal(body.total, 1);
    assert.equal(body.view, "changed");
    assert.equal(body.items[0].changeStatus, "changed");
    assert.match(body.items[0].name, /5GA畅享套餐/);
    assert.match(body.items[0].changes[0].before, /承诺消费得AI豆399元/);
    assert.ok(!datasets["3"].views.added.some((item) => item.id === "111603019221"));
    const oldName = await (await fetch(`${origin}/api/contracts?type=3&view=changed&q=${encodeURIComponent("承诺消费得AI豆399元")}`)).json();
    assert.ok(oldName.items.some((item) => item.id === "111603019221"));
    const removed = await (await fetch(`${origin}/api/contracts?type=3&view=removed&pageSize=200`)).json();
    assert.equal(removed.total, 45);
    assert.ok(removed.items.every((item) => item.name && item.id && item.changeStatus === "removed"));
    const csvResponse = await fetch(`${origin}/api/contracts.csv?type=3&view=removed`);
    const csv = await csvResponse.text();
    assert.match(csv, new RegExp(removed.items[0].id));
    assert.equal(csv.trim().split("\r\n").length, 46);
    const empty = await (await fetch(`${origin}/api/contracts?type=low&view=removed`)).json();
    assert.equal(empty.total, 0);
    assert.deepEqual(empty.items, []);
    const invalid = await (await fetch(`${origin}/api/contracts?type=__proto__&view=constructor`)).json();
    assert.equal(invalid.type, "3");
    assert.equal(invalid.view, "current");
  });
});

test("low-consumption imports fill merged grade rules and preserve all ID details", async () => {
  await withServer(async (origin) => {
    for (const [identifier, grade, note] of [["111603002926", "多档规则", "24年已下线"], ["111602054514", "普卡", ""], ["111603010872", "银卡", "等级次月生效"]]) {
      const body = await (await fetch(`${origin}/api/contracts?type=low&q=${identifier}`)).json();
      assert.equal(body.total, 1);
      assert.equal(body.items[0].grade, grade);
      const variant = body.items[0].variants.find((v) => v.id === identifier);
      assert.ok(variant);
      assert.ok(variant.note.includes(note));
    }
    const extraGrade = await (await fetch(`${origin}/api/contracts?type=low&grade=${encodeURIComponent("卓越钻石卡")}`)).json();
    assert.equal(extraGrade.total, 1);
    assert.ok(extraGrade.filters.grades.includes("普卡"));
  });
});

test("grid search and export use business links without embedded employee identifiers", async () => {
  for (const item of datasets.grid.items) {
    const link = new URL(item.url);
    assert.equal(link.origin, "https://ysmapp.bj.10086.cn");
    assert.deepEqual([...link.searchParams.keys()], ["submitWarePackageId", "channel"]);
    assert.equal(link.searchParams.get("submitWarePackageId"), item.id);
    assert.equal(Number.isInteger(item.optionCount), true);
  }
  await withServer(async (origin) => {
    const body = await (await fetch(`${origin}/api/contracts?type=grid&q=${encodeURIComponent("垂类 ETC")}`)).json();
    assert.equal(body.type, "grid");
    assert.equal(body.total, 1);
    assert.equal(body.items[0].id, "A1000499");
    assert.equal(body.items[0].optionCount, 5);
    const csv = await (await fetch(`${origin}/api/contracts.csv?type=grid&q=A1000499`)).text();
    assert.match(csv, /ETC速通卡/);
    assert.doesNotMatch(csv, /[?&](?:empCode|code|nbc)=/);
    const fallback = await (await fetch(`${origin}/api/contracts?type=grid&view=removed`)).json();
    assert.equal(fallback.view, "current");
    assert.equal(fallback.total, 358);
  });
});
