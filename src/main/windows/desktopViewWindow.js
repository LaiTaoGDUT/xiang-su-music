const electron = require('electron')
import { LOAD_URL } from './../config'
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#desktop-view`
  : `${LOAD_URL}#desktop-view`

const createViewWindow = function (BrowserWindow) {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  const obj = {
    minWidth: 700,
    width: 700,
    height: 132,
    show: false,
    frame: false,
    x: width / 2 - 350,
    y: height - 150,
    fullscreenable: false,
    minimizable: false,
    maximizable: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true, // 任务栏中不显示窗口
    closable: false,
    // parent: global.mainWindow,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      backgroundThrottling: false,
      devTools: false,
      webSecurity: false
    }
  }

  let viewWindow = new BrowserWindow(obj)

  viewWindow.loadURL(winURL)
  // lyricWindow.setIgnoreMouseEvents(true)

  return viewWindow
}
export default createViewWindow