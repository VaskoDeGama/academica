'use strict'
/**
 * @param {any} func
 * @returns {boolean}
 */
function isClass (func) {
  return typeof func === 'function' &&
    /^class\s/.test(Function.prototype.toString.call(func))
}

module.exports = isClass
