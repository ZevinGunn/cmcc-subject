const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { createApp, datasets, validateGridLinks, contractPrice, queryDataset, contractCategory } = require("../server");
const { createGridCatalog } = require("../grid-catalog");

async function withServer(callback, options) {
  const server = createApp(options);
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
    assert.equal(body.version, "20261106-grid-clean-links-1");
    assert.equal(body.gridLinks.total, 358);

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
    const response = await fetch(`${origin}/api/contracts?type=low&prefix=111602&grade=${encodeURIComponent("银卡")}`);
    const body = await response.json();
    assert.equal(body.total, 122);
    assert.deepEqual(body.activeFilters, { prefix: "", category: "", grade: "银卡", minPrice: null, maxPrice: null });
  });
});

test("business categories follow the main named product and keep fallback records searchable", () => {
  for (const [name, expected] of [
    ["云宽带149元档", "宽带/家庭融合"],
    ["爱家融合版1000M198元档--两年", "宽带/家庭融合"],
    ["信用购机红包优惠低消7折版（218档）", "信用购机"],
    ["政企承诺消费得5G金币方案318元36月", "政企合约"],
    ["国补版承诺消费超享福袋专用AI豆860活动36月", "金币/AI豆"],
    ["全球通吉祥号码营销方案188元", "吉祥号码"],
    ["全网优惠享特权-20GB会员", "会员/权益"],
    ["畅享30GB合约套餐128（12个月）和包版", "套餐/资费"],
    ["全网普惠得流量-10GB", "流量包"],
    ["尊享多多得算力主机-金卡版", "终端/设备"],
    ["未命名业务", "其他"],
  ]) assert.equal(contractCategory(name), expected, name);
  for (const type of ["3", "low"]) {
    const { filters, views } = datasets[type];
    for (const items of Object.values(views)) {
      assert.ok(items.every((item) => item.category && filters.categories.includes(item.category)));
    }
    assert.equal(filters.categories.reduce((count, category) => count + datasets[type].items.filter((item) => item.category === category).length, 0), datasets[type].items.length);
  }
});

test("type-3 categories combine with prefix, price, differences, totals, and CSV export", async () => {
  await withServer(async (origin) => {
    for (const view of ["current", "added", "removed", "changed"]) {
      const category = view === "removed" ? datasets["3"].views.removed[0].category : "信用购机";
      const params = new URLSearchParams({ type: "3", category, view, prefix: "111603", sort: "price-asc", pageSize: "25" });
      if (view !== "removed") { params.set("minPrice", "100"); params.set("maxPrice", "300"); }
      const result = await (await fetch(`${origin}/api/contracts?${params}`)).json();
      const expected = datasets["3"].views[view].filter((item) => item.category === category && item.prefix === "111603" && (view === "removed" || (item.price !== null && item.price >= 100 && item.price <= 300)));
      assert.equal(result.total, expected.length);
      assert.equal(result.activeFilters.category, category);
      assert.ok(result.items.every((item) => item.category === category));
      assert.ok(result.filters.categories.includes(category));
      if (view === "current") {
        assert.ok(result.total > 25);
        const csv = await (await fetch(`${origin}/api/contracts.csv?${params}`)).text();
        assert.match(csv.split("\r\n")[0], /分类/);
        for (const item of expected) assert.ok(csv.includes(item.id));
        assert.equal(csv.trim().split("\r\n").length, expected.length + 1);
      }
    }
  });
});

test("global-tier categories combine with grade and keywords and remain compatible with grid queries", async () => {
  await withServer(async (origin) => {
    const params = new URLSearchParams({ type: "low", category: "宽带/家庭融合", grade: "金卡", q: "爱家", minPrice: "158", maxPrice: "198", sort: "price-desc" });
    const result = await (await fetch(`${origin}/api/contracts?${params}`)).json();
    assert.equal(result.total, 6);
    assert.ok(result.items.every((item) => item.category === "宽带/家庭融合" && item.grade === "金卡" && item.name.includes("爱家")));
    assert.deepEqual(result.items.map((item) => item.price), [198, 198, 169, 158, 158, 158]);
    const csv = await (await fetch(`${origin}/api/contracts.csv?${params}`)).text();
    assert.match(csv.split("\r\n")[0], /分类/);
    assert.ok(result.items.every((item) => csv.includes(item.name)));
    params.set("category", "信用购机");
    const empty = await (await fetch(`${origin}/api/contracts?${params}`)).json();
    assert.equal(empty.total, 0);
    const grid = await (await fetch(`${origin}/api/contracts?type=grid&category=nope`)).json();
    assert.equal(grid.total, 358);
    assert.equal(grid.activeFilters.category, "");
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

test("price extraction prefers explicit amounts and avoids speeds, dates, and ambiguous prices", () => {
  const cases = [
    ["2", { amount: "59元", name: "600元大礼包" }, 59],
    ["3", { name: "爱家融合版1000M198元档--两年" }, 198],
    ["3", { name: "智臻会员299档（A版）" }, 299],
    ["2", { name: "29元套餐折后9元档" }, 9],
    ["low", { name: "0元购（128元24月）", variants: [{ amount: "128" }, { amount: "128" }] }, 128],
    ["low", { name: "主套餐优惠", variants: [{ amount: "118元及以上" }] }, null],
    ["low", { name: "多档套餐", variants: [{ amount: "128" }, { amount: "198" }] }, null],
    ["3", { name: "1000M宽带24个月2026版" }, null],
    ["3", { name: "128元套餐赠50元话费" }, null],
    ["3", { name: "9.9元会员（12月）" }, 9.9],
    ["3", { name: "0元专属权益" }, 0],
    ["grid", { name: "99元业务" }, null],
  ];
  for (const [type, item, expected] of cases) assert.equal(contractPrice(item, type), expected, item.name);
});

test("price ranges combine with keywords and grades and count every matching page", async () => {
  await withServer(async (origin) => {
    const params = new URLSearchParams({ type: "low", q: "爱家", grade: "金卡", minPrice: "158", maxPrice: "198", sort: "price-asc", pageSize: "25" });
    const body = await (await fetch(`${origin}/api/contracts?${params}`)).json();
    assert.equal(body.total, 6);
    assert.deepEqual(body.items.map((item) => item.price), [158, 158, 158, 169, 198, 198]);
    assert.ok(body.items.every((item) => item.grade === "金卡" && item.name.includes("爱家")));
    params.set("minPrice", "158");
    params.set("maxPrice", "158");
    const exact = await (await fetch(`${origin}/api/contracts?${params}`)).json();
    assert.equal(exact.total, 3);
    assert.ok(exact.items.every((item) => item.price === 158));
    const empty = await (await fetch(`${origin}/api/contracts?type=low&q=爱家&minPrice=99999`)).json();
    assert.equal(empty.total, 0);
    assert.deepEqual(empty.items, []);
    for (const type of ["2", "3", "low"]) {
      const query = new URLSearchParams({ type, minPrice: "50", maxPrice: "300", sort: "price-desc", pageSize: "25", page: "2" });
      const result = await (await fetch(`${origin}/api/contracts?${query}`)).json();
      const expected = datasets[type].items.filter((item) => item.price !== null && item.price >= 50 && item.price <= 300).sort((a, b) => b.price - a.price);
      assert.equal(result.total, expected.length);
      assert.equal(result.totalPages, Math.ceil(expected.length / 25));
      assert.deepEqual(result.items.map((item) => item.row), expected.slice(25, 50).map((item) => item.row));
    }
  });
});

test("price sorting is numeric and stable with unknown amounts last and supports difference views", () => {
  for (const type of ["2", "3", "low"]) {
    for (const sort of ["price-asc", "price-desc"]) {
      const { filtered } = queryDataset(new URLSearchParams({ type, sort }));
      const known = filtered.filter((item) => item.price !== null);
      assert.ok(known.length > 0);
      assert.ok(filtered.slice(known.length).every((item) => item.price === null));
      for (let index = 1; index < known.length; index++) {
        assert.ok(sort === "price-asc" ? known[index - 1].price <= known[index].price : known[index - 1].price >= known[index].price);
      }
      const firstPrice = known[0].price;
      assert.deepEqual(known.filter((item) => item.price === firstPrice).map((item) => item.row), datasets[type].items.filter((item) => item.price === firstPrice).map((item) => item.row));
    }
    for (const view of ["added", "removed", "changed"]) {
      const { filtered } = queryDataset(new URLSearchParams({ type, view, minPrice: "100", maxPrice: "200", sort: "price-asc" }));
      assert.ok(filtered.every((item) => item.price >= 100 && item.price <= 200 && item.changeStatus === view));
    }
  }
});

test("invalid price ranges return a clear error and grid ignores price conditions", async () => {
  await withServer(async (origin) => {
    for (const query of ["minPrice=-1", "maxPrice=Infinity", "minPrice=abc", "maxPrice=1.234", "minPrice=200&maxPrice=100"]) {
      for (const endpoint of ["contracts", "contracts.csv"]) {
        const response = await fetch(`${origin}/api/${endpoint}?type=low&${query}`);
        assert.equal(response.status, 400, query);
        assert.equal((await response.json()).error, "invalid_price_range");
      }
    }
    const grid = await (await fetch(`${origin}/api/contracts?type=grid&minPrice=invalid&sort=price-asc`)).json();
    assert.equal(grid.total, 358);
    assert.equal(grid.activeFilters.minPrice, null);
    assert.equal(grid.sort, "");
  });
});

test("CSV exports preserve the same price range and order as query results", async () => {
  await withServer(async (origin) => {
    const query = new URLSearchParams({ type: "low", q: "爱家", grade: "金卡", minPrice: "158", maxPrice: "198", sort: "price-desc" });
    const data = await (await fetch(`${origin}/api/contracts?${query}`)).json();
    const csv = await (await fetch(`${origin}/api/contracts.csv?${query}`)).text();
    assert.match(csv.split("\r\n")[0], /价格（元）/);
    let previous = -1;
    for (const item of data.items) {
      const position = csv.indexOf(item.name, previous + 1);
      assert.ok(position > previous, item.name);
      previous = position;
    }
    assert.equal(data.total, 6);
    assert.doesNotMatch(csv, /爱家.*钻石卡/);
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
    assert.match(html, /业务大全/);
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

test("grid search and export use stable entry links without exposing original link parameters", async () => {
  for (const item of datasets.grid.items) {
    const link = new URL(item.url, "http://localhost");
    assert.equal(link.pathname, "/api/grid/open");
    assert.deepEqual([...link.searchParams.keys()], ["businessId"]);
    assert.equal(link.searchParams.get("businessId"), item.id);
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
    assert.match(csv, /https:\/\/contracts\.1008086\.xyz\/api\/grid\/open\?businessId=A1000499/);
    assert.doesNotMatch(csv, /[?&](?:empCode|code|nbc)=/);
    const fallback = await (await fetch(`${origin}/api/contracts?type=grid&view=removed`)).json();
    assert.equal(fallback.view, "current");
    assert.equal(fallback.total, 358);
  });
});

test("grid redirect keeps only the business ID and preserves the imported repeated slashes", async () => {
  const target = "https://ysmapp.bj.10086.cn//app//channel-web//busiCore//showIndexCommon.action?submitWarePackageId=A1000499";
  const original = `${target}&channel=app_share&code=test-employee&empCode=test-employee&nbc=fixture%2f%2B+%20`;
  const gridLinks = validateGridLinks({ A1000499: original });
  await withServer(async (origin) => {
    for (const method of ["GET", "HEAD"]) {
      const response = await fetch(`${origin}/api/grid/open?businessId=A1000499`, { method, redirect: "manual" });
      assert.equal(response.status, 302);
      assert.equal(response.headers.get("location"), target);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.equal(await response.text(), "");
    }
    const unavailable = await fetch(`${origin}/api/grid/open?businessId=A1000489`, { redirect: "manual" });
    assert.equal(unavailable.status, 503);
    const unknown = await fetch(`${origin}/api/grid/open?businessId=https://example.com`, { redirect: "manual" });
    assert.equal(unknown.status, 404);
    const catalog = await (await fetch(`${origin}/api/contracts?type=grid&q=A1000499`)).text();
    assert.doesNotMatch(catalog, /test-employee|fixture%2f/);
  }, { gridLinks });
});

test("grid redirect removes parameters on either side of the ID and fragments", async () => {
  const base = "https://ysmapp.bj.10086.cn//app//channel-web//busiCore//showIndexCommon.action";
  const expected = `${base}?submitWarePackageId=A1000499`;
  for (const original of [
    expected,
    `${base}?channel=first&channel=second&submitWarePackageId=A1000499&code=test-employee#details`,
    `${base}?empCode=test-employee&submitWarePackageId=A1000499#code=test-employee`,
  ]) {
    await withServer(async (origin) => {
      const response = await fetch(`${origin}/api/grid/open?businessId=A1000499`, { redirect: "manual" });
      assert.equal(response.status, 302);
      assert.equal(response.headers.get("location"), expected);
    }, { gridLinks: validateGridLinks({ A1000499: original }) });
  }
});

test("grid original link validation rejects mismatched IDs and external redirect targets", () => {
  const base = "https://ysmapp.bj.10086.cn//app//channel-web//busiCore//showIndexCommon.action";
  for (const original of [
    `${base}?submitWarePackageId=A1000489`,
    `${base}?submitWarePackageId=A1000499&submitWarePackageId=A1000489`,
    "https://example.com/?submitWarePackageId=A1000499",
    "https://ysmapp.bj.10086.cn@evil.example/?submitWarePackageId=A1000499",
    `${base}?submitWarePackageId=A1000499\r\nInjected: yes`,
    `https://ysmapp.bj.10086.cn/other-path?submitWarePackageId=A1000499`,
  ]) {
    assert.throws(() => validateGridLinks({ A1000499: original }), /Invalid original grid link/);
  }
});

test("grid knowledge API serves read endpoints and protects management POST requests", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "contract3-grid-api-"));
  const packageId = "A1000489";
  const detail = {
    package_id: packageId,
    title: "测试业务入口",
    status: "ok",
    businesses: [{ type_id: "B1000001", name: "测试资费", introduction: "测试介绍", rules: "测试规则", sections: [] }],
  };
  const list = { items: [{ package_id: packageId, title: detail.title, status: "ok" }], total: 1, page: 1, pageSize: 100, summary: { total: 1, businesses: 1, tariffRows: 0, statuses: { ok: 1 } } };
  const runner = async (args) => {
    if (args.operation === "summary") return list.summary;
    if (args.operation === "settings") return { startId: "A1000959", endId: "A1001058", intervalMs: 500 };
    if (args.operation === "list") return list;
    if (args.operation === "detail") return args.id === packageId ? detail : null;
    if (args.operation === "configure") return { configured: args.ids.length, settings: args.settings || {} };
    if (args.operation === "scan") return { done: true, summary: list.summary };
    throw new Error(`unexpected operation: ${args.operation}`);
  };
  const gridCatalogHandler = createGridCatalog({ dbPath: path.join(tempDir, "test.sqlite"), key: "test-secret", run: runner });
  await withServer(async (origin) => {
    const status = await fetch(`${origin}/api/grid-catalog/status`);
    assert.equal(status.status, 200);
    assert.equal((await status.json()).summary.total, 1);

    const detailResponse = await fetch(`${origin}/api/grid-catalog/detail?id=${packageId}`);
    assert.equal(detailResponse.status, 200);
    assert.equal((await detailResponse.json()).businesses[0].name, "测试资费");

    const exportResponse = await fetch(`${origin}/api/grid-catalog/export.json`);
    assert.equal(exportResponse.status, 200);
    assert.equal((await exportResponse.json()).packages[0].package_id, packageId);

    const unauthorized = await fetch(`${origin}/api/grid-catalog/configure`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: [packageId] }),
    });
    assert.equal(unauthorized.status, 401);

    const configured = await fetch(`${origin}/api/grid-catalog/configure`, {
      method: "POST",
      headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
      body: JSON.stringify({ ids: [packageId] }),
    });
    assert.equal(configured.status, 200);
    assert.equal((await configured.json()).configured, 1);

    const invalid = await fetch(`${origin}/api/grid-catalog/configure`, {
      method: "POST",
      headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
      body: JSON.stringify({ ids: ["bad-id"] }),
    });
    assert.equal(invalid.status, 400);

    const collect = await fetch(`${origin}/api/grid-catalog/collect`, {
      method: "POST",
      headers: { authorization: "Bearer test-secret", "content-type": "application/json" },
      body: JSON.stringify({ mode: "selected", ids: [packageId] }),
    });
    assert.equal(collect.status, 202);
    assert.equal((await collect.json()).job.mode, "selected");

    const method = await fetch(`${origin}/api/grid-catalog/status`, { method: "PUT" });
    assert.equal(method.status, 405);
  }, { gridCatalogHandler });
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("grid knowledge API validates IDs and blocks cross-origin management requests", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "contract3-grid-api-"));
  const runner = async (args) => args.operation === "summary" ? { total: 0, businesses: 0, tariffRows: 0, statuses: {} } : args.operation === "settings" ? {} : { items: [], total: 0, page: 1, pageSize: 100, summary: {} };
  const gridCatalogHandler = createGridCatalog({ dbPath: path.join(tempDir, "test.sqlite"), key: "test-secret", run: runner });
  await withServer(async (origin) => {
    const invalid = await fetch(`${origin}/api/grid-catalog/detail?id=not-an-id`);
    assert.equal(invalid.status, 400);
    assert.match((await invalid.json()).message, /业务 ID/);

    const crossOrigin = await fetch(`${origin}/api/grid-catalog/configure`, {
      method: "POST",
      headers: { authorization: "Bearer test-secret", origin: "https://evil.example", "content-type": "application/json" },
      body: JSON.stringify({ ids: [] }),
    });
    assert.equal(crossOrigin.status, 403);
  }, { gridCatalogHandler });
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("grid knowledge listing searches introductions and detail returns tariff sections", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "contract3-grid-knowledge-"));
  const packageId = "A1000494";
  const runner = async (args) => {
    if (args.operation === "list") return {
      items: [{ package_id: packageId, title: "承诺低消得流量（泛渠道）", status: "ok", business_count: 1, last_success_at: "2026-11-06T00:00:00+08:00" }],
      total: 1, page: 1, pageSize: 20, summary: { total: 1, businesses: 1, tariffRows: 1, statuses: { ok: 1 } },
    };
    if (args.operation === "detail") return {
      package_id: packageId, title: "承诺低消得流量（泛渠道）", status: "ok", last_success_at: "2026-11-06T00:00:00+08:00",
      businesses: [{ type_id: "B1000888", name: "承诺低消得流量（泛渠道）", introduction: "每月承诺消费", rules: "业务规则", dynamic_pricing: 1,
        sections: [{ heading: "资费说明", content: "资费说明", tables: [[["月承诺", "权益"], ["58元", "流量"]]] }] }],
    };
    if (args.operation === "summary") return { total: 1, businesses: 1, tariffRows: 1, statuses: { ok: 1 } };
    if (args.operation === "settings") return {};
    throw new Error(`unexpected operation: ${args.operation}`);
  };
  const gridCatalogHandler = createGridCatalog({ dbPath: path.join(tempDir, "test.sqlite"), run: runner });
  await withServer(async (origin) => {
    const listResponse = await fetch(`${origin}/api/grid-catalog?q=${encodeURIComponent("承诺消费")}&pageSize=20`);
    assert.equal(listResponse.status, 200);
    const list = await listResponse.json();
    assert.equal(list.total, 1);
    assert.equal(list.items[0].business_count, 1);
    const detailResponse = await fetch(`${origin}/api/grid-catalog/detail?id=${packageId}`);
    assert.equal(detailResponse.status, 200);
    const detail = await detailResponse.json();
    assert.equal(detail.businesses[0].sections[0].tables[0][1][0], "58元");
  }, { gridCatalogHandler });
  fs.rmSync(tempDir, { recursive: true, force: true });
});
