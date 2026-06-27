#!/usr/bin/env bash
# 用 check-host.net API 真的从外部测试
set +e
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }

PUB4=$(curl -4 -s --noproxy '*' --max-time 5 https://ipv4.icanhazip.com | tr -d ' \r\n')
echo "当前 Mac 出口 IPv4 = $PUB4"

sep "1. 用 check-host.net 真外部多节点测 home.1008086.xyz"
echo "  提交请求..."
REQ=$(curl -s "https://check-host.net/check-http?host=home.1008086.xyz&max_nodes=8" \
  -H "Accept: application/json")
ID=$(echo "$REQ" | python3 -c "import json,sys;print(json.load(sys.stdin)['request_id'])" 2>/dev/null)
if [ -z "$ID" ]; then echo "  check-host 提交失败: $REQ"; exit; fi
echo "  request_id=$ID"
sleep 8
RES=$(curl -s "https://check-host.net/check-result/$ID" -H "Accept: application/json")
echo "$RES" | python3 -c "
import json,sys
d = json.load(sys.stdin)
print('  节点                结果')
print('  ' + '-'*60)
for node, arr in d.items():
    if arr is None: status='Pending'
    elif arr and arr[0]: 
        x = arr[0]
        # [success, time, status_code, response_body, ip, ...]
        if isinstance(x, list) and len(x) > 2:
            status = f'OK HTTP {x[2]}  via {x[4] if len(x)>4 else \"?\"}'
        else: status = str(x)
    else: status = 'Timeout/Failed'
    print(f'  {node:<18}  {status}')
" 2>&1

sep "2. DNS TTL"
for d in home rights; do
  ttl=$(dig +noall +answer $d.1008086.xyz | awk '{print $2}' | head -1)
  printf "  %-25s TTL=%s 秒\n" "$d.1008086.xyz" "$ttl"
done
echo "  -> 600 秒 (10 分钟) 偏长，建议改 60-120 秒，让 IP 漂移时新值更快生效"

sep "3. ddns-go 真在同步吗？"
echo "  浏览器打开：http://127.0.0.1:9876"
echo "  应该能看到所有 A 记录都是 $PUB4，且'更新时间'是最近"
