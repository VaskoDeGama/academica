'use strict'

const Cache = require('../../configs/cache')
const mockRedis = require('redis-mock')
const config = require('config')
const delay = require('../../utils/delay')
const { appLogger } = require('../../utils/logger')

describe('Cache', () => {
  let cache = null
  beforeAll(async () => {
    cache = new Cache(appLogger)
    cache.redis = mockRedis
    await cache.connect(config.cache)
  })

  afterAll(async () => {
    await cache.close()
  })

  afterEach(async () => {
    await new Promise(resolve => cache.client.flushdb(resolve))
  })

  it('server defined', () => {
    expect(cache).toBeDefined()
  })

  it('base', async () => {
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
    await new Promise(resolve => {
      cache.client.set('test key 2', 'test value 2', () => resolve())
    })

    const value = await cache.get('test key 2')

    expect(value).toBe('test value 2')
  })

  it('ser with expiry', async () => {
    await cache.set('test key 3', 'value 3', 1)
    const value = await cache.get('test key 3')
    await delay(1500)
    const valueAfterDelay = await cache.get('test key 3')

    expect(value).toBe('value 3')
    expect(valueAfterDelay).toBe(null)
  })
})
