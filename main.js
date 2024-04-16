const { app, BrowserWindow,screen  } = require('electron')
const { ipcMain } = require('electron');
// 在你文件顶部导入 Node.js 的 path 模块
const path = require('node:path')
const createWindow = () => {
    // 获取主屏幕的大小
    const mainScreen = screen.getPrimaryDisplay();
    const dimensions = mainScreen.size;
  const sidebarWindow  = new BrowserWindow({
    width: dimensions.width,
    height: dimensions.height,
    frame: false, // 设置为 false 隐藏标题栏包括放大缩小按钮
    transparent: true, // 设置窗口为透明,在Windows上，仅在无边框窗口下起作用。
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  sidebarWindow .setIgnoreMouseEvents(true); // 透明时，设置窗口穿透，鼠标事件穿透窗口
  sidebarWindow .loadURL('http://localhost:5174/');


  win = new BrowserWindow({
    width: dimensions.width,
    height: dimensions.height,
    parent: sidebarWindow,
    show: false
  });
  win .loadURL('http://localhost:5173/');
    // 通过 IPC 通信，在主窗口中控制侧边栏的显示与隐藏
    ipcMain.on('toggleSidebar', () => {
      if (win.isVisible()) {
        win.hide();
      } else {
        win.show();
      }
    });

}
app.whenReady().then(() => {
  createWindow()
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
app.whenReady().then(() => {
 
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 采用第一种方法。但是将侧边栏当作主窗口去控制副窗口的显示。并且帮我用vue在主窗口得filepath中实现一个底部侧边栏