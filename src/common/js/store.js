/**
 * 存取缓存数据
 * @param id
 * @param key
 * @param value
 */
export function saveToLocal(id, key, value) {
  // 手动设置localStorage的key
  let seller = window.localStorage.__seller__
  if (!seller) {
    seller = {}
    seller[id] = {}
  } else {
    // 取出的缓存为JSON格式，需要转换为js格式
    seller = JSON.parse(seller)
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  // 缓存对象为JSON格式
  window.localStorage.__seller__ = JSON.stringify(seller)
}

/**
 * 读取缓存数据
 * @param id
 * @param key
 * @param def 实际值
 * @return {*} Boolean
 */
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
