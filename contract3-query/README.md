# 北京移动合约查询

统一查询二类合约、三类合约及低消合约方案对应的全球通等级。

数据源：

- 二类合约：`好礼多多本地版查询/productSearch.html`
- 三类合约：`三类合约列表（20251031） (1).xls`
- 低消合约方案等级：`低消合约方案对应生效全球通等级表250801.docx`

```bash
npm test
PORT=3002 npm start
```

生产入口：`https://contracts.1008086.xyz/`

兼容入口：`https://contract3.1008086.xyz/`

接口：

- `GET /api/health`
- `GET /api/catalogs`
- `GET /api/contracts?type=2&q=关键词&prefix=111603&category=分类&page=1&pageSize=50`
- `GET /api/contracts?type=3&q=关键词&prefix=111602&page=1&pageSize=50`
- `GET /api/contracts?type=low&q=关键词&grade=钻石卡&page=1&pageSize=50`
- `GET /api/contracts.csv?type=2|3|low&q=关键词`

为兼容原三类合约接口，未提供 `type` 时默认查询三类合约。

更新源表后，安装一次导入依赖并重新生成数据：

```bash
python3 -m pip install xlrd==2.0.2 python-docx
npm run import:type2
npm run import:type3
npm run import:low
```
