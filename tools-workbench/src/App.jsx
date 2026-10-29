import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Braces,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileUp,
  KeyRound,
  Link2,
  LockKeyhole,
  Menu,
  QrCode,
  Radio,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";
import {
  CMCC_PREFIX,
  CMCC_SUFFIX,
  buildLink,
  decryptAes,
  defaultRecordName,
  downloadText,
  encryptAes,
  formatJson,
  qxRegexFromUrl,
  safeFilename,
  unescapeAndFormatJson,
} from "./utils";

const tools = [
  { id: "link", label: "链接拼接", short: "链接", icon: Link2, group: "生成" },
  { id: "scan", label: "扫码识别", short: "扫码", icon: ScanLine, group: "二维码" },
  { id: "qr", label: "二维码生成", short: "生成", icon: QrCode, group: "二维码" },
  { id: "aes", label: "AES 加解密", short: "AES", icon: LockKeyhole, group: "安全" },
  { id: "qx", label: "QX 正则", short: "QX", icon: Radio, group: "文本" },
  { id: "url", label: "URL 编解码", short: "URL", icon: ExternalLink, group: "文本" },
  { id: "json", label: "JSON 格式化", short: "JSON", icon: Braces, group: "文本" },
];

const FORMAT_LABELS = {
  QR_CODE: "二维码",
  MICRO_QR_CODE: "Micro QR",
  CODE_128: "Code 128",
  CODE_39: "Code 39",
  CODE_93: "Code 93",
  EAN_13: "EAN-13",
  EAN_8: "EAN-8",
  UPC_A: "UPC-A",
  UPC_E: "UPC-E",
  ITF: "ITF",
  CODABAR: "Codabar",
  RSS_14: "GS1 DataBar",
  RSS_EXPANDED: "GS1 Expanded",
  DATA_MATRIX: "Data Matrix",
  AZTEC: "Aztec",
  PDF_417: "PDF417",
  MAXICODE: "MaxiCode",
};

function formatScanResult(result, BarcodeFormat) {
  const format = BarcodeFormat[result.getBarcodeFormat()] || "UNKNOWN";
  return {
    text: result.getText(),
    format,
    formatLabel: FORMAT_LABELS[format] || "未知码制",
  };
}

function ActionButton({ children, icon: Icon, kind = "secondary", ...props }) {
  return (
    <button className={`button ${kind}`} type="button" {...props}>
      {Icon && <Icon size={17} strokeWidth={2} aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}

function IconButton({ label, icon: Icon, ...props }) {
  return (
    <button className="icon-button" type="button" aria-label={label} title={label} {...props}>
      <Icon size={18} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

function ResultBox({ value, placeholder = "结果将在这里显示", onCopy, mono = true }) {
  return (
    <div className="result-box">
      <textarea className={mono ? "mono" : ""} value={value} readOnly placeholder={placeholder} />
      {value && <IconButton label="复制结果" icon={Copy} onClick={onCopy} />}
    </div>
  );
}

function Segmented({ value, onChange, options, label }) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Switch({ checked, onChange, label }) {
  return (
    <label className="switch-row">
      <button
        className="switch"
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
      <span>{label}</span>
    </label>
  );
}

function LinkBuilder({ notify, openQr }) {
  const [prefix, setPrefix] = useState(CMCC_PREFIX);
  const [suffix, setSuffix] = useState(CMCC_SUFFIX);
  const [encode, setEncode] = useState(false);
  const result = useMemo(() => buildLink({ prefix, suffix, encode }), [prefix, suffix, encode]);

  const useExample = () => {
    setPrefix(CMCC_PREFIX);
    setSuffix(CMCC_SUFFIX);
    setEncode(false);
    notify("已填入中国移动跳转示例");
  };

  return (
    <ToolLayout
      title="链接拼接"
      subtitle="组合统一前缀与目标内容"
      status="实时生成"
      icon={Link2}
      aside={
        <PreviewPanel title="链接预览">
          <div className="link-preview mono">{result || "等待输入"}</div>
          <div className="stack-actions">
            <ActionButton icon={Copy} kind="primary" onClick={() => copyText(result, notify)}>复制链接</ActionButton>
            <ActionButton icon={QrCode} onClick={() => openQr(result)} disabled={!result}>转为二维码</ActionButton>
          </div>
        </PreviewPanel>
      }
    >
      <div className="section-heading">
        <h3>链接组成</h3>
        <button type="button" className="text-button" onClick={useExample}>使用示例</button>
      </div>
      <Field label="统一前缀">
        <textarea className="compact mono" value={prefix} onChange={(event) => setPrefix(event.target.value)} />
      </Field>
      <div className="join-indicator"><span>+</span></div>
      <Field label="Query 参数或链接后缀">
        <textarea className="compact mono" value={suffix} onChange={(event) => setSuffix(event.target.value)} />
      </Field>
      <div className="option-row">
        <Switch checked={encode} onChange={setEncode} label="对后缀执行 URL Encode" />
        <span className="value-state">{encode ? "已编码" : "保留原文"}</span>
      </div>
    </ToolLayout>
  );
}

function Scanner({ notify }) {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const readerRef = useRef(null);
  const lastScanRef = useRef({ text: "", format: "", time: 0 });
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [name, setName] = useState(() => defaultRecordName());
  const [records, setRecords] = useState([]);
  const [dedupe, setDedupe] = useState(true);

  const appendRecord = useCallback(({ text, format, formatLabel }, source = "camera") => {
    const clean = text.trim();
    if (!clean) return;
    setRecords((current) => {
      if (dedupe && current.some((item) => item.text === clean && item.format === format)) return current;
      return [...current, {
        id: crypto.randomUUID(),
        text: clean,
        format,
        formatLabel,
        source,
        time: new Date().toISOString(),
      }];
    });
  }, [dedupe]);

  const stopScan = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setScanning(false);
  }, []);

  const startScan = async () => {
    stopScan();
    try {
      const { BarcodeFormat, BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;
      setScanning(true);
      const controls = await reader.decodeFromConstraints(
        { audio: false, video: { facingMode: { ideal: "environment" } } },
        videoRef.current,
        (result) => {
          if (!result) return;
          const decoded = formatScanResult(result, BarcodeFormat);
          const now = Date.now();
          if (
            decoded.text === lastScanRef.current.text
            && decoded.format === lastScanRef.current.format
            && now - lastScanRef.current.time < 1800
          ) return;
          lastScanRef.current = { text: decoded.text, format: decoded.format, time: now };
          appendRecord(decoded, "camera");
          navigator.vibrate?.(40);
        },
      );
      controlsRef.current = controls;
    } catch (error) {
      setScanning(false);
      notify(error?.name === "NotAllowedError" ? "未获得相机权限" : "无法启动相机，请使用 HTTPS 或上传图片", "error");
    }
  };

  useEffect(() => stopScan, [stopScan]);

  const decodeImages = async (event) => {
    const files = [...event.target.files];
    if (!files.length) return;
    setProcessing(true);
    const { BarcodeFormat, BrowserMultiFormatReader } = await import("@zxing/browser");
    const reader = readerRef.current || new BrowserMultiFormatReader();
    readerRef.current = reader;
    let found = 0;
    for (const file of files) {
      const url = URL.createObjectURL(file);
      try {
        const result = await reader.decodeFromImageUrl(url);
        appendRecord(formatScanResult(result, BarcodeFormat), file.name);
        found += 1;
      } catch {
        // Keep processing the remaining images.
      } finally {
        URL.revokeObjectURL(url);
      }
    }
    setProcessing(false);
    event.target.value = "";
    notify(found ? `已识别 ${found} 张图片` : "未在图片中识别到二维码或条码", found ? "success" : "error");
  };

  const copyAllRecords = () => {
    copyText(
      records.map((record) => record.text).join("\n"),
      notify,
      `已复制 ${records.length} 条内容，按换行分隔`,
    );
  };

  const exportRecords = () => {
    const csvCell = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const rows = records.map((item, index) => [
      index + 1,
      item.time,
      item.formatLabel,
      item.source === "camera" ? "相机" : item.source,
      item.text,
    ].map(csvCell).join(","));
    downloadText(
      `${safeFilename(name)}.csv`,
      ["序号,识别时间,码制,来源,内容", ...rows].join("\n"),
      "text/csv;charset=utf-8",
    );
    notify("扫码记录已导出");
  };

  return (
    <ToolLayout title="扫码识别" subtitle="二维码与条码自动识别" status={scanning ? "连续识别中" : `${records.length} 条记录`} icon={ScanLine}>
      <div className="scanner-grid">
        <section className="scanner-stage">
          <video ref={videoRef} muted playsInline />
          {!scanning && (
            <div className="scanner-empty">
              <Camera size={30} strokeWidth={1.7} />
              <strong>二维码与条码自动识别</strong>
              <span>开启相机，或批量导入图片</span>
            </div>
          )}
          {scanning && <div className="scan-frame" aria-hidden="true"><span /></div>}
          <div className="scanner-actions">
            <ActionButton icon={scanning ? X : Camera} kind={scanning ? "danger" : "primary"} onClick={scanning ? stopScan : startScan}>
              {scanning ? "停止识别" : "开始连续识别"}
            </ActionButton>
            <label className="button secondary file-button">
              <Upload size={17} aria-hidden="true" />
              <span>{processing ? "识别中" : "批量导入"}</span>
              <input type="file" accept="image/*" multiple onChange={decodeImages} disabled={processing} />
            </label>
          </div>
        </section>
        <section className="records-panel">
          <div className="records-header">
            <Field label="本次记录名称">
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </Field>
            <Switch checked={dedupe} onChange={setDedupe} label="自动去重" />
          </div>
          <div className="results-toolbar">
            <div className="results-title">
              <strong>识别结果</strong>
              <span>{records.length} 条</span>
            </div>
            <div className="record-actions">
              <ActionButton icon={Copy} onClick={copyAllRecords} disabled={!records.length}>复制全部</ActionButton>
              <ActionButton icon={Download} onClick={exportRecords} disabled={!records.length}>导出 CSV</ActionButton>
              <IconButton label="清空记录" icon={Trash2} onClick={() => setRecords([])} disabled={!records.length} />
            </div>
          </div>
          <div className="record-list" aria-live="polite">
            {!records.length && <div className="empty-state"><ScanLine size={24} /><span>暂无二维码或条码记录</span></div>}
            {records.map((record, index) => (
              <article className="record-row" key={record.id}>
                <span className="record-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="record-body">
                  <div className="record-meta">
                    <span className="format-badge">{record.formatLabel}</span>
                    <small title={record.source}>{record.source === "camera" ? "相机" : record.source}</small>
                  </div>
                  <p>{record.text}</p>
                </div>
                <IconButton label="复制内容" icon={Copy} onClick={() => copyText(record.text, notify)} />
              </article>
            ))}
          </div>
        </section>
      </div>
    </ToolLayout>
  );
}

function QRPreview({ value, logo, style, foreground, background, caption, selected, onSelect }) {
  const ref = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    let cancelled = false;
    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      if (cancelled || !ref.current) return;
      ref.current.innerHTML = "";
      const qr = new QRCodeStyling({
        width: 280,
        height: 280,
        type: "canvas",
        data: value || " ",
        image: logo || undefined,
        margin: 12,
        qrOptions: { errorCorrectionLevel: "H" },
        dotsOptions: { color: foreground, type: style },
        backgroundOptions: { color: background },
        imageOptions: { crossOrigin: "anonymous", margin: 6, imageSize: 0.18, hideBackgroundDots: true },
        cornersSquareOptions: { color: foreground, type: style === "dots" ? "extra-rounded" : "square" },
        cornersDotOptions: { color: foreground, type: style === "dots" ? "dot" : "square" },
      });
      qr.append(ref.current);
      instanceRef.current = qr;
    });
    return () => { cancelled = true; };
  }, [value, logo, style, foreground, background]);

  const download = async () => {
    if (!caption) {
      await instanceRef.current.download({ name: safeFilename(value.slice(0, 36) || "二维码"), extension: "png" });
      return;
    }
    const blob = await instanceRef.current.getRawData("png");
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 820;
    const context = canvas.getContext("2d");
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 40, 40, 640, 640);
    context.fillStyle = foreground;
    context.font = '600 34px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
    context.textAlign = "center";
    const visible = caption.length > 24 ? `${caption.slice(0, 24)}…` : caption;
    context.fillText(visible, 360, 750);
    canvas.toBlob((output) => {
      const url = URL.createObjectURL(output);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${safeFilename(caption)}.png`;
      anchor.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <button type="button" className={`qr-preview ${selected ? "selected" : ""}`} onClick={onSelect}>
      <div className="qr-canvas" ref={ref} />
      {caption && <strong>{caption}</strong>}
      {selected && <span className="selection-mark"><Check size={14} /></span>}
      <span className="qr-download" onClick={(event) => { event.stopPropagation(); download(); }}>
        <Download size={16} /> PNG
      </span>
    </button>
  );
}

function QRGenerator({ initialValue, notify }) {
  const [text, setText] = useState(initialValue || "https://tools.1008086.xyz");
  const [caption, setCaption] = useState("");
  const [logo, setLogo] = useState("");
  const [style, setStyle] = useState("rounded");
  const [foreground, setForeground] = useState("#111827");
  const [background, setBackground] = useState("#ffffff");
  const [selected, setSelected] = useState(0);
  const entries = useMemo(() => text.split(/\\r?\\n/).map((line) => line.trim()).filter(Boolean), [text]);

  useEffect(() => {
    if (initialValue) setText(initialValue);
  }, [initialValue]);

  const importText = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setText(await file.text());
    setSelected(0);
    event.target.value = "";
  };

  const importLogo = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(String(reader.result));
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  return (
    <ToolLayout title="二维码生成" subtitle="文本、链接与批量转码" status={`${entries.length} 个二维码`} icon={QrCode}>
      <div className="generator-grid">
        <section className="generator-form">
          <div className="section-heading">
            <h3>编码内容</h3>
            <label className="text-button file-button">
              <FileUp size={15} />
              导入文本
              <input type="file" accept=".txt,text/plain" onChange={importText} />
            </label>
          </div>
          <Field label="文本或链接" hint="每行生成一个二维码">
            <textarea className="mono tall" value={text} onChange={(event) => { setText(event.target.value); setSelected(0); }} />
          </Field>
          <div className="field-grid">
            <Field label="二维码样式">
              <Segmented
                label="二维码样式"
                value={style}
                onChange={setStyle}
                options={[{ value: "square", label: "经典" }, { value: "rounded", label: "圆润" }, { value: "dots", label: "圆点" }]}
              />
            </Field>
            <Field label="题注文字">
              <input value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="显示在二维码下方" maxLength={48} />
            </Field>
          </div>
          <div className="field-grid colors-grid">
            <Field label="前景色">
              <div className="color-input"><input type="color" value={foreground} onChange={(event) => setForeground(event.target.value)} /><span>{foreground}</span></div>
            </Field>
            <Field label="背景色">
              <div className="color-input"><input type="color" value={background} onChange={(event) => setBackground(event.target.value)} /><span>{background}</span></div>
            </Field>
          </div>
          <div className="logo-row">
            <label className="button secondary file-button">
              <Sparkles size={17} />
              <span>{logo ? "更换中心图标" : "加入中心图标"}</span>
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={importLogo} />
            </label>
            {logo && <ActionButton icon={X} onClick={() => setLogo("")}>移除图标</ActionButton>}
            <span className="quality-note"><ShieldCheck size={15} /> 高纠错 · 安全留白</span>
          </div>
        </section>
        <section className="preview-column">
          <div className="preview-heading">
            <span>预览</span>
            {entries.length > 1 && <span>{selected + 1} / {entries.length}</span>}
          </div>
          {entries.length ? (
            <QRPreview
              value={entries[selected] || entries[0]}
              logo={logo}
              style={style}
              foreground={foreground}
              background={background}
              caption={caption}
              selected
            />
          ) : <div className="empty-state qr-empty"><QrCode size={26} /><span>等待输入内容</span></div>}
          {entries.length > 1 && (
            <div className="preview-pagination">
              <IconButton label="上一个" icon={ChevronLeft} onClick={() => setSelected((selected - 1 + entries.length) % entries.length)} />
              <div className="page-dots">{entries.slice(0, 8).map((_, index) => <button key={index} aria-label={`第 ${index + 1} 个`} className={index === selected ? "active" : ""} onClick={() => setSelected(index)} />)}</div>
              <IconButton label="下一个" icon={ChevronRight} onClick={() => setSelected((selected + 1) % entries.length)} />
            </div>
          )}
        </section>
      </div>
    </ToolLayout>
  );
}

function AesTool({ notify }) {
  const [mode, setMode] = useState("encrypt");
  const [key, setKey] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const execute = async () => {
    try {
      setOutput(mode === "encrypt" ? await encryptAes(input, key) : await decryptAes(input, key));
      notify(mode === "encrypt" ? "加密完成" : "解密完成");
    } catch (error) {
      notify(error.message, "error");
    }
  };

  return (
    <ToolLayout title="AES 加解密" subtitle="使用口令加密与还原文本" status="仅本地处理" icon={LockKeyhole}>
      <div className="narrow-workspace">
        <Segmented label="AES 操作" value={mode} onChange={(value) => { setMode(value); setOutput(""); }} options={[{ value: "encrypt", label: "加密" }, { value: "decrypt", label: "解密" }]} />
        <Field label="密钥">
          <div className="input-with-icon"><KeyRound size={17} /><input type="password" value={key} onChange={(event) => setKey(event.target.value)} placeholder="输入加密口令" autoComplete="off" /></div>
        </Field>
        <Field label={mode === "encrypt" ? "待加密文本" : "AES 密文"}>
          <textarea className="mono tall" value={input} onChange={(event) => setInput(event.target.value)} placeholder={mode === "encrypt" ? "输入或粘贴文本" : "粘贴 OpenSSL 格式的 AES 密文"} />
        </Field>
        <ActionButton icon={LockKeyhole} kind="primary" onClick={execute}>{mode === "encrypt" ? "执行加密" : "执行解密"}</ActionButton>
        <Field label="结果">
          <ResultBox value={output} onCopy={() => copyText(output, notify)} />
        </Field>
      </div>
    </ToolLayout>
  );
}

function QxTool({ notify }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const execute = () => {
    try { setOutput(qxRegexFromUrl(input)); }
    catch { notify("请输入完整有效的 URL", "error"); }
  };
  return (
    <SimpleTextTool title="QX 正则生成" subtitle="从完整 URL 提取域名与路径规则" icon={Radio}>
      <Field label="完整 URL"><textarea className="mono compact" value={input} onChange={(e) => setInput(e.target.value)} placeholder="https://example.com/path?query=1" /></Field>
      <ActionButton icon={WandSparkles} kind="primary" onClick={execute}>生成正则</ActionButton>
      <Field label="Quantumult X 匹配规则"><ResultBox value={output} onCopy={() => copyText(output, notify)} /></Field>
    </SimpleTextTool>
  );
}

function UrlTool({ notify }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const execute = (mode) => {
    try { setOutput(mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input)); }
    catch { notify("文本包含无效的 URL 编码", "error"); }
  };
  return (
    <SimpleTextTool title="URL 编解码" subtitle="处理 Query 参数与链接文本" icon={ExternalLink}>
      <Field label="输入文本"><textarea className="mono tall" value={input} onChange={(e) => setInput(e.target.value)} /></Field>
      <div className="inline-actions"><ActionButton kind="primary" onClick={() => execute("encode")}>URL Encode</ActionButton><ActionButton onClick={() => execute("decode")}>URL Decode</ActionButton></div>
      <Field label="结果"><ResultBox value={output} onCopy={() => copyText(output, notify)} /></Field>
    </SimpleTextTool>
  );
}

function JsonTool({ notify }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const execute = (mode) => {
    try { setOutput(mode === "unescape" ? unescapeAndFormatJson(input) : formatJson(input, mode)); }
    catch { notify("JSON 格式无效，请检查输入", "error"); }
  };
  return (
    <SimpleTextTool title="JSON 格式化" subtitle="格式化、压缩与转义还原" icon={Braces}>
      <Field label="JSON 输入"><textarea className="mono tall" value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"status":"ok"}' /></Field>
      <div className="inline-actions"><ActionButton kind="primary" onClick={() => execute("format")}>格式化</ActionButton><ActionButton onClick={() => execute("minify")}>压缩</ActionButton><ActionButton onClick={() => execute("unescape")}>解转义后格式化</ActionButton></div>
      <Field label="输出"><ResultBox value={output} onCopy={() => copyText(output, notify)} /></Field>
    </SimpleTextTool>
  );
}

function SimpleTextTool({ title, subtitle, icon, children }) {
  return <ToolLayout title={title} subtitle={subtitle} status="实时工具" icon={icon}><div className="narrow-workspace">{children}</div></ToolLayout>;
}

function PreviewPanel({ title, children }) {
  return <section className="preview-panel"><span className="eyebrow">{title}</span>{children}</section>;
}

function ToolLayout({ title, subtitle, status, icon: Icon, aside, children }) {
  return (
    <div className={`tool-page ${aside ? "with-aside" : ""}`}>
      <header className="tool-header">
        <div className="tool-icon"><Icon size={21} strokeWidth={2} /></div>
        <div><h2>{title}</h2><p>{subtitle}</p></div>
        <span className="status-chip"><span />{status}</span>
      </header>
      <div className="tool-content">
        <section className="primary-pane">{children}</section>
        {aside && <aside>{aside}</aside>}
      </div>
    </div>
  );
}

async function copyText(value, notify, message = "已复制到剪贴板") {
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const area = document.createElement("textarea");
    area.value = value;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  notify(message);
}

export default function App() {
  const [active, setActive] = useState("link");
  const [menuOpen, setMenuOpen] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const notify = useCallback((message, type = "success") => {
    window.clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  const selectTool = (id) => {
    setActive(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openQr = (value) => {
    setQrValue(value);
    selectTool("qr");
    notify("链接已送入二维码生成器");
  };

  const component = {
    link: <LinkBuilder notify={notify} openQr={openQr} />,
    scan: <Scanner notify={notify} />,
    qr: <QRGenerator initialValue={qrValue} notify={notify} />,
    aes: <AesTool notify={notify} />,
    qx: <QxTool notify={notify} />,
    url: <UrlTool notify={notify} />,
    json: <JsonTool notify={notify} />,
  }[active];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><img src="/favicon.svg" alt="" /></div>
          <div><strong>Tools</strong><span>轻量工具工作台</span></div>
          <IconButton label="关闭菜单" icon={X} onClick={() => setMenuOpen(false)} />
        </div>
        <nav aria-label="工具列表">
          {[...new Set(tools.map((tool) => tool.group))].map((group) => (
            <div className="nav-group" key={group}>
              <span>{group}</span>
              {tools.filter((tool) => tool.group === group).map((tool) => {
                const Icon = tool.icon;
                return (
                  <button key={tool.id} className={active === tool.id ? "active" : ""} onClick={() => selectTool(tool.id)}>
                    <Icon size={18} strokeWidth={2} /><span>{tool.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="privacy-note"><ShieldCheck size={16} /><span>内容仅在当前设备处理</span></div>
      </aside>
      {menuOpen && <button className="sidebar-scrim" aria-label="关闭菜单" onClick={() => setMenuOpen(false)} />}
      <main className="main-area">
        <header className="mobile-header">
          <IconButton label="打开菜单" icon={Menu} onClick={() => setMenuOpen(true)} />
          <div><strong>Tools</strong><span>{tools.find((tool) => tool.id === active)?.label}</span></div>
          <span className="local-badge"><ShieldCheck size={14} /> 本地</span>
        </header>
        {component}
      </main>
      <nav className="mobile-nav" aria-label="常用工具">
        {tools.slice(0, 4).map((tool) => {
          const Icon = tool.icon;
          return <button key={tool.id} className={active === tool.id ? "active" : ""} onClick={() => selectTool(tool.id)}><Icon size={20} /><span>{tool.short}</span></button>;
        })}
        <button onClick={() => setMenuOpen(true)}><Menu size={20} /><span>更多</span></button>
      </nav>
      {toast && <div className={`toast ${toast.type}`} role="status"><span>{toast.type === "success" ? <Check size={16} /> : <X size={16} />}</span>{toast.message}</div>}
    </div>
  );
}
