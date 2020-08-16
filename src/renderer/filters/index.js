import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

Vue.filter('NumberFormat', function (value) {  // 将数字的整数部分转换为xxx,xxx,xxx的格式
  if (!value) {
    return '0'
  }
  let intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('toWan', function (num) {       // 将数字转换为 x万xxx的格式
  if (num >= 100000000) {
    let billion = Math.floor(num / 100000000)
    num = num % 100000000
    return billion + '亿' + (num >= 10000 ? (num / 10000).toFixed(1) + '万' : num)
  }
  return num >= 10000 ? (num / 10000).toFixed(1) + '万' : num
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('toDate', function (val, format) {
  return moment(val).format(format || 'YYYY-MM-DD')
})

Vue.filter('duration', function (duration, type) {  // 将毫秒数转换为 mm:ss的格式
  if (!duration) return '00:00'
  if (type && type == 'ms') duration = Math.floor(duration / 1000)
  let minute = _pad((duration / 60) | 0)
  let second = _pad(duration % 60)
  return `${minute}:${second}`
})

Vue.filter('formatBrs', function (num) {  // 将数字格式的分辨率转换为中文
  if (num == 1080) {
    return '蓝光'
  } else if (num == 720) {
    return '超清'
  } else if (num == 480) {
    return '高清'
  } else {
    return '标清'
  }
})

function _pad (num) {  // 将小于10的数字转换成0x的格式
  let _num = Math.floor(num)
  return _num < 10 ? '0' + _num : _num
}

Vue.filter('normalSize', function (size, type) {   // 将以Byte单位的容量转换成k或M为单位
  if (isNaN(size) || size < 0) return '未知大小'
  if (type === 'K') return `${(size / 1024).toFixed(2)}k`
  return `${(size / 1024 / 1024).toFixed(2)}M`
})

Vue.filter('normalDate', function (date) {
  if (!/^(\d+)$/g.test(date)) {
    return date
  }
  let _date = new Date(date)
  return `${_date.getFullYear()}-${_pad(_date.getMonth())}-${_pad(_date.getDay())}`
})
