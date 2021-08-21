const services = require('./../services')
const repositories = require('./../repositories')
const controllers = require('./../controllers')
const models = require('./../models')
const startCase = require('./start-case')

/**
 * @param {string} name - 'user'
 * @returns {Controller}
 */
function controllerFactory (name) {
  if (!name) {
    throw new Error('Model name must be defined')
  }

  const modelName = startCase(name)

  const model = models[modelName]

  if (!model) {
    throw new Error(`${modelName} Model no  found`)
  }

  const Repository = repositories[`${modelName}Repository`]

  if (!Repository) {
    throw new Error(`${modelName} Repository no  found`)
  }

  const Service = services[`${modelName}Service`]

  if (!Service) {
    throw new Error(`${modelName} Service no  found`)
  }

  const Controller = controllers[`${modelName}Controller`]

  if (!Controller) {
    throw new Error(`${modelName} Controller no  found`)
  }

  return new Controller(new Service(new Repository(name, model)))
}

module.exports = controllerFactory
