const { contextBridge, ipcRenderer,remote } = require('electron/renderer');
// const {  remote } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  showWin: () => ipcRenderer.send('show-win', ),
  mouseAcross:(bool,options) => {
    ipcRenderer.send('mouse-across', bool,options)},
});
