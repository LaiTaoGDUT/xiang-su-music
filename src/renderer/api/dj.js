import { instance as request } from '@/utils/_request.js'

// 获取推荐电台
export function getRecommendDjprogram () {
  return request.get('/personalized/djprogram')
}

// 获取电台banner
export function getDjBanner () {
  return request.get('/dj/banner')
}

// 获得电台类型
export function getDjCatelist () {
  return request.get('/dj/catelist')
}

// 传入分类,获得对应类型电台列表
export function getDjByCate ({ type, limit = 5, offset = 0 }) {
  return request.get('/dj/recommend/type', {
    params: {
      type, limit, offset
    }
  })
}

// 获得电台推荐类型
export function getDjCatelistRecommend () {
  return request.get('/dj/category/recommend')
}

// 获得推荐电台
export function getDjRecommend () {
  return request.get('/dj/recommend')
}
// 今日优选
export function getDjPerfered () {
  return request.get('/dj/today/perfered')
}
// 推荐节目
export function getProgramRecommend () {
  return request.get('/program/recommend')
}
// 付费精选
export function getDjPaygift () {
  return request.get('/dj/paygift')
}
// 热门
export function getDjHot () {
  return request.get('/dj/hot')
}
// 电台详情
export function getDjDetail (rid) {
  return request.post('/dj/detail', {
    rid
  })
}
// 获取电台的节目
export function getDjProgram ({ rid, limit, offset, asc = false }) {
  return request.get('/dj/program', {
    params: {
      rid,
      limit,
      offset,
      asc
    }
  })
}
