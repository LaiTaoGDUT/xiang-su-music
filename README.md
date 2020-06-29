# xiang-su-music

* 实现登录功能
* 除登陆外，用户id暂时无法获得
* 考虑开启两个服务，将登录和用户歌单请求与（用户登录）与其他请求（vip账号）分开
* 创建歌单、收藏歌单、收藏歌手时，如果没有登录，将创建离线歌单，并在用户登录后提供歌单同步选项
* 加载喜欢的音乐数据时系统进程被阻塞

> 像素音乐

## 特点
* 歌词滚动，翻译切换
![player](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/player.png)
* 桌面歌词与音乐可视化
![desktop](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/desktopLyric.png)
* mini模式
![mini](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/mini.png)
![mini2](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/mini2.png)
* 托盘菜单
![tray](https://github.com/LaiTaoGDUT/xiang-su-music/blob/master/screenshot/tray.png)
* 任务栏缩略图，歌曲操作
* 自动/手动检查更新
* 换肤，下载，本地歌曲匹配，网络变化桌面通知，分享歌曲/歌单/MV/视频等到QQ空间
* 登录，私人Fm，歌单，专辑，歌手，排行榜，MV，视频，评论，搜索，用户，动态，粉丝，关注，云盘，收藏...
* 心动模式，歌词微调，下一首播放，追加播放，单曲循环，随机播放，列表循环

## 版本更新
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

