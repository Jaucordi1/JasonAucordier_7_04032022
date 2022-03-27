export function chunkArray(arr, chunkSize = 10) {
  if (arr.length <= chunkSize) return [[...arr]];
  const arrCopy = [...arr];
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
  return (a < b)
         ? -1
         : a > b;
}

/**
 * @param {string} str
 * @return {string}
 */
export function replaceAccentuedChars(str) {
  const replacements = [
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
  ];
  return replacements.reduce((transformed, [voyels, replacement]) => {
    return voyels
      .split("")
      .reduce((transformed, voyel) => {
        return transformed.replaceAll(voyel, replacement);
      }, transformed);
  }, str);
}
