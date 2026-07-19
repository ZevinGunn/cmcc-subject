#!/usr/bin/env bash
# 启动清单允许自动操作的业务应用，并恢复 startWithServices 标记的受管依赖。
set -euo pipefail

sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*" >&2; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$ROOT/project-manager/services.json"
ECOSYSTEM="$ROOT/_部署方案/ecosystem.config.cjs"
NODE="${NODE_BIN:-$(command -v node || true)}"
PM2="${PM2_BIN:-$HOME/.nvm/versions/node/v18.20.8/bin/pm2}"
[ -x "$PM2" ] || PM2="$(command -v pm2 || true)"

if [[ "${1:-}" =~ ^(-h|--help|help)$ ]]; then
  printf '%s\n' \
    "用法：bash _部署方案/start-services.sh" \
    "按 services.json 启动允许自动操作的业务应用和 startWithServices 依赖，并执行端口与健康检查。"
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
if [ -z "$PM2" ] || [ ! -x "$PM2" ]; then
  bad "找不到 pm2；请设置 PM2_BIN 或安装 PM2"
  exit 1
fi
if [ ! -f "$MANIFEST" ]; then
  bad "服务清单不存在：$MANIFEST"
  exit 1
fi
if [ ! -f "$ECOSYSTEM" ]; then
  bad "PM2 清单不存在：$ECOSYSTEM"
  exit 1
fi

export NODE_BIN="$NODE"
export PM2_BIN="$PM2"
export PATH="$(dirname "$NODE"):$(dirname "$PM2"):/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

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
    return 1
  fi
  if [ "$pid_count" -ne 1 ]; then
    bad "$name ($id) :$port -> 监听 PID 数量为 ${pid_count}（${pid_list:-none}），要求恰好 1 个且属于 PM2 进程树 $pm2_pid"
    return 1
  fi
  if ! pid_belongs_to_pm2 "$pids" "$pm2_pid"; then
    bad "$name ($id) :$port -> 监听 PID $pids 不属于 PM2 进程树 $pm2_pid"
    return 1
  fi

  ok "$name ($id) :$port -> 唯一监听 PID ${pids}（PM2 根进程 ${pm2_pid}）"
}

pm2_json="$("$PM2" jlist)"
managed_report="$(printf '%s' "$pm2_json" | "$NODE" -e '
  const fs = require("fs");
  const manifest = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { input += chunk; });
  process.stdin.on("end", () => {
    const current = new Map(JSON.parse(input || "[]").map((item) => [item.name, item.pm2_env?.status || "unknown"]));
    const services = manifest.services.filter((service) =>
      service.kind === "application"
      && !service.protected
      && service.automaticOperations !== false
    );
    for (const service of services) {
      console.log([service.id, service.name, service.pm2Name, current.get(service.pm2Name) || "missing"].join("\t"));
    }
  });
' "$MANIFEST")"

dependency_report="$(printf '%s' "$pm2_json" | "$NODE" -e '
  const fs = require("fs");
  const manifest = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { input += chunk; });
  process.stdin.on("end", () => {
    const current = new Map(JSON.parse(input || "[]").map((item) => [item.name, item.pm2_env?.status || "unknown"]));
    for (const service of manifest.infrastructure.filter((item) => item.startWithServices === true && item.pm2Name)) {
      console.log([service.id, service.name, service.pm2Name, current.get(service.pm2Name) || "missing"].join("\t"));
    }
  });
' "$MANIFEST")"

if [ -z "$managed_report" ]; then
  bad "服务清单中没有允许自动启动的业务应用"
  exit 1
fi

sep "1. 恢复公网服务所需的受管依赖"
failures=0
while IFS=$'\t' read -r id name pm2_name status; do
  [ -n "$id" ] || continue
  if [ "$status" = "online" ]; then
    ok "$name ($id) 已在线，跳过"
  elif [ "$status" = "missing" ]; then
    if "$PM2" startOrRestart "$ECOSYSTEM" --only "$pm2_name" --update-env >/dev/null; then
      ok "$name ($id) 已从 ecosystem 恢复并启动"
    else
      bad "$name ($id) 恢复失败"
      failures=$((failures + 1))
    fi
  elif "$PM2" start "$pm2_name" --update-env >/dev/null; then
    ok "$name ($id) 已从 $status 状态启动"
  else
    bad "$name ($id) 启动失败"
    failures=$((failures + 1))
  fi
done <<< "$dependency_report"

sep "2. 按统一清单启动业务 PM2 进程"
while IFS=$'\t' read -r id name pm2_name status; do
  [ -n "$id" ] || continue
  if [ "$status" = "online" ]; then
    ok "$name ($id) 已在线，跳过"
  elif [ "$status" = "missing" ]; then
    if "$PM2" startOrRestart "$ECOSYSTEM" --only "$pm2_name" --update-env >/dev/null; then
      ok "$name ($id) 已从 ecosystem 恢复并启动"
    else
      bad "$name ($id) 恢复失败"
      failures=$((failures + 1))
    fi
  elif "$PM2" start "$pm2_name" --update-env >/dev/null; then
    ok "$name ($id) 已从 $status 状态启动"
  else
    bad "$name ($id) 启动失败"
    failures=$((failures + 1))
  fi
done <<< "$managed_report"

if [ "$failures" -gt 0 ]; then
  bad "$failures 个 PM2 进程启动失败"
  exit 1
fi
"$PM2" save >/dev/null

sleep 3

sep "3. 校验业务端口唯一归属"
pm2_json="$("$PM2" jlist)"
while IFS=$'\t' read -r id name port pm2_name status pm2_pid; do
  [ -n "$id" ] || continue
  if ! validate_listener "$id" "$name" "$port" "$pm2_name" "$status" "$pm2_pid"; then
    failures=$((failures + 1))
  fi
done < <(printf '%s' "$pm2_json" | "$NODE" -e '
  const fs = require("fs");
  const manifest = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { input += chunk; });
  process.stdin.on("end", () => {
    const current = new Map(JSON.parse(input || "[]").map((item) => [item.name, item]));
    const services = manifest.services.filter((service) =>
      service.kind === "application"
      && !service.protected
      && service.automaticOperations !== false
    );
    for (const service of services) {
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

sep "4. 校验业务应用健康路径"
while IFS=$'\t' read -r id name port health_path allowed; do
  [ -n "$id" ] || continue
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 4 "http://127.0.0.1:$port$health_path" 2>/dev/null || printf '000')"
  case ",$allowed," in
    *",$code,"*) ok "$name ($id) :$port$health_path -> HTTP $code" ;;
    *)
      bad "$name ($id) :$port$health_path -> HTTP ${code}（期望：${allowed}）"
      failures=$((failures + 1))
      ;;
  esac
done < <("$NODE" -e '
  const fs = require("fs");
  const manifest = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  for (const service of manifest.services.filter((item) =>
    item.kind === "application"
    && !item.protected
    && item.automaticOperations !== false
  )) {
    console.log([service.id, service.name, service.port, service.healthPath, service.allowedStatus.join(",")].join("\t"));
  }
' "$MANIFEST")

if [ "$failures" -gt 0 ]; then
  bad "$failures 个业务启动后检查未通过"
  exit 1
fi

ok "全部允许自动操作的业务应用已就绪；受保护、已退出自动操作的服务及基础设施均未操作"
