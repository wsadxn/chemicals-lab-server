module.exports = {
  getUuid: (len, radix) => {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
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
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | (Math.random() * 16);
          uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  },
  getCurrentTime(){
    const time = new Date();
    const year = time.getFullYear();
    const month = (time.getMonth() + 1).toString();
    const day = time.getDate().toString();
    const hour = time.getHours().toString();
    const minute = time.getMinutes().toString();
    const second = time.getSeconds().toString();
    return year + '-' + 
      (month.length > 1 ? month : '0'+ month) + '-' + 
      (day.length > 1 ? day : '0'+ day) + ' ' +
      (hour.length > 1 ? hour : '0'+ hour) + ':' + 
      (minute.length > 1 ? minute : '0'+ minute) + ':' + 
      (second.length > 1 ? second : '0'+ second);
  }
};
