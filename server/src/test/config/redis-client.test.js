'use strict'

const RedisClient = require('../../configs/redis-client')
const mockRedis = require('redis-mock')
const config = require('config')
const delay = require('../../utils/delay')

describe('RedisClient', () => {
  let redis = null
  beforeAll(async () => {
    redis = new RedisClient(config.redis)
    redis.redis = mockRedis
    await redis.connect()
  })

  afterAll(async () => {
    await redis.close()
  })

  afterEach(async () => {
    await new Promise(resolve => redis.client.flushdb(resolve))
  })

  it('server defined', () => {
    expect(redis).toBeDefined()
  })

  it('base', async () => {
    await new Promise(resolve => {
      redis.client.set('key', 'value', () => resolve())
    })

    const value = await new Promise((resolve, reject) => {
      redis.client.get('key', (err, value) => {
        if (err) reject(err)
        resolve(value)
      })
    })

    expect(value).toBe('value')
  })

  it('set', async () => {
    await redis.set('test key', 'test value')

    const value = await new Promise((resolve, reject) => {
      redis.client.get('test key', (err, value) => {
        if (err) reject(err)
        resolve(value)
      })
    })
    expect(value).toBe('test value')
  })

  it('get', async () => {
    await new Promise(resolve => {
      redis.client.set('test key 2', 'test value 2', () => resolve())
    })

    const value = await redis.get('test key 2')

    expect(value).toBe('test value 2')
  })

  it('ser with expiry', async () => {
    await redis.set('test key 3', 'value 3', 1)
    const value = await redis.get('test key 3')
    await delay(1500)
    const valueAfterDelay = await redis.get('test key 3')

    expect(value).toBe('value 3')
    expect(valueAfterDelay).toBe(null)
  })
})
