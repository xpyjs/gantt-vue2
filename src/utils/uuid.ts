/**
 * 生成uuid
 * @param {Number} len 指定uuid的长度
 * @param {Number} radix 进制，默认16进制
 */
export function uuid(len: number, radix = 16) {
  const chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const id = [];
  let i;

  if (len) {
    for (i = 0; i < len; i++) {
      // eslint-disable-next-line no-bitwise
      id[i] = chars[0 | (Math.random() * (radix || chars.length))];
    }
  } else {
    let r;
    // eslint-disable-next-line no-multi-assign
    id[8] = id[13] = id[18] = id[23] = '-';
    id[14] = '4';

    for (i = 0; i < 36; i++) {
      if (!id[i]) {
        // eslint-disable-next-line no-bitwise
        r = 0 | (Math.random() * 16);
        // eslint-disable-next-line no-bitwise
        id[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return id.join('');
}

export default uuid;
