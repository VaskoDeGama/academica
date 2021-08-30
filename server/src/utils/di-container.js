'use strict'

const isCLass = require('./is-class')

class DiContainer {
  constructor () {
    this.dependencies = {}
    this.factories = {}
  }

  /**
   *
   * @param {symbol} name
   * @param {any} dependency
   */
  register (name, dependency) {
    this.dependencies[name] = dependency
  }

  /**
   *
   * @param {symbol} name
   * @param {Function | Class} factory
   * @param {string[]} depNames - array on string where string it's a name if ether dependency or factory
   */
  factory (name, factory, depNames = []) {
    this.factories[name] = { name, factory, depNames }
  }

  /**
   *
   * @param {symbol} name
   * @returns {any}
   */
  get (name) {
    if (!this.dependencies[name]) {
      const factory = this.factories[name]
      this.dependencies[name] = factory && this.picker(factory)
      if (!this.dependencies[name]) throw new Error(`Cannot find module ${name.description}`)
    }

    return this.dependencies[name]
  }

  /**
   *
   * @param {object} inject
   * @param {Function | Class} inject.factory
   * @param {string[]} inject.depNames
   * @returns {any}
   */
  picker ({ factory, depNames = [] }) {
    const args = []

    for (const name of depNames) {
      args.push(this.get(name))
    }

    if (isCLass(factory)) {
      // eslint-disable-next-line new-cap
      return new factory(...args)
    }

    return factory.apply(null, args)
  }
}

module.exports = {
  ioc: new DiContainer(),
  DiContainer
}
