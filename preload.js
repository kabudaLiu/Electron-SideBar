const { contextBridge, ipcRenderer,remote } = require('electron/renderer');
// const {  remote } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  showWin: (title) => ipcRenderer.send('show-win', title),
  mouseAcross:(title) => ipcRenderer.send('mouse-across', title),
});
