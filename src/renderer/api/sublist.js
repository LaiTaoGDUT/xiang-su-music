import { uInstance as uRequest } from '@/utils/_request.js'

// 获取收藏的歌手列表
export function getArtist ({ limit = 20, offset = 0 }) {
  return uRequest.get('/artist/sublist', {
    params: {
      limit,
      offset,
      _: new Date().getTime()
    }
  })
}

// 获取收藏的 MV 列表
export function getMv ({ limit = 50, offset = 0 }) {
  return uRequest.get('/mv/sublist', {
    params: {
      limit,
      offset,
      _: new Date().getTime()
    }
  })
}

// 获得已收藏专辑列表
export function getSubAlbum ({ limit = 20, offset = 0 }) {
  return uRequest.get('/album/sublist', {
    params: {
      limit,
      offset,
      _: new Date().getTime()
    }
  })
}
