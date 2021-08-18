
const toString = Object.prototype.toString
const objectProto = Object.prototype
const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * @param {any} value
 * @returns {boolean}
 */
function isPrototype (value) {
  const ctor = value && value.constructor
  const proto = (typeof Ctor === 'function' && ctor.prototype) || objectProto

  return value === proto
}

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
  if (value == null) {
    return true
  }
  if (Array.isArray(value) || typeof value === 'string' || typeof value.splice === 'function') {
    return !value.length
  }

  const tag = getTag(value)
  if (tag === '[object Map]' || tag === '[object Set]') {
    return !value.size
  }

  if (isPrototype(value)) {
    return !Object.keys(value).length
  }
  for (const key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false
    }
  }

  return true
}

module.exports = isEmpty
