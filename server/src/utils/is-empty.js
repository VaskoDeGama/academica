'use strict'

const toString = Object.prototype.toString
const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * @param {any} value
 * @returns {string}
 */
function getTag (value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return toString.call(value)
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isEmpty (value) {
  const tag = getTag(value)

  if (tag === '[object Map]' || tag === '[object Set]') {
    return !value.size
  }
  if (value == null) {
    return true
  }

  if (Array.isArray(value) || typeof value === 'string' || typeof value.splice === 'function') {
    return !value.length
  }

  if (typeof value === 'object') {
    return Reflect.ownKeys(value).every(key => !hasOwnProperty.call(value, key))
  }

  return true
}

module.exports = isEmpty
