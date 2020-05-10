import { instance as request } from '@/utils/_request.js'

// 获取独家放送
export function getPrivateContent () {
  return request.get('/personalized/privatecontent')
}
