const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('toolbox', Object.freeze({
  invoke: (action, value) => ipcRenderer.invoke('toolbox:action', action, value),
  onState: callback => {
    const listener = (_event, state) => callback(state);
    ipcRenderer.on('toolbox:state', listener);
    return () => ipcRenderer.removeListener('toolbox:state', listener);
  }
}));
