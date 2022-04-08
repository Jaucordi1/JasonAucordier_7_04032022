/**
 * @param {Array} array
 * @param {(item: *) => boolean} iterator
 * @param {* | undefined} thisArgs
 * @returns {Array}
 */
export function filter(array, iterator, thisArgs = undefined) {
  return array.filter(iterator, thisArgs);
}

export function map(array, mapper, thisArgs = undefined) {
  return array.map(mapper, thisArgs);
}

export function forEach(array, callback, thisArgs = undefined) {
  array.forEach(callback, thisArgs);
}

export function reduce(array, reducer, initialValue) {
  return array.reduce(reducer, initialValue);
}

export function find(array, finder, thisArgs = undefined) {
  return array.find(finder, thisArgs);
}

/**
 * @param {Array} array
 * @param {(item: *) => boolean} finder
 * @param {* | undefined} thisArgs
 * @returns {number}
 */
export function findIndex(array, finder, thisArgs = undefined) {
  return array.findIndex(finder, thisArgs);
}

export function splice(array, index, deleteCount = undefined, items = []) {
  if (items.length === 0)
    return array.splice(index, deleteCount);
  else
    return array.splice(index, deleteCount, items);
}

/**
 * @param {string} str
 * @param {string} splitter
 * @param {number | undefined} limit
 * @returns {Array}
 */
export function split(str, splitter, limit = undefined) {
  return str.split(splitter, limit);
}

export function join(array, glue) {
  return array.join(glue);
}

/**
 * @param {Array<*>} array
 * @param {*} item
 * @param {number | undefined} fromIndex
 * @returns {boolean}
 */
export function includes(array, item, fromIndex = undefined) {
  return array.includes(item, fromIndex);
}

/**
 * @param {Array} array
 * @param {(a: *, b: *) => (-1 | 0 | 1)} sorter
 * @returns {Array}
 */
export function sort(array, sorter) {
  return array.sort(sorter);
}

/**
 * @param {Array} array
 * @param {(value: *, index: number, array: Array) => unknown} predicate
 * @param {* | undefined} thisArg
 * @returns {boolean}
 */
export function some(array, predicate, thisArg = undefined) {
  return array.some(predicate, thisArg);
}

/**
 * @param {Array} array
 * @param {(value: *, index: number, array: Array) => boolean} predicate
 * @param {* | undefined} thisArg
 * @returns {boolean}
 */
export function every(array, predicate, thisArg = undefined) {
  return array.every(predicate, thisArg);
}


export function chunkArray(arr, chunkSize = 10) {
  if (arr.length <= chunkSize) return [map(arr, i => i)];
  const arrCopy = map(arr, i => i);
  const chunks  = [[]];
  do {
    if (chunks[chunks.length - 1].length === chunkSize) {
      chunks.push([]);
    }
    chunks[chunks.length - 1].push(arrCopy.shift());
  } while (arrCopy.length > 0);
  return chunks;
}
export function alphabeticalSort(a, b) {
  return (a < b) ? -1 : a > b;
}
