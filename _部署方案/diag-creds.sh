#!/usr/bin/env bash
ROOT="$HOME/CMCC-PROJECT/免登录进入全球通/cookie-app"
sep() { printf "\n\033[1;36m===== %s =====\033[0m\n" "$*"; }

sep "deriveCredentialsDatabaseUrl 函数完整实现"
sed -n '50,75p' "$ROOT/api/services/runtimeConfig.ts"

sep "credentials prisma client 用法（看哪里实例化）"
grep -rn "credentialsDatabaseUrl\|CREDENTIALS_DATABASE_URL\|credentialsPrisma" "$ROOT/api" 2>/dev/null | head -20

sep "PG 里 cmcc_credentials 的表列表（看是否已迁移）"
docker exec cmcc-cookie-app-postgres psql -U cmcc_user -d cmcc_credentials -c "\dt" 2>&1 | head -30

sep "从 .env 取出 DATABASE_URL 实际派生出来的 credentials URL（让 node 来跑 derive）"
cd "$ROOT"
node --no-warnings -e "
import('dotenv').then(d => {
  d.config({path:'.env.production'});
  d.config({path:'.env'});
  return import('./api/services/runtimeConfig.ts');
}).then(m => {
  const u = process.env.DATABASE_URL;
  const c = m.deriveCredentialsDatabaseUrl(u);
  // 脱敏打印
  const mask = s => s ? s.replace(/:[^:@]*@/, ':<PWD>@') : '<empty>';
  console.log('DATABASE_URL            =', mask(u));
  console.log('CREDENTIALS_DATABASE_URL=', mask(c));
}).catch(e => console.error(e.message));
" 2>&1 | tail -10
