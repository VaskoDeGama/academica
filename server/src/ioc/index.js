const DiContainer = require('./di-container')
const init = require('./init')

const ioc = new DiContainer()
init(ioc)

module.exports = {
  DiContainer,
  init,
  ioc
}
