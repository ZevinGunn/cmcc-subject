const api = require('../../utils/api');
Page({
  data: { mode: 'link', link: '', username: '', password: '', agreed: false, busy: false },
  switchMode(event) { if (!this.data.busy) this.setData({ mode: event.currentTarget.dataset.mode }); },
  input(event) { const field = event.currentTarget.dataset.field; if (['link', 'username', 'password'].includes(field)) this.setData({ [field]: event.detail.value }); },
  consent(event) { this.setData({ agreed: event.detail.value.indexOf('agreed') !== -1 }); },
  privacy() { wx.showModal({ title: '隐私说明', content: '登录信息通过 HTTPS 发往 home.1008086.xyz，用于访问你的站点账号。小程序仅保存站点会话，不保存密码或移动、星巴克原始 CK。账号和卡券由现有服务端管理。可在“我的”退出登录；删除服务端账号请使用站点账号管理。', showCancel: false }); },
  async login() {
    if (this.data.busy || !this.data.agreed) return;
    this.setData({ busy: true });
    try {
      const isLink = this.data.mode === 'link';
      const data = isLink ? { link: api.invitation(this.data.link) } : { username: this.data.username.trim(), password: this.data.password };
      const result = await api.request(isLink ? '/api/auth/link-login' : '/api/auth/login', { method: 'POST', data });
      if (!api.session()) throw new Error('未收到登录凭证，请检查服务端与小程序域名配置');
      getApp().globalData.user = result.user;
      this.setData({ password: '', link: '' });
      wx.switchTab({ url: '/pages/accounts/index' });
    } catch (error) { api.showError(error); } finally { this.setData({ busy: false }); }
  },
  onUnload() { this.data.password = ''; this.data.link = ''; }
});
