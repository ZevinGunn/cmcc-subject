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
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test("loads all three complete normalized datasets", () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(datasets).map(([key, dataset]) => [key, dataset.items.length])),
    { "2": 1544, "3": 1303, low: 786 },
  );
  assert.equal(new Set(datasets["2"].items.map((item) => item.id)).size, 1544);
  assert.equal(new Set(datasets["3"].items.map((item) => item.id)).size, 1303);
  assert.equal(datasets["2"].items.every((item) => /^\d{12}$/.test(item.id) && item.prefix === item.id.slice(0, 6)), true);
  assert.equal(datasets["3"].items.every((item) => /^11160[23]\d{6}$/.test(item.id)), true);
  assert.deepEqual(datasets.low.meta.gradeCounts, {
    银卡: 117,
    金卡: 189,
    白金卡: 163,
    钻石卡: 282,
    多档规则: 3,
    未标注: 32,
  });
});

test("health and catalog endpoints report the unified service", async () => {
  await withServer(async (origin) => {
    const response = await fetch(`${origin}/api/health`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.service, "contract-query");
    assert.deepEqual(body.records, { "2": 1544, "3": 1303, low: 786 });

    const catalogsResponse = await fetch(`${origin}/api/catalogs`);
    const catalogs = (await catalogsResponse.json()).catalogs;
    assert.equal(catalogsResponse.status, 200);
    assert.equal(catalogs["2"].label, "二类合约");
    assert.equal(catalogs["3"].meta.sourceDate, "2025-10-31");
    assert.equal(catalogs.low.meta.sourceDate, "2025-08-01");
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
    assert.equal(gradeBody.total, 282);
    assert.equal(gradeBody.items.every((item) => item.grade === "钻石卡"), true);

    const ruleResponse = await fetch(`${origin}/api/contracts?type=low&q=${encodeURIComponent("20GB 388元")}`);
    const ruleBody = await ruleResponse.json();
    assert.equal(ruleBody.total, 1);
    assert.equal(ruleBody.items[0].name, "全网优惠享特权-20GB会员");
    assert.equal(ruleBody.items[0].grade, "多档规则");
    assert.match(ruleBody.items[0].rule, /388元.*钻石卡/);
  });
});

test("irrelevant filters are ignored when changing datasets", async () => {
  await withServer(async (origin) => {
    const response = await fetch(`${origin}/api/contracts?type=low&prefix=111602&category=nope&grade=${encodeURIComponent("银卡")}`);
    const body = await response.json();
    assert.equal(body.total, 117);
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
    assert.match(html, /href="https:\/\/arpu\.1008086\.xyz\/"/);
  });
});
