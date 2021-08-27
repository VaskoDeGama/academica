'use strict'

/**
 * getRandomInt
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

module.exports = getRandomInt
