/**
 * 生成uuid
 * @param {Number} len 指定uuid的长度
 * @param {Number} radix 进制，默认16进制
 */
export function uuid(len, radix = 16) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  var uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join("");
}

/**
 * 获得一个随机字符串
 * @param {Number} len 获取字符串长度
 */
export function getRandomString(len) {
  len = len || 4;
  var $chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghijklmnopqrstuvwxyz0123456789";
  var maxPos = $chars.length;
  var s = "";
  for (let i = 0; i < len; i++) {
    s += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return s;
}

/**
 * 从任意对象中获取一个数字，如果无法获取，返回默认值（如果没有提供，返回0）
 * @param {Object} v 任何需要转成数字的内容
 * @param {Number} defaultNumber 默认值
 */
export function parseNumber(v, defaultNumber = 0) {
  if (v === undefined) {
    v = defaultNumber;
  } else {
    v = parseInt(v, 10);
    if (isNaN(v)) {
      v = defaultNumber;
    }
  }
  return v;
}

// 是否为null
export const isNull = o => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Null";
};

// 是否undefined
export const isUndefined = o => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Undefined";
};

// 是否对象
export const isObject = o => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Object";
};

// 是否数组
export const isArray = o => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Array";
};

// 是否时间对象
export const isDate = o => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Date";
};

// 是否函数
export const isFunction = o => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Function";
};

// 是否boolean
export const isBoolean = o => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Boolean";
};

// 是否字符串
export const isString = o => {
  return Object.prototype.toString.call(o).slice(8, -1) === "String";
};

// 是否数字
export const isNumber = o => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Number";
};

// 对象相等
export function isObjectValueEqual(a, b) {
  var o1 = a instanceof Object;
  var o2 = b instanceof Object;
  // 判断是不是对象
  if (!o1 || !o2) {
    return a === b;
  }

  //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,
  //例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (var o in a) {
    var t1 = a[o] instanceof Object;
    var t2 = b[o] instanceof Object;
    if (t1 && t2) {
      if (!isObjectValueEqual(a[o], b[o])) return false;
    } else if (a[o] !== b[o]) {
      return false;
    }
  }
  return true;
}

// 节流
export function throttle(func, wait, options) {
  let context, args, timeout, result;
  let previous = 0;

  if (!options) options = {};

  let later = function() {
    // 这里控制再次出发时，第一次是否执行，当为双false时，也是这里会出现的问题。
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
    context = this;
    args = arguments;

    let now = Date.now();

    // 第一次不执行，调整previous的值即可。
    if (!previous && options.leading === false) previous = now;

    if (now - previous > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      // 立即执行
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      // 设置一个定时器，只有为空时才会触发，每次执行后都会重新设定一个定时器。
      timeout = setTimeout(later, wait);
    }

    return result;
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
    timeout = context = args = null;
  };

  return throttled;
}

// 防抖
export function debounce(func, wait, immediate) {
  let timeout, result;

  var debounced = function() {
    // 获取上下文，关联this的指向
    let context = this;
    // 获取所有参数
    const args = arguments;
    // 每次防抖都清除定时器，然后设置一个新的定时器。
    if (timeout) clearTimeout(timeout);

    // 区别是否立即执行
    if (immediate) {
      // 如果立即执行，需要一个变量控制重复执行。这里利用timeout取反，可以控制效果
      let callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);

      // 立即执行
      if (callNow) result = func.apply(context, args);
    } else {
      // 不立即执行，则正常定时器等待即可
      timeout = setTimeout(function() {
        result = func.apply(context, args);
      }, wait);
    }

    // 返回调用函数的结果
    return result;
  };

  // 设置一个清除函数，可以手动控制取消防抖函数的执行。
  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}
