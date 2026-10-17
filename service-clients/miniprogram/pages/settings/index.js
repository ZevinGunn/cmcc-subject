const api = require('../../utils/api');
Page({
  data: { name: '尚未登录', permissions: [], busy: false },
  async onShow() {
    if (!api.session()) { this.setData({ name: '尚未登录', permissions: [] }); return; }
    try {
      const data = await api.request('/api/auth/me'); getApp().globalData.user = data.user;
      const names = { businessQuery: '退订与撤回', shopQuery: '商城查询', businessOrder: '业务订购', benefitActivity: '权益活动' };
      this.setData({ name: data.user.displayName || data.user.username, permissions: Object.keys(names).map(key => ({ name: names[key], enabled: Boolean(data.user.permissions && data.user.permissions[key]) })) });
    } catch (error) { api.showError(error); if (!api.session()) this.setData({ name: '登录已过期', permissions: [] }); }
  },
  privacy() { wx.showModal({ title: '隐私与数据', content: '小程序通过 HTTPS 访问 home.1008086.xyz。仅在本机保存站点登录会话，不保存密码、移动 CK、星巴克 CK 或卡券明文券码。卡券内容仅在当前页面内存中展示，复制操作由你触发。退出登录清除本地会话；服务端账号数据请在站点账号管理中删除。', showCancel: false }); },
  async logout() {
    if (this.data.busy) return;
    wx.showModal({ title: '退出登录', content: '退出当前站点账号？', success: async result => {
      if (!result.confirm) return;
      this.setData({ busy: true });
      try { if (api.session()) await api.request('/api/auth/logout', { method: 'POST', data: {} }); }
      catch (error) { api.showError(error); }
      finally { api.clearSession(); this.setData({ busy: false, name: '尚未登录', permissions: [] }); wx.switchTab({ url: '/pages/accounts/index' }); }
    } });
  }
});
