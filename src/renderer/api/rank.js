import { instance as request } from '@/utils/_request.js'

// 全球榜
export function getToplist () {
  return request.get('/toplist')
}

// 传入数字idx, 获取不同排行榜
// export function getTopDetail (idx) {
//   return request.get('/top/list', {
//     params: {
//       idx
//     }
//   })
// }

// 获取所有榜单内容摘要
export function getToplistDetail () {
  return request.get('/toplist/detail')
}
