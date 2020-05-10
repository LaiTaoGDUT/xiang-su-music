import { instance as request } from '@/utils/_request.js'

// 获取新碟上架列表
export function getTopAlbum ({ limit, offset }) {
  return request.get('/top/album', {
    params: {
      limit, offset
    }
  })
}

// 获取云音乐首页新碟上架数据
export function getNewestAlbum ({ limit, offset }) {
  return request.get('/album/newest', {
    params: {
      limit, offset
    }
  })
}

//  传入专辑id, 获得专辑内容
export function getAlbum (id) {
  return request.get('/album', {
    params: {
      id
    }
  })
}
