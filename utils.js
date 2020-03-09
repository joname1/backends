//确保传过来是否正确时间
function ensureDate(date) {
  if (typeof date !== "object") {
    date = new Date(date);
  }
  return date;
}

function naive(arr) {
  var len = arr.length;
  if (len === 0) {
    return 0;
  } else if (len === 1) {
    return arr[0];
  } else {
    return arr[0] + naive(arr.slice(1));
  }
}

//数组计算总和
exports.calcSum = arr => {
  var len = arr.length;
  if (len === 0) {
    return 0;
  } else if (len === 1) {
    return arr[0];
  } else {
    return arr[0] + naive(arr.slice(1));
  }
};

//时间戳转正常时间
exports.dateFormat = (date, format) => {
  if (format === undefined) {
    format = date;
    date = ensureDate();
  }

  date = ensureDate(date);

  let map = {
    M: date.getMonth() + 1, // 月份
    d: date.getDate(), // 日
    h: date.getHours(), // 小时
    m: date.getMinutes(), // 分
    s: date.getSeconds(), // 秒
    q: Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  };
  let repReg = new RegExp("([yMdhmsqS])+", "g");
  format = format.replace(repReg, function(all, t) {
    let v = map[t];
    if (v !== undefined) {
      if (all.length > 1) {
        v = "0" + v;
        v = v.substring(v.length - 2);
      }
      return v;
    } else if (t === "y") {
      let tmpVal = date.getFullYear() + "";
      return tmpVal.substring(4 - all.length);
    }
    return all;
  });
  return format;
};
