const byId = id => document.getElementById(id);
let toastTimer;
function toast(message) {
  byId('toast').textContent = message; byId('toast').hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { byId('toast').hidden = true; }, 4200);
}
async function invoke(action, value) {
  try {
    const result = await window.toolbox.invoke(action, value);
    if (!result.ok) toast(result.message);
    return result;
  } catch { toast('操作未完成，请重试'); return { ok: false }; }
}
document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => invoke('service', button.dataset.service)));
for (const action of ['back', 'forward', 'reload', 'browser', 'clear']) byId(action).addEventListener('click', () => invoke(action));
const dialog = byId('invite-dialog');
byId('invite').addEventListener('click', async () => {
  await invoke('overlay', true); dialog.showModal(); byId('invite-value').focus();
});
byId('cancel').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { byId('invite-value').value = ''; void invoke('overlay', false); byId('invite').focus(); });
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
byId('invite-form').addEventListener('submit', async event => {
  event.preventDefault(); const result = await invoke('invite', byId('invite-value').value);
  if (result.ok) dialog.close();
});
window.toolbox.onState(state => {
  document.querySelectorAll('[data-service]').forEach(button => {
    if (button.dataset.service === state.service) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
  });
  byId('back').disabled = !state.canGoBack; byId('forward').disabled = !state.canGoForward;
  byId('version').textContent = `v${state.version}`;
  byId('status').textContent = state.error || (state.loading ? '正在加载…' : '已连接 · home.1008086.xyz');
  byId('reload').setAttribute('aria-label', state.error ? '重新连接' : '刷新');
});
void invoke('state');
