import { reduce, split } from "./array.js";

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
