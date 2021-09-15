'use strict'

/**
 * @param {any} str
 * @returns {boolean}
 */
function isNonEmptyString (str) {
  return typeof str === 'string' && !!str.trim()
}

/**
 * @param {string} str
 * @returns {{name: string, value: string, path: string, expire: Date, flags: string[]}}
 */
const parseCookie = (str) => {
  const parts = str.split(';').filter(isNonEmptyString)
  const nameValue = parts.shift()

  const [name, value] = nameValue.split('=')

  return {
    name,
    value
  }
}

/**
 *
 * @param {Response} response
 * @returns {object}
 */
const getCookies = (response) => {
  const setCookie = response.headers['set-cookie'] || []
  const rawCookies = setCookie.map(parseCookie)
  const cookies = {}
  for (const { name, value } of rawCookies) {
    cookies[name] = value
  }

  return cookies
}

module.exports = getCookies
