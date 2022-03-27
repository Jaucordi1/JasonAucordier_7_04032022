/**
 * @param {Array} array
 * @param {(item: *) => boolean} iterator
 * @returns {Array}
 */
export function filter(array, iterator) {
  return array.filter(iterator);
}

export function map(array, mapper) {
  return array.map(mapper);
}

export function forEach(array, callback) {
  array.forEach(callback);
}

export function reduce(array, reducer, initialValue) {
  return array.reduce(reducer, initialValue);
}

export function find(array, finder) {
  return array.find(finder);
}

/**
 * @param {Array} array
 * @param {(item: *) => boolean} finder
 * @returns {number}
 */
export function findIndex(array, finder) {
  return array.findIndex(finder);
}

export function splice(array, index, deleteCount = undefined, items = []) {
  if (items.length === 0)
    return array.splice(index, deleteCount);
  else
    return array.splice(index, deleteCount, items);
}

export function split(array, splitter) {
  return array.split(splitter);
}

export function join(array, glue) {
  return array.join(glue);
}

export function includes(array, item) {
  return array.includes(item);
}

/**
 * @param {Array} array
 * @param {(a: *, b: *) => (-1 | 0 | 1)} sorter
 * @returns {Array}
 */
export function sort(array, sorter) {
  return array.sort(sorter);
}
