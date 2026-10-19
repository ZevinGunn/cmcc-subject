import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  copyFileSync,
  renameSync,
  chmodSync,
} from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { passwordRecord } from "../backend/src/services/siteAccess.js";
const root = fileURLToPath(new URL("../", import.meta.url));
const cloudflared =
  process.env.CLOUDFLARED_BIN || "/opt/homebrew/bin/cloudflared";
const pm2 =
  process.env.PM2_BIN ||
  path.join(homedir(), ".nvm/versions/node/v18.20.8/bin/pm2");
const domain = "ct189.1008086.xyz";
const run = (bin, args) =>
  execFileSync(bin, args, {
    cwd: root,
    encoding: "utf8",
    timeout: 60000,
    stdio: ["ignore", "pipe", "pipe"],
  });
if (!existsSync(path.join(root, "frontend/dist/version.json")))
  throw new Error("请先测试并构建前端");
const data = path.join(root, "backend/data");
mkdirSync(data, { recursive: true, mode: 0o700 });
const accessFile = path.join(data, "site-access.json"),
  credentialFile = path.join(data, "site-access-credentials.txt");
if (!existsSync(accessFile)) {
  const password = randomBytes(24).toString("base64url");
  const record = await passwordRecord(password);
  writeFileSync(
    credentialFile,
    `北京电信快捷服务\n地址：https://${domain}/\n访问账号：admin\n访问密码：${password}\n\n此密码仅用于站点访问，不是电信服务密码。请妥善保管。\n`,
    { mode: 0o600, flag: "wx" },
  );
  writeFileSync(accessFile, JSON.stringify({ username: "admin", ...record }), {
    mode: 0o600,
    flag: "wx",
  });
}
chmodSync(accessFile, 0o600);
const tunnels = () =>
  JSON.parse(run(cloudflared, ["tunnel", "list", "--output", "json"]));
let tunnel = tunnels().find((t) => t.name === "cmcc-ct189");
if (!tunnel) {
  run(cloudflared, ["tunnel", "create", "cmcc-ct189"]);
  tunnel = tunnels().find((t) => t.name === "cmcc-ct189");
}
if (!tunnel || !/^[a-f0-9-]{36}$/.test(tunnel.id))
  throw new Error("无法确认电信独立隧道");
const tunnelCredential = path.join(
  homedir(),
  ".cloudflared",
  `${tunnel.id}.json`,
);
if (!existsSync(tunnelCredential)) throw new Error("独立隧道凭据不存在");
const publicDir = path.join(root, ".public");
mkdirSync(publicDir, { recursive: true, mode: 0o700 });
const config = path.join(publicDir, "tunnel.yml"),
  candidate = `${config}.next`;
writeFileSync(
  candidate,
  `tunnel: ${tunnel.id}\ncredentials-file: ${tunnelCredential}\nprotocol: http2\noriginRequest:\n  connectTimeout: 3s\ningress:\n  - hostname: ${domain}\n    service: http://127.0.0.1:5710\n  - service: http_status:404\n`,
  { mode: 0o600 },
);
run(cloudflared, ["tunnel", "--config", candidate, "ingress", "validate"]);
if (existsSync(config)) copyFileSync(config, `${config}.previous`);
// Without overwrite: never replace an unrelated DNS record.
run(cloudflared, ["tunnel", "route", "dns", tunnel.id, domain]);
renameSync(candidate, config);
run(pm2, [
  "startOrRestart",
  "ecosystem.public.config.cjs",
  "--only",
  "ct189-service,ct189-tunnel",
  "--update-env",
  "--silent",
]);
run(pm2, ["save", "--silent"]);
console.log(`已更新北京电信快捷服务与独立隧道：https://${domain}/`);
console.log(`站点访问凭据保存在本机私有文件：${credentialFile}`);
