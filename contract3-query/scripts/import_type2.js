const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");
const source = path.resolve(process.argv[2] || path.join(root, "好礼多多本地版查询", "productSearch.html"));
const output = path.resolve(process.argv[3] || path.join(root, "contract3-query", "data", "type2.json"));
const html = fs.readFileSync(source, "utf8");
const match = html.match(/const DATA = (\[.*?\]);\s*const SUMMARY/s);

if (!match) throw new Error("未在二类合约页面中找到 DATA 数据");
const contracts = JSON.parse(match[1]);
if (!Array.isArray(contracts) || !contracts.length) throw new Error("二类合约数据为空");

const ids = new Set();
for (const [index, contract] of contracts.entries()) {
  if (!contract || !/^\d{12}$/.test(String(contract.code || ""))) {
    throw new Error(`第 ${index + 1} 条二类合约编码无效`);
  }
  if (!contract.name) throw new Error(`第 ${index + 1} 条二类合约名称为空`);
  if (ids.has(contract.code)) throw new Error(`二类合约编码重复：${contract.code}`);
  ids.add(contract.code);
}

const payload = {
  meta: {
    sourceFile: path.basename(source),
    total: contracts.length,
  },
  contracts,
};
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`已导入 ${contracts.length} 条二类合约 -> ${output}`);
