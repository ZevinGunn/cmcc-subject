const api = require('../../utils/api');
Page({
  data: { authenticated: false, busy: false, accounts: [], coupons: [], categories: ['全部类型'], categoryIndex: 0, keyword: '', loginOpen: false, phone: '', pin: '', cooldown: 0 },
  onShow() { this.setData({ authenticated: Boolean(api.session()) }); if (api.session()) this.reload(); else this.apply({ accounts: [] }); this.tick(); },
  login() { api.requireLogin(); },
  noop() {},
  async reload() {
    if (this.data.busy || !api.requireLogin()) return;
    this.setData({ busy: true });
    try { this.apply(await api.request('/api/starbucks/state')); }
    catch (error) { api.showError(error); if (!api.session()) { this.apply({ accounts: [] }); this.setData({ authenticated: false }); } }
    finally { this.setData({ busy: false }); wx.stopPullDownRefresh(); }
  },
  onPullDownRefresh() { this.reload(); if (!api.session()) wx.stopPullDownRefresh(); },
  apply(state) {
    const previous = this.data.categories[this.data.categoryIndex];
    const categories = ['全部类型'].concat(Array.from(new Set((state.accounts || []).reduce((all, account) => all.concat((account.coupons || []).map(item => item.title)), []))).sort());
    this.setData({ accounts: state.accounts || [], categories, categoryIndex: Math.max(0, categories.indexOf(previous)) }); this.filter();
  },
  category(event) { this.setData({ categoryIndex: Number(event.detail.value) }); this.filter(); },
  search(event) { this.setData({ keyword: event.detail.value }); this.filter(); },
  filter() {
    const category = this.data.categories[this.data.categoryIndex], keyword = this.data.keyword.trim(), now = Date.now();
    const coupons = [];
    for (const account of this.data.accounts) for (const coupon of account.coupons || []) {
      if (coupon.status !== 'active' || (coupon.expiresAt !== null && coupon.expiresAt <= now)) continue;
      if (category !== '全部类型' && coupon.title !== category) continue;
      if (keyword && `${account.phoneMasked} ${coupon.title}`.indexOf(keyword) === -1) continue;
      coupons.push(Object.assign({}, coupon, { key: `${account.id}:${coupon.id}`, accountId: account.id, phoneMasked: account.phoneMasked, invalidAt: account.invalidAt }));
    }
    this.setData({ coupons });
  },
  copyOne(event) { const item = this.data.coupons.find(coupon => coupon.key === event.currentTarget.dataset.key); if (item) this.copy([item]); },
  copyAll() { this.copy(this.data.coupons.filter(item => item.codeAvailable && !item.invalidAt)); },
  async copy(items) {
    if (this.data.busy || !items.length) return;
    this.setData({ busy: true });
    try {
      const groups = new Map(), codes = [];
      items.forEach(item => { if (!groups.has(item.accountId)) groups.set(item.accountId, []); groups.get(item.accountId).push(item.id); });
      // 每个号码串行查询，任一失败不复制不完整结果，不把券码写入持久化存储。
      for (const [id, ids] of groups) {
        const data = await api.request(`/api/starbucks/accounts/${encodeURIComponent(id)}/codes`, { method: 'POST', data: { ids, activeOnly: true } }); codes.push(...data.codes);
      }
      const types = new Map(); codes.forEach(code => { if (!types.has(code.title)) types.set(code.title, []); types.get(code.title).push(code); });
      const text = Array.from(types.entries()).sort((a,b) => a[0].localeCompare(b[0])).map(([name, rows]) => `${name} × ${rows.length}\n${rows.map(row => `${row.phoneMasked}｜${row.code}｜${row.expiryText || '有效期未知'}`).join('\n')}`).join('\n\n');
      await new Promise((resolve,reject) => wx.setClipboardData({ data: text, success: resolve, fail: reject }));
    } catch (error) { api.showError(error); } finally { this.setData({ busy: false }); }
  },
  openLogin() { if (!this.data.busy) this.setData({ loginOpen: true }); },
  closeLogin() { if (!this.data.busy) this.setData({ loginOpen: false, pin: '' }); },
  phoneInput(event) { this.setData({ phone: event.detail.value }); },
  pinInput(event) { this.setData({ pin: event.detail.value }); },
  phone() { const value = this.data.phone.replace(/[\s\u200b-\u200d\ufeff]/g, '').replace(/^\+?86/, ''); if (!/^1\d{10}$/.test(value)) throw new Error('请输入正确的 11 位手机号'); return value; },
  tick() { clearInterval(this.timer); const update = () => this.setData({ cooldown: Math.max(0, Math.ceil(((this.smsUntil || 0) - Date.now()) / 1000)) }); update(); if (this.data.cooldown) this.timer = setInterval(() => { update(); if (!this.data.cooldown) clearInterval(this.timer); }, 1000); },
  async sms() {
    if (this.data.busy || this.data.cooldown) return;
    this.setData({ busy: true });
    try { const data = await api.request('/api/starbucks/auth/sms', { method: 'POST', data: { phone: this.phone() } }); this.smsUntil = Date.now() + (data.cooldownSeconds || 60) * 1000; this.tick(); wx.showToast({ title: '验证码已发送', icon: 'success' }); }
    catch (error) { api.showError(error); } finally { this.setData({ busy: false }); }
  },
  async submitLogin() {
    if (this.data.busy) return;
    this.setData({ busy: true });
    try {
      const pin = this.data.pin.trim(); if (!/^\d{4}$/.test(pin)) throw new Error('请输入 4 位验证码');
      const data = await api.request('/api/starbucks/auth/login', { method: 'POST', data: { phone: this.phone(), pin } });
      this.apply(data); this.setData({ loginOpen: false, phone: '', pin: '' });
      if (data.warning) api.showError(new Error(data.warning));
    } catch (error) { api.showError(error); } finally { this.setData({ busy: false }); }
  },
  onHide() { clearInterval(this.timer); },
  onUnload() { clearInterval(this.timer); this.data.phone = ''; this.data.pin = ''; }
});
