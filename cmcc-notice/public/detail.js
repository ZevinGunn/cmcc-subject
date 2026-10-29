const detailFrameEl = document.getElementById("detail-frame");
const detailDownloadEl = document.getElementById("detail-download");
const detailImageEl = document.getElementById("detail-image");
const detailPdfEl = document.getElementById("detail-pdf");

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function decodeParam(value) {
  if (!value) {
    return value;
  }
  try {
    return decodeURIComponent(value);
  } catch (err) {
    return value;
  }
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "请求失败");
  }
  return res.text();
}

function injectHead(html, baseUrl) {
  const baseTag = `<base href="${baseUrl}">`;
  const viewportTag =
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">';
  const styleTag =
    "<style>" +
    "html{-webkit-text-size-adjust:100%;}" +
    "html,body{margin:0;padding:0;max-width:100%;overflow-x:hidden;background:#fff;}" +
    "body{font-size:16px;line-height:1.7;word-break:break-word;overflow-wrap:anywhere;}" +
    "img,video,canvas,svg{max-width:100%!important;height:auto!important;}" +
    "table{max-width:100%!important;display:block;overflow-x:auto;border-collapse:collapse;}" +
    "pre,code{white-space:pre-wrap;word-break:break-word;}" +
    "*{box-sizing:border-box;}" +
    "@media (max-width: 768px){" +
    "body{padding:12px!important;font-size:14px!important;line-height:1.6!important;}" +
    "*{max-width:100%!important;}" +
    "[style*='font-size: 32px'],[style*='font-size:32px']{font-size:24px!important;}" +
    "[style*='font-size: 30px'],[style*='font-size:30px']{font-size:22px!important;}" +
    "[style*='font-size: 28px'],[style*='font-size:28px']{font-size:20px!important;}" +
    "[style*='font-size: 26px'],[style*='font-size:26px']{font-size:19px!important;}" +
    "[style*='font-size: 24px'],[style*='font-size:24px']{font-size:18px!important;}" +
    "[style*='font-size: 22px'],[style*='font-size:22px']{font-size:17px!important;}" +
    "[style*='font-size: 20px'],[style*='font-size:20px']{font-size:16px!important;}" +
    "}" +
    "</style>";
  const additions = `${baseTag}${viewportTag}${styleTag}`;
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (match) => `${match}${additions}`);
  }
  if (/<html[^>]*>/i.test(html)) {
    return html.replace(/<html[^>]*>/i, (match) => `${match}<head>${additions}</head>`);
  }
  return `<head>${additions}</head>${html}`;
}

let resizeObserver = null;

function getFrameHeight() {
  const doc = detailFrameEl.contentDocument;
  if (!doc || !doc.body || !doc.documentElement) {
    return 0;
  }
  const body = doc.body;
  const html = doc.documentElement;
  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
}

function updateFrameHeight() {
  const nextHeight = getFrameHeight();
  if (!Number.isFinite(nextHeight) || nextHeight <= 0) {
    return;
  }
  detailFrameEl.style.height = `${nextHeight}px`;
}

function observeFrame() {
  const doc = detailFrameEl.contentDocument;
  if (!doc || !doc.body || !doc.documentElement) {
    return;
  }
  updateFrameHeight();
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => updateFrameHeight());
    resizeObserver.observe(doc.documentElement);
    resizeObserver.observe(doc.body);
  }
  Array.prototype.forEach.call(doc.images || [], (img) => {
    if (!img.complete) {
      img.addEventListener("load", updateFrameHeight);
      img.addEventListener("error", updateFrameHeight);
    }
  });
  setTimeout(updateFrameHeight, 200);
  setTimeout(updateFrameHeight, 800);
}

async function renderCanvas() {
  const frameWindow = detailFrameEl.contentWindow;
  const frameDocument = detailFrameEl.contentDocument;
  if (!frameWindow || !frameDocument || !frameDocument.body) {
    throw new Error("详情未加载");
  }
  await new Promise((resolve) => {
    frameWindow.requestAnimationFrame(() => setTimeout(resolve, 150));
  });
  return window.html2canvas(frameDocument.body, {
    useCORS: true,
    backgroundColor: "#ffffff",
    scale: 2,
  });
}

async function handleImageExport() {
  if (!window.html2canvas) {
    alert("未加载图片生成工具");
    return;
  }
  detailImageEl.disabled = true;
  try {
    const canvas = await renderCanvas();
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "公告详情.png";
    link.click();
  } catch (err) {
    alert("生成图片失败");
  } finally {
    detailImageEl.disabled = false;
  }
}

async function handlePdfExport() {
  if (!window.html2canvas || !window.jspdf || !window.jspdf.jsPDF) {
    alert("未加载PDF生成工具");
    return;
  }
  detailPdfEl.disabled = true;
  try {
    const canvas = await renderCanvas();
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new window.jspdf.jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let position = 0;
    let heightLeft = imgHeight;
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save("公告详情.pdf");
  } catch (err) {
    alert("生成PDF失败");
  } finally {
    detailPdfEl.disabled = false;
  }
}

async function loadDetail() {
  const url = decodeParam(getQueryParam("url"));
  if (!url) {
    detailFrameEl.srcdoc = "<p>未提供详情地址。</p>";
    return;
  }
  detailDownloadEl.href = url;
  const proxyUrl = `/api/detail?url=${encodeURIComponent(url)}`;
  try {
    const html = await fetchText(proxyUrl);
    const withHead = injectHead(html, url);
    detailFrameEl.srcdoc = withHead;
  } catch (err) {
    detailFrameEl.srcdoc = "<p>详情内容加载失败。</p>";
  }
}

detailFrameEl.addEventListener("load", observeFrame);
detailImageEl.addEventListener("click", handleImageExport);
detailPdfEl.addEventListener("click", handlePdfExport);
loadDetail();
