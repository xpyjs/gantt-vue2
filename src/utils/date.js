import { isDate, isString, isNumber } from "./handle";

/**
 * 创建日期的工厂函数，生成一个指定日期，如果无效，返回当日日期
 * @param {String | Number | Date} date 日期
 */
export function createDate(date) {
  if (isString(date) || isNumber(date)) {
    return new Date(date);
  } else if (isDate(date)) {
    return date;
  } else {
    return new Date();
  }
}

/**
 * 获取两个时间的间隔时间戳
 * @param {String | Number | Date} startDate 起始日期
 * @param {String | Number | Date} endDate 截止日期
 */
export function getDateInterval(startDate, endDate) {
  return parseInt(
    createDate(endDate).getTime() - createDate(startDate).getTime()
  );
}

/**
 * 比较大小，返回字符，l 左小，r 右小，e 相等
 * @param {*} date1 左日期
 * @param {*} date2 右日期
 */
export function compareDate(date1, date2) {
  const l = createDate(date1).getTime();
  const r = createDate(date2).getTime();
  if (l < r) return "l";
  else if (l > r) return "r";
  else return "e";
}

/**
 * 计算日期偏移值，给定一个偏移值，返回新日期的时间戳
 * @param {Date | String | Number} date
 * @param {Number} offset 日期偏移值的时间戳
 */
export function getDateOffset(date, offset) {
  const currentTime = createDate(date).getTime() + offset;
  return createDate(currentTime).getTime();
}

/**
 * 判断两个日期是否相等
 * @param {Date | String} date1
 * @param {Date | String} date2
 */
export function sameDate(date1, date2) {
  const d1 = createDate(date1);
  const d2 = createDate(date2);
  if (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
    return true;
  return false;
}

/**
 * 获取两个日期间的所有日期列表
 * @param {Date | String | Number} startDate
 * @param {Date | String | Number} endDate
 * @param {String} format
 */
export function dateList(startDate, endDate, format = "yyyy-MM-dd") {
  const r = [];
  let startTime = createDate(startDate).getTime();
  let endTime = createDate(endDate).getTime();

  for (let i = startTime; i <= endTime; ) {
    r.push(formatDate(i, format));
    i += 24 * 60 * 60 * 1000;
  }

  return r;
}

/**
 * 格式化时间
 * @param {Date | String | Number} date 日期对象，或一个日期字符串，对其进行格式化
 * @param {String} fmt 格式文本，y:年，q:季度，M:月，d:日，H:小时，m:分钟，s:秒，S:毫秒。例：`yyyy-MM-dd`
 * @return {String} 格式化的内容，
 */
export function formatDate(date = null, fmt = "yyyy-MM-dd") {
  if (!isDate(date)) {
    date = checkDate(date);
  }

  if (date === null) {
    date = createDate();
  }

  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
    "H+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
}

/**
 * 检测给出了内容是否可以转成一个日期对象，如果可以，返回日期对象，如果不能，返回null
 * @param {Date | String | Number} date
 */
export function checkDate(date) {
  if (typeof date === "string" || typeof date === "number") {
    try {
      date = createDate(date);
    } catch (error) {
      date = null;
    }
  }
  return date;
}
