/**
 * @param {string} id
 * @returns {boolean}
 */
function isId (id) {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

module.exports = isId
