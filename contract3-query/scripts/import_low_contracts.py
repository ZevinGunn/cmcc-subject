#!/usr/bin/env python3
import argparse
import json
import re
from collections import Counter
from pathlib import Path

try:
    from docx import Document
except ImportError as error:
    raise SystemExit("缺少 python-docx；请先安装导入依赖：python3 -m pip install python-docx") from error


GRADE_PATTERN = re.compile(r"\s+(银卡|金卡|白金卡|钻石卡)\s*$")


def parse_records(lines):
    records = []
    index = 0
    while index < len(lines):
        line = lines[index]

        # One source row contains an embedded quote split across two Word paragraphs.
        if line.startswith('"') and index + 1 < len(lines) and lines[index + 1].startswith('"'):
            line = f"{line[1:]} {lines[index + 1][1:]}".strip()
            index += 2
        elif ' "' in line and not line.endswith('"'):
            name, first_rule = line.split(' "', 1)
            rules = [first_rule]
            index += 1
            while index < len(lines):
                part = lines[index]
                rules.append(part.rstrip('"'))
                index += 1
                if part.endswith('"'):
                    break
            rule = "；".join(part.strip("； ") for part in rules if part.strip("； "))
            records.append({"name": name.strip(), "grade": "多档规则", "rule": rule})
            continue
        else:
            index += 1

        match = GRADE_PATTERN.search(line)
        if match:
            records.append({
                "name": line[:match.start()].strip(' "'),
                "grade": match.group(1),
                "rule": "",
            })
        else:
            records.append({"name": line.strip(' "'), "grade": "未标注", "rule": ""})
    return records


def main():
    root = Path(__file__).resolve().parents[2]
    parser = argparse.ArgumentParser(description="导入低消合约方案对应全球通等级 Word 清单")
    parser.add_argument("source", nargs="?", default=root / "低消合约方案对应生效全球通等级表250801.docx")
    parser.add_argument("output", nargs="?", default=root / "contract3-query/data/low-consumption.json")
    args = parser.parse_args()

    source = Path(args.source).resolve()
    output = Path(args.output).resolve()
    document = Document(source)
    lines = [paragraph.text.strip() for paragraph in document.paragraphs if paragraph.text.strip()]
    records = parse_records(lines)
    if not records:
        raise ValueError("Word 文档中没有可导入的方案")

    grade_counts = Counter(record["grade"] for record in records)
    payload = {
        "meta": {
            "sourceFile": source.name,
            "sourceDate": "2025-08-01",
            "total": len(records),
            "gradeCounts": dict(grade_counts),
        },
        "contracts": records,
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"已导入 {len(records)} 条低消方案 -> {output}")


if __name__ == "__main__":
    main()
