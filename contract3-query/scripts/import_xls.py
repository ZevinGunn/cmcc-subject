#!/usr/bin/env python3
import argparse
import json
import math
from pathlib import Path

try:
    import xlrd
except ImportError as error:
    raise SystemExit("缺少 xlrd 2.x；请先安装导入依赖：python3 -m pip install xlrd==2.0.2") from error


def normalize_id(value):
    if isinstance(value, float):
        if not math.isfinite(value) or not value.is_integer():
            raise ValueError(f"策划 ID 不是整数：{value}")
        return str(int(value))
    return str(value).strip()


def main():
    root = Path(__file__).resolve().parents[2]
    parser = argparse.ArgumentParser(description="导入北京移动三类合约旧版 Excel 清单")
    parser.add_argument("source", nargs="?", default=root / "三类合约列表（20251031） (1).xls")
    parser.add_argument("output", nargs="?", default=root / "contract3-query/data/contracts.json")
    args = parser.parse_args()

    source = Path(args.source).resolve()
    output = Path(args.output).resolve()
    workbook = xlrd.open_workbook(source)
    sheet = workbook.sheet_by_index(0)
    if sheet.nrows < 2 or sheet.row_values(0)[:2] != ["策划ID", "策划名称"]:
        raise ValueError("首个工作表缺少预期表头：策划ID、策划名称")

    contracts = []
    ids = set()
    for row_index in range(1, sheet.nrows):
        contract_id = normalize_id(sheet.cell_value(row_index, 0))
        name = str(sheet.cell_value(row_index, 1)).strip()
        if not contract_id and not name:
            continue
        if not contract_id.isdigit() or len(contract_id) != 12:
            raise ValueError(f"第 {row_index + 1} 行策划 ID 非 12 位数字：{contract_id}")
        if not name:
            raise ValueError(f"第 {row_index + 1} 行策划名称为空")
        if contract_id in ids:
            raise ValueError(f"策划 ID 重复：{contract_id}")
        ids.add(contract_id)
        contracts.append({"id": contract_id, "name": name})

    payload = {
        "meta": {
            "sourceFile": source.name,
            "sourceDate": "2025-10-31",
            "total": len(contracts),
        },
        "contracts": contracts,
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"已导入 {len(contracts)} 条记录 -> {output}")


if __name__ == "__main__":
    main()
