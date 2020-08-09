import { ipcMain, dialog, app, BrowserWindow, shell } from 'electron'
import path from 'path'
import createMiniWindow from '../windows/miniWindow'
import createUpdateWindow from './../windows/updateWindow'
import { defaultDownloadFolder } from '../../renderer/config/downloadSettings'
let { download } = require('electron-dl')
let downloads = {}
let updateWindow

export default function () {
  ipcMain.on('change-lyric', (event, params) => { // from mainWindow
    // params : { lyric, trans }
    global.lyricWindow.webContents.send('change-lyric', params)
    global.miniWindow.webContents.send('change-lyric', params)
    // global.trayWindow.webContents.send('change-lyric', params)
  })

  ipcMain.on('show-trans', (event, params) => { // from mainWindow
    // params : { value: boolean }
    global.lyricWindow.webContents.send('show-trans', params)
    global.miniWindow.webContents.send('show-trans', params)
    // global.trayWindow.webContents.send('show-trans', params)
  })

  ipcMain.on('change-play-index', (event, params) => { // from mainWindow
    // params : { index: Number }
    // global.lyricWindow.webContents.send('change-play-index', params)
    global.miniWindow.webContents.send('change-play-index', params)
    global.trayWindow.webContents.send('change-play-index', params)
  })

  ipcMain.on('set-muted', (event, params) => { // from mainWindow and trayWindow
    // params : { value: Boolean }
    // global.lyricWindow.webContents.send('set-muted', params)
    // global.miniWindow.webContents.send('set-muted', params)
    global.trayWindow.webContents.send('set-muted', params)
    global.mainWindow.webContents.send('set-muted', params)
  })

  let viewReady = false, miniReady = false, trayReady = false, lyricReady = false
  ipcMain.on('view-ready', (event, params) => { // from mainWindow and trayWindow
    viewReady = true
    if (viewReady && miniReady && trayReady && lyricReady) {
      global.mainWindow.webContents.send('view-ready')
    }
  })

  ipcMain.on('mini-ready', (event, params) => { // from mainWindow and trayWindow
    miniReady = true
    if (viewReady && miniReady && trayReady && lyricReady) {
      global.mainWindow.webContents.send('view-ready')
    }
  })

  ipcMain.on('tray-ready', (event, params) => { // from mainWindow and trayWindow
    trayReady = true
    if (viewReady && miniReady && trayReady && lyricReady) {
      global.mainWindow.webContents.send('view-ready')
    }
  })

  ipcMain.on('lyric-ready', (event, params) => { // from mainWindow and trayWindow
    lyricReady = true
    if (viewReady && miniReady && trayReady && lyricReady) {
      global.mainWindow.webContents.send('view-ready')
    }
  })

  ipcMain.on('set-volume', (event, params) => { // from mainWindow and trayWindow
    // params : { value: Number 0 - 1 }
    // global.lyricWindow.webContents.send('set-volumn', params)
    // global.miniWindow.webContents.send('set-volumn', params)
    global.trayWindow.webContents.send('set-volume', params)
    global.viewWindow.webContents.send('set-volume', params)
    global.mainWindow.webContents.send('set-volume', params)
  })

  ipcMain.on('set-mode', (event, params) => { // from mainWindow and trayWindow
    // params : { value: String }
    // global.lyricWindow.webContents.send('set-volumn', params)
    // global.miniWindow.webContents.send('set-volumn', params)
    global.trayWindow.webContents.send('set-mode', params)
    global.mainWindow.webContents.send('set-mode', params)
  })

  ipcMain.on('set-play-list', (event, params) => { // from mainWindow
    // params : { value: Array }
    // global.lyricWindow.webContents.send('set-play-list', params)
    global.miniWindow.webContents.send('set-play-list', params)
    global.trayWindow.webContents.send('set-play-list', params)
    // global.mainWindow.webContents.send('set-play-list', params)
  })

  ipcMain.on('set-like-song-ids', (event, params) => { // from mainWindow
    // params : { value: Array }
    // global.lyricWindow.webContents.send('set-like-song-ids', params)
    global.miniWindow.webContents.send('set-like-song-ids', params)
    global.trayWindow.webContents.send('set-like-song-ids', params)
    // global.mainWindow.webContents.send('set-like-song-ids', params)
  })

  ipcMain.on('like-song', (event, params) => { // from miniWindow
    // params : { songId, isLike : Boolean }
    global.mainWindow.webContents.send('like-song', params)
  })

  // ipcMain.on('console', (event, params) => { // from lyricWindow
  //   let value = params.value
  //   global.mainWindow.webContents.send('console', {
  //     value
  //   })
  // })

  ipcMain.on('change-color', (event, color) => {
    global.lyricWindow.webContents.send('change-color', {
      color
    })
    global.miniWindow.webContents.send('change-color', {
      color
    })
    global.trayWindow.webContents.send('change-color', {
      color
    })
    global.viewWindow.webContents.send('change-color', {
      color
    })
  })

  ipcMain.on('change-color2', (event, color) => {
    global.viewWindow.webContents.send('change-color', {
      color
    })
  })

  ipcMain.on('resize-mini', (event, params) => {
    let height = params.height
    global.miniWindow.setBounds({ height })
  })

  ipcMain.on('toggle-play', (event, params) => { // from miniWindow and trayWindow
    let value = params.value
    global.mainWindow.webContents.send('toggle-play', {
      value
    })
  })

  ipcMain.on('toggle-play2', (event, params) => {
    let value = params.value
    global.miniWindow.webContents.send('toggle-play2', {
      value
    })
    global.trayWindow.webContents.send('toggle-play2', {
      value
    })
    global.viewWindow.webContents.send('toggle-play2', {
      value
    })
  })

  ipcMain.on('play-song', (event, params) => {
    let value = params.value
    global.mainWindow.webContents.send('play-song', {
      value
    })
  })

  ipcMain.on('prev-play', (event, params) => {
    let value = params.value
    global.mainWindow.webContents.send('prev-play', {
      value
    })
  })

  ipcMain.on('next-play', (event, params) => {
    let value = params.value
    global.mainWindow.webContents.send('next-play', {
      value
    })
  })

  ipcMain.on('toggle-mini', (event, params) => {
    if (params.value) {
      global.miniWindow.show()
      global.mainWindow.hide()
    } else {
      global.miniWindow.hide()
      global.mainWindow.show()
    }
  })

  ipcMain.on('show-window', () => {
    global.mainWindow.show()
  })

  ipcMain.on('window-min', () => {
    global.mainWindow.minimize()
  })

  ipcMain.on('window-max', () => {
    if (global.mainWindow.isMaximized()) {
      global.mainWindow.restore()
    } else {
      global.mainWindow.maximize()
    }
  })

  ipcMain.on('window-close', () => {
    let wins = BrowserWindow.getAllWindows()
    for (let i = 0; i < wins.length; i++) {
      wins[i].close()
    }
  })

  ipcMain.on('app-exit', () => {
    // 所有窗口都将立即被关闭，而不询问用户，而且 before-quit 和 will-quit 事件也不会被触发。
    app.exit()
  })

  ipcMain.on('quit-and-open', (event, data) => {
    global.downloadFile = data
    app.quit()
  })

  ipcMain.on('download-start', (e, args) => {
    let downloadFolder = args.downloadFolder
    let downloadUrl = args.url
    download(global.mainWindow, downloadUrl, {
      filename: args.filename,
      directory: downloadFolder, // 本地若不存在该目录会自动创建
      // saveAs: true
      onStarted (downloadItem) {
        global.mainWindow.webContents.send('download-onStarted', {
          id: args.id,
          song: args.song,
          totalBytes: downloadItem.getTotalBytes()
        })
        downloads[args.id] = downloadItem
      },
      onProgress (progress) {
        global.mainWindow.webContents.send('download-onProgress', {
          id: args.id,
          progress: progress.percent * 100,
          state: downloads[args.id].getState()
        })
      }
    }).then(downloadItem => {
      global.mainWindow.webContents.send('download-success', {
        id: args.id,
        song: args.song,
        downloadFolder,
        downloadUrl
      })
    }).catch(e => {
      global.mainWindow.webContents.send('download-error', {
        id: args.id,
        error: e
      })
    })
  })

  ipcMain.on('download-cancel', (e, data) => {
    let { id } = data
    downloads[id].cancel && downloads[id].cancel()
  })

  ipcMain.on('download-toggle', (e, data) => {
    let { id } = data
    if (downloads[id].isPaused()) {
      downloads[id].resume && downloads[id].resume()
    } else {
      downloads[id].pause && downloads[id].pause()
    }
  })

  ipcMain.on('open-directory-dialog', event => {
    dialog.showOpenDialog(
      {
        defaultPath: defaultDownloadFolder,
        properties: ['openDirectory', 'multiSelections']
        // filters: [
        //   { name: 'Audio', extensions: ['mp3', 'wma'] }
        // ]
      },
      function (files) {
        if (files) {
          event.sender.send('selectedItem', files)
        }
      }
    )
  })

  ipcMain.on('ondragstart', (event, e) => {
    event.sender.startDrag({
      file: 'images/play.png',
      icon: 'images/play.png'
    })
  })

  ipcMain.on('set-tray-title', (event, data) => {
    if (global.tray) {
      global.tray.setToolTip(data)
    }
  })

  ipcMain.once('hide-welcome', () => {
    global.welcomeWindow.hide()
    global.mainWindow.focus()
  })

  ipcMain.once('hide-tray', () => {
    global.trayWindow.hide()
  })

  ipcMain.on('restart', () => {
    app.relaunch()
    app.exit(0)
  })

  ipcMain.on('toggle-desktop-lyric', (event, flag) => { // from mainWindow
    if (flag) {
      global.lyricWindow.showInactive()
    } else {
      global.lyricWindow.hide()
    }
    global.trayWindow.webContents.send('toggle-desktop-lyric', {
      value: flag
    })
  })

  ipcMain.on('toggle-desktop-view', (event, flag) => { // from mainWindow
    if (flag) {
      global.viewWindow.showInactive()
    } else {
      global.viewWindow.hide()
    }
    global.trayWindow.webContents.send('toggle-desktop-view', {
      value: flag
    })
    global.viewWindow.webContents.send('toggle-desktop-view', {
      value: flag
    })
  })

  ipcMain.on('change-source', (event, params) => { // from mainWindow
    // params : { value: String }
    global.viewWindow.webContents.send('change-source', params)
  })

  ipcMain.on('change-media-time', (event, params) => { // from mainWindow
    // params : { value: String }
    global.viewWindow.webContents.send('change-media-time', params)
  })

  ipcMain.on('fix-desktop-lyric', (event, data) => {
    global.lyricWindow.setIgnoreMouseEvents(data, {
      forward: true
    })
  })

  ipcMain.on('fix-desktop-view', (event, data) => { // from trayWindow
    global.viewWindow.setIgnoreMouseEvents(data, {
      forward: true
    })
  })

  ipcMain.on('close-updatewin', (event, data) => {
    updateWindow.close()
    updateWindow = null
  })

  ipcMain.on('toggle-updatewin', (event, data) => {
    if (!updateWindow) {
      updateWindow = createUpdateWindow(BrowserWindow)
      updateWindow.show()
    } else {
      if (updateWindow.isVisible()) {
        updateWindow.minimize()
      } else {
        updateWindow.show()
      }
    }
  })

  ipcMain.on('update-version', (event, data) => {
    let version = data
    global.remoteVersion = version
  })
}
