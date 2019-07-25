export function urlParse() {
  let url = window.location.search
  let obj = {}
  // reg = 以 ? 或者 & 开头 非 ? 或者 & 一个或者多个 = 非 ? 或者 & 一个或者多个 全局匹配
  let reg = /[?&][^?&]+=[^?&]+/g
  // arr = ['?id=12345', '&a=b']
  let arr = url.match(reg)
  if (arr) {
    arr.forEach(item => {
      // 去 ?&，再以 “=” 分割字符串 => temArr = ['id', '12345']
      let temArr = item.substring(1).split('=')
      // 对 URI 参数进行解码
      let key = decodeURIComponent(temArr[0])
      let val = decodeURIComponent(temArr[1])
      obj[key] = val
    })
  }
  return obj
}

export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    // Number + '' = String
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  let obj = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let key in obj) {
    if (new RegExp(`(${key})`).test(fmt)) {
      // 转换成字符串
      let str = obj[key] + ''
      // 把匹配到的正则表达式片段替换为具体的日期
      // fmt = fmt.replace (RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
      fmt = fmt.replace(RegExp.$1, padLeftZero(str))
    }
  }
  return fmt
}

// 一位数字时前面补零（两位数字也适用）
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

export function saveToLocal(id, key, value) {
  // 手动设置 localStorage 的 key
  let seller = window.localStorage.__seller__
  if (!seller) {
    seller = {}
    seller[id] = {}
  } else {
    // 取出的缓存为 JSON 格式，需要转换为 js 格式
    seller = JSON.parse(seller)
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  // 缓存对象为 JSON 格式
  window.localStorage.__seller__ = JSON.stringify(seller)
}

export function loadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    return def
  }
  seller = JSON.parse(seller)[id]
  if (!seller) {
    return def
  }
  let ret = seller[key]
  // 返回缓存的值，没有就返回实际的值
  return ret || def
}
