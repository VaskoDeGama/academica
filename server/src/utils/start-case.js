/**
 * @param {string} str - lower case string
 * @returns {string}  - Lower case string
 */
function startCase (str = '') {
  if (!str.length) {
    return str
  }
  return `${str[0].toUpperCase()}${str.slice(1)}`
}

module.exports = startCase
