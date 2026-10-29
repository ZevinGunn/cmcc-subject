#!/usr/bin/env bash
# 按统一服务清单执行 PM2、端口归属、应用、本机代理和公网 HTTPS 五层检查。
set -uo pipefail

sep()  { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()   { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
warn() { printf "  \033[1;33m!\033[0m %s\n" "$*"; }
bad()  { printf "  \033[1;31m✗\033[0m %s\n" "$*" >&2; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$ROOT/project-manager/services.json"
NODE="${NODE_BIN:-$(command -v node || true)}"
PM2="${PM2_BIN:-$HOME/.nvm/versions/node/v18.20.8/bin/pm2}"
[ -x "$PM2" ] || PM2="$(command -v pm2 || true)"
MAIN_CF_CONFIG="/etc/cloudflared/config.yml"
MAIN_CF_PLIST="/Library/LaunchDaemons/com.cloudflare.cloudflared.plist"
BMCC_CF_CONFIG="$HOME/.cloudflared/cmcc-bmcc.yml"

if [[ "${1:-}" =~ ^(-h|--help|help)$ ]]; then
  printf '%s\n' \
    "用法：bash _部署方案/healthcheck.sh" \
    "按 services.json 检查 PM2、端口归属、应用健康、Nginx、Tunnel 与公网 HTTPS。"
  exit 0
fi
if [ "$#" -gt 0 ]; then
  bad "未知参数：$1"
  exit 2
fi

if [ -z "$NODE" ] || [ ! -x "$NODE" ]; then
  bad "找不到 node，无法读取服务清单"
  exit 1
fi
if [ ! -f "$MANIFEST" ]; then
  bad "服务清单不存在：$MANIFEST"
  exit 1
fi
if ! "$NODE" -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "$MANIFEST"; then
  bad "服务清单不是合法 JSON"
  exit 1
fi

failures=0
pm2_json="[]"

check_tunnel_config() {
  local id="$1"
  local label="$2"
  local config="$3"
  local expected actual invalid_origins

  if [ ! -r "$config" ]; then
    bad "$label 配置不存在或不可读：$config"
    failures=$((failures + 1))
    return
  fi
  if ! command -v cloudflared >/dev/null 2>&1 \
    || ! cloudflared tunnel --config "$config" ingress validate >/dev/null 2>&1; then
    bad "$label ingress 配置校验失败：$config"
    failures=$((failures + 1))
    return
  fi
  expected="$("$NODE" -e '
    const manifest = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
    const resource = manifest.infrastructure.find((item) => item.id === process.argv[2]);
    if (!resource) process.exit(1);
    process.stdout.write([...resource.domains].sort().join("\n"));
  ' "$MANIFEST" "$id")"
  actual="$(awk '/^[[:space:]]*- hostname:/ { print $3 }' "$config" | LC_ALL=C sort)"
  if [ "$actual" = "$expected" ]; then
    ok "$label 域名与 services.json 一致（${config}）"
  else
    bad "$label 域名与 services.json 不一致（${config}）"
    printf '  manifest:\n%s\n  config:\n%s\n' "$expected" "$actual" >&2
    failures=$((failures + 1))
  fi

  invalid_origins="$(awk '
    $2 == "hostname:" { hostname=$3; next }
    $1 == "service:" && hostname != "" {
      if ($2 != "http://127.0.0.1:80") print hostname " -> " $2
      hostname=""
    }
  ' "$config")"
  if [ -n "$invalid_origins" ]; then
    bad "$label 存在绕过 Nginx 网关的源站路由"
    printf '%s\n' "$invalid_origins" >&2
    failures=$((failures + 1))
  else
    ok "$label 所有域名均通过 127.0.0.1:80 网关"
  fi
}

record_http_result() {
  local label="$1"
  local code="$2"
  local allowed="$3"

  if [ "$code" = "404" ]; then
    bad "$label -> HTTP 404（路由不存在，不视为健康）"
    failures=$((failures + 1))
    return
  fi

  case ",$allowed," in
    *",$code,"*) ok "$label -> HTTP $code" ;;
    *)
      bad "$label -> HTTP ${code}（期望：${allowed}）"
      failures=$((failures + 1))
      ;;
  esac
}

trusted_auth_redirect() {
  local location="$1"
  local allowed_hosts="$2"
  "$NODE" -e '
    try {
      const target = new URL(process.argv[1]);
      const allowed = process.argv[2].split(",").filter(Boolean);
      process.exit(target.protocol === "https:"
        && allowed.includes(target.hostname)
        && target.pathname.startsWith("/cdn-cgi/access/") ? 0 : 1);
    } catch {
      process.exit(1);
    }
  ' "$location" "$allowed_hosts"
}

record_edge_result() {
  local label="$1"
  local code="$2"
  local allowed="$3"
  local exposure="$4"
  local domain="$5"
  local location="${6:-}"
  local access_hosts="${7:-}"

  if [ "$exposure" != "restricted-pending-auth" ]; then
    record_http_result "$label" "$code" "$allowed"
    return
  fi

  case "$code" in
    2??)
      bad "$label -> HTTP ${code}（受限服务在访问控制完成前不应公网可达）"
      failures=$((failures + 1))
      ;;
    401|403)
      warn "$label -> HTTP ${code}（可信鉴权拒绝；仍需完成访问控制验收）"
      ;;
    3??)
      if trusted_auth_redirect "$location" "$access_hosts"; then
        warn "$label -> HTTP ${code}（跳转到可信鉴权入口）"
      else
        bad "$label -> HTTP ${code}（跳转目标不是可信鉴权入口）"
        failures=$((failures + 1))
      fi
      ;;
    404)
      warn "$label -> HTTP 404（公网路由关闭；这不代表已接入鉴权）"
      ;;
    000)
      warn "$label -> 无法连接（公网入口未启用或不可达；尚未验证鉴权）"
      ;;
    *)
      bad "$label -> HTTP ${code}（无法确认受限服务的访问控制）"
      failures=$((failures + 1))
      ;;
  esac
}

listening_pids() {
  local port="$1"
  lsof -nP -iTCP:"$port" -sTCP:LISTEN -Fp 2>/dev/null \
    | sed -n 's/^p//p' \
    | sort -u \
    || true
}

pid_belongs_to_pm2() {
  local listener_pid="$1"
  local pm2_pid="$2"
  local current="$listener_pid"
  local parent depth
  for depth in $(seq 1 16); do
    [ "$current" = "$pm2_pid" ] && return 0
    parent="$(/bin/ps -o ppid= -p "$current" 2>/dev/null | awk 'NF { print $1; exit }' || true)"
    [ -n "$parent" ] && [ "$parent" != "$current" ] && [ "$parent" -gt 0 ] 2>/dev/null || return 1
    current="$parent"
  done
  return 1
}

validate_listener() {
  local id="$1"
  local name="$2"
  local port="$3"
  local pm2_name="$4"
  local status="$5"
  local pm2_pid="$6"
  local pids pid_count pid_list

  pids="$(listening_pids "$port")"
  pid_count="$(printf '%s\n' "$pids" | awk 'NF { count += 1 } END { print count + 0 }')"
  pid_list="$(printf '%s\n' "$pids" | paste -sd, -)"

  if [ "$status" != "online" ] || [ -z "$pm2_pid" ]; then
    bad "$name ($id) / $pm2_name -> PM2 ${status}，无法确认端口归属"
    failures=$((failures + 1))
    return
  fi
  if [ "$pid_count" -ne 1 ]; then
    bad "$name ($id) :$port -> 监听 PID 数量为 ${pid_count}（${pid_list:-none}），要求恰好 1 个且属于 PM2 进程树 $pm2_pid"
    failures=$((failures + 1))
    return
  fi
  if ! pid_belongs_to_pm2 "$pids" "$pm2_pid"; then
    bad "$name ($id) :$port -> 监听 PID $pids 不属于 PM2 进程树 $pm2_pid"
    failures=$((failures + 1))
    return
  fi

  ok "$name ($id) :$port -> 唯一监听 PID ${pids}（PM2 根进程 ${pm2_pid}）"
}

sep "1. PM2 应用与受管 Tunnel"
if [ -z "$PM2" ] || [ ! -x "$PM2" ]; then
  bad "找不到 pm2"
  failures=$((failures + 1))
elif ! pm2_json="$("$PM2" jlist 2>/dev/null)"; then
  bad "无法读取 PM2 状态"
  failures=$((failures + 1))
  pm2_json="[]"
elif pm2_report="$(printf '%s' "$pm2_json" | "$NODE" -e '
  const fs = require("fs");
  const manifest = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { input += chunk; });
  process.stdin.on("end", () => {
    const current = JSON.parse(input || "[]");
    const actual = new Map(current.map((item) => [item.name, item.pm2_env?.status || "unknown"]));
    const expected = [...manifest.services, ...manifest.infrastructure].filter((item) => item.pm2Name);
    for (const service of expected) {
      console.log([service.id, service.name, service.pm2Name, actual.get(service.pm2Name) || "missing"].join("\t"));
    }
  });
' "$MANIFEST")"; then
  while IFS=$'\t' read -r id name pm2_name status; do
    [ -n "$id" ] || continue
    if [ "$status" = "online" ]; then
      ok "$name ($id) / $pm2_name -> online"
    else
      bad "$name ($id) / $pm2_name -> $status"
      failures=$((failures + 1))
    fi
  done <<< "$pm2_report"
else
  bad "PM2 状态不是有效 JSON"
  failures=$((failures + 1))
  pm2_json="[]"
fi

sep "2. 应用端口与 PM2 PID 归属"
while IFS=$'\t' read -r id name port pm2_name status pm2_pid; do
  [ -n "$id" ] || continue
  validate_listener "$id" "$name" "$port" "$pm2_name" "$status" "$pm2_pid"
done < <(printf '%s' "$pm2_json" | "$NODE" -e '
  const fs = require("fs");
  const manifest = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { input += chunk; });
  process.stdin.on("end", () => {
    const current = new Map(JSON.parse(input || "[]").map((item) => [item.name, item]));
    for (const service of manifest.services.filter((item) => item.kind === "application")) {
      const process = current.get(service.pm2Name);
      console.log([
        service.id,
        service.name,
        service.port,
        service.pm2Name,
        process?.pm2_env?.status || "missing",
        Number(process?.pid) || ""
      ].join("\t"));
    }
  });
' "$MANIFEST")

sep "3. 应用直连健康路径"
while IFS=$'\t' read -r id name port health_path allowed; do
  [ -n "$id" ] || continue
  if code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 4 "http://127.0.0.1:$port$health_path" 2>/dev/null)"; then
    :
  else
    code="000"
  fi
  record_http_result "$name ($id) :$port$health_path" "$code" "$allowed"
done < <("$NODE" -e '
  const fs = require("fs");
  const manifest = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  for (const service of manifest.services.filter((item) => item.kind === "application")) {
    console.log([service.id, service.name, service.port, service.healthPath, service.allowedStatus.join(",")].join("\t"));
  }
' "$MANIFEST")

sep "4. 基础设施"
if nc -z 127.0.0.1 80 >/dev/null 2>&1; then
  ok "Nginx :80 可连接"
else
  bad "Nginx :80 无法连接"
  failures=$((failures + 1))
fi

if docker exec cmcc-cookie-app-postgres pg_isready -U cmcc_user >/dev/null 2>&1; then
  ok "PostgreSQL ready"
else
  bad "PostgreSQL 不可用"
  failures=$((failures + 1))
fi

if launchctl print system/com.cloudflare.cloudflared >/dev/null 2>&1; then
  ok "主 Cloudflare Tunnel 已由 launchd 加载"
else
  bad "主 Cloudflare Tunnel launchd 服务未加载"
  failures=$((failures + 1))
fi

if plutil -p "$MAIN_CF_PLIST" 2>/dev/null | grep -Fq "$MAIN_CF_CONFIG"; then
  ok "主 Cloudflare Tunnel 固定读取 $MAIN_CF_CONFIG"
else
  bad "主 Cloudflare Tunnel launchd 未指向 $MAIN_CF_CONFIG"
  failures=$((failures + 1))
fi
check_tunnel_config "cloudflare-main" "主 Cloudflare Tunnel" "$MAIN_CF_CONFIG"
check_tunnel_config "bmcc-tunnel" "BMCC Tunnel" "$BMCC_CF_CONFIG"

sep "5. 本机 Nginx 域名链路"
while IFS=$'\t' read -r id name domain probe_path allowed exposure access_hosts; do
  [ -n "$id" ] || continue
  if probe="$(curl -sS -o /dev/null -w '%{http_code}\t%{redirect_url}' --max-time 4 -H "Host: $domain" "http://127.0.0.1$probe_path" 2>/dev/null)"; then
    IFS=$'\t' read -r code location <<< "$probe"
    :
  else
    code="000"
    location=""
  fi
  record_edge_result "$domain$probe_path" "$code" "$allowed" "$exposure" "$domain" "$location" "$access_hosts"
done < <("$NODE" -e '
  const fs = require("fs");
  const manifest = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  for (const service of manifest.services.filter((item) =>
    item.kind === "application"
    && item.dependencies.includes("nginx")
  )) {
    for (const domain of service.domains) {
      const exposure = service.exposure || "public";
      const paths = exposure === "restricted-pending-auth"
        ? [...new Set(["/", service.healthPath])]
        : [service.healthPath];
      for (const probePath of paths) {
        console.log([
          service.id,
          service.name,
          domain,
          probePath,
          service.allowedStatus.join(","),
          exposure,
          (service.accessRedirectHosts || []).join(",")
        ].join("\t"));
      }
    }
  }
' "$MANIFEST")

sep "6. 公网 HTTPS 链路"
while IFS=$'\t' read -r id name domain probe_path allowed exposure access_hosts; do
  [ -n "$id" ] || continue
  if probe="$(curl -sS -o /dev/null -w '%{http_code}\t%{redirect_url}' --max-time 8 "https://$domain$probe_path" 2>/dev/null)"; then
    IFS=$'\t' read -r code location <<< "$probe"
    :
  else
    code="000"
    location=""
  fi
  record_edge_result "https://$domain$probe_path" "$code" "$allowed" "$exposure" "$domain" "$location" "$access_hosts"
done < <("$NODE" -e '
  const fs = require("fs");
  const manifest = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  for (const service of manifest.services.filter((item) => item.kind === "application")) {
    for (const domain of service.domains) {
      const exposure = service.exposure || "public";
      const paths = exposure === "restricted-pending-auth"
        ? [...new Set(["/", service.healthPath])]
        : [service.healthPath];
      for (const probePath of paths) {
        console.log([
          service.id,
          service.name,
          domain,
          probePath,
          service.allowedStatus.join(","),
          exposure,
          (service.accessRedirectHosts || []).join(",")
        ].join("\t"));
      }
    }
  }
' "$MANIFEST")

sep "检查结果"
if [ "$failures" -gt 0 ]; then
  bad "共发现 $failures 个异常"
  exit 1
fi
ok "全部检查通过；受限服务的边缘安全阻断不计为应用故障"
