'use strict'

const { DiContainer } = require('./../../utils/di-container')

describe('DiContainer', () => {
  it('define', () => {
    expect(DiContainer).toBeDefined()
  })

  it('get new instnace', () => {
    const diContainer = new DiContainer()
    expect(diContainer instanceof DiContainer).toBeTruthy()
  })

  it('register number', () => {
    const diContainer = new DiContainer()

    diContainer.register('const', 12)
    expect(diContainer.get('const')).toBe(12)
  })

  it('register string', () => {
    const diContainer = new DiContainer()

    diContainer.register('const', '12')
    expect(diContainer.get('const')).toBe('12')
  })

  it('register object', () => {
    const diContainer = new DiContainer()

    const b = { c: 10 }
    diContainer.register('const', { a: b })
    expect(diContainer.get('const')).toStrictEqual({ a: b })
  })

  it('register array', () => {
    const diContainer = new DiContainer()

    const arr = ['a', 'b', {}]
    diContainer.register('const', arr)
    expect(diContainer.get('const')).toStrictEqual(arr)
  })

  it('dependency throw', () => {
    const diContainer = new DiContainer()
    expect(() => diContainer.get('const')).toThrow('Cannot find module const')
  })

  it('simple factory', () => {
    const diContainer = new DiContainer()

    const host = '127.0.0.1'
    const port = 1488
    const hostFactory = (port, host) => `${port}:${host}`
    diContainer.factory('fullHost', hostFactory, ['port', 'host'])
    diContainer.register('host', host)
    diContainer.register('port', port)
    expect(diContainer.get('fullHost')).toStrictEqual(`${port}:${host}`)
  })

  it('factory throw', () => {
    const diContainer = new DiContainer()

    const host = '127.0.0.1'
    const hostFactory = (port, host) => `${port}:${host}`
    diContainer.factory('fullHost', hostFactory, ['port', 'host'])
    diContainer.register('host', host)
    expect(() => diContainer.get('fullHost')).toThrow('Cannot find module port')
  })

  it('class factory 1 level', () => {
    const diContainer = new DiContainer()

    class Car {
      constructor (engine, wheels) {
        this.engine = engine
        this.wheels = wheels
      }
    }

    class Engine {
      constructor () {
        this.name = 'engine'
      }
    }

    class Wheels {
      constructor () {
        this.name = 'wheels'
      }
    }

    diContainer.factory('car', Car, ['engine', 'wheels'])
    diContainer.factory('engine', Engine)
    diContainer.factory('wheels', Wheels)

    const car = diContainer.get('car')

    expect(car instanceof Car).toBeTruthy()
    expect(car.engine instanceof Engine).toBeTruthy()
    expect(car.wheels instanceof Wheels).toBeTruthy()
    expect(diContainer.dependencies.car instanceof Car).toBeTruthy()
  })

  it('class factory 2 level', () => {
    const diContainer = new DiContainer()

    class Car {
      constructor (engine, wheels) {
        this.engine = engine
        this.wheels = wheels
      }
    }

    class Engine {
      constructor (oil) {
        this.name = 'engine'
        this.oil = oil
      }
    }

    class Wheels {
      constructor () {
        this.name = 'wheels'
      }
    }

    class Oil {
      constructor () {
        this.name = 'oil'
      }
    }

    diContainer.factory('car', Car, ['engine', 'wheels'])
    diContainer.factory('engine', Engine, ['oil'])
    diContainer.factory('wheels', Wheels)
    diContainer.factory('oil', Oil)

    const car = diContainer.get('car')

    expect(car instanceof Car).toBeTruthy()
    expect(car.engine instanceof Engine).toBeTruthy()
    expect(car.wheels instanceof Wheels).toBeTruthy()
    expect(car.engine.oil instanceof Oil).toBeTruthy()
    expect(diContainer.dependencies.car instanceof Car).toBeTruthy()
    expect(diContainer.dependencies.engine instanceof Engine).toBeTruthy()
    expect(diContainer.dependencies.wheels instanceof Wheels).toBeTruthy()
    expect(diContainer.dependencies.oil instanceof Oil).toBeTruthy()
  })
})
