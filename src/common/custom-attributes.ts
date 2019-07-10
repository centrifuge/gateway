import { DocumentAttribute } from '../../clients/centrifuge-node';

export const flatten = (data) => {
  var result = {};

  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++)
        recurse(cur[i], prop + '[' + i + ']');
      if (l == 0) result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + '.' + p : p);
      }
      if (isEmpty && prop) result[prop] = {};
    }
  }

  recurse(data, '');
  return result;
};

export const unflatten = function(data) {
  if (Object(data) !== data || Array.isArray(data)) return data;
  let regex = /\.?([^.\[\]]+)|\[(\d+)\]/g;
  let result = {};
  for (let p in data) {
    let cur = result;
    let prop = '';
    let m;
    console.log('PROP', p);
    while (m = regex.exec(p)) {
      console.log('regexp', m[2], m[1]);
      console.log(prop, cur);
      cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
      prop = m[2] || m[1];
    }
    cur[prop] = data[p];
  }

  let normalised = {}
  for (let p in result['']) {
    normalised[p] = toIterable(result[''][p]);
  }
  return normalised;
};

// Nested references are kept and mutating the content will mutate the orinal object
export const toIterable = (attr: DocumentAttribute) => {
  const keys =  Object.keys(attr);
  const values =  Object.values(attr);
  const iterable = values.slice(0, -3);
  for(let i = iterable.length; i <= values.length; i ++) {
    iterable[keys[i]] = values[i];
  }
  return iterable;
};

export const shouldBeItarable = (attr: DocumentAttribute) => {
  return (Object.keys(attr).length > 3)
}

export const toUniterable = (attr: DocumentAttribute[]): DocumentAttribute => {

  for(let i)

}
