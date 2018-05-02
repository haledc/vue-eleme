// 格式化时间
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    // Number+''=String
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let obj = {
    'M+': date.getMonth() + 1,
    'd+': date.getDay(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let key in obj) {
    if (new RegExp(`(${key})`).test(fmt)) {
      // 转换成字符串
      let str = obj[key] + ''
      // 把匹配到的正则表达式片段替换为具体的日期
      // fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
      fmt = fmt.replace(RegExp.$1, padLeftZero(str))
    }
  }
  return fmt
}

// 一位数字时前面补零（两位数字也适用）
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

