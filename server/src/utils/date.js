'use strict'

/**
 * @param {number} [timestamp=Date.now()]
 * @returns {Date} - date with zero h, m, s, ms
 */
function getDay (timestamp = Date.now()) {
  const date = new Date(timestamp)
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)

  return date
}

/**
 * @param {number} timestamp = Date.now()
 * @param {number} hours = 0
 * @param {number} minutes = 0
 * @returns {Date} - date with h and m and zero m, s
 */
function setTime (timestamp = Date.now(), hours = 0, minutes = 0) {
  const date = getDay(timestamp)
  if (hours >= 0 && hours <= 23) {
    date.setHours(hours)
  }
  if (hours >= 0 && hours <= 59) {
    date.setMinutes(minutes)
  }
  return date.getTime()
}
module.exports = {
  getDay,
  setTime
}
