import { instance as request } from '@/utils/_request.js'

// 传入歌单id和limit参数 ,获得该歌单的所有评论
export function getPlaylistComment (id, limit = 20, offset = 0) {
  return request.get('/comment/playlist', {
    params: {
      id, limit, offset
    }
  })
}

// 传入专辑id和limit参数 ,获得该专辑的所有评论
export function getAlbumComment (id, limit = 20, offset = 0, platform = 'netease' ) {
  return request.get('/comment/album', {
    params: {
      id, limit, offset, platform
    }
  })
}

// 传入MVid和limit参数, 获得该mv的所有评论
export function getMVComment (id, limit = 20, offset = 0) {
  return request.get('/comment/mv', {
    params: {
      id, limit, offset
    }
  })
}

// 传入视频id和limit参数, 获得该视频的所有评论
export function getVideoComment (id, limit = 20, offset = 0) {
  return request.get('/comment/video', {
    params: {
      id, limit, offset
    }
  })
}

// 传入音乐id和limit参数, 获得该音乐的所有评论
export function getSongComment (id, limit = 20, offset = 0, before = '') {
  return request.get('/comment/music', {
    params: {
      id, limit, offset, before
    }
  })
}

// 传入电台id和limit参数 , 获得该电台节目的所有评论
export function getDjComment (id, limit = 20, offset = 0, before = '') {
  return request.get('/comment/dj', {
    params: {
      id, limit, offset, before
    }
  })
}
/**
 * 给评论点赞或取消点赞
 * @param {*} id 资源 id
 * @param {*} cid 评论 id
 * @param {*} t 是否点赞 ,1 为点赞 ,0 为取消点赞
 * @param {Number} type  资源类型 0: 歌曲，1: mv，2: 歌单，3: 专辑，4: 电台，5: 视频，6: 动态
 */
export function likeComment (id, cid, t, type, platform) {
  let timestamp = Date.now()
  return request.get('/comment/like', {
    params: {
      id, cid, t, type, timestamp, platform
    }
  })
}
