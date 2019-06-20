import { DocumentAttribute } from '../../clients/centrifuge-node';

export const flatten =  (data) => {
  var result = {};

  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++)
        recurse(cur[i], prop + "[" + i + "]");
      if (l == 0) result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + "." + p : p);
      }
      if (isEmpty && prop) result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
};

export const unflatten = function (data) {
  if (Object(data) !== data || Array.isArray(data)) return data;
  let regex = /\.?([^.\[\]]+)|\[(\d+)\]/g;
  let result = {};
  for (let p in data) {
    let cur = result;
    let prop = "";
    let  m;
    while (m = regex.exec(p)) {
      cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
      prop = m[2] || m[1];
    }
    cur[prop] = data[p];
  }
  return result[""] || result;
};

// Nested references are kept and mutating the content will mutate the orinal object
export const extractArray = (attr: DocumentAttribute):any[] => {
  if(!attr) return []
  return Object.values(attr).slice(0, -3);
}
