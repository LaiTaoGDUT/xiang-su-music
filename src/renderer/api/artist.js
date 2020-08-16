import { instance as request } from '@/utils/_request.js'

// 获取歌手分类列表
export function getArtistList ({ cat = '全部', limit = 30, offset = 0, initial = '' }) {
  return request.get('/artist/list', {
    params: {
      cat,
      limit,
      offset,
      initial
    }
  })
}

// 传入歌手id, 获得歌手专辑内容
export function getArtistAlbum ({ id, limit = 30, offset = 0, platform }) {
  return request.get('/artist/album', {
    params: {
      id,
      limit,
      offset,
      platform
    }
  })
}

// 传入歌手id, 获得歌手MV内容
export function getArtistMV ({ id, limit = 10, offset = 0, platform }) {
  return request.get('/artist/mv', {
    params: {
      id,
      limit,
      offset,
      platform
    }
  })
}

// 传入歌手id, 获得歌手部分信息和热门歌曲
export function getArtistSongs ({ id, limit = 30, offset = 0, platform }) {
  return request.get('/artists', {
    params: {
      id,
      limit,
      offset,
      platform
    }
  })
}

// 传入歌手id, 获得歌手描述
export function getArtistDesc ({ id, limit = 30, offset = 0, platform }) {
  return request.get('/artist/desc', {
    params: {
      id,
      limit,
      offset,
      platform
    }
  })
}
// 传入歌手id, 获得相似歌手
export function getArtistSimi ({ id, limit = 30, offset = 0, platform }) {
  return request.get('/simi/artist', {
    params: {
      id,
      limit,
      offset,
      platform
    }
  })
}

// 获得歌手榜
export function getTopArtist () {
  return request.get('/toplist/artist')
}
