'use strict'
const DataBase = require('../../infrastructure/database')
const config = require('config')
const { MongoMemoryServer } = require('mongodb-memory-server')

const logger = {
  error: jest.fn().mockImplementation((text) => text),
  info: jest.fn().mockImplementation((text) => text)
}

describe('DataBase', () => {
  let mongoServer = null
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        ip: config.db.ip,
        port: config.db.port
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await mongoServer.stop()
  })

  it('Defined', async () => {
    expect(DataBase).toBeDefined()
  })

  it('constructor', async () => {
    const expectedOptions = {
      dbName: 'Test',
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
    const db = new DataBase(logger)
    expect(db).toBeDefined()
    expect(db instanceof DataBase).toBeTruthy()
    expect(typeof db.log).toBe('object')
    expect(db.options).toEqual(expectedOptions)
  })

  it('connection', async () => {
    const db = new DataBase(logger)
    await db.connect({ url: mongoServer.getUri() })

    expect(logger.info.mock.results[0].value).toEqual('Connection to MongoDB established')
    expect(db.mongoose.STATES[db.mongoose.connection.readyState]).toBe('connected')
    await db.close()
  })

  it('close connection', async () => {
    const db = new DataBase(logger)
    await db.connect({ url: mongoServer.getUri() })

    expect(logger.info.mock.results[0].value).toEqual('Connection to MongoDB established')
    expect(db.mongoose.STATES[db.mongoose.connection.readyState]).toBe('connected')
    await db.close()
    expect(logger.info.mock.results[1].value).toEqual('Connection to MongoDB closed')
    expect(db.mongoose.STATES[db.mongoose.connection.readyState]).toBe('disconnected')
  })

  it('fail connection', async () => {
    const db = new DataBase(logger)
    db.options = {
      serverSelectionTimeoutMS: 1000
    }
    const connectionResult = await db.connect({ url: 'wrong url' })

    expect(connectionResult).toBeFalsy()
    expect(logger.info.mock.results[0].value).toMatch(/Connection to MongoDB closed/)
    expect(logger.error.mock.results[0].value).toMatch(/Error! DB Connection failed/)
    expect(db.mongoose.STATES[db.mongoose.connection.readyState]).toBe('disconnected')
  })

  it('ping', async () => {
    expect(DataBase.ping).toBeDefined()
    expect(DataBase.ping()).toBe('disconnected')
  })

  it('get connection', async () => {
    const db = new DataBase(logger)

    await db.connect({ url: mongoServer.getUri() })
    const connection = db.getConnection()
    expect(connection).toBeDefined()
    await db.close()
  })

  it('drop collections', async () => {
    const db = new DataBase(logger)

    await db.connect({ url: mongoServer.getUri() })
    await db.db.createCollection('test')
    await db.dropCollections(['test'])

    const collections = (await db.db.listCollections().toArray()).map(collection => collection.name)
    expect(collections.length).toBe(0)
    await db.close()
  })

  it('drop collections with not array arg', async () => {
    const db = new DataBase(logger)

    await db.connect({ url: mongoServer.getUri() })
    await db.db.createCollection('test')
    await db.dropCollections('test')

    const collections = (await db.db.listCollections().toArray()).map(collection => collection.name)
    expect(collections.length).toBe(0)
    await db.close()
  })

  it('drop collections with not exits collection', async () => {
    const db = new DataBase(logger)

    await db.connect({ url: mongoServer.getUri() })
    await db.db.createCollection('test')
    await db.dropCollections('collection')

    const collections = (await db.db.listCollections().toArray()).map(collection => collection.name)
    expect(collections.length).toBe(1)
    await db.close()
  })
})
