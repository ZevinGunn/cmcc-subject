const api = require('../../utils/api');
Page({
  data: { authenticated: false, accounts: [], filtered: [], keyword: '', busy: false, updatedText: '' },
  onShow() { this.setData({ authenticated: Boolean(api.session()) }); if (api.session()) this.reload(); else this.setData({ accounts: [], filtered: [] }); },
  login() { api.requireLogin(); },
  async reload() {
    if (this.data.busy || !api.requireLogin()) return;
    this.setData({ busy: true });
    try {
      const data = await api.request('/api/auth/bootstrap'); getApp().globalData.user = data.user;
      const accounts = (data.accounts || []).map(item => Object.assign({}, item, {
        cloudValid: Boolean(item.hasYunpanSession && !item.yunpanSessionInvalidAt),
        cloudText: item.hasYunpanSession ? (item.yunpanSessionInvalidAt ? '云盘需补登' : '云盘已保存') : '未登录云盘',
        mobileText: item.hasCookie ? (item.cookieInvalidAt ? '需补登' : '已保存') : '未登录'
      }));
      this.setData({ accounts, authenticated: true, updatedText: new Date().toLocaleTimeString() }); this.filter();
    } catch (error) { api.showError(error); if (!api.session()) this.setData({ authenticated: false, accounts: [], filtered: [] }); }
    finally { this.setData({ busy: false }); wx.stopPullDownRefresh(); }
  },
  onPullDownRefresh() { this.reload(); if (!api.session()) wx.stopPullDownRefresh(); },
  search(event) { this.setData({ keyword: event.detail.value }); this.filter(); },
  filter() { const q = this.data.keyword.trim(); this.setData({ filtered: this.data.accounts.filter(item => [item.displayPhone, item.phoneMasked, item.label].some(value => String(value || '').indexOf(q) !== -1)) }); },
  detail(event) {
    const item = this.data.accounts.find(account => account.id === event.currentTarget.dataset.id);
    if (!item) return;
    wx.showModal({ title: item.displayPhone || item.phoneMasked, content: [item.label || '', item.cloudText, `10086：${item.mobileText}`, `全球通：${item.qqtAccessTokenCheckedAt ? '已获取凭证' : '尚未获取'}`, `更新：${item.updatedAt || '未知'}`].filter(Boolean).join('\n'), showCancel: false });
  }
});
