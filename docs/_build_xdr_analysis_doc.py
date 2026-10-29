#!/usr/bin/env python3
"""Build the CMCC Global Telecom / Star Day evidence analysis document."""

from pathlib import Path
from datetime import date

from docx import Document
from docx.enum.section import WD_ORIENT
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.table import WD_ALIGN_VERTICAL, WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Inches, Pt, RGBColor, Twips


OUT = Path("/Users/ZevinGunn/CMCC-PROJECT/docs/全球通信息查询_成长值查询_星动日权益接口与加解密完整解析.docx")

BLUE = "0085D0"
DEEP = "12324A"
INK = "1E2933"
MUTED = "5B6873"
LIGHT = "EAF5FB"
PALE = "F4F7F9"
GOLD = "C59B42"
WARN = "FFF4D6"
RED = "B64747"
WHITE = "FFFFFF"
GRID = "B9C6CE"

# Named document override: A4 portrait with 1.65 cm side margins produces a
# 10036 DXA usable width in python-docx. Tables retain the original column
# proportions but encode exact fixed geometry for deterministic rendering.
A4_CONTENT_WIDTH_DXA = 10036
TABLE_INDENT_DXA = 120
CELL_MARGINS_DXA = {"top": 80, "bottom": 80, "start": 120, "end": 120}


def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_border(cell, **kwargs):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    borders = tc_pr.first_child_found_in("w:tcBorders")
    if borders is None:
        borders = OxmlElement("w:tcBorders")
        tc_pr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        if edge not in kwargs:
            continue
        tag = "w:" + edge
        element = borders.find(qn(tag))
        if element is None:
            element = OxmlElement(tag)
            borders.append(element)
        for key in ("val", "sz", "space", "color"):
            if key in kwargs[edge]:
                element.set(qn("w:" + key), str(kwargs[edge][key]))


def set_repeat_table_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def prevent_row_split(row):
    tr_pr = row._tr.get_or_add_trPr()
    cant_split = OxmlElement("w:cantSplit")
    tr_pr.append(cant_split)


def ensure_child(parent, tag):
    child = parent.find(qn(tag))
    if child is None:
        child = OxmlElement(tag)
        parent.append(child)
    return child


def proportional_widths(weights, total_width=A4_CONTENT_WIDTH_DXA):
    if not weights or any(float(weight) <= 0 for weight in weights):
        raise ValueError("Table column weights must be positive")
    total_weight = float(sum(weights))
    widths = [int(round(total_width * float(weight) / total_weight)) for weight in weights]
    widths[-1] += total_width - sum(widths)
    return widths


def apply_table_geometry(table, column_weights):
    widths = proportional_widths(column_weights)
    table.autofit = False
    table.alignment = WD_TABLE_ALIGNMENT.LEFT

    tbl_pr = table._tbl.tblPr
    tbl_w = ensure_child(tbl_pr, "w:tblW")
    tbl_w.set(qn("w:type"), "dxa")
    tbl_w.set(qn("w:w"), str(A4_CONTENT_WIDTH_DXA))
    tbl_ind = ensure_child(tbl_pr, "w:tblInd")
    tbl_ind.set(qn("w:type"), "dxa")
    tbl_ind.set(qn("w:w"), str(TABLE_INDENT_DXA))
    tbl_layout = ensure_child(tbl_pr, "w:tblLayout")
    tbl_layout.set(qn("w:type"), "fixed")

    grid = table._tbl.tblGrid
    for child in list(grid):
        grid.remove(child)
    for width in widths:
        grid_col = OxmlElement("w:gridCol")
        grid_col.set(qn("w:w"), str(width))
        grid.append(grid_col)

    for idx, width in enumerate(widths):
        table.columns[idx].width = Twips(width)
    for row in table.rows:
        row.height = None
        if len(row.cells) != len(widths):
            raise ValueError("Merged table rows require explicit geometry handling")
        for idx, cell in enumerate(row.cells):
            width = widths[idx]
            cell.width = Twips(width)
            tc_pr = cell._tc.get_or_add_tcPr()
            tc_w = ensure_child(tc_pr, "w:tcW")
            tc_w.set(qn("w:type"), "dxa")
            tc_w.set(qn("w:w"), str(width))
            tc_mar = ensure_child(tc_pr, "w:tcMar")
            for side, margin_width in CELL_MARGINS_DXA.items():
                margin = ensure_child(tc_mar, f"w:{side}")
                margin.set(qn("w:type"), "dxa")
                margin.set(qn("w:w"), str(margin_width))


def set_east_asia_font(run, font_name):
    run.font.name = font_name
    run._element.get_or_add_rPr().rFonts.set(qn("w:eastAsia"), font_name)


def add_page_field(paragraph):
    paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = paragraph.add_run("第 ")
    set_east_asia_font(run, "Hiragino Sans GB")
    fld = OxmlElement("w:fldSimple")
    fld.set(qn("w:instr"), "PAGE")
    paragraph._p.append(fld)
    run = paragraph.add_run(" 页")
    set_east_asia_font(run, "Hiragino Sans GB")


def configure_document(doc):
    section = doc.sections[0]
    section.page_width = Cm(21)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(1.65)
    section.bottom_margin = Cm(1.55)
    section.left_margin = Cm(1.65)
    section.right_margin = Cm(1.65)
    section.header_distance = Cm(0.75)
    section.footer_distance = Cm(0.75)

    styles = doc.styles
    normal = styles["Normal"]
    normal.font.name = "Aptos"
    normal._element.rPr.rFonts.set(qn("w:eastAsia"), "Hiragino Sans GB")
    normal.font.size = Pt(9.4)
    normal.font.color.rgb = RGBColor.from_string(INK)
    normal.paragraph_format.space_after = Pt(3.5)
    normal.paragraph_format.line_spacing = 1.18

    for name, size, color, before, after in [
        ("Title", 28, DEEP, 0, 10),
        ("Subtitle", 12, MUTED, 0, 8),
        ("Heading 1", 17, DEEP, 12, 6),
        ("Heading 2", 13, BLUE, 9, 4),
        ("Heading 3", 10.5, DEEP, 7, 3),
    ]:
        st = styles[name]
        st.font.name = "Aptos Display"
        st._element.rPr.rFonts.set(qn("w:eastAsia"), "Hiragino Sans GB")
        st.font.size = Pt(size)
        st.font.bold = True
        st.font.color.rgb = RGBColor.from_string(color)
        st.paragraph_format.space_before = Pt(before)
        st.paragraph_format.space_after = Pt(after)
        st.paragraph_format.keep_with_next = True
        st.paragraph_format.widow_control = True

    if "Code Block" not in styles:
        code_style = styles.add_style("Code Block", WD_STYLE_TYPE.PARAGRAPH)
    else:
        code_style = styles["Code Block"]
    code_style.font.name = "Menlo"
    code_style._element.rPr.rFonts.set(qn("w:eastAsia"), "Hiragino Sans GB")
    code_style.font.size = Pt(7.5)
    code_style.font.color.rgb = RGBColor.from_string(INK)
    code_style.paragraph_format.left_indent = Cm(0.35)
    code_style.paragraph_format.right_indent = Cm(0.35)
    code_style.paragraph_format.space_before = Pt(3)
    code_style.paragraph_format.space_after = Pt(4)
    code_style.paragraph_format.line_spacing = 1.05

    if "Callout" not in styles:
        callout = styles.add_style("Callout", WD_STYLE_TYPE.PARAGRAPH)
    else:
        callout = styles["Callout"]
    callout.font.name = "Aptos"
    callout._element.rPr.rFonts.set(qn("w:eastAsia"), "Hiragino Sans GB")
    callout.font.size = Pt(9.2)
    callout.font.color.rgb = RGBColor.from_string(DEEP)
    callout.paragraph_format.left_indent = Cm(0.45)
    callout.paragraph_format.right_indent = Cm(0.35)
    callout.paragraph_format.space_before = Pt(4)
    callout.paragraph_format.space_after = Pt(5)
    callout.paragraph_format.line_spacing = 1.15

    for sec in doc.sections:
        header = sec.header.paragraphs[0]
        header.text = "中国移动全球通 / 星动日 · 接口与加解密证据解析"
        header.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        for run in header.runs:
            set_east_asia_font(run, "Hiragino Sans GB")
            run.font.size = Pt(7.5)
            run.font.color.rgb = RGBColor.from_string(MUTED)
        add_page_field(sec.footer.paragraphs[0])
        for run in sec.footer.paragraphs[0].runs:
            run.font.size = Pt(7.5)
            run.font.color.rgb = RGBColor.from_string(MUTED)


def add_rule(doc, color=BLUE, height=12):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(5)
    p.paragraph_format.keep_with_next = True
    p_pr = p._p.get_or_add_pPr()
    borders = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), str(height))
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), color)
    borders.append(bottom)
    p_pr.append(borders)


def add_callout(doc, title, text, tone="info"):
    fills = {"info": LIGHT, "warn": WARN, "danger": "FCE8E8", "neutral": PALE}
    table = doc.add_table(rows=1, cols=1)
    table.autofit = False
    prevent_row_split(table.rows[0])
    cell = table.cell(0, 0)
    set_cell_shading(cell, fills.get(tone, LIGHT))
    set_cell_border(
        cell,
        left={"val": "single", "sz": "18", "color": GOLD if tone == "warn" else BLUE},
        top={"val": "nil"}, bottom={"val": "nil"}, right={"val": "nil"},
    )
    p = cell.paragraphs[0]
    p.style = doc.styles["Callout"]
    r = p.add_run(title + "  ")
    r.bold = True
    r.font.color.rgb = RGBColor.from_string(RED if tone == "danger" else DEEP)
    p.add_run(text)
    apply_table_geometry(table, [1])
    doc.add_paragraph().paragraph_format.space_after = Pt(0)


def add_bullets(doc, items, level=0):
    for item in items:
        p = doc.add_paragraph(style="List Bullet" if level == 0 else "List Bullet 2")
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.left_indent = Cm(0.55 + 0.4 * level)
        p.paragraph_format.first_line_indent = Cm(-0.25)
        p.add_run(item)


def add_numbered(doc, items):
    for item in items:
        p = doc.add_paragraph(style="List Number")
        p.paragraph_format.space_after = Pt(2.5)
        p.paragraph_format.left_indent = Cm(0.58)
        p.paragraph_format.first_line_indent = Cm(-0.3)
        p.add_run(item)


def add_code(doc, code):
    p = doc.add_paragraph(style="Code Block")
    p.paragraph_format.keep_together = True
    p_pr = p._p.get_or_add_pPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), "F2F5F7")
    p_pr.append(shd)
    r = p.add_run(code.strip("\n"))
    set_east_asia_font(r, "Menlo")
    return p


def add_table(
    doc, headers, rows, widths=None, font_size=7.6, header_fill=DEEP,
    keep_together=False,
):
    table = doc.add_table(rows=1, cols=len(headers))
    table.autofit = False
    table.style = "Table Grid"
    hdr = table.rows[0]
    set_repeat_table_header(hdr)
    prevent_row_split(hdr)
    for idx, header in enumerate(headers):
        cell = hdr.cells[idx]
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        set_cell_shading(cell, header_fill)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(str(header))
        run.bold = True
        run.font.color.rgb = RGBColor.from_string(WHITE)
        run.font.size = Pt(font_size)
        set_east_asia_font(run, "Hiragino Sans GB")
    for row_index, values in enumerate(rows):
        row = table.add_row()
        prevent_row_split(row)
        for idx, value in enumerate(values):
            cell = row.cells[idx]
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            if row_index % 2 == 1:
                set_cell_shading(cell, "F7F9FA")
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.05
            run = p.add_run(str(value))
            run.font.size = Pt(font_size)
            set_east_asia_font(run, "Hiragino Sans GB")
    apply_table_geometry(table, widths or [1] * len(headers))
    if keep_together:
        for row in table.rows[:-1]:
            for cell in row.cells:
                for paragraph in cell.paragraphs:
                    paragraph.paragraph_format.keep_with_next = True
    doc.add_paragraph().paragraph_format.space_after = Pt(0)
    return table


def add_section_title(doc, number, title, subtitle=None):
    p = doc.add_paragraph(style="Heading 1")
    r = p.add_run(f"{number}  {title}")
    r.font.color.rgb = RGBColor.from_string(DEEP)
    add_rule(doc, BLUE, 10)
    if subtitle:
        p = doc.add_paragraph(subtitle)
        p.paragraph_format.space_after = Pt(6)
        for run in p.runs:
            run.font.color.rgb = RGBColor.from_string(MUTED)


def add_page_break(doc):
    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)


def add_cover(doc):
    table = doc.add_table(rows=1, cols=1)
    table.autofit = False
    apply_table_geometry(table, [1])
    cell = table.cell(0, 0)
    set_cell_shading(cell, DEEP)
    set_cell_border(cell, top={"val": "nil"}, bottom={"val": "nil"}, left={"val": "nil"}, right={"val": "nil"})
    cell.height = Cm(8.7)
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(34)
    p.paragraph_format.space_after = Pt(10)
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r = p.add_run("全球通信息查询 · 成长值查询\n星动日权益查询与领取")
    r.bold = True
    r.font.size = Pt(27)
    r.font.color.rgb = RGBColor.from_string(WHITE)
    set_east_asia_font(r, "Hiragino Sans GB")
    p = cell.add_paragraph()
    r = p.add_run("源代码、HAR 请求、业务流程与加解密完整解析")
    r.font.size = Pt(13)
    r.font.color.rgb = RGBColor.from_string("CDEAF8")
    set_east_asia_font(r, "Hiragino Sans GB")
    p = cell.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    r = p.add_run("技术证据报告  |  复用实施参考  |  敏感数据已脱敏")
    r.font.size = Pt(9)
    r.font.color.rgb = RGBColor.from_string("E1C887")
    set_east_asia_font(r, "Hiragino Sans GB")

    doc.add_paragraph()
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    r = p.add_run("分析范围")
    r.bold = True
    r.font.size = Pt(12)
    r.font.color.rgb = RGBColor.from_string(BLUE)
    add_bullets(doc, [
        "3 份页面源码/离线响应包：全球通信息查询、成长值查询、星动日权益查询领取",
        "2 份 HAR：全球通信息查询和成长值查询、星动日",
        "认证、等级、内容楼层、成长/消费值、权益领取/转赠、盲盒、签到/补签、协议验证、日志埋点",
        "固定密钥、算法、IV、请求头、会话链路、字段用途、复用限制、已知代码缺陷与测试清单",
    ])
    add_callout(doc, "结论先行", "核心业务不是单一接口：站内 Cookie 会话负责全球通专区与星动日，另以大网 SSO token 登录加密 GSM 网关；短信登录又使用独立的 SM2 + AES-ECB 方案。三套凭据不能互换。", "warn")
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(16)
    r = p.add_run(f"生成日期：{date.today().isoformat()}  ·  版本：1.0（基于所给样本静态/抓包证据）")
    r.font.size = Pt(8.5)
    r.font.color.rgb = RGBColor.from_string(MUTED)
    set_east_asia_font(r, "Hiragino Sans GB")
    add_page_break(doc)


def build():
    doc = Document()
    configure_document(doc)
    add_cover(doc)

    add_section_title(doc, "0", "文档说明与证据口径", "本报告只陈述样本能够支持的事实；对仅有调用代码、没有抓包/保存响应的接口，明确标注为“源码可见，待联调验证”。")
    doc.add_heading("0.1 交付内容", level=2)
    add_bullets(doc, [
        "完整业务说明：全球通身份与等级、成长/消费值、等级化楼层、星动日权益、生日礼、出行/国漫/家庭圈、盲盒、签到/补签。",
        "完整接口说明：相对路径、HTTP 方法、Content-Type、入参、响应外壳、核心字段、页面用途、证据等级。",
        "完整加解密说明：GSM 网关请求/响应双密钥、固定 IV、静态头、X-GSM-TOKEN；短信登录 AES；短信发送 SM2；富文本解密。",
        "复用说明：推荐调用顺序、缓存/会话管理、字段类型兼容、错误码、源代码缺陷、验收测试清单。",
    ])
    doc.add_heading("0.2 证据等级", level=2)
    add_table(doc, ["标记", "证据类型", "可下结论范围"], [
        ("H", "HAR 抓包", "方法、URL、查询参数、请求体、请求头、HTTP 状态均已实证"),
        ("R", "离线保存响应", "响应外壳、字段、类型和该次样本值已实证"),
        ("S", "源代码调用", "调用方法、拼装参数、消费字段和前端状态分支可确认；服务端完整协议仍需联调"),
        ("T", "静态模板/保底数据", "可说明页面预期字段和权益配置，不等同于线上实时返回"),
        ("M", "第三方遥测", "仅用于分析埋点数据暴露面，不属于业务查询/领取接口"),
    ], [1.2, 3.6, 11.0], 8.2)
    doc.add_heading("0.3 样本清单与完整性", level=2)
    add_table(doc, ["文件", "SHA-256", "用途"], [
        ("星动日.har", "87454083…917451c", "星动日页面真实请求，共 20 条"),
        ("星动日权益查询领取.zip", "5a1fb38e…f0e30e50", "星动日源码、组件、离线响应"),
        ("全球通信息查询.zip", "ba667203…e5bfa90", "全球通专区源码、等级楼层与网关组件"),
        ("成长值查询.zip", "0cff4222…c5771a", "成长/消费值页面源码与网关响应"),
        ("全球通信息查询和成长值查询.har", "8f2fe05f…be13ad2", "全球通/成长值真实请求，共 33 条"),
    ], [4.8, 5.4, 5.6], 7.5)
    add_callout(doc, "数量核验", "解包后共 741 个文件：443 PNG、126 JS、57 HTML、47 CSS、32 TXT，另含 JPG/GIF/字体及 .action/.do 保存响应。两份 HAR 合计 53 条请求、25 个唯一“方法 + 端点”组合；源码检出 173 处相关调用引用，大量文件在三个包之间字节级重复。", "neutral")
    doc.add_heading("0.4 脱敏与限制", level=2)
    add_bullets(doc, [
        "HAR 中 Cookie、X-GSM-TOKEN、SSO token、手机号、用户唯一标识、埋点 session_id 均不在文档中原样披露。",
        "源码中固定写死、实现复用所必需的密钥/IV/公钥按用户要求原样记录；这不代表建议继续在生产前端硬编码。",
        "所有 HAR 请求 HTTP 状态均为 200，但业务成功必须继续判断内层 status、retCode 或 rtnCode。",
        "保存的 contactInfo 响应含未转义控制字符，严格 JSON 解析器会失败；本报告以宽松解析方式提取结构。",
        "没有对线上接口再次发请求，未验证源代码未覆盖的服务端校验、频控、活动日期及省份策略。",
    ])

    add_section_title(doc, "1", "系统功能与业务全景")
    doc.add_heading("1.1 三层架构", level=2)
    add_table(doc, ["层", "主机/组件", "职责", "认证/加密"], [
        ("专区业务层", "qqt.cmicrwx.cn/2016tyjf/xhmqqthy", "登录态、全球通等级、楼层配置、权益、盲盒、签到、提示记录、日志", "同源 Cookie 会话；部分字段另行 AES/SM2"),
        ("GSM 数据网关", "10086.online-cmcc.cn:20010/cmcc-gateway", "全球通状态、消费累计、升档阈值、月度账单、等级刻度", "AES-CBC 请求/响应；静态头；X-GSM-TOKEN"),
        ("内容/组件层", "qqt-res.cmicrwx.cn、app.online-cmcc.cn、qwhdcdn.cmcc-cs.cn", "JS/CSS/图片、富文本、全球通信息组件", "静态资源；部分富文本 AES-ECB"),
        ("外部业务跳转", "云盘、新通话、各省商城等", "领取后使用、任务浏览、SSO 跳转", "getCmpSSOTokenNew/getCmpSSOParam 转换 token 名称"),
        ("遥测层", "dc.cmicapm.com:7080/list", "页面访问/事件上报", "独立 SDK；样本会将完整 URL 与 token 放入 params"),
    ], [2.4, 4.5, 6.0, 4.0], 7.4)
    doc.add_heading("1.2 核心业务链路", level=2)
    add_numbered(doc, [
        "进入专区：记录渠道日志，调用 checkLoginStatus 判断站内 Cookie 会话。",
        "未登录时：优先尝试 App/本机号码一键取号；失败后进入短信验证码登录。",
        "登录后：queryVipLevel 返回全球通卡级、归属省、可领取次数、已领产品、分析标识等。",
        "专区内容：按 userLevel + version=V2 拉取 contactInfo，渲染对应等级的导航、权益楼层和推荐内容。",
        "成长/消费值：先取大网 SSO token，再登录加密 GSM 网关；用 sessionId 查询 gsmState，随后查询消费与升档详情。",
        "星动日：查询领取次数和分期权益列表；按等级、库存、隐藏标记、是否已领取、是否可转赠、活动时段决定按钮状态。",
        "扩展活动：盲盒、签到/补签、生日礼、协议验证码、评价与提示记录分别使用独立接口。",
        "领取成功：页面通常提示 24 小时内下发；部分实物奖或合作方权益还会发短信、填写收货信息或携 SSO token 跳转。",
    ])
    doc.add_heading("1.3 等级与身份映射", level=2)
    add_table(doc, ["userLevel", "显示身份", "关键影响"], [
        ("-2", "未登录", "不能领取；触发登录流程"),
        ("-1", "非中国移动", "跳转非移动用户提示/引导"),
        ("0", "普卡", "页面有专门升档文案；多数星动日权益最低从银卡展示"),
        ("1", "银卡", "使用 levelable 包含 1 的权益"),
        ("2", "金卡", "使用 levelable 包含 2 的权益"),
        ("3", "白金卡", "生日礼可展示；可领白金档权益"),
        ("4", "钻石卡", "生日礼可展示；可命中钻石到卓越钻策略"),
        ("7", "非全球通", "相关页面按“非全”处理；部分列表预览按银卡兜底"),
        ("8", "卓越钻石卡", "最高档卡级；生日礼可展示"),
        ("11", "体验卡", "星动日源码存在卡面映射，但通用等级组件主枚举未包含"),
        ("9999", "异常/网络兜底", "源码会退出登录并要求重试"),
    ], [2.0, 4.0, 10.8], 7.7)
    add_callout(doc, "状态归一化", "GSM 组件会把 gsmState 4/5 统一为 userLevel 4，把空值及 6/7 归一为 -1；专区 queryVipLevel 的 userLevel 与 GSM 网关 gsmState 是两套来源，复用时应显式做一致性校验。", "warn")

    add_section_title(doc, "2", "登录、认证与会话")
    doc.add_heading("2.1 站内 Cookie 会话", level=2)
    add_bullets(doc, [
        "专区接口依赖浏览器同源 Cookie。checkLoginStatus 只判断当前会话，不返回 GSM 网关 token。",
        "queryVipLevel 是业务身份主数据入口；页面把 mobile、userLevel、huoshanCode、province 写入 sessionStorage。",
        "logout.action 成功后源码清空整个 sessionStorage，可能误删同域其他模块状态。",
        "HTTP 200 仅表示传输成功；通用成功多为字符串 status=\"1\"，出行次数接口则用 status=\"0000\"。",
    ])
    doc.add_heading("2.2 一键取号", level=2)
    add_numbered(doc, [
        "前端用 appId=300011877466、version=1.0 调用 ywAuth.getSign。",
        "POST /acquire/tokenParam.action，表单字段 ydrzSign；响应 data 提供 version/appId/sign/openType/expandParams/isTest/reqType。",
        "客户端 SDK ywAuth.getTokenInfo 获取 token 与 userInformation。",
        "POST /acquire/validateTokenHttps：token、userInformation、preLogin=1、sspId。",
        "响应 data.phone（页面展示用掩码号）与 data.preToken；随后 POST /login.action：phone + preToken，建立站内会话。",
    ])
    doc.add_heading("2.3 中国移动 App 电渠登录", level=2)
    add_bullets(doc, [
        "新版路径通过 leadeon.getYDRZToken(sourceId=001191) 取得 token；兼容路径通过 checkUID 取得 uid。",
        "POST /leadeonLogin.action?随机数，表单 token、sspId；成功后回调 data，并保存 huoshanCode 供埋点使用。",
        "请求超时设为 10 秒；源码失败时只记日志并关闭蒙层，复用应补齐可观察错误和重试策略。",
    ])
    doc.add_heading("2.4 短信验证码登录", level=2)
    add_numbered(doc, [
        "发送验证码：明文 phone + ':' + 毫秒时间戳，UTF-8 → Base64 文本 → SM2(C1C2C3)；POST /new/cmpSmsSend.action，字段 phone、sspId。",
        "发送成功开始 60 秒倒计时，并每 1.2 秒 POST /phoneCheck.action，最多约 6 次；status=-1001 表示非移动用户。",
        "登录：phone 与 6 位 smsCode 分别用 AES-128-ECB/PKCS#7/Base64 加密；POST /login.action 或白名单 /loginW.action。",
        "登录状态码：1 成功；0/-41 验证码错误；-42/-43 发送过频；-44 验证码失效；-52 非移动号；-64 微信绑定失败；-800 短信下发中。",
    ])
    add_callout(doc, "易混淆点", "SM2 发送验证码和 AES-ECB 登录是同一流程的两个不同加密步骤；不能用 AES 密钥加密 cmpSmsSend.phone，也不能把 SM2 密文用于 login.phone。", "danger")
    doc.add_heading("2.5 大网 SSO 与 GSM 网关会话", level=2)
    add_numbered(doc, [
        "POST /getCmpSSOTokenNew.action（可空、可传 targetid），得到 YDRZToken/大网 token。",
        "把 {token} 作为明文 JSON，整体 AES-CBC 加密后 POST 到 /outside/gsm/login。",
        "解密登录响应，取 data.sessionId；样本 expires=1800 秒。组件把它写入 localStorage.sessionId。",
        "后续网关请求同时带静态 Lrsbhbg8 和动态 X-GSM-TOKEN=sessionId；请求体继续整体 AES-CBC 加密。",
        "网关外层 rtnCode=\"0\" 才解密 encryptData；解密后的业务层再判断 status 或 retCode。",
    ])

    add_section_title(doc, "3", "全球通信息与成长/消费值")
    doc.add_heading("3.1 数据来源不能混用", level=2)
    add_table(doc, ["页面信息", "真实来源", "用途"], [
        ("全球通身份/卡级/归属省", "queryVipLevel.do", "专区登录后身份、权益过滤、埋点"),
        ("等级化内容/权益楼层", "floorRule/contactInfo", "按卡级渲染导航、推荐、生日、出行、通信、家庭、设备等"),
        ("活动与升档推荐内容", "customer/growthValue", "hdczz 活动楼层、tsdj 提升等级推荐；不是数值成长值"),
        ("当前 GSM 状态/入网时间", "getGsmState", "rspBody.gsmState、userBegin、userChinaMobileage"),
        ("消费累计/差额/月账单/等级刻度", "queryGsmInfo", "成长/消费值主卡片、升档进度和月度明细"),
    ], [4.2, 5.2, 7.4], 7.8)
    doc.add_heading("3.2 GSM 三步查询", level=2)
    add_code(doc, """
1. POST /cmcc-gateway/outside/gsm/login
   plaintext: {"token":"<YDRZToken>"}
   => data.sessionId, data.expires, data.user.*

2. POST /cmcc-gateway/outside/gsm/iservice/direct/serviceUnified/getGsmState
   plaintext: {}
   header: X-GSM-TOKEN: <sessionId>
   => rspBody.gsmState, userBegin, userChinaMobileage

3. POST /cmcc-gateway/outside/gsm/iservice/direct/gsmInfo/queryGsmInfo
   plaintext: {"gsmState":"4","appFlag":"0"}
   header: X-GSM-TOKEN: <sessionId>
   => consumptionTotal / Required / Re, gsmNext, gsmList, transactionDetails
""")
    doc.add_heading("3.3 queryGsmInfo 字段字典", level=2)
    add_table(doc, ["字段", "类型", "用途/样本解释"], [
        ("retCode", "String", "业务成功码；源码要求 000000"),
        ("retDesc", "String", "业务描述"),
        ("rspBody.gsmState", "String", "当前全球通状态/等级枚举"),
        ("gsmNext", "String", "下一目标等级名称"),
        ("consumptionTotal", "String", "当前累计消费值；样本 4163"),
        ("consumptionRequired", "String", "目标等级所需阈值；样本 3720"),
        ("consumptionRe", "String", "距目标差额；样本 -443，负值不可简单显示为“还差”"),
        ("gsmList[].name", "String", "卡级名称，如普卡/银卡/金卡/白金卡/钻石卡/卓越钻石卡"),
        ("gsmList[].value", "String", "对应卡级刻度值"),
        ("transactionDetails[].month", "String", "月份，源码取末两位拼显示范围"),
        ("transactionDetails[].bill", "String", "该月消费账单值"),
        ("year/month", "String", "统计年度/月"),
        ("growthValueSwitch", "String", "成长值展示开关，组件回传页面"),
        ("proviceCode", "String", "省代码；服务端拼写确为 proviceCode"),
        ("isShieldingPeriod", "String", "是否处于屏蔽期"),
    ], [5.0, 2.5, 9.3], 7.5)
    doc.add_heading("3.4 登录响应字段", level=2)
    add_table(doc, ["字段", "用途"], [
        ("data.expires", "网关会话有效秒数；样本 1800，应在到期前刷新"),
        ("data.sessionId", "后续 X-GSM-TOKEN；属于敏感凭据"),
        ("data.user.cipherPhoneNumber", "密文手机号标识；不要假设可用短信 AES 密钥解密"),
        ("data.user.gioPhoneNumber", "埋点用户标识；组件写入 phoneNumber"),
        ("data.user.maskPhoneNumber", "掩码手机号，适合展示"),
        ("data.user.provinceCode/cityCode", "登录归属省市与埋点通用属性"),
        ("data.user.bindStatus", "绑定状态"),
        ("restStatus/status/id/message", "网关登录内层状态与诊断字段"),
    ], [6.3, 10.5], 8)
    add_callout(doc, "数值类型", "queryGsmInfo 的金额、阈值、差额、年份、月份大多以字符串返回。展示前可保留字符串；计算前必须 Number/Decimal 转换，并处理空串、负数和非数字。", "warn")

    add_section_title(doc, "4", "全球通专区楼层与其他权益")
    doc.add_heading("4.1 contactInfo 响应模型", level=2)
    doc.add_paragraph("统一外壳为 {status,msg,data}。data 下按楼层键分组；每个键通常是 [{moduleId,floorCode,value:[...]}]，value 元素包含 elementMap 和营销元数据。")
    add_table(doc, ["字段组", "核心字段", "前端用途"], [
        ("展示", "vSubject、vSubject1…8、vImage/vImage2/vImage3、vIconTitle、vCardColor", "标题、说明、图片、卡片样式"),
        ("跳转", "vLinkUrl、vLinkUrl1/2、vLinkUrlType、vLaunchType、vJumpType", "H5/原生/SSO 跳转路由"),
        ("订购", "productId、productType、vOrderType、tfRuleId、makeContactCode", "权益/产品标识、订购策略"),
        ("过滤", "isHide、versionType、isJudgeOs、android/ios/harmony、contactProvince/contactCity", "隐藏、终端/版本/地域过滤"),
        ("有效性", "effectiveType/effectiveTime、startTime/endTime、lockLimitTime", "时间窗与频控"),
        ("营销", "marketingPlayId、childMarketingCode、yxMarketingCode、ruleCode、channelCode", "营销活动与触点归因"),
        ("富文本", "vRichText、vRichTextIsEncryption", "规则/详情 URL 或加密正文"),
    ], [3.0, 7.5, 6.3], 7.5)
    doc.add_heading("4.2 楼层键完整清单", level=2)
    add_table(doc, ["键", "业务含义", "说明"], [
        ("dhtab2", "导航图标", "专区顶部导航配置"),
        ("dhtabgl2", "导航关联", "导航与目标楼层映射"),
        ("wntj2", "为你推荐", "个性化/营销推荐"),
        ("srl2 / srltc2", "生日礼 / 生日弹窗", "白金及以上生日权益入口"),
        ("txqy2", "通信权益", "通信及国际漫游相关内容"),
        ("xxsly2", "休闲商旅", "机场、高铁、酒店等出行权益"),
        ("jdjqyh2", "酒店景区优惠", "酒店/景区类内容"),
        ("xdhl2", "星动好礼", "星动日入口及权益内容"),
        ("zmjh2", "逐马计划", "跑步/运动活动"),
        ("gjyh2", "购机优惠", "终端设备优惠"),
        ("jtgx2", "家庭共享", "亲情圈/家庭共享内容"),
        ("wlfl2", "网龄福利", "按在网年限配置的福利"),
        ("zstc2", "专属套餐", "含 5GA/全球通专属套餐内容"),
        ("zyzsk2 / zyzsktc2", "卓越钻石卡 / 弹窗", "最高卡级专属内容"),
        ("yxcp2", "优选产品", "产品推荐"),
        ("sjb2", "世界杯", "赛事专题内容"),
        ("xgyyh2", "香港优越会", "香港/优越会相关入口"),
        ("lxkf2", "联系客户经理", "客户经理/客服信息"),
        ("zskhjl2", "钻石客户经理", "钻石客户经理相关楼层"),
        ("gg2", "公告/广告", "公告或运营横幅"),
        ("fwpj2", "服务评价", "评价组件配置"),
        ("ktgdan2", "运营配置键", "样本未给出稳定中文名，复用时按 moduleId 核对"),
        ("tytc2", "体验弹窗", "体验型弹窗配置"),
        ("wxtstc2", "微信提示弹窗", "微信环境提示"),
        ("xsydmc2", "运营配置键", "样本仅能确认键名，需以后端配置字典为准"),
    ], [3.4, 4.5, 8.9], 7.25)
    add_callout(doc, "解析兼容", "抓到的 contactInfo 文本含 JSON 标准不允许的控制字符。JavaScript/jQuery 在实际环境可能已由浏览器/服务端处理，但后端复用、ETL 或 Go/Java 严格解析时会直接报错。应先要求服务端修复；短期只能做有边界的控制字符清洗并保留原文审计。", "danger")
    doc.add_heading("4.3 其他权益状态", level=2)
    add_table(doc, ["接口", "关键返回", "用途"], [
        ("customer/queryRemainNum", "travelFlag、travelGoodsCode、mealCount、airportCount、trainCount、hotelFlag", "商旅权益可领标志与剩余次数；成功码 0000"),
        ("cartoon/queryInternationalRoaming.action", "code/msg/data.pickUp/reqID/syncOrderRelationInfo[]/success", "国际漫游领取状态与订购关系"),
        ("paidpurchase/familyCircle.action", "num、familyList[].familyMemNum/showFamilyMemNum/familyMemName", "家庭圈数量与成员；familyMemNum 为未知加密字段"),
        ("clientManager/checkTarget", "rtnCode/rtnMsg/object.staffName/serviceNum/teamName/respCode 等", "客户经理匹配与服务信息"),
        ("member/yyh/getUserActivityData", "data.code、data.data[].remainNum/actId/supplierInfos[].goodsInfos[]", "优越会医疗、出行、保险、休息室剩余次数和券码"),
        ("member/yyh/orderGsmRights", "status/msg/data（未抓包）", "优越会权益领取，入参 actId/goodscode/skuId"),
    ], [5.0, 7.2, 4.6], 7.2)

    add_section_title(doc, "5", "星动日权益业务")
    doc.add_heading("5.1 权益首页与资格", level=2)
    add_numbered(doc, [
        "queryIndexReceive 获取 enjoycollectabletimes、freeEnjoy、enjoy、prodList，用于领取次数与已领产品。",
        "normalNewProdList?phase=N 获取分期/分类权益；前端先过滤 isHide，再按 levelable 匹配用户卡级。",
        "未登录和非全球通预览按 levelable 包含 1 的权益兜底，不等于真正具备领取资格。",
        "领取按钮还受已领取、可领取次数、stock、transferable、活动日/时间影响。源码定义 0:00–10:00 不可领取，10:00 后可领取。",
        "点击详情时并行查询 getQyxq.do 和 getQyxqBanner.do，并缓存于 sessionStorage。",
        "领取/转赠统一调用 initNormalNewQy；receivePhone 为空表示本人领取，非空表示转赠。",
    ])
    doc.add_heading("5.2 已抓到的 phase=4 权益", level=2)
    add_table(doc, ["ID", "权益", "卡级", "转赠", "库存值", "隐藏/归属"], [
        ("3943", "手机碎屏不限额保障", "1,2,3,4,8", "否", "13", "isHide=true, isOwn=true"),
        ("3908", "综合意外保障-家庭版", "1,2,3,4,8", "是", "1", "isHide=false, isOwn=true"),
        ("3913", "咪咕悦读白金会员月卡", "3,4,8", "是", "46", "isHide=null, isOwn=true"),
        ("3914", "咪咕悦读黄金会员月卡", "1,2", "是", "14", "isHide=null, isOwn=true"),
        ("3458", "WPS超级会员月卡", "1,2,3,4,8", "是", "100", "isOwn=false"),
        ("3832", "中石油满200减15加油券", "1,2,3,4,8", "是", "100", "isOwn=false"),
    ], [1.4, 5.1, 3.1, 1.5, 1.8, 4.0], 7.0)
    add_callout(doc, "库存语义反直觉", "源码以 Number(stock) >= 100 或 stock==\"100\" 判定“已抢光”，并非常见的 stock=0 无库存。不能按字段名猜测；必须保留这一服务端约定并向接口方确认。", "warn")
    doc.add_heading("5.3 源码保底权益清单", level=2)
    doc.add_paragraph("源码模板还包含以下权益，用于其他 phase 或保底展示；它们不是本次 HAR 的实时返回：")
    add_bullets(doc, [
        "热门推荐：手机碎屏不限额保障、综合意外保障-家庭版、星巴克20元会员礼包、咪咕视频通看券包、移动安全管家升级版月卡。",
        "视频影音/生活：哔哩哔哩月度大会员、腾讯视频VIP月卡/会员、爱奇艺黄金VIP月卡、美团单车30天30次卡。",
        "音乐与知识：咪咕音乐天籁VIP/月包、QQ音乐豪华绿钻、喜马拉雅、酷狗、移动云盘图文AI、咪咕悦读白金/黄金、WPS、中石油加油券。",
    ])
    doc.add_heading("5.4 领取/转赠请求", level=2)
    add_code(doc, """
POST /normal/initNormalNewQy
Content-Type: application/x-www-form-urlencoded; charset=UTF-8

productId=3913
receivePhone=                 # 空：本人领取；非空：转赠号码
channelCode=75442
isRandom=0                   # 字符串 "0"/"1"
sourece=1                    # 源码真实拼写，不能改成 source
""")
    add_bullets(doc, [
        "status=1：成功，页面提示 24 小时内下发，并刷新 queryIndexReceive。",
        "status=6 且 receivePhone 非空：被转赠号码已达到转赠次数上限。",
        "其他状态：优先显示服务端 msg；没有 msg 才显示通用错误。",
        "请求参数注释称 isRandom 为 Integer、channelCode 为 Integer，但实际源码常传字符串；后端复用应做显式类型兼容。",
    ])
    doc.add_heading("5.5 商品字段语义", level=2)
    add_table(doc, ["字段", "用途", "注意"], [
        ("id", "权益/产品 ID", "详情、领取、日志的主键"),
        ("qyName", "权益名称", "仅展示，不应作为主键"),
        ("levelable", "允许卡级的逗号字符串", "源码用字符串 includes，存在子串误判风险"),
        ("transferable", "是否允许转赠", "0/1；最终资格仍由服务端校验"),
        ("isRandom", "是否彩蛋/随机权益", "前端转换为字符串 0/1"),
        ("isOwn", "自有/合作方权益标记", "影响领取后的弹窗或跳转"),
        ("isHide", "运营隐藏", "true 必须过滤；null 按未隐藏处理"),
        ("stock", "前端库存状态值", "样本/源码以 >=100 视为无库存"),
        ("status", "单品状态", "样本为 0，完整枚举未抓到"),
        ("phase/rank", "分类与排序", "phase 是字符串；rank 控制次序"),
    ], [3.0, 5.0, 8.8], 7.6)
    doc.add_heading("5.6 生日礼与云手机日卡", level=2)
    add_bullets(doc, [
        "birthday/status?channelCode：返回 data.productId、data.status。仅 userLevel 3/4/8 且状态 1/2 展示；1=去领取，2=去查看。样本 status=2、productId=3958。",
        "cloudPhoneQyStatus.do：data 1 可领取、2 已领取、3 无法参与、4 无库存；天津用户源码直接隐藏该模块。",
        "getCloudPhoneQy.do：POST form channelCode；status=1 后提示 24 小时内下发。",
    ])

    add_section_title(doc, "6", "盲盒、签到/补签与协议")
    doc.add_heading("6.1 星动盲盒", level=2)
    add_table(doc, ["步骤", "接口/入参", "响应与用途"], [
        ("奖池", "GET luckBox/infoList?channelCode&type=1", "data[]: prizeCode、prizeImage；渲染奖池入口"),
        ("次数/任务", "GET luckBox/status?channelCode&type=1", "drawTotal/drawUsed/drawRemain；tasks[].number/flag/url/time"),
        ("抽奖", "POST JSON luckBox/draw {channelCode,type:1}", "data.prizeCode；9999 表示未中奖"),
        ("收下奖品", "POST JSON luckBox/receive {prizeCode,channelCode}", "1成功、2重复领取、3无库存、4非活动时间、-10未登录"),
        ("完成任务", "POST JSON luckBox/completeTask {number,type:1,channelCode}", "成功后刷新次数/任务"),
        ("活动规则", "POST form mspapi/activityRules.do type=1", "data 是 JSON 字符串，二次 JSON.parse，内部 code=200"),
        ("中奖短信", "POST JSON sendSms/signAndBlindSms {mark:\"2\",prizeId}", "盲盒实物奖通知"),
    ], [2.7, 7.4, 6.7], 7.25)
    add_callout(doc, "奖品 ID 9999", "盲盒和签到源码都把 prizeId/prizeCode=9999 当作“未中奖/假奖品”。业务统计不能把它当真实权益。", "warn")
    doc.add_heading("6.2 七日签到与补签", level=2)
    add_numbered(doc, [
        "GET /sign/info 得到 signDates[] 与 reSignNum。signStatus 在样本出现 -1、1、2；源码另定义 0 未签到、1 已签到、2 补签，说明前后端/页面归一化存在版本差异。",
        "POST JSON /sign/sign {sspid} 完成当天签到。注意这里字段为小写 sspid。",
        "需要补签时，前端把 dayNum、taskId、sspid 传给 /sign/finshResignTask。接口路径中的 finsh 为真实错拼，不能改成 finish。",
        "奖品接受/放弃使用 /sign/toaccept：sspId、dayNum、prizeId、mark；mark=true 收下，false 放弃。部分调用额外带 isVirtual。",
        "第 7 天收下虚拟奖品后，调用 signAndBlindSms，mark=1 发送签到中奖短信。",
    ])
    add_table(doc, ["sign/info 字段", "用途"], [
        ("signDates[].dayNum", "第几天，1–7"),
        ("signStatus", "签到/补签状态；必须以联调枚举为准"),
        ("newPrize.prizeId/prizeName/kind/prizeStatus", "奖品身份、类型和待领取/已领取状态"),
        ("task[].taskId/taskStatus", "补签任务及完成状态"),
        ("reSign", "该天是否属于补签场景"),
        ("reSignNum", "剩余补签次数"),
    ], [6.0, 10.8], 8)
    doc.add_heading("6.3 5G 消息协议验证码", level=2)
    add_table(doc, ["接口", "入参", "成功/错误"], [
        ("sendSmsVerificationCode", "无", "status=1；-42 分钟上限；-43 当天上限"),
        ("checkVerificationCode", "verificationCode=AES-ECB(验证码)", "status=1；-41 错误；-44 失效"),
        ("checkProtocolIsExpired", "无", "status=1，data 为是否过期；-10 未登录"),
    ], [6.0, 5.7, 5.1], 7.8)
    doc.add_heading("6.4 提示记录", level=2)
    doc.add_paragraph("/prompt/isCompleted 与 /prompt/saveRecord 均为 POST form，入参 type。前者响应 data.typeNN=\"0\"/\"1\"，后者写入已展示记录。源码使用 type 13、17、19、34、35、38、43、44 等不同标签，且 type=35 注释称缓存 50 天；复用时不得把标签当布尔值或跨活动共用。")

    add_section_title(doc, "7", "完整接口清单", "默认业务主机为 https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy；GSM 和遥测接口在表中写明独立主机。")
    endpoint_groups = [
        ("7.1 登录、会话与 SSO", [
            ("A01", "POST /checkLoginStatus.action", "无；同源 Cookie", "{status,msg}；判断站内登录", "H/R/S"),
            ("A02", "POST /phoneCheck.action", "无；轮询", "status 1/-1001；确认移动号码", "S"),
            ("A03", "POST /new/cmpSmsSend.action", "form: phone(SM2),sspId", "status/msg；发送验证码", "S"),
            ("A04", "POST /login.action", "form: AES(phone),AES(smsCode)；或 phone,preToken", "status/msg/data；建立 Cookie 会话", "S"),
            ("A05", "POST /loginW.action", "同短信登录，白名单分支", "同 login.action", "S"),
            ("A06", "POST /logout.action", "无", "status=1；退出并清本地状态", "S"),
            ("A07", "POST /acquire/tokenParam.action", "form: ydrzSign", "取号 SDK 参数", "S"),
            ("A08", "POST /acquire/validateTokenHttps", "token,userInformation,preLogin=1,sspId", "data.phone/preToken", "S"),
            ("A09", "POST /leadeonLogin.action", "token,sspId", "data 含 huoshanCode；App 登录", "S"),
            ("A10", "POST /getCmpSSOTokenNew.action", "JSON/form/空；可含 targetid", "data=大网 SSO token", "H/R/S"),
            ("A11", "POST /getCmpSSOToken.action", "targetid（旧接口引用）", "旧版 token；当前代码改用 New", "S"),
            ("A12", "POST /getCmpSSOParam.action", "channelCode,levelPass", "channelName/level/sign/token", "S"),
            ("A13", "POST /getQyChannel.action", "code", "data.short_name", "S"),
            ("A14", "GET /cmpSsoTo.action", "targetid,url", "302/页面跳转；普通 SSO", "S"),
            ("A15", "GET /cmpSsoToRh.action", "targetid,url", "带等级放行的 SSO 跳转", "S"),
        ]),
        ("7.2 全球通、成长值与楼层", [
            ("B01", "POST /member/func/queryVipLevel.do", "form: sspId,tag", "等级、电话掩码、省份、领取次数、已领产品、分析标识", "H/R/S"),
            ("B02", "GET /floorRule/contactInfo", "userLevel,version=V2", "等级化楼层配置", "H/R/S/T"),
            ("B03", "GET /customer/growthValue", "无", "hdczz/tsdj 营销内容", "H/R/S"),
            ("B04", "POST GSM /outside/gsm/login", "AES-CBC({token})", "sessionId/expires/user", "H/R/S"),
            ("B05", "POST GSM /.../getGsmState", "AES-CBC({}) + X-GSM-TOKEN", "gsmState/入网时间/网龄", "H/R/S"),
            ("B06", "POST GSM /.../queryGsmInfo", "AES-CBC({gsmState,appFlag})", "消费、差额、目标等级、账单、刻度", "H/R/S"),
            ("B07", "GET /iop/hit", "rappId", "data Boolean；客群/策略命中", "H/R/S"),
            ("B08", "GET /customer/sdlj", "province", "data.sdlj[].elementMap.vLinkUrl；升档链接", "S"),
            ("B09", "GET /clientManager/checkTarget", "无", "客户经理/服务信息", "H/R"),
            ("B10", "GET /customer/queryRemainNum", "无", "商旅权益次数/可领状态", "H/R/S"),
            ("B11", "POST /cartoon/queryInternationalRoaming.action", "空 form", "国际漫游领取/订购关系", "H/R/S"),
            ("B12", "POST /paidpurchase/familyCircle.action", "form: sspId", "家庭圈 num/familyList", "H/R/S"),
            ("B13", "GET /member/yyh/getUserActivityData", "type=1/2/5/6 等", "优越会剩余次数、活动与券码", "S"),
            ("B14", "POST /member/yyh/orderGsmRights", "JSON: actId,goodscode,skuId", "优越会领取结果", "S"),
        ]),
        ("7.3 星动日权益", [
            ("C01", "GET /birthday/status", "channelCode", "productId/status；生日礼按钮", "H/R/S"),
            ("C02", "GET /member/func/queryIndexReceive.do", "无", "领取次数、已领产品", "H/R/S"),
            ("C03", "GET /member/func/cloudPhoneQyStatus.do", "无", "data 1/2/3/4；云手机日卡状态", "S"),
            ("C04", "POST /member/func/getCloudPhoneQy.do", "form: channelCode", "云手机日卡领取结果", "S"),
            ("C05", "GET /normal/normalNewProdList", "phase", "phase/prodList[]", "H/R/S/T"),
            ("C06", "POST /normal/initNormalNewQy", "form: productId,receivePhone,channelCode,isRandom,sourece", "本人领取/转赠结果", "S"),
            ("C07", "POST /normal/getNewRandomQy", "无", "随机/彩蛋权益结果", "S"),
            ("C08", "POST /qyxq/getQyxq.do", "form: id,xqtype=free", "权益详情", "S"),
            ("C09", "POST /qyxq/getQyxqBanner.do", "form: id", "详情 banner", "S"),
        ]),
        ("7.4 盲盒", [
            ("D01", "GET /luckBox/infoList", "channelCode,type=1", "奖品 code/image", "H/R/S"),
            ("D02", "GET /luckBox/status", "channelCode,type=1", "次数与任务", "H/R/S"),
            ("D03", "POST /luckBox/draw", "JSON: channelCode,type=1", "data.prizeCode", "S"),
            ("D04", "POST /luckBox/receive", "JSON: prizeCode,channelCode", "奖品领取状态", "S"),
            ("D05", "POST /luckBox/completeTask", "JSON: number,type=1,channelCode", "任务完成结果", "S"),
            ("D06", "POST /mspapi/activityRules.do", "form: type=1", "data JSON 字符串；活动规则", "S"),
            ("D07", "GET /prize/cloudPhoneSsoUrl.do", "无", "data=云手机 SSO URL", "S"),
        ]),
        ("7.5 签到、协议、评价与提示", [
            ("E01", "GET /sign/info", "无", "signDates/reSignNum", "H/R/S"),
            ("E02", "POST /sign/sign", "JSON: sspid", "签到结果", "S"),
            ("E03", "POST /sign/toaccept", "JSON: sspId,dayNum,prizeId,mark[,isVirtual]", "收下/放弃奖品", "S"),
            ("E04", "POST /sign/finshResignTask", "JSON: dayNum,taskId,sspid", "完成补签任务", "S"),
            ("E05", "POST /sendSms/signAndBlindSms", "JSON: mark(1/2),prizeId", "签到/盲盒中奖短信", "S"),
            ("E06", "POST /msg5GSubPlatform/sendSmsVerificationCode", "无", "协议验证码发送", "S"),
            ("E07", "POST /msg5GSubPlatform/checkVerificationCode", "form: AES(verificationCode)", "协议验证码校验", "S"),
            ("E08", "POST /msg5GSubPlatform/checkProtocolIsExpired", "无", "data=是否过期", "S"),
            ("E09", "POST /prompt/isCompleted", "form: type", "data.typeNN", "H/R/S"),
            ("E10", "POST /prompt/saveRecord", "form: type", "保存弹窗记录", "R/S"),
            ("E11", "GET /floorEvaluate/queryYear", "无", "data Boolean；星动日年度评价状态", "S"),
            ("E12", "GET /floorEvaluate/queryQuarter", "无", "data Boolean；专区季度评价状态", "S"),
            ("E13", "POST /floorEvaluate/insert", "JSON: star,subOption,custom,activityName[,expandField1]", "评价提交", "S"),
        ]),
        ("7.6 日志、分享与静态页面", [
            ("F01", "GET /saveChannelLog.do", "cookie 查询参数", "渠道访问日志", "H/S"),
            ("F02", "GET /addOperationsClickLog1.do", "button,cookie,dynamicButton", "点击日志", "H/S"),
            ("F03", "POST /countShare1.do?随机数", "无", "分享计数回调", "S"),
            ("F04", "GET /res/wap/components/xdrProtocol/index.html", "无", "协议组件静态入口，不是 JSON API", "H"),
            ("F05", "GET /res/wap/components/xdrsignNew/index.html", "无", "签到组件静态入口，不是 JSON API", "H"),
            ("F06", "POST https://dc.cmicapm.com:7080/list", "JSON: events/user/header/local_time", "第三方遥测；响应 Type/e/message/sc/server_time/tc", "H/R/M"),
        ]),
    ]
    for title, rows in endpoint_groups:
        doc.add_heading(title, level=2)
        add_table(doc, ["ID", "方法与路径", "入参/介质", "响应/用途", "证据"], rows, [1.2, 5.8, 4.5, 5.0, 1.3], 6.85)
    add_callout(doc, "接口总数口径", "上表列出 64 个可辨识端点/静态入口，包含抓包端点、源码端点、旧版引用和第三方遥测。HAR 自身只有 25 个唯一方法+端点组合；不能把 64 个都表述为已抓包成功。", "info")

    add_section_title(doc, "8", "加密、解密与签名")
    doc.add_heading("8.1 GSM 网关 AES-CBC", level=2)
    add_table(doc, ["方向", "算法", "Key", "IV", "编码"], [
        ("请求加密", "AES-128-CBC + PKCS#7", "foorettD7vcBawt3", "9791027341711819", "UTF-8 JSON → AES → Base64"),
        ("响应解密", "AES-128-CBC + PKCS#7", "UVic06tpXgMNiApm", "9791027341711819", "Base64 → AES → UTF-8 JSON"),
    ], [2.0, 4.0, 4.5, 4.5, 3.0], 7.5)
    add_bullets(doc, [
        "静态请求头：Lrsbhbg8: YnBBRmFrMkxFOGR3OFJpOXNhRnlvQT09。该值再做一次 Base64 解码得到 bpAFak2LE8dw8Ri9saFyoA==；源码不继续把后者当密钥使用。",
        "请求 Content-Type 标为 application/json，但线上的 body 是一个 Base64 密文字符串，不是 {encryptData:...} JSON 对象。",
        "响应外层格式：{rtnCode:\"0\",rtnMsg:\"成功\",encryptData:\"<Base64>\"}。只有 rtnCode=0 才解密。",
        "login 不带 X-GSM-TOKEN；其他 GSM 调用必须带 login 内层 data.sessionId。",
        "inside 模式源码另支持 /inside/gsm/*：登录入参不是 token，而是由 JSESSIONID、UID、Comment、ticketID、currentTime、MD5 sign 组成；本次 HAR 仅实证 outside。",
    ])
    add_code(doc, """
// CryptoJS 等价实现（网关）
const iv = CryptoJS.enc.Utf8.parse('9791027341711819');
const reqKey = CryptoJS.enc.Utf8.parse('foorettD7vcBawt3');
const respKey = CryptoJS.enc.Utf8.parse('UVic06tpXgMNiApm');

function encryptGateway(obj) {
  return CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(JSON.stringify(obj)), reqKey,
    { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  ).toString();
}

function decryptGateway(encryptData) {
  const bytes = CryptoJS.AES.decrypt(encryptData, respKey,
    { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return JSON.parse(CryptoJS.enc.Utf8.stringify(bytes));
}
""")
    doc.add_heading("8.2 短信登录 AES-ECB", level=2)
    add_table(doc, ["项目", "值"], [
        ("算法", "AES-128-ECB + PKCS#7 + Base64"),
        ("Key", "WX812FB36C5901D3"),
        ("IV", "ECB 无 IV"),
        ("应用字段", "login.phone、login.smsCode、checkVerificationCode.verificationCode；lottery 中也定义 encryptproductQyId"),
    ], [4.2, 12.6], 8)
    add_callout(doc, "边界", "familyMemNum、insertionMobile、huoshanCode、GSM login.user.gioPhoneNumber 等虽然看起来像密文/标识，但用 WX812FB36C5901D3 无法验证解密。不得把“格式像 Base64”写成“同一密钥加密”。", "danger")
    doc.add_heading("8.3 短信发送 SM2", level=2)
    add_table(doc, ["项目", "值"], [
        ("公钥", "04a1ae3a2f576a99b9999d22a707fa2f93c5921ac285094a0a0549a0ceb519ffc30026b8a58b0e945b40cd699c92926632997722f3cc3efc5f3cb1b96e399cdd9d"),
        ("明文", "phone + ':' + Date.now()"),
        ("预处理", "UTF-8 → Base64 字符串 → 再按 UTF-8 转字节"),
        ("模式", "sm2Encrypt(...,0)；源码模式 0 对应 C1C2C3"),
        ("输出", "hex；函数在结果前补 04"),
    ], [3.2, 13.6], 7.3)
    doc.add_heading("8.4 富文本 AES-ECB", level=2)
    add_table(doc, ["项目", "值"], [
        ("算法", "AES-128-ECB + PKCS#7"),
        ("Key", "contactmanager1q（源码以 ASCII 数组隐藏）"),
        ("触发", "vRichTextIsEncryption 标记为加密时解密富文本内容"),
        ("风险", "同一静态密钥在前端可提取；只提供混淆，不提供可信保密性"),
    ], [4.0, 12.8], 8)
    doc.add_heading("8.5 安全评价", level=2)
    add_bullets(doc, [
        "固定 IV + 固定对称密钥会泄露相同明文块模式，不具备现代消息认证能力；CBC/ECB 均没有内建完整性校验。",
        "前端内嵌密钥、公钥和静态请求头都可被提取，不能作为客户端身份凭证。生产复用应由可信后端代理完成，至少叠加 TLS、会话隔离、频控、日志脱敏和密钥轮换。",
        "不要在 URL 查询参数放 Cookie、token 或用户标识。当前 saveChannelLog、埋点 params 和部分 SSO 跳转会造成浏览器历史、Referer、代理日志泄露。",
        "不要记录解密后的手机号、sessionId、YDRZToken 或完整响应。调试日志应按字段白名单输出。",
    ])

    add_section_title(doc, "9", "接口使用示例")
    doc.add_heading("9.1 站内业务接口", level=2)
    add_code(doc, """
// 浏览器同源调用；必须已有 qqt.cmicrwx.cn Cookie 会话
const body = new URLSearchParams({ sspId: '75442', tag: 'qqtindex' });
const level = await fetch('/2016tyjf/xhmqqthy/member/func/queryVipLevel.do', {
  method: 'POST', credentials: 'include', body
}).then(r => r.json());
if (String(level.status) !== '1') throw new Error(level.msg || '等级查询失败');

const list = await fetch(
  '/2016tyjf/xhmqqthy/normal/normalNewProdList?phase=4',
  { credentials: 'include', cache: 'no-store' }
).then(r => r.json());
""")
    doc.add_heading("9.2 GSM 网关调用骨架", level=2)
    add_code(doc, """
const gatewayHeaders = {
  'Content-Type': 'application/json',
  'Lrsbhbg8': 'YnBBRmFrMkxFOGR3OFJpOXNhRnlvQT09'
};

async function gsmPost(path, plain, sessionId) {
  const headers = { ...gatewayHeaders };
  if (sessionId) headers['X-GSM-TOKEN'] = sessionId;
  const outer = await fetch('https://10086.online-cmcc.cn:20010' + path, {
    method: 'POST', headers, body: encryptGateway(plain)
  }).then(r => r.json());
  if (String(outer.rtnCode) !== '0') throw new Error(outer.rtnMsg || '网关失败');
  return decryptGateway(outer.encryptData);
}

const login = await gsmPost('/cmcc-gateway/outside/gsm/login', { token: ydrzToken });
const sid = login.data.sessionId;
const state = await gsmPost('/cmcc-gateway/outside/gsm/iservice/direct/serviceUnified/getGsmState', {}, sid);
const detail = await gsmPost('/cmcc-gateway/outside/gsm/iservice/direct/gsmInfo/queryGsmInfo',
  { gsmState: state.rspBody.gsmState, appFlag: '0' }, sid);
""")
    doc.add_heading("9.3 领取示例", level=2)
    add_code(doc, """
const claim = new URLSearchParams({
  productId: '3913', receivePhone: '', channelCode: '75442',
  isRandom: '0', sourece: '1'
});
const result = await fetch('/2016tyjf/xhmqqthy/normal/initNormalNewQy', {
  method: 'POST', credentials: 'include', body: claim
}).then(r => r.json());

switch (String(result.status)) {
  case '1': /* 成功，刷新领取次数 */ break;
  case '6': /* 受赠号码达到上限 */ break;
  case '-10': /* 会话失效，重新登录 */ break;
  default: throw new Error(result.msg || '领取失败');
}
""")
    add_callout(doc, "跨域要求", "GSM 网关与专区主机不同。纯浏览器复用还受 CORS、Referer/Origin、证书链和网关风控影响；最稳妥的生产实现是服务端 BFF/代理持有网关会话，并向前端只返回最小化业务字段。", "warn")

    add_section_title(doc, "10", "复用避坑与已知缺陷")
    pitfalls = [
        ("Cookie 与 token 混淆", "专区 Cookie、YDRZToken、GSM sessionId、第三方 SSO token 是四种不同凭据；建立显式类型，禁止用 String 到处传。"),
        ("会话过期", "GSM expires 样本为 1800 秒。401/网关错误或到期前应重新获取 YDRZToken→login；不要无限重放旧 sessionId。"),
        ("localStorage 冲突", "两个组件都使用固定键 sessionId。同域并行实例、多个号码或标签页会相互覆盖。应改为内存态或带用户/实例命名空间。"),
        ("Content-Type 不一致", "站内多数 POST 是 form；盲盒/签到/评价是 JSON；GSM 标称 JSON 但 body 是 Base64 字符串。统一封装时必须按端点配置。"),
        ("字段拼写", "sourece、finshResignTask、proviceCode、sspid/sspId 都是现网/源码真实拼写；不要自行纠正。"),
        ("字符串数字", "status、phase、金额、卡级常以字符串返回，也有数字比较。统一 String(status) 做枚举，金额用 Decimal。"),
        ("非严格 JSON", "contactInfo 控制字符会使严格解析失败；先修服务端，兼容清洗必须局限在字符串内部。"),
        ("库存哨兵", "源码把 stock>=100 当无库存。不要以 0/正数的常识解释；做契约测试。"),
        ("isHide 三态", "true 隐藏，false/null/缺失按源码显示；若用 SQL Boolean 必须保留 NULL 语义。"),
        ("levelable 子串", "源码用 includes('1')，未来出现 11 时可能误命中。应 split(',') 后精确比较，但改动前与服务端确认。"),
        ("活动时间", "页面既有星动日日期计算又有 10:00 后领取限制，服务端还会返回非活动期；客户端时钟不能替代服务端校验。"),
        ("缓存陈旧", "getQyxq、banner、规则和楼层会写 sessionStorage；领取后必须失效相关列表/详情缓存，避免按钮与库存陈旧。"),
        ("并发点击", "源码用全局布尔锁，但异常路径存在变量名错误/未释放风险。后端必须幂等，前端用 finally 解锁。"),
        ("用户隐私", "遥测样本把完整 URL（含 token）放进事件 params。上线前剥离 query/token，并限制 user_unique_id。"),
        ("未知密文", "familyMemNum 等没有已验证密钥。只透传或用 showFamilyMemNum 展示，禁止试图猜密钥解密。"),
    ]
    add_table(doc, ["风险", "复用要求"], pitfalls, [4.3, 12.5], 7.6)
    doc.add_heading("10.1 已发现源代码缺陷", level=2)
    add_table(doc, ["位置/模式", "问题", "影响与修复"], [
        ("growUpLv.html:1414", "isGetPluginProvince.includes(province) == -1", "includes 返回 Boolean，永远不等于 -1；条件恒 false。改为 !includes(province) 或 indexOf(...)==-1。"),
        ("xdrNormal.js:3547；lottery/index.js:2119", "qxproductId != A || qxproductId != B || ...", "只要 ID 不可能同时等于全部值，条件恒 true。应改成 &&，或 ![A,B,...].includes(id)。"),
        ("xdrNormal.js:3670", "catch((error)=>{ console.error(err) })", "err 未定义，异常处理本身可能再抛错。改为 console.error(error)，并在 finally 解锁。"),
        ("getSSOToken 多版本", "同名 self.ssoTo/getSSOToken 在文件内重复定义", "后定义覆盖前定义，调用行为依赖加载顺序。抽成单一模块并写契约测试。"),
        ("同步 Ajax", "多处 async:false", "阻塞 UI，移动端易卡顿；改 async/await 并提供加载/取消。"),
        ("敏感日志", "console 输出 token、接口完整对象、用户标识", "生产构建删除或字段级脱敏。"),
        ("sessionStorage.clear", "退出时清空整个域存储", "可能破坏其他模块；只删除本模块键。"),
        ("状态枚举漂移", "signStatus 注释/前端常量/样本值不完全一致", "建立服务端 OpenAPI/枚举契约，兼容未知值并监控。"),
    ], [4.8, 5.0, 7.0], 7.3)
    doc.add_heading("10.2 建议的复用边界", level=2)
    add_bullets(doc, [
        "把认证、GSM 网关、权益业务拆为三个客户端；各自拥有独立 baseURL、凭据和序列化器。",
        "统一返回 Result<T>：同时保留 HTTP 状态、外层 rtnCode/status、内层 retCode/status、message 和原始 requestId。",
        "数据模型对不稳定字段使用 nullable/unknown，不要一开始就强制所有字段非空。",
        "为每个可写接口生成 idempotency key 或在业务端以用户+活动+产品做幂等；客户端防抖不是一致性保证。",
        "固定密钥先迁移到后端秘密管理；若无法改上游，至少不再复制到新前端、移动 App 或公开仓库。",
    ])

    add_section_title(doc, "11", "验收与测试清单")
    doc.add_heading("11.1 协议级测试", level=2)
    add_bullets(doc, [
        "用固定明文向量验证 AES-CBC 请求密文和响应解密；分别验证错误 key、错误 IV、损坏 padding、非 Base64。",
        "验证 GSM login 无 X-GSM-TOKEN，其他调用缺 token 会失败；验证 expires 前后刷新。",
        "验证 form 与 JSON 端点的 Content-Type，尤其 initNormalNewQy、luckBox/*、sign/*、floorEvaluate/insert。",
        "验证 status 为字符串和数字两种形式；验证 retCode=000000 与 rtnCode=0 的层级差异。",
        "验证 contactInfo 含控制字符、空数组、null、未知楼层键时仍可降级。",
    ])
    doc.add_heading("11.2 业务矩阵", level=2)
    add_table(doc, ["维度", "至少覆盖"], [
        ("身份", "未登录、非移动、非全球通、普卡、银卡、金卡、白金、钻石、卓越钻、体验卡"),
        ("权益", "可领、已领、次数用尽、隐藏、不可转赠、转赠上限、无库存、非活动时段、随机权益"),
        ("会话", "Cookie 有效/失效、YDRZToken 空/过期、GSM sessionId 过期、多标签页并发"),
        ("签到", "未签到、已签到、补签、任务未完成/完成、未中奖 9999、虚拟/实物奖、收下/放弃"),
        ("验证码", "发送成功、分钟/日上限、错误、失效、非移动号、频繁点击"),
        ("地域", "北京/天津/上海及其他省份；省份专属跳转与模块隐藏"),
        ("数据", "null、空串、负差额、stock=0/99/100/101、isHide=null、levelable 含 11"),
    ], [4.0, 12.8], 7.8)
    doc.add_heading("11.3 上线前核对", level=2)
    add_bullets(doc, [
        "向上游确认所有 status/signStatus/stock 枚举和活动日策略，并形成版本化接口契约。",
        "清理 HAR 与日志中的真实 token、Cookie、手机号和 user_unique_id；轮换已暴露且可轮换的凭据。",
        "用真实测试账号分别验证本人领取、转赠、重复请求和并发请求的幂等。",
        "确认 CORS、Origin/Referer、防盗链、TLS 证书、代理超时和 WAF 频控。",
        "监控按端点区分传输错误、外层网关错误、内层业务错误和解析错误。",
        "领取后主动刷新 queryIndexReceive、normalNewProdList、luckBox/status、sign/info，不依赖旧缓存。",
    ])

    add_section_title(doc, "12", "响应结构速查")
    response_rows = [
        ("通用站内", "{status:String|Number,msg:String,data:Any[,extend]}", "成功通常 1；但 queryRemainNum 成功 0000"),
        ("queryVipLevel", "data.userLevel/levelName/phone/province/prodList/enjoy/freeEnjoy/enjoycollectabletimes/chacode/useActType/useTag/newFlag/isluckdraw/netAge/huoshanCode/insertionMobile/tqgx_tips", "phone/标识敏感；prodList 为已领产品 ID"),
        ("normalNewProdList", "data.phase, data.prodList[].id/transferable/levelable/stock/status/qyName/isRandom/isOwn/isHide/phase/rank", "字段三态和字符串数字需兼容"),
        ("luckBox/status", "data.drawTotal/drawUsed/drawRemain/tasks[].number/flag/url/time", "剩余次数小于等于 0 均显示无机会"),
        ("sign/info", "data.signDates[].dayNum/signStatus/newPrize/task/reSign, data.reSignNum", "newPrize 可 null/对象/数组，源码统一归一为数组"),
        ("GSM 外层", "{rtnCode,rtnMsg,encryptData}", "rtnCode=0 后 AES 解密"),
        ("GSM getGsmState", "{retCode,retDesc,rspBody:{userChinaMobileage,userBegin,gsmState}}", "retCode=000000"),
        ("GSM queryGsmInfo", "{retCode,retDesc,rspBody:{gsmNext,transactionDetails,consumptionRequired/Total/Re,growthValueSwitch,gsmList,gsmState,year,month,proviceCode,isShieldingPeriod}}", "金额与阈值为字符串"),
        ("遥测响应", "{Type,e,message,sc,server_time,tc}", "不参与业务成功判断"),
    ]
    add_table(doc, ["接口族", "结构", "备注"], response_rows, [3.4, 9.8, 3.6], 7.2)

    doc.add_heading("12.1 样本业务值摘要", level=2)
    add_bullets(doc, [
        "queryVipLevel 样本：全球通钻石卡 userLevel=4；已领 prodList=[3913]；剩余可领取次数为 0。手机号、分析标识已脱敏。",
        "GSM 样本：gsmState=4；consumptionTotal=4163、consumptionRequired=3720、consumptionRe=-443。",
        "盲盒样本：drawTotal=2、drawUsed=2、drawRemain=0；任务 1/2 均完成。",
        "签到样本：第 1 天奖品 9999（未中奖），第 4 天处于补签状态并含 3 个任务，reSignNum=3。",
        "生日礼样本：productId=3958、status=2（页面显示“去查看”）。",
        "商旅样本：airportCount=5、trainCount=3、mealCount=0、travelFlag=false、hotelFlag=false。",
    ])

    add_section_title(doc, "附录 A", "证据定位与源码文件")
    add_table(doc, ["主题", "主要证据文件"], [
        ("认证/短信", "res/wap/scripts/common/loginxdr.js、loginxdrNew.js、sm2.js、cmpassport/autoAcquirecommon.js、common/leadeonNew.js"),
        ("站内公共接口/SSO", "res/wap/scripts/common/utils_index.js"),
        ("全球通专区", "res/wap/index3/js/newzq.js、rights.js、yyh.js、lvJson/*.js"),
        ("成长/消费值", "res/wap/growUpLv.html、app.online-cmcc.cn/.../qqtInfoLibrary.1.1.2.js、qqtTopCardNewLibrary.1.1.2.js"),
        ("星动日权益", "res/wap/scripts/js/xdrNormal.42a18b91.js"),
        ("盲盒", "res/wap/components/lottery/index.js"),
        ("签到/补签", "res/wap/components/xdrsignNew/index.d434d569.js"),
        ("协议验证码", "res/wap/components/xdrProtocol/index.js"),
        ("真实请求", "星动日.har、全球通信息查询和成长值查询.har"),
        ("保存响应", "解包目录中 qqt.cmicrwx.cn/.../*.action|*.do|*.html 与 10086.online-cmcc.cn20010/.../*.html"),
    ], [4.0, 12.8], 7.5)
    doc.add_heading("附录 A.1 关键源码行定位", level=2)
    add_table(doc, ["事实", "文件:行（样本版本）"], [
        ("GSM 三组 AES 参数与富文本密钥", "qqtInfoLibrary.1.1.2.js:12667–12690"),
        ("GSM 静态头、X-GSM-TOKEN、加密拦截器", "qqtInfoLibrary.1.1.2.js:15099–15164"),
        ("GSM 调用顺序与字段消费", "qqtInfoLibrary.1.1.2.js:15381–15438"),
        ("短信登录 AES", "loginxdrNew.js:677–684"),
        ("SM2 Base64 预处理/公钥", "sm2.js:4056–4089"),
        ("权益领取真实字段 sourece", "xdrNormal.42a18b91.js:2116–2139、3660–3785"),
        ("库存哨兵与按钮状态", "xdrNormal.42a18b91.js:4215–4279"),
        ("盲盒领取状态", "lottery/index.js:2328–2537"),
        ("签到接受/放弃与短信", "xdrsignNew/index.d434d569.js:2410–2520、2932–3000"),
        ("签到/补签请求", "xdrsignNew/index.d434d569.js:3199–3231"),
        ("协议错误码", "xdrProtocol/index.js:144–256"),
    ], [7.5, 9.3], 7.4)

    add_section_title(doc, "附录 B", "结论与实施优先级")
    add_table(doc, ["优先级", "工作", "原因"], [
        ("P0", "凭据脱敏、禁止 URL/token 日志、轮换可轮换固定凭据", "样本含真实会话信息，遥测会采集完整 URL"),
        ("P0", "建立三套独立客户端与凭据类型", "Cookie/YDRZToken/GSM sessionId/SSO token 不可互换"),
        ("P0", "修复恒假 includes 判断与恒真 OR 判断", "直接影响省份模块与详情缓存逻辑"),
        ("P1", "固化接口契约与错误码/字段枚举", "当前字符串/数字、null、错拼和状态漂移较多"),
        ("P1", "把 GSM 加密代理移到可信后端", "前端静态密钥无法提供真正保密与身份认证"),
        ("P1", "改造 localStorage.sessionId 与全量 sessionStorage.clear", "避免多实例/同域模块互相污染"),
        ("P2", "移除同步 Ajax、统一缓存失效与 finally 解锁", "提升稳定性和移动端体验"),
    ], [1.5, 7.8, 7.5], 7.8, keep_together=True)
    add_callout(doc, "最终结论", "所给源码和 HAR 足以完整复现已抓取的全球通/成长值查询链路，并能实现星动日主要查询与领取流程；但源代码可见而未抓包的写接口仍需用测试账号联调其完整错误码、幂等、日期和省份规则。复用时应优先修正会话隔离、密钥托管、字段错拼兼容和缓存/库存语义。", "info")

    # Set document metadata and ensure every paragraph has the intended CJK font.
    doc.core_properties.title = "全球通信息查询、成长值查询、星动日权益接口与加解密完整解析"
    doc.core_properties.subject = "源代码、HAR 请求、业务流程、接口字段、加解密与复用避坑"
    doc.core_properties.author = "Codex"
    doc.core_properties.keywords = "中国移动,全球通,成长值,星动日,权益,AES,SM2,HAR"

    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUT)
    print(OUT)


if __name__ == "__main__":
    build()
