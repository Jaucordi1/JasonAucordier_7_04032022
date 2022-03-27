import { reduce, split, map } from "./utils/array.js";

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

const replacementChars = [
  ["àäâã", "a"],
  ["ÀÄÂÃ", "A"],
  ["éèêë", "e"],
  ["ÉÈËÊ", "E"],
  ["îïì", "i"],
  ["ÏÎÌ", "I"],
  ["òöôõ", "o"],
  ["ÒÖÔÕ", "O"],
  ["ùüû", "u"],
  ["ÙÜÛ", "U"],
  ["ç", "c"],
  ["Ç", "C"],
  [",;.:", "-"],
  [" ", ""],
];
/**
 * @param {string} str
 * @return {string}
 */
export function replaceAccentuedChars(str) {
  return reduce(replacementChars, (transformed, [voyels, replacement]) => {
    return reduce(split(voyels, ""), (transformed, voyel) => {
      return transformed.replaceAll(voyel, replacement);
    }, transformed);
  }, str);
}
