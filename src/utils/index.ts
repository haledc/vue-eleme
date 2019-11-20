interface QueryObj {
  [key: string]: string
}

export function urlParse() {
  let url = window.location.search
  let obj: QueryObj = {}
  let reg = /[?&][^?&]+=[^?&]+/g
  let arr = url.match(reg)
  if (arr) {
    arr.forEach(item => {
      let temArr = item.substring(1).split('=')
      let key = decodeURIComponent(temArr[0])
      let val = decodeURIComponent(temArr[1])
      obj[key] = val
    })
  }
  return obj
}

interface DateObj {
  [key: string]: number
}

export function formatDate(date: Date, fmt: string) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  let obj: DateObj = {
    'M+': date.getMonth() + 1,
    'd+': date.getDay(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let key in obj) {
    if (new RegExp(`(${key})`).test(fmt)) {
      let str = obj[key] + ''
      fmt = fmt.replace(RegExp.$1, padLeftZero(str))
    }
  }
  return fmt
}

// 一位数字前面补零（两位数字也适用）
function padLeftZero(str: string) {
  return ('00' + str).substr(str.length)
}

export function saveToLocal(id: number, key: string, value: boolean) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    seller = {}
    seller[id] = {}
  } else {
    seller = JSON.parse(seller)
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  window.localStorage.__seller__ = JSON.stringify(seller)
}

export function loadFromLocal(id: number, key: string, def: boolean) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    return def
  }
  seller = JSON.parse(seller)[id]
  if (!seller) {
    return def
  }
  let ret = seller[key]
  return ret || def
}
