const getDatabaseClient = require('../../configs/db-connect')
const config = require('config')
const BaseRepository = require('../../repositories/base-repository')

describe('Base repo test', () => {
  let mongo = null
  let repo = null
  beforeAll(async () => {
    const dbConfig = config.get('DataBase')
    mongo = await getDatabaseClient(dbConfig.url, dbConfig.dbName)
    repo = new BaseRepository('testCollection', {
      username: { type: String, required: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['admin', 'student', 'teacher'], default: 'student' }
    })
  })

  afterEach(async () => {
    await repo._model.deleteMany()
  })

  afterAll(async () => {
    await mongo.connection.close()
  })

  it('connected', () => {
    expect(mongo.connection.readyState).toBe(1)
  })

  it('findById', async () => {
    const id = new mongo.Types.ObjectId()
    const mockUser = {
      _id: id,
      username: 'findById',
      password: 'findByIdpassword'
    }
    await repo.save(mockUser)
    const userFromDb = await repo.findById(id.toString())

    expect(userFromDb.username).toBe(mockUser.username)
    expect(userFromDb.password).toBe(mockUser.password)
    expect(userFromDb.role).toBe('student')
  })

  it('save', async () => {
    const mockUser = {
      username: 'test1',
      password: 'test1password'
    }
    const resp = await repo.save(mockUser)
    const userFromDb = await repo.findById(resp._id)

    expect(userFromDb.username).toBe(mockUser.username)
    expect(userFromDb.password).toBe(mockUser.password)
    expect(userFromDb.role).toBe('student')
  })

  it('getAll', async () => {
    const length = 10
    for (let i = 0; i < length; i += 1) {
      await repo.save({
        username: `username${i}`,
        password: `password${i}`
      })
    }

    const usersFromDb = await repo.findAll()

    expect(Array.isArray(usersFromDb)).toBeTruthy()
    expect(usersFromDb.length).toBe(length)
  })

  it('findManyById', async () => {
    const length = 10
    const ids = []
    for (let i = 0; i < length; i += 1) {
      const id = new mongo.Types.ObjectId()
      ids.push(id.toString())
      await repo.save({
        _id: id,
        username: `username${i}`,
        password: `password${i}`
      })
    }

    const usersFromDb = await repo.findManyById(ids.slice(0, length / 2))

    expect(Array.isArray(usersFromDb)).toBeTruthy()
    expect(usersFromDb.length).toBe(length / 2)
  })

  it('findManyByQuery', async () => {
    const length = 10
    for (let i = 0; i < length; i += 1) {
      if ([2, 4, 8].includes(i)) {
        await repo.save({
          username: `username${i}`,
          password: `password${i}`,
          role: 'teacher'
        })
      } else {
        await repo.save({
          username: `username${i}`,
          password: `password${i}`
        })
      }
    }

    const usersFromDb = await repo.findManyByQuery({
      role: 'teacher'
    })

    console.log(usersFromDb)
    expect(Array.isArray(usersFromDb)).toBeTruthy()
    expect(usersFromDb[0].role).toBe('teacher')
    expect(usersFromDb.length).toBe(3)
  })
})
