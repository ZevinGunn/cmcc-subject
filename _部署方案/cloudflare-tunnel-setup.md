# Cloudflare Tunnel 上线指引（10 分钟）

> 目标：让 6 个 `*.1008086.xyz` 域名通过 Cloudflare 边缘网络对外访问。
> 你的 Mac 主动连出去到 Cloudflare 边缘节点，外部用户访问域名就走 Cloudflare → tunnel → 你 Mac 的 nginx。

## A. Cloudflare 账号 + 域名托管

### A1. 注册 Cloudflare 账号

打开 https://dash.cloudflare.com/sign-up 注册（用邮箱即可，不需要付费计划，免费 plan 完全够用）。

### A2. 把 1008086.xyz 加到 Cloudflare

1. 登录 dashboard 后，点击 **"Add a Site"**
2. 输入 `1008086.xyz`，选择 **Free** 计划
3. Cloudflare 会扫描现有 DNS 记录（你阿里云那些 A 记录会被自动检测出来）
4. 在下一步 Cloudflare 会给你 **2 个 Nameservers**，比如：
   - `xxx.ns.cloudflare.com`
   - `yyy.ns.cloudflare.com`
5. **去阿里云万网控制台**：域名列表 → 1008086.xyz → "DNS 修改"
   - 把 NS 改成 Cloudflare 给的两个 nameserver
   - **同时把阿里云那边的 A 记录全部删除**（避免你 ddns-go 继续同步）

### A3. 等 NS 生效（5-30 分钟）

Cloudflare 检测到 NS 切换成功后会发邮件通知。在此之前也能继续配置。

---

## B. Mac 装 cloudflared 并配置 Tunnel

下面这条脚本会自动完成 B 段所有步骤：

```bash
bash ~/CMCC-PROJECT/_部署方案/cloudflared-setup.sh
```

它会：
1. `brew install cloudflared`
2. `cloudflared tunnel login` —— 浏览器跳出 Cloudflare 授权页，你点 Authorize 即可
3. 创建一个 tunnel 叫 `cmcc-home`
4. 写 `~/.cloudflared/config.yml`，把 6 个子域名都路由到本地 nginx (`http://localhost:80`)
5. 用 `cloudflared tunnel route dns` 给每个域名加 CNAME 到 tunnel
6. 安装为 launchd 服务，开机自启

---

## C. 验证

```
# 本机 cloudflared 日志
launchctl print system/com.cloudflare.cloudflared

# 外部访问（手机 4G）
打开 http://home.1008086.xyz/  应该直接通

# 用 check-host.net 测多节点
https://check-host.net/check-http?host=home.1008086.xyz
应该看到大部分海外节点 OK
```

---

## D. 如果想保留阿里云解析不切 NS

Cloudflare Tunnel 也支持 **partial CNAME** 模式：
- 不切 NS
- 在阿里云为每个子域名设 CNAME 到 `<tunnel-id>.cfargotunnel.com`

但这需要你 Cloudflare 套餐升级到 Business（贵），免费 plan 必须切 NS。

---

## E. 退路

Cloudflare 不能用了，随时可以：
- 阿里云重新加 A 记录指回 ddns-go 那个公网 IP
- 把 `cmcc.conf` 改回 IPv4 直连模式

Cloudflared 在本地是独立进程，不会影响 nginx / pm2。
