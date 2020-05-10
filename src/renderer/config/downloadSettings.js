const { remote } = require('electron')
console.log('remote', remote)
export const defaultDownloadFolder = 'C:\\CloudMusicDownload'   //音乐的下载路径
// `${remote.app.getPath('music')}\\CloudMusicDownload`
