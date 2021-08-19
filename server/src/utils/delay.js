'use strict'

/**
 * Delay
 *
 * @param {number} minDelay - ms
 * @param {number} [maxDelay] - ms
 * @returns {Promise}
 */
function delay (minDelay, maxDelay) {
  const timeout = maxDelay ? ~~((minDelay + (maxDelay - minDelay) * Math.random())) : minDelay

  return new Promise(resolve => setTimeout(resolve, timeout))
}

module.exports = delay
