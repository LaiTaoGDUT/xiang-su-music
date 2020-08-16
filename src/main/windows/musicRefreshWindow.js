import { LOAD_URL } from './../config'
const electron = require('electron')

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#music-refresh`
  : `${LOAD_URL}#music-refresh`

const createMusicRefreshWindow = function (BrowserWindow) {
  const obj = {
    width: 0,
    height: 0,
    show: false,
    frame: false,
    fullscreenable: false,
    minimizable: false,
    maximizable: false,
    skipTaskbar: true, // 任务栏中不显示窗口
    closable: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      backgroundThrottling: false,
      devTools: false,
      webSecurity: false
    }
  }

  let musicRefreshWindow = new BrowserWindow(obj)

  musicRefreshWindow.loadURL(winURL)

  return musicRefreshWindow
}
export default createMusicRefreshWindow
