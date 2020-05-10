import { instance as request } from '@/utils/_request.js'

// 获取歌单分类
export function getPlaylistTags () {
  return request.get('/playlist/hot')
}

// 传入用户id, 获取用户歌单
export function getUserPlaylist (uid) {
  return request.post('/user/playlist', {
    uid
  })
}

// 传入歌单id, 获取对应歌单内的所有的音乐
export function getPlaylistDetail (id) {
  return request.post('/playlist/detail', {
    id,
    _: new Date().getTime()
  })
}

// 获取歌单分类
export function getPlaylistCatlist () {
  return request.get('/playlist/catlist')
}

// 获取推荐歌单
export function getPersonalizedPlaylist () {
  return request.get('/personalized')
}

// 获取网友精选碟歌单
export function getTopPlaylist ({ cat = '全部', limit = 10, offset = 0, order = 'new' }) {
  return request.get('/top/playlist', {
    params: {
      cat,
      limit,
      offset,
      order
    }
  })
}

// 获取精品歌单 before: 分页参数,取上一页最后一个歌单的 updateTime 获取下一页数据
export function getHighPlaylist ({ cat = '全部', limit = 20, before = '' }) {
  return request.get('/top/playlist/highquality', {
    params: {
      cat,
      limit,
      before
    }
  })
}

// 传入歌单id获取相关歌单
export function getRelatedPlaylist (id) {
  return request.post('/related/playlist', {
    id
  })
}

// 获取推荐歌单
export function getRecommendPlaylist () {
  return request.get('/personalized')
}

// 传入歌单id, 获取歌单的所有收藏者
export function getPlaylistSubscribers ({ limit = 20, offset = 0, id }) {
  return request.post('/playlist/subscribers', {
    id,
    limit,
    offset
  })
}
