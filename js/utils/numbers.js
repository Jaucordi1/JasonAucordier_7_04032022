/**
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
export function getRandomIntInRange(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
