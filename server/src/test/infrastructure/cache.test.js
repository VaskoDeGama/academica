'use strict'

const Cache = require('../../infrastructure/cache')
const delay = require('../../utils/delay')
const mockRedis = require('redis-mock')
const config = require('config')

const logger = {
  error: jest.fn().mockImplementation((text) => text),
  info: jest.fn().mockImplementation((text) => text)
}

describe('Cache', () => {
  let cache = null
  beforeAll(async () => {
    cache = new Cache(logger)
    cache.redis = mockRedis
  })

  afterEach(async () => {
    await new Promise(resolve => cache?.client?.flushdb(resolve) || resolve())
    await cache.close()
  })

  it('cache defined', () => {
    expect(cache).toBeDefined()
  })

  it('connect test', async () => {
    await cache.connect(config.cache)

    expect(logger.info.mock.results[0].value).toEqual('Connection to Redis established')
    expect(cache.client.connected).toBeTruthy()
  })

  it('base', async () => {
    await cache.connect(config.cache)

    await new Promise(resolve => {
      cache.client.set('key', 'value', () => resolve())
    })

    const value = await new Promise((resolve, reject) => {
      cache.client.get('key', (err, value) => {
        if (err) reject(err)
        resolve(value)
      })
    })

    expect(value).toBe('value')
  })

  it('set', async () => {
    await cache.connect(config.cache)

    await cache.set('test key', 'test value')

    const value = await new Promise((resolve, reject) => {
      cache.client.get('test key', (err, value) => {
        if (err) reject(err)
        resolve(value)
      })
    })
    expect(value).toBe('test value')
  })

  it('get', async () => {
    await cache.connect(config.cache)

    await new Promise(resolve => {
      cache.client.set('test key 2', 'test value 2', () => resolve())
    })

    const value = await cache.get('test key 2')

    expect(value).toBe('test value 2')
  })

  it('ser with expiry', async () => {
    await cache.connect(config.cache)

    await cache.set('test key 3', 'value 3', 1)
    const value = await cache.get('test key 3')
    await delay(1500)
    const valueAfterDelay = await cache.get('test key 3')

    expect(value).toBe('value 3')
    expect(valueAfterDelay).toBe(null)
  })
})
