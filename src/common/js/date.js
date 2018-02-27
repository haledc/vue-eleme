// 格式化时间
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) // Number+''=String
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDay(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''   // 转换成字符串
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

// 一位数字时前面补零
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

