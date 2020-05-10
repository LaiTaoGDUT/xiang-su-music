import { uInstance as uRequest } from '../utils/_request.js'

// 手机登录
export function login_cellphone (data) {
  return uRequest.post('/login/cellphone', data)
}

// 邮箱登录
export function login_email (data) {
  return uRequest.post('/login/email', data)
}

// type: 签到类型 , 默认 0, 其中 0 为安卓端签到 ,1 为 web/PC 签到
export function daily_signin (type) {
  return uRequest.get('/daily_signin', {
    params: {
      type
    }
  })
}

// 用户详情
export function user_detail (uid) {
  return uRequest.post('/user/detail', {
    uid,
    _: new Date().getTime()
  })
}

// 获取用户信息 , 歌单，收藏，mv, dj 数量
export function user_subcount (uid) {
  return uRequest.post('/user/subcount', {
    uid,
    _: new Date().getTime()
  })
}

// 获取用户私信
export function user_msg_private ({ limit = 10, offset = 0 }) {
  return uRequest.post('/msg/private', {
    limit,
    offset
  })
}

// 获取用户关注列表
export function user_follower ({ uid, limit = 10, offset = 0 }) {
  return uRequest.post('/user/follows', {
    uid,
    limit,
    offset
  })
}

// 获取用户粉丝列表
export function user_followed ({ uid, limit = 10, lasttime = -1 }) {
  return uRequest.post('/user/followeds', {
    uid,
    limit,
    lasttime
  })
}

// 关注/取消关注用户
export function user_follow ({ t, id }) {
  return uRequest.post('/follow', {
    t, id
  })
}

// 获取用户歌单
export function getUserPlaylist (uid) {
  let data = {
    uid,
    limit: 10000
  }
  if (process.env.NODE_ENV !== 'production') {
    data.timestamp = new Date().getTime()
  }
  return uRequest.post('/user/playlist', data)
}

// 获取云盘数据
export function getUserCloud (uid) {
  return uRequest.post('/user/cloud', {
    uid
  })
}

// 获取用户喜欢歌曲列表
export function getUserLikeSongs (uid) {
  let data = {
    uid
  }
  if (process.env.NODE_ENV === 'production') {
    data.timestamp = new Date().getTime()
  }
  return uRequest.post('/likelist', data)
}

// 喜欢音乐
export function likeMusic (musicId, isLike) {
  return uRequest.post('/like', {
    id: musicId,
    like: isLike
  })
}

// 收藏专辑 t  1:收藏,2:取消收藏
export function subAlbum ({ t, id }) {
  return uRequest.get('/album/sub', {
    params: {
      t,
      id
    }
  })
}

// 收藏歌单 t  1:收藏,2:取消收藏
export function likePlaylist (t, pid) {
  return uRequest.post('/playlist/subscribe', {
    t,
    id: pid
  })
}

// 删除创建的歌单
export function deletePlaylist (id) {
  return uRequest.post('/playlist/delete', {
    id
  })
}

/**
 * 新建歌单
 * @param {*歌单名} name
 * @param {*privacy : 是否设置为隐私歌单，默认否，传'10'则设置成隐私歌单} privacy
 */
export function createPlaylist ({ name, privacy }) {
  let data = {
    name
  }
  if (privacy) {
    data.privacy = 10
  }
  return uRequest.post('/playlist/create', data)
}

// 对歌单添加或删除歌曲
export function addSongToList ({ op, tracks, pid }) {
  return uRequest.post('/playlist/tracks', {
    op, tracks, pid
  })
}

// 私人fm
export function getFm () {
  return uRequest.get('/personal_fm?_=' + new Date().getTime())
}

// 每日推荐歌曲
export function getRecommendSongs () {
  return uRequest.get('/recommend/songs')
}

// 用户动态
export function getUserEvent ({ uid, limit = 30, lasttime = -1 }) {
  return uRequest.post('/user/event', {
    uid, limit, lasttime
  })
}

// 动态
export function getEvent ({ pagesize = 30, lasttime = -1 }) {
  return uRequest.get('/event', {
    params: {
      pagesize, lasttime
    }
  })
}

// 订阅电台 1订阅,0订阅
export function subDj ({ t, rid }) {
  return uRequest.post('/dj/sub', {
    t, rid
  })
}

// 收藏歌手 1为收藏,其他取消订阅
export function subArtist ({ t, id }) {
  return uRequest.post('/artist/sub', {
    t, id
  })
}

// 获取热门话题
export function getHotTopic ({ limit = 30, offset = 0 }) {
  return uRequest.get('/hot/topic', {
    params: {
      limit, offset
    }
  })
}
