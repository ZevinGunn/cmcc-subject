const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = __dirname;
const PYTHON = process.env.GRID_PYTHON || (fs.existsSync('/Library/Developer/CommandLineTools/usr/bin/python3')
  ? '/Library/Developer/CommandLineTools/usr/bin/python3' : 'python3');

function worker(args, onProgress = () => {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(PYTHON, [path.join(ROOT, 'scripts/grid_catalog.py')], { stdio: ['pipe', 'pipe', 'pipe'] });
    let buffer = '', error = '', result;
    child.stderr.on('data', (chunk) => { error = (error + chunk).slice(-2000); });
    child.stdout.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line) continue;
        try {
          const value = JSON.parse(line);
          if (value.error) error = value.error;
          else if (Object.hasOwn(value, 'result')) result = value.result;
          else { result = value; onProgress(value); }
        } catch { error = '知识库进程返回了无效数据'; }
      }
    });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve(result) : reject(new Error(error || '知识库进程异常退出')));
    child.stdin.on('error', () => {});
    child.stdin.end(JSON.stringify(args));
  });
}

function adminKey() {
  const target = path.join(ROOT, 'data/grid-admin.local.json');
  if (!fs.existsSync(target)) {
    try { fs.writeFileSync(target, JSON.stringify({ key: crypto.randomBytes(32).toString('hex') }), { flag: 'wx', mode: 0o600 }); }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
  }
  return JSON.parse(fs.readFileSync(target)).key;
}

async function body(req) {
  let text = '';
  for await (const chunk of req) {
    text += chunk.toString();
    if (Buffer.byteLength(text) > 32768) throw new RangeError('请求内容超过 32KB');
  }
  try { return JSON.parse(text); } catch { throw new RangeError('请求须为有效 JSON'); }
}

function createGridCatalog({ dbPath = path.join(ROOT, 'data/grid-catalog.sqlite'), key, run = worker } = {}) {
  let secret = key;
  let job = { running: false };
  const call = (args, progress) => run({ ...args, dbPath }, progress);
  async function handle(req, res, url, sendJson, send) {
    if (!url.pathname.startsWith('/api/grid-catalog')) return false;
    const endpoint = url.pathname.slice('/api/grid-catalog'.length);
    const method = req.method || 'GET';
    try {
      if (method === 'GET' || method === 'HEAD') {
        if (endpoint === '' || endpoint === '/') {
          const args = Object.fromEntries(url.searchParams);
          if (args.page && !/^\d{1,6}$/.test(args.page) || args.pageSize && !/^\d{1,3}$/.test(args.pageSize)) throw new RangeError('分页参数无效');
          sendJson(res, 200, await call({ ...args, operation: 'list' }), method);
        } else if (endpoint === '/status') {
          sendJson(res, 200, { job, summary: await call({ operation: 'summary' }), settings: await call({ operation: 'settings' }) }, method);
        } else if (endpoint === '/detail') {
          const id = url.searchParams.get('id');
          if (!/^A\d{7}$/.test(id || '')) throw new RangeError('业务 ID 格式无效');
          const result = await call({ operation: 'detail', id });
          sendJson(res, result ? 200 : 404, result || { message: '业务不存在' }, method);
        } else if (endpoint === '/export.json') {
          // Only public, cleaned business records are exported; no administrator configuration.
          const list = await call({ operation: 'list', pageSize: 100 });
          const records = [];
          for (let page = 1; page <= Math.ceil(list.total / 100); page++) {
            const part = page === 1 ? list : await call({ operation: 'list', page, pageSize: 100 });
            for (const item of part.items) records.push(await call({ operation: 'detail', id: item.package_id }));
          }
          res.setHeader('Content-Disposition', 'attachment; filename="grid-knowledge.json"');
          sendJson(res, 200, { generatedAt: new Date().toISOString(), summary: list.summary, packages: records }, method);
        } else if (endpoint === '/export.xlsx') {
          const target = path.join(ROOT, 'data/grid-exports/grid-knowledge.xlsx');
          if (!fs.existsSync(target)) sendJson(res, 404, { message: 'Excel 尚未生成，请先完成资料导出' }, method);
          else {
            res.setHeader('Content-Disposition', 'attachment; filename="grid-knowledge.xlsx"');
            send(res, 200, fs.readFileSync(target), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', method);
          }
        } else sendJson(res, 404, { message: '接口不存在' }, method);
        return true;
      }
      if (method !== 'POST') { sendJson(res, 405, { message: '不支持该请求方式' }, method); return true; }
      secret ||= adminKey();
      const supplied = (req.headers.authorization || '').replace(/^Bearer /, '');
      if (Buffer.byteLength(supplied) !== Buffer.byteLength(secret) || !crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(secret))) {
        sendJson(res, 401, { message: '需要有效的业务配置管理密钥' }, method); return true;
      }
      const origin = req.headers.origin;
      if (origin && new URL(origin).host !== req.headers.host) {
        sendJson(res, 403, { message: '不允许跨站配置请求' }, method); return true;
      }
      if (job.running) { sendJson(res, 409, { message: '已有采集任务执行中，请等待完成' }, method); return true; }
      const input = await body(req);
      if (endpoint === '/configure') {
        if (input.ids !== undefined && (!Array.isArray(input.ids) || input.ids.length > 500 || input.ids.some((id) => !/^A\d{7}$/.test(id)))) {
          throw new RangeError('请提供最多 500 个有效业务 ID');
        }
        if (input.settings !== undefined && (input.settings === null || typeof input.settings !== 'object' || Array.isArray(input.settings))) {
          throw new RangeError('业务发现配置无效');
        }
        if (input.settings?.startId !== undefined && !/^A\d{7}$/.test(input.settings.startId)) throw new RangeError('发现起始编号无效');
        if (input.settings?.endId !== undefined && !/^A\d{7}$/.test(input.settings.endId)) throw new RangeError('发现结束编号无效');
        if (input.settings?.startId !== undefined && input.settings?.endId !== undefined
          && Number(input.settings.endId.slice(1)) - Number(input.settings.startId.slice(1)) >= 500) {
          throw new RangeError('发现范围需为顺序排列的最多 500 个编号');
        }
        if (input.settings?.intervalMs !== undefined
          && (!Number.isInteger(input.settings.intervalMs) || input.settings.intervalMs < 300 || input.settings.intervalMs > 10000)) {
          throw new RangeError('请求间隔须在 300 至 10000 毫秒之间');
        }
        sendJson(res, 200, await call({ operation: 'configure', ids: input.ids || [], settings: input.settings }), method);
      } else if (endpoint === '/collect') {
        if (!['all', 'discover', 'selected'].includes(input.mode)) throw new RangeError('采集模式无效');
        if (input.mode === 'selected' && (!Array.isArray(input.ids) || !input.ids.length || input.ids.length > 500 || input.ids.some((id) => !/^A\d{7}$/.test(id)))) throw new RangeError('请提供最多 500 个有效业务 ID');
        job = { running: true, startedAt: new Date().toISOString(), mode: input.mode, progress: 0 };
        call({ operation: 'scan', mode: input.mode, ids: input.mode === 'selected' ? input.ids : undefined }, (value) => { job = { ...job, ...value }; })
          .then((result) => { job = { ...job, ...result, running: false, finishedAt: new Date().toISOString() }; })
          .catch((error) => { job = { ...job, running: false, error: error.message }; });
        sendJson(res, 202, { job }, method);
      } else sendJson(res, 404, { message: '接口不存在' }, method);
    } catch (error) {
      sendJson(res, error instanceof RangeError || /业务 ID|范围|间隔|最多|startId|endId/.test(error.message) ? 400 : 500,
        { message: error.message || '知识库请求失败' }, method);
    }
    return true;
  }
  return { handle };
}

module.exports = { worker, createGridCatalog };
