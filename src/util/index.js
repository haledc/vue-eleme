import BScroll from "@better-scroll/core";

export function urlParse() {
  const url = window.location.search;
  const obj = {};
  const reg = /[?&][^?&]+=[^?&]+/g;
  const arr = url.match(reg);
  if (arr) {
    arr.forEach((item) => {
      const temArr = item.substring(1).split("=");
      const key = decodeURIComponent(temArr[0]);
      const val = decodeURIComponent(temArr[1]);
      obj[key] = val;
    });
  }
  return obj;
}

export function formatDate(date, fmt) {
  let obj = {
    "y+": date.getFullYear(),
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };
  for (const key in obj) {
    if (new RegExp(`(${key})`).test(fmt)) {
      const str = obj[key] + "";
      fmt = fmt.replace(RegExp.$1, key !== "y+" ? padLeftZero(str) : str);
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}

export function saveToLocal(id, key, value) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    seller = JSON.parse(seller);
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = value;
  window.localStorage.__seller__ = JSON.stringify(seller);
}

export function loadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    return def;
  }
  seller = JSON.parse(seller)[id];
  if (!seller) {
    return def;
  }
  const ret = seller[key];
  return ret || def;
}

export function createScroll(el, options) {
  return new BScroll(el, options);
}

export function refreshScroll(scroll) {
  scroll && scroll.refresh();
}
