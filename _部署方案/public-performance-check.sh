#!/usr/bin/env bash
# Read-only public baseline: homepage timing, health status, edge location and cache state.
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$ROOT/project-manager/services.json"
NODE="${NODE_BIN:-$(command -v node || true)}"
SAMPLES="${SAMPLES:-3}"
MAX_TIME="${MAX_TIME:-20}"

ok()   { printf "  \033[1;32mOK\033[0m %s\n" "$*"; }
warn() { printf "  \033[1;33mWARN\033[0m %s\n" "$*"; }
bad()  { printf "  \033[1;31mFAIL\033[0m %s\n" "$*" >&2; }

if [[ "${1:-}" =~ ^(-h|--help|help)$ ]]; then
  printf '%s\n' \
    "Usage: SAMPLES=3 MAX_TIME=20 bash _部署方案/public-performance-check.sh" \
    "Runs read-only homepage and health checks for every public domain in services.json."
  exit 0
fi
if [ "$#" -gt 0 ]; then
  bad "unknown argument: $1"
  exit 2
fi
if ! [[ "$SAMPLES" =~ ^[1-9]$ ]]; then
  bad "SAMPLES must be an integer from 1 to 9"
  exit 2
fi
if [ -z "$NODE" ] || [ ! -x "$NODE" ] || [ ! -f "$MANIFEST" ]; then
  bad "node or services.json is unavailable"
  exit 1
fi

tmp_dir=$(mktemp -d /private/tmp/cmcc-public-performance.XXXXXX)
trap 'rm -rf "$tmp_dir"' EXIT
failures=0

median_column() {
  local file="$1"
  local column="$2"
  awk -v column="$column" 'NF >= column { print $column }' "$file" \
    | sort -n \
    | awk '{ value[NR]=$1 } END { if (NR) printf "%.3f", value[int((NR+1)/2)] }'
}

services=$($NODE - "$MANIFEST" <<'NODE'
const fs = require('fs');
const manifest = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const service of manifest.services) {
  if (service.exposure !== 'public') continue;
  for (const domain of service.domains || []) {
    console.log([service.id, domain, service.healthPath || '/', (service.allowedStatus || [200]).join(',')].join('\t'));
  }
}
NODE
)

printf '%-12s %-29s %6s %7s %7s %7s %7s %-5s %-8s\n' \
  "SERVICE" "DOMAIN" "HTTP" "DNS" "TLS" "TTFB" "TOTAL" "EDGE" "CACHE"
printf '%-12s %-29s %6s %7s %7s %7s %7s %-5s %-8s\n' \
  "------------" "-----------------------------" "------" "-------" "-------" "-------" "-------" "-----" "--------"

while IFS=$'\t' read -r service domain health_path allowed; do
  [ -n "$domain" ] || continue
  sample_file="$tmp_dir/${service}-${domain}.tsv"
  header_file="$tmp_dir/${service}-${domain}.headers"
  : > "$sample_file"

  health_code=$(curl -sS --compressed --max-time "$MAX_TIME" -o /dev/null -w '%{http_code}' "https://$domain$health_path") || health_code="000"
  for _sample in $(seq 1 "$SAMPLES"); do
    curl -sS --compressed --max-time "$MAX_TIME" -D "$header_file" -o /dev/null \
      -w '%{http_code}\t%{time_namelookup}\t%{time_connect}\t%{time_appconnect}\t%{time_starttransfer}\t%{time_total}\n' \
      "https://$domain/" >> "$sample_file" || printf '000\t0\t0\t0\t0\t0\n' >> "$sample_file"
  done

  page_code=$(awk 'NR==1 { print $1 }' "$sample_file")
  dns=$(median_column "$sample_file" 2)
  tls=$(median_column "$sample_file" 4)
  ttfb=$(median_column "$sample_file" 5)
  total=$(median_column "$sample_file" 6)
  edge=$(awk 'BEGIN{IGNORECASE=1} /^cf-ray:/ { value=$2 } END { sub(/.*-/, "", value); gsub(/\r/, "", value); print value }' "$header_file")
  cache=$(awk 'BEGIN{IGNORECASE=1} /^cf-cache-status:/ { value=$2 } END { gsub(/\r/, "", value); print value }' "$header_file")

  printf '%-12s %-29s %6s %7s %7s %7s %7s %-5s %-8s\n' \
    "$service" "$domain" "$page_code" "${dns:-?}" "${tls:-?}" "${ttfb:-?}" "${total:-?}" "${edge:--}" "${cache:--}"

  case ",$allowed," in
    *",$health_code,"*) : ;;
    *) bad "$domain$health_path returned HTTP $health_code; expected $allowed"; failures=$((failures + 1)) ;;
  esac
  if [ "$page_code" = "000" ] || [ "$page_code" -ge 500 ] 2>/dev/null; then
    bad "$domain homepage returned HTTP $page_code"
    failures=$((failures + 1))
  fi
  if awk -v value="${ttfb:-0}" 'BEGIN { exit !(value > 1.5) }'; then
    warn "$domain median TTFB ${ttfb}s exceeds 1.5s"
  fi
done <<< "$services"

if [ "$failures" -gt 0 ]; then
  bad "$failures availability check(s) failed"
  exit 1
fi
ok "all public health checks passed; timing warnings are observational"
