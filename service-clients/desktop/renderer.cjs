const byId = id => document.getElementById(id);
let toastTimer, services = [], groups = [], currentService = 'mobile';
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
function renderTools() {
  const query = byId('tool-search').value.trim().toLowerCase();
  byId('tools').replaceChildren(); let count = 0;
  for (const group of groups) {
    const matches = services.filter(item => item.group === group && `${item.name} ${item.description} ${item.url} ${group}`.toLowerCase().includes(query));
    if (!matches.length) continue;
    const section = document.createElement('section'), heading = document.createElement('h2');
    heading.textContent = group; section.append(heading);
    for (const service of matches) {
      const button = document.createElement('button'), name = document.createElement('strong'), detail = document.createElement('small');
      button.className = 'tool'; button.dataset.service = service.id; button.title = service.url;
      button.setAttribute('aria-label', service.name);
      if (service.id === currentService) button.setAttribute('aria-current', 'page');
      name.textContent = service.name; detail.textContent = service.description; button.append(name, detail);
      button.addEventListener('click', () => invoke('service', service.id)); section.append(button); count++;
    }
    byId('tools').append(section);
  }
  byId('tool-count').textContent = query ? `${count} / ${services.length}` : String(services.length);
  byId('no-results').hidden = count !== 0;
}
byId('tool-search').addEventListener('input', renderTools);
for (const action of ['back', 'forward', 'reload', 'browser', 'clear', 'home']) byId(action).addEventListener('click', () => invoke(action));
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
  currentService = state.service;
  document.querySelectorAll('[data-service]').forEach(button => {
    if (button.dataset.service === state.service) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
  });
  byId('back').disabled = !state.canGoBack; byId('forward').disabled = !state.canGoForward;
  byId('version').textContent = `v${state.version}`;
  byId('current-tool').textContent = services.find(item => item.id === currentService)?.name || '随行工具箱';
  let host = ''; try { host = new URL(state.url).host; } catch { /* 正在初始化 */ }
  byId('status').textContent = state.error || (state.loading ? '正在加载…' : `已连接${host ? ' · ' + host : ''}`);
  byId('reload').setAttribute('aria-label', state.error ? '重新连接' : '刷新');
});
void invoke('state').then(result => {
  if (!result.ok) return;
  services = result.services; groups = result.groups; renderTools();
  byId('current-tool').textContent = services.find(item => item.id === currentService)?.name || '随行工具箱';
});
