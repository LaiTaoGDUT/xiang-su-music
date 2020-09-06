# xiang-su-music

> 像素音乐

<!-- <p align="center">
  <img src="https://github.com/xiaozhu188/electron-vue-cloud-music/blob/master/docs/images/logo.png" width="120">
</p> -->
## install
`npm install`

项目后台未部署到服务器，运行项目需要安装依赖[像素音乐聚合API](https://github.com/xiangSuMusic)

## 下一步
* 本地音乐按歌手，专辑等分类查看功能
* 专辑详情页增加专辑付费信息与购买
* 本地歌单功能，支持不同平台歌曲加入本地歌单

## BUG
* ~~播放本地音乐时下载歌曲成功将切换正在播放的音乐~~
* ~~使用下载全部功能时不会排除列表中已包含在本地音乐中的歌曲~~

## 特点
* 歌词滚动，翻译切换
![player](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/player.png)
* 桌面歌词与桌面动效
![desktop](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/desktopLyric.png)
* 多种音乐动效
![view1](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/view1.png)
![view2](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/view2.png)
![view3](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/view3.png)
![view4](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/view4.png)
* 本地音乐匹配
![match](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/match.png)
* 匹配QQ音乐的歌
![qqMusic](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/qqMusic.png)
* 评论功能表情
![emoji](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/emoji.png)
* 聚合网易云与QQ音乐搜索
![search](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/search.png)
* 暗黑模式皮肤
![darkTheme](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/darkTheme.png)
![darkTheme2](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/darkTheme2.png)
* mini模式

![mini](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/mini.png)

![mini2](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/mini2.png)
* 托盘菜单

![tray](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/tray.png)
* 还有......

## 版本更新
* 0.3.3 优化歌曲搜索功能，更新若干样式，更新暗黑模式皮肤（不仅仅是换色）
* 0.3.2 修复若干问题，私人FM支持垃圾桶功能，支持给删除当前播放列表中的歌曲，支持在音乐详情页跳转至MV播放
* 0.3.1 接入QQ音乐，支持QQ音乐的接口：歌曲，歌单，专辑，MV，歌手，以及以上各项的搜索，不支持通过登录获取QQ音乐的用户信息，修复接口升级后MV无法获取链接的问题，现在可以正常播放登录用户购买的专辑内歌曲
* 0.2.4 评论区现在可以正确显示表情，歌单现在可以完整显示所有音乐，修复部分歌曲歌词无法显示的问题,现在在任何地方播放本地音乐列表或下载列表中存在的歌曲时，无需加载来自网络上的资源
* 0.2.3 修复下载歌曲时无法完整显示下载队列的问题，现在可以删除等待下载的任务，本地歌曲扫描卡顿优化，部分图标更新
* 0.2.2 增加本地歌曲列表删除与彻底删除，已下载歌曲文件删除功能，本地歌曲列表增加播放全部功能，调整随机播放模式下的歌曲切换算法，现在下载完成的歌曲将自动添加到本地歌曲列表，优化歌曲扫描算法
* 0.2.1 增加多个音乐动效，修复用户信息和关注列表无法正常查看的问题，现在点击跳转链接会正确关闭播放页详情页，各按钮的配色更切合主题
* 0.1.2 修复下载音乐成功后本地音乐列表无法同步更新的问题，增加桌面音乐动效
* 0.1.1 优化播放时主进程卡顿问题，优化响应速度
* 0.0.3 软件logo重新设计，皮肤更新，托盘播放图标同步皮肤颜色
* 0.0.2 本地歌曲匹配进度优化，新增匹配暂停功能，修复歌单详情页不会刷新的问题
* 0.0.1 本地歌曲扫描，匹配在线音乐库，扫描匹配界面优化，换肤优化
<!-- ## 下载 && 运行
点击[下载应用](https://github.com/xiaozhu188/electron-vue-cloud-music/releases/latest)。 -->

> 项目当前依赖[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi),感谢NeteaseCloudMusicApi的作者。

> 项目当前依赖[QQMusicApi](https://github.com/jsososo/QQMusicApi),感谢QQMusicApi的作者。

>开发灵感来自[electron-vue-cloud-music](https://github.com/xiaozhu188/electron-vue-cloud-music),感谢electron-vue-cloud-music的作者。

---

<!-- This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html). -->

