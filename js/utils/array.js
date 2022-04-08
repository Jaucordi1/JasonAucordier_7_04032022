/**
 * @param {Array} array
 * @param {(item: *) => boolean} iterator
 * @param {* | undefined} thisArgs
 * @returns {Array}
 */
export function filter(array, iterator, thisArgs = undefined) {
  if (array.length === 0) {
    return [];
  }
  const newArr = [];
  const func   = thisArgs !== undefined ? iterator.bind(thisArgs) : iterator;
  for (const item of array) {
    if (func(item) === true) {
      newArr.push(item);
    }
  }
  return newArr;
}

export function map(array, mapper, thisArgs = undefined) {
  if (array.length === 0) {
    return [];
  }
  const newArr = [];
  const func   = thisArgs !== undefined ? mapper.bind(thisArgs) : mapper;
  for (const item of array) {
    newArr.push(func(item));
  }
  return newArr;
}

export function forEach(array, callback, thisArgs = undefined) {
  if (array.length > 0) {
    const func = thisArgs !== undefined ? callback.bind(thisArgs) : callback;
    for (const item of array) {
      func(item);
    }
  }
}

export function reduce(array, reducer, initialValue) {
  const arrayLength = array.length;
  if (arrayLength === 0) {
    return initialValue;
  }

  let result = initialValue, i = 0;
  do {
    result = reducer(result, array[i], i++, array);
  } while (i < arrayLength);

  return result;
}

export function find(array, finder, thisArgs = undefined) {
  if (array.length === 0) {
    return;
  }

  const func = thisArgs !== undefined ? finder.bind(thisArgs) : finder;

  let found = undefined, i = 0;
  do {
    const item = array[i++];
    if (func(item) === true) {
      found = item;
    }
  } while (!found && i < array.length - 1);

  return found;
}

/**
 * @param {Array} array
 * @param {(item: *) => boolean} finder
 * @param {* | undefined} thisArgs
 * @returns {number}
 */
export function findIndex(array, finder, thisArgs = undefined) {
  if (array.length === 0) {
    return -1;
  }

  const func = thisArgs !== undefined ? finder.bind(thisArgs) : finder;

  let found = -1, i = -1;
  do {
    const item = array[++i];
    if (func(item) === true) {
      found = i;
    }
  } while (found < 0 && i < array.length - 1);

  return found;
}

export function splice(array, start, deleteCount = undefined, items = []) {
  let i;
  const arrayLength = array.length;
  const result      = [];
  const removed     = [];

  if (deleteCount < 0) {
    deleteCount = 0;
  }
  if (deleteCount > (arrayLength - start)) {
    deleteCount = (arrayLength - start);
  }

  // Before start
  for (i = 0; i < start; i++) {
    result.push(array[i]);
  }

  // Delete items
  for (i = start; i < start + deleteCount; i++) {
    removed.push(array[i]);
  }

  // Add after
  for (i = start + (deleteCount || 0); i < arrayLength; i++) {
    result.push(array[i]);
  }

  // Modify original array
  array.length = 0;
  i            = result.length;
  while (i--) {
    array[i] = result[i];
  }

  return removed;
}

// TODO
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
  const arrayLength = array.length;
  if (arrayLength === 0) {
    return "";
  }
  if (arrayLength === 1) {
    return array[0];
  }

  let str = array[0], i = 1;
  for (; i < arrayLength - 1; i++) {
    str += `${glue}${array[i]}`;
  }

  return str;
}

/**
 * @param {Array<*>} array
 * @param {*} item
 * @param {number | undefined} fromIndex
 * @returns {boolean}
 */
export function includes(array, item, fromIndex = 0) {
  const arrayLength = array.length;
  if (arrayLength === 0) {
    return false;
  }

  let found = false, i = fromIndex;
  do {
    if (array[i] === item) {
      found = true;
    }
  } while (!found && i < arrayLength - 1);

  return found;
}

/**
 * @param {Array} array
 * @param {(value: *, index: number, array: Array) => unknown} predicate
 * @param {* | undefined} thisArg
 * @returns {boolean}
 */
export function some(array, predicate, thisArg = undefined) {
  const arrayLength = array.length;
  if (arrayLength === 0) {
    return false;
  }

  const func = thisArg !== undefined ? predicate.bind(thisArg) : predicate;

  let match = false, i = 0;
  do {
    match = func(array[i], i++);
  } while (!match && i < arrayLength);

  return match;
}

/**
 * @param {Array} array
 * @param {(value: *, index: number, array: Array) => boolean} predicate
 * @param {* | undefined} thisArg
 * @returns {boolean}
 */
export function every(array, predicate, thisArg = undefined) {
  const arrayLength = array.length;
  if (arrayLength === 0) {
    return false;
  }

  const func = thisArg !== undefined ? predicate.bind(thisArg) : predicate;

  let match = true, i = 0;
  do {
    match = func(array[i], i++);
  } while (match && i < arrayLength);

  return match;
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
