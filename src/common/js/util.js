/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:'12345', a:'b'}
 */

export function urlParse() {
  // 获取搜索字符串
  let url = window.location.search
  let obj = {}
  // reg = 以?或者&开头 非?或者&一个或者多个 = 非?或者&一个或者多个 全局匹配
  let reg = /[?&][^?&]+=[^?&]+/g
  // arr = ['?id=12345', '&a=b']
  let arr = url.match(reg)
  if (arr) {
    arr.forEach((item) => {
      // 去?&，再以“=”分割字符串 => temArr = ['id', '12345']
      let temArr = item.substring(1).split('=')
      // 对URI参数进行解码
      let key = decodeURIComponent(temArr[0])
      let val = decodeURIComponent(temArr[1])
      obj[key] = val
    })
  }
  return obj
}
