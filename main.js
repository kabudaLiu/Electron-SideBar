const { app, BrowserWindow,screen  } = require('electron')
const { ipcMain } = require('electron');
// 在你文件顶部导入 Node.js 的 path 模块
const path = require('node:path')
// // 第一步：引入remote
// const remote = require('@electron/remote/main');
// // 第二步： 初始化remote
// remote.initialize();
const createWindow = () => {
    // 获取主屏幕的大小
    const mainScreen = screen.getPrimaryDisplay();
    const dimensions = mainScreen.size;

// 获取任务栏的高度
const allDisplays = screen.getAllDisplays();
const primaryDisplay = allDisplays.find(display => display.id === mainScreen.id);
const taskbarHeight = primaryDisplay.bounds.height - primaryDisplay.workAreaSize.height;

// 在主屏幕高度中减去任务栏高度
const screenHeightWithoutTaskbar = dimensions.height - taskbarHeight;

// window?.canvansWidth=dimensions.width
// window?.canvansHeight=screenHeightWithoutTaskbar

  win = new BrowserWindow({
    width: dimensions.width,
    height: screenHeightWithoutTaskbar,
  
    show: false
  });
  // win.loadURL('http://localhost:5174/');


  const sidebarWindow  = new BrowserWindow({
    width: dimensions.width,
    height:screenHeightWithoutTaskbar,
    frame: false, // 设置为 false 隐藏标题栏包括放大缩小按钮
    transparent: true, // 设置窗口为透明,在Windows上，仅在无边框窗口下起作用。
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    
    },
    parent: win,
  })
   // 当打开开发者工具时，窗口将不透明。
  // sidebarWindow.webContents.openDevTools()
  // 透明时，设置窗口穿透，鼠标事件穿透窗口

  // sidebarWindow .setIgnoreMouseEvents(true, { forward: true })
  // sidebarWindow .loadURL('http://localhost:5173/');
  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (isDevelopment) {
    // 开发环境下的代码
    console.log('当前是开发环境');
    win.loadURL('http://localhost:5174/');
  sidebarWindow .loadURL('http://localhost:5173/');

  } else {
    // 生产环境下的代码
    console.log('当前是生产环境');
    win.loadFile(path.join(__dirname, '1/dist/index.html'))
  
  sidebarWindow .loadFile( path.join(__dirname, 'dist/index.html'));

  }
    // 通过 IPC 通信，在主窗口中控制侧边栏的显示与隐藏
    ipcMain.on('show-win', () => {
      console.log(win.isVisible(),1111)
      if (win.isVisible()) {
        win.hide();
      } else {
        win.show();
      }
    });
    
ipcMain.on('mouse-across', (event,bool,options) => {

 
   sidebarWindow .setIgnoreMouseEvents(bool, options)
 
});
// 第三步： 开启remote服务
// remote.enable(sidebarWindow.webContents);
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