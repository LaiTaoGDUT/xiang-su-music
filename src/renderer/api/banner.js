import { instance as request } from '@/utils/_request.js'

// 获取banner( 轮播图 )数据
export function getBanner () {
  return request.get('/banner')
}
