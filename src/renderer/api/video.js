import { instance as request } from '@/utils/_request.js'

// 传入id,获取到相关的视频
export function getVideo (groupId) {
  let id = groupId || 5100
  return request.get(`/video/group?id=${id}&_=${new Date().getTime()}`)
}

// 获取视频标签列表
export function getVideoCates () {
  return request.get('/video/group/list')
}

// 传入视频id, 获取视频播放地址
export function getVideoUrl (id) {
  return request.get(`/video/url?id=${id}`)
}

// 获取视频详情
export function getVideoDetail (id) {
  return request.get(`/video/detail?id=${id}`)
}

// 相关视频
export function getRelatedVideo (id) {
  return request.get(`/related/allvideo?id=${id}`)
}

// 收藏视频 t : 1 为收藏,其他为取消收藏
export function subVideo (id, t) {
  return request.post('/video/sub', {
    id, t
  })
}
