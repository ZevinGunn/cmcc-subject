"""Import supplied XLSX catalogs; treat all workbook cells as data, never commands.

Requires openpyxl. Baseline snapshots are immutable and contain public catalog data only.
"""
import argparse
from collections import Counter
from datetime import date, datetime
import hashlib
import json
from pathlib import Path
import re
from urllib.parse import parse_qs, urlencode, urlsplit

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
FILES = {"2": "type2.json", "3": "contracts.json", "low": "low-consumption.json", "grid": "grid-businesses.json"}


def text(value):
    if value is None:
        return ""
    if isinstance(value, (date, datetime)):
        return value.strftime("%Y-%m-%d %H:%M:%S")
    return str(value).strip()


def name_key(value):
    return re.sub(r"\s+", "", text(value)).translate(str.maketrans({"（": "(", "）": ")", "【": "[", "】": "]", "－": "-", "—": "-", "–": "-"})).lower()


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def normalize_old(kind, records):
    if kind == "low":
        grouped = {}
        for record in records:
            key = name_key(record["name"])
            item = {**record, "key": key}
            if key in grouped and (grouped[key]["grade"], grouped[key].get("rule", "")) != (item["grade"], item.get("rule", "")):
                raise ValueError("Conflicting grades in baseline: " + record["name"])
            grouped.setdefault(key, item)
        return [{**record, "row": index} for index, record in enumerate(grouped.values(), 1)]
    result = []
    for index, record in enumerate(records, 1):
        item = {**record, "row": index, "id": text(record.get("id", record.get("code")))}
        item["prefix"] = item["id"][:6]
        item.pop("code", None)
        item.pop("idx", None)
        result.append(item)
    return result


def workbook_meta(path, source_date):
    return {"sourceFile": path.name, "sourceDate": source_date, "sourceSha256": hashlib.sha256(path.read_bytes()).hexdigest()}


def import_numbered(path, kind, baseline, source_date):
    sheet = openpyxl.load_workbook(path, data_only=True).active
    expected = "ID" if kind == "2" else "策划ID"
    if text(sheet.cell(1, 2).value) != expected or text(sheet.cell(1, 3).value) != "策划名称":
        raise ValueError("Unexpected workbook columns: " + path.name)
    previous = {item["id"]: item for item in baseline["contracts"]}
    records = {}
    duplicates = 0
    for values in sheet.iter_rows(min_row=2, values_only=True):
        if not values[1]:
            continue
        identifier, name = text(values[1]), text(values[2])
        if not re.fullmatch(r"\d{12}", identifier) or not name:
            raise ValueError("Invalid contract ID/name")
        item = {"id": identifier, "prefix": identifier[:6], "name": name,
                "start": text(values[3 if kind == "2" else 4]), "end": text(values[4 if kind == "2" else 5])}
        if kind == "2":
            old = previous.get(identifier, {})
            item.update({key: old.get(key, "") for key in ["category", "amount", "duration", "long", "status"]})
            item["category"] = item["category"] or "未分类"
        if identifier in records:
            if records[identifier] != item:
                raise ValueError("Conflicting duplicate contract: " + identifier)
            duplicates += 1
        records[identifier] = item
    contracts = [{"row": index, **record} for index, record in enumerate(records.values(), 1)]
    meta = {**workbook_meta(path, source_date), "total": len(contracts), "duplicateRowsMerged": duplicates}
    if kind == "2":
        meta["fieldNote"] = "分类、金额、合约期沿用旧版；新表未提供的字段留空，新增编码分类为未分类。"
    return {"meta": meta, "contracts": contracts}


def sheet_rows(sheet):
    # Only fill actual merged grade ranges, never arbitrary blank cells.
    merged = {row: sheet.cell(area.min_row, 3).value for area in sheet.merged_cells.ranges if area.min_col == area.max_col == 3
              for row in range(area.min_row, area.max_row + 1)}
    for row, values in enumerate(sheet.iter_rows(min_row=2, values_only=True), 2):
        if values[0]:
            values = list(values)
            values[2] = merged.get(row, values[2])
            yield values


def import_low(path, source_date):
    workbook = openpyxl.load_workbook(path, data_only=True)
    details = {text(row[0]): row for row in sheet_rows(workbook["详情"])}
    grouped, identifiers = {}, set()
    for title in ["合约", "套餐"]:
        for values in sheet_rows(workbook[title]):
            identifier, name, raw_grade = map(text, values[:3])
            if not re.fullmatch(r"\d{12}", identifier) or identifier in identifiers or not name or not raw_grade:
                raise ValueError("Invalid or duplicate low-consumption contract: " + identifier)
            identifiers.add(identifier)
            detail = details.get(identifier)
            if detail and (name_key(detail[1]) != name_key(name) or text(detail[2]) != raw_grade):
                raise ValueError("Conflicting detail sheet: " + identifier)
            rule = raw_grade if "对应" in raw_grade else ""
            grade = "多档规则" if rule else raw_grade
            key = name_key(name)
            record = grouped.setdefault(key, {"key": key, "name": name, "grade": grade, "rule": rule, "variants": []})
            if (record["grade"], record["rule"]) != (grade, rule):
                raise ValueError("Conflicting name/grade: " + name)
            record["variants"].append({"id": identifier, "kind": title, "amount": text(detail[3]) if detail else "",
                "duration": text(detail[4]) if detail else "", "immediate": text(values[3]),
                "note": text(values[4]) if len(values) > 4 else ""})
    if not set(details).issubset(identifiers):
        raise ValueError("Unmatched low-consumption details")
    records = [{"row": index, **record, "ids": [v["id"] for v in record["variants"]]} for index, record in enumerate(grouped.values(), 1)]
    return {"meta": {**workbook_meta(path, source_date), "total": len(records), "idTotal": len(identifiers),
        "gradeCounts": dict(Counter(record["grade"] for record in records)), "comparisonKey": "normalized-name",
        "fieldNote": f"共 {len(records)} 个方案、{len(identifiers)} 个策划 ID。同名方案合并展示，可展开查看承诺金额、合约期和生效说明；已下线标注沿用源表。"}, "contracts": records}


def import_grid(path):
    sheet = openpyxl.load_workbook(path, data_only=True)["有效业务清单"]
    records, identifiers = [], set()
    for values in sheet.iter_rows(min_row=3, values_only=True):
        if not values[1]:
            continue
        identifier = text(values[1])
        if not re.fullmatch(r"A\d{7}", identifier) or identifier in identifiers:
            raise ValueError("Invalid/duplicate grid business")
        identifiers.add(identifier)
        # The source URLs embed employee identifiers and opaque tracking values.
        # Validate only business identity, then rebuild from an allowlisted origin.
        url = urlsplit(text(values[5]))
        if url.scheme != "https" or url.hostname != "ysmapp.bj.10086.cn" or parse_qs(url.query).get("submitWarePackageId") != [identifier]:
            raise ValueError("Unexpected grid business link")
        safe_url = "https://ysmapp.bj.10086.cn/app/channel-web/busiCore/showIndexCommon.action?" + urlencode({"submitWarePackageId": identifier, "channel": "app_share"})
        records.append({"row": len(records) + 1, "id": identifier, "name": text(values[2]), "optionCount": int(values[3]),
                        "details": text(values[4]), "url": safe_url, "note": text(values[6])})
    if len(records) != 358:
        raise ValueError("Expected 358 valid grid businesses")
    return {"meta": {"sourceFile": path.name, "total": len(records), "fieldNote": "办理需登录有效网格通工号；业务入口已去除原表内嵌工号及追踪参数。备注“本轮新增”沿用源表标注。"}, "contracts": records}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path, required=True)
    parser.add_argument("--baseline", default="before-20261105", help="Immutable snapshot name; choose a new name for each future update")
    args = parser.parse_args()
    if not re.fullmatch(r"[a-zA-Z0-9_-]+", args.baseline):
        parser.error("Invalid baseline name")
    data = ROOT / "data"
    snapshot_path = data / "baselines" / (args.baseline + ".json")
    if snapshot_path.exists():
        baseline = read_json(snapshot_path)
    else:
        baseline = {}
        for kind in ["2", "3", "low"]:
            original = read_json(data / FILES[kind])
            baseline[kind] = {"meta": original["meta"], "contracts": normalize_old(kind, original["contracts"])}
    directory = args.source_dir
    # Validate every input before touching runtime data or the snapshot.
    outputs = {
        "2": import_numbered(directory / "二类合约列表（20260810）(1).xlsx", "2", baseline["2"], "2026-08-10"),
        "3": import_numbered(directory / "三类合约260907.xlsx", "3", baseline["3"], "2026-09-07"),
        "low": import_low(directory / "低消方案对应生效全球通等级表260730.xlsx", "2026-07-30"),
        "grid": import_grid(directory / "网格通业务地址（没工号办不了没工号办不了）.xlsx"),
    }
    if not snapshot_path.exists():
        write_json(snapshot_path, baseline)
    for kind, output in outputs.items():
        if kind != "grid":
            output["meta"]["baselineFile"] = "baselines/" + snapshot_path.name
        write_json(data / FILES[kind], output)
        print(kind, json.dumps(output["meta"], ensure_ascii=False))


if __name__ == "__main__":
    main()
