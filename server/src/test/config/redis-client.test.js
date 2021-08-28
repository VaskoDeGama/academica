'use strict'

const RedisClient = require('../../configs/redis-client')
const mockRedis = require('redis-mock')
const config = require('config')

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

  it('server defined', () => {
    expect(redis).toBeDefined()
  })

  it('base test', async () => {
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

  it('set test', async () => {
    await redis.set('test key', 'test value')

    const value = await new Promise((resolve, reject) => {
      redis.client.get('test key', (err, value) => {
        if (err) reject(err)
        resolve(value)
      })
    })
    expect(value).toBe('test value')
  })

  it('get test', async () => {
    await new Promise(resolve => {
      redis.client.set('test key 2', 'test value 2', () => resolve())
    })

    const value = await redis.get('test key 2')

    expect(value).toBe('test value 2')
  })
})
