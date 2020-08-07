import { uInstance as uRequest } from '../utils/_request.js'

// 手机登录
export function login_cellphone (data) {
  return uRequest.get('/login/cellphone', { params: data })
}

// 邮箱登录
export function login_email (data) {
  return uRequest.get('/login/email', { params: data })
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
  return uRequest.get('/user/detail', {
    params: {
      uid,
      _: new Date().getTime()
    }
  })
}

// 获取用户信息 , 歌单，收藏，mv, dj 数量
export function user_subcount (uid) {
  return uRequest.get('/user/subcount', {
    params: {
      uid,
      _: new Date().getTime()
    }
  })
}

// 获取用户私信
export function user_msg_private ({ limit = 10, offset = 0 }) {
  return uRequest.get('/msg/private', {
    params: {
      limit,
      offset
    }
  })
}

// 获取用户关注列表
export function user_follower ({ uid, limit = 10, offset = 0 }) {
  return uRequest.get('/user/follows', {
    params: {
      uid,
      limit,
      offset
    }
  })
}

// 获取用户粉丝列表
export function user_followed ({ uid, limit = 10, lasttime = -1 }) {
  return uRequest.get('/user/followeds', {
    params: {
      uid,
      limit,
      lasttime
    }
  })
}

// 关注/取消关注用户
export function user_follow ({ t, id }) {
  return uRequest.get('/follow', {
    params: {
      t, id
    }
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
  return uRequest.get('/user/playlist', { params: data })
}

// 获取云盘数据
export function getUserCloud (uid) {
  return uRequest.get('/user/cloud', {
    params: {
      uid
    }
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
  return uRequest.get('/likelist', { params: data })
}

// 喜欢音乐
export function likeMusic (musicId, isLike) {
  return uRequest.get('/like', {
    params: {
      id: musicId,
      like: isLike
    }
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
  return uRequest.get('/playlist/subscribe', {
    params: {
      t,
      id: pid
    }
  })
}

// 删除创建的歌单
export function deletePlaylist (id) {
  return uRequest.get('/playlist/delete', {
    params: {
      id
    }
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
  return uRequest.get('/playlist/create', { params: data })
}

// 对歌单添加或删除歌曲
export function addSongToList ({ op, tracks, pid }) {
  return uRequest.get('/playlist/tracks', {
    params: {
      op, tracks, pid
    }
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
  return uRequest.get('/user/event', {
    params: {
      uid, limit, lasttime
    }
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
  return uRequest.get('/dj/sub', {
    params: {
      t, rid
    }
  })
}

// 收藏歌手 1为收藏,其他取消订阅
export function subArtist ({ t, id }) {
  return uRequest.get('/artist/sub', {
    params: {
      t, id
    }
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
