#!/usr/bin/env bash
# 用 Cloudflare API 删除旧 A 记录 + 加 tunnel CNAME
# 用法：
#   CF_API_TOKEN=xxx CF_ZONE_ID=yyy bash cf-fix-dns.sh
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }
ok()  { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }
bad() { printf "  \033[1;31m✗\033[0m %s\n" "$*"; }

[ -z "$CF_API_TOKEN" ] && { bad "缺 CF_API_TOKEN"; exit 1; }
[ -z "$CF_ZONE_ID" ]   && { bad "缺 CF_ZONE_ID"; exit 1; }

TUN_ID="de8aad74-e0df-49f2-84aa-f3dbc100c6a2"
DOMAIN="1008086.xyz"

cf() {
  curl -s -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" "$@"
}

sep "1. 列出 zone 现有所有 A/AAAA/CNAME 记录"
cf "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records?per_page=100" | \
  python3 -c "
import json,sys
d=json.load(sys.stdin)
if not d.get('success'):
    print(' ERROR:', d.get('errors')); sys.exit(1)
for r in d['result']:
    print(f\"  {r['type']:<6} {r['name']:<30} -> {r['content']:<40} id={r['id']}\")
"

sep "2. 删掉 6 个目标子域名的旧 A 记录（保留 notic、blog、nas 等其它）"
for sub in home rights arpu qqtlocal notice qqt; do
  IDS=$(cf "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records?name=${sub}.${DOMAIN}&type=A" | \
    python3 -c "import json,sys; [print(r['id']) for r in json.load(sys.stdin)['result']]" 2>/dev/null)
  for id in $IDS; do
    R=$(cf -X DELETE "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records/$id")
    if echo "$R" | grep -q '"success":true'; then
      ok "删除 ${sub}.${DOMAIN} A 记录 id=$id"
    else
      bad "删除失败 ${sub} id=$id : $R"
    fi
  done
done

sep "3. 给 6 个子域名添加 CNAME 到 tunnel"
for sub in home rights arpu qqtlocal notice qqt; do
  R=$(cf -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records" -d "{
    \"type\":\"CNAME\",
    \"name\":\"${sub}.${DOMAIN}\",
    \"content\":\"${TUN_ID}.cfargotunnel.com\",
    \"proxied\":true,
    \"ttl\":1
  }")
  if echo "$R" | grep -q '"success":true'; then
    ok "添加 CNAME ${sub}.${DOMAIN} -> ${TUN_ID}.cfargotunnel.com (proxied)"
  else
    bad "添加失败 ${sub} : $R"
  fi
done

sep "4. 等 30 秒 让 DNS 生效，外部测试"
sleep 30
for d in home rights arpu qqtlocal notice qqt notic; do
  code=$(curl -4 -s --noproxy '*' -o /dev/null -w '%{http_code}' --max-time 8 http://$d.${DOMAIN}/)
  printf "  %-25s -> %s\n" "$d.${DOMAIN}" "$code"
done

sep "5. 用 check-host 外部多节点测试"
REQ=$(curl -s "https://check-host.net/check-http?host=home.${DOMAIN}&max_nodes=6" -H "Accept: application/json")
ID=$(echo "$REQ" | python3 -c "import json,sys;print(json.load(sys.stdin)['request_id'])" 2>/dev/null)
sleep 8
curl -s "https://check-host.net/check-result/$ID" -H "Accept: application/json" | \
  python3 -c "
import json,sys
d=json.load(sys.stdin)
for node, arr in d.items():
    if arr and arr[0]:
        x = arr[0]
        if isinstance(x, list) and len(x) > 2:
            print(f'  {node:<24}  HTTP {x[2]}  via {x[4] if len(x)>4 else \"?\"}')
        else: print(f'  {node:<24}  {x}')
    else: print(f'  {node:<24}  Timeout/Failed')
" 2>&1
