'use strict'

/**
 * @param {string} cookie
 * @returns {{name: string, value: string, path: string, expire: Date, flags: string[]}}
 */
const parseCookie = (cookie) => {
  const [nameValue, pathRaw, expiresRaw, ...flags] = cookie.match(/([^;]+)/g)

  const [name, value] = nameValue.split('=')
  const [, path] = pathRaw.split('=')
  const [, rawDate] = expiresRaw.split('=')
  const expire = new Date(rawDate).getTime()
  return {
    name,
    value,
    path,
    expire,
    flags: flags.map(s => s?.trim())
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
  for (const { name, value, path, expire, flags } of rawCookies) {
    cookies[name] = {
      value,
      path,
      expire,
      flags
    }
  }

  return cookies
}

module.exports = getCookies
