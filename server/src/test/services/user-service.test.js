'use strict'

const userService = require('../../services/user-service')
const MockRepo = require('./mock-repo')
const DTO = require('../../models/DTO')
const mongoose = require('mongoose')

describe('UserService', () => {
  let service = null
  beforeAll(async () => {
    service = userService
    service.repo = new MockRepo([], {
      username: { unique: true, required: true },
      password: {},
      role: { default: 'student' }
    })
  })

  afterEach(() => {
    service.repo.db = []
  })

  it('createUser', async () => {
    const mockRequest = {
      method: 'POST',
      body: {
        username: 'test1',
        password: 'testPassword'
      }
    }

    const dto = new DTO(mockRequest)

    expect(dto.status).toBe(500)

    await userService.createUser(dto)
    expect(dto instanceof DTO).toBeTruthy()
    expect(dto.status).toBe(201)
    expect(typeof dto.data.id).toBe('string')
    expect(dto.data.id.length).toBe(24)
    expect(typeof dto.success).toBeTruthy()
  })

  it('createUserError already exist', async () => {
    const mockRequest = {
      method: 'POST',
      body: {
        username: 'test1',
        password: 'testPassword'
      }
    }

    await userService.createUser(new DTO(mockRequest))

    const dto = new DTO(mockRequest)
    await userService.createUser(dto)

    expect(dto instanceof DTO).toBeTruthy()
    expect(dto.status).toBe(409)
    expect(dto.success).toBeFalsy()
    expect(Array.isArray(dto.errors)).toBeTruthy()
    expect(dto.errors.length).toBe(1)
    expect(dto.errors[0].type).toBe('Custom')
    expect(dto.errors[0].msg).toBe('A user with the same username already exists.')
  })

  it('createUserError validation', async () => {
    // TODO update test after implement
    const mockRequest = {
      method: 'POST',
      body: {
        password: 'testPassword'
      }
    }

    await userService.createUser(new DTO(mockRequest))

    const dto = new DTO(mockRequest)
    await userService.createUser(dto)

    expect(dto instanceof DTO).toBeTruthy()
    expect(dto.status).toBe(500)
    expect(dto.success).toBeFalsy()
    expect(Array.isArray(dto.errors)).toBeTruthy()
    expect(dto.errors.length).toBe(1)
    expect(dto.errors[0].type).toBe('ValidationError')
    expect(dto.errors[0].msg).toBe('validation failed: username: Path `username` is required.')
    expect(dto.errors.length).toBe(1)
  })

  it('findById', async () => {
    const id = new mongoose.Types.ObjectId()
    const mockRequest = {
      method: 'GET',
      params: {
        id: id.toString()
      }
    }
    const mockUser = {
      id: id.toString(),
      username: 'findById',
      password: 'findByIdpassword'
    }

    await userService.repo.saveUser(mockUser)
    const dto = new DTO(mockRequest)
    await userService.getUser(dto)

    expect(dto.success).toBeTruthy()
    expect(dto.status).toBe(200)
    expect(dto.data.username).toBe('findById')
    expect(dto.data.password).toBe('findByIdpassword')
    expect(dto.data.role).toBe('student')
    expect(dto.errors.length).toBe(0)
  })

  it('getAll', async () => {
    const length = 10
    for (let i = 0; i < length; i += 1) {
      await userService.repo.saveUser({
        username: `username${i}`,
        password: `password${i}`
      })
    }
    const mockRequest = {
      method: 'GET',
      params: {},
      query: {},
      body: {}
    }
    const dto = new DTO(mockRequest)

    await userService.getUser(dto)

    expect(dto.success).toBeTruthy()
    expect(dto.status).toBe(200)
    expect(Array.isArray(dto.data.users)).toBeTruthy()
    expect(dto.data.count).toBe(length)
    expect(dto.errors.length).toBe(0)
  })

  it('findManyById', async () => {
    const length = 10
    const ids = []
    for (let i = 0; i < length; i += 1) {
      const id = new mongoose.Types.ObjectId()
      ids.push(id.toString())
      await userService.repo.saveUser({
        id: id,
        username: `username${i}`,
        password: `password${i}`
      })
    }

    const requestIds = ids.slice(0, length / 2)

    const mockRequest = {
      method: 'GET',
      params: {},
      query: { id: requestIds },
      body: {}
    }
    const dto = new DTO(mockRequest)

    await userService.getUser(dto)

    expect(dto.success).toBeTruthy()
    expect(dto.status).toBe(200)
    expect(Array.isArray(dto.data.users)).toBeTruthy()
    expect(dto.data.count).toBe(requestIds.length)
    expect(dto.data.users.every(user => requestIds.includes(user.id))).toBeTruthy()
    expect(dto.errors.length).toBe(0)
  })

  it('findManyByQuery', async () => {
    const length = 10
    for (let i = 0; i < length; i += 1) {
      if ([2, 4, 8].includes(i)) {
        await userService.repo.saveUser({
          username: `username${i}`,
          password: `password${i}`,
          role: 'teacher'
        })
      } else {
        await userService.repo.saveUser({
          username: `username${i}`,
          password: `password${i}`
        })
      }
    }

    const mockRequest = {
      method: 'GET',
      params: {},
      query: { role: 'teacher' },
      body: {}
    }
    const dto = new DTO(mockRequest)

    await userService.getUser(dto)

    expect(dto.success).toBeTruthy()
    expect(dto.status).toBe(200)
    expect(dto.data.count).toBe(3)
    expect(dto.data.users.length).toBe(3)
    expect(dto.data.users.every(user => mockRequest.query.role === user.role)).toBeTruthy()
  })

  it('findManyByQuery with id', async () => {
    const length = 10
    let needId = ''
    for (let i = 0; i < length; i += 1) {
      if ([2, 4, 8].includes(i)) {
        const id = new mongoose.Types.ObjectId()
        await userService.repo.saveUser({
          id: id.toString(),
          username: `username${i}`,
          password: `password${i}`,
          role: 'teacher'
        })

        if (i === 4) {
          needId = id.toString()
        }
      } else {
        await userService.repo.saveUser({
          username: `username${i}`,
          password: `password${i}`
        })
      }
    }

    const mockRequest = {
      method: 'GET',
      params: {},
      query: { role: 'teacher', id: needId },
      body: {}
    }
    const dto = new DTO(mockRequest)

    await userService.getUser(dto)
    expect(dto.success).toBeTruthy()
    expect(dto.status).toBe(200)
    expect(dto.data.count).toBe(1)
    expect(dto.data.users.length).toBe(1)
    expect(dto.data.users.every(user => mockRequest.query.id === user.id)).toBeTruthy()
  })

  it('findManyByQuery bad id', async () => {
    const length = 10
    for (let i = 0; i < length; i += 1) {
      if ([2, 4, 8].includes(i)) {
        const id = new mongoose.Types.ObjectId()
        await userService.repo.saveUser({
          id: id.toString(),
          username: `username${i}`,
          password: `password${i}`,
          role: 'teacher'
        })
      } else {
        await userService.repo.saveUser({
          username: `username${i}`,
          password: `password${i}`
        })
      }
    }

    const mockRequest = {
      method: 'GET',
      params: {},
      query: { role: 'teacher', id: 'bad id' },
      body: {}
    }
    const dto = new DTO(mockRequest)
    await userService.getUser(dto)

    expect(dto.success).toBeFalsy()
    expect(dto.status).toBe(404)
    expect(dto.data).toBe(null)
    expect(dto.errors[0].msg).toBe('Users not found')
    expect(dto.errors[0].type).toBe('Custom')
  })

  it('removeById', async () => {
    const id = new mongoose.Types.ObjectId()
    const hasBeforeCreate = !!await userService.repo.findUserById(id.toString())

    expect(hasBeforeCreate).toBeFalsy()

    await userService.repo.saveUser({
      id: id.toString(),
      username: 'username',
      password: 'password'
    })

    const hasAfterCreate = !!await userService.repo.findUserById(id.toString())
    expect(hasAfterCreate).toBeTruthy()

    const mockRequest = {
      method: 'DELETE',
      params: { id: id.toString() },
      query: { },
      body: {}
    }

    const dto = new DTO(mockRequest)

    await userService.removeUser(dto)

    const hasAfterDelete = !!await userService.repo.findUserById(id.toString())
    expect(hasAfterDelete).toBeFalsy()
    expect(dto.success).toBeTruthy()
    expect(dto.status).toBe(200)
    expect(dto.data.deletedCount).toBe(1)
  })

  it('removeByIds', async () => {
    const length = 10
    const needIds = []
    for (let i = 0; i < length; i += 1) {
      if ([2, 4, 8].includes(i)) {
        const id = new mongoose.Types.ObjectId()
        await userService.repo.saveUser({
          id: id.toString(),
          username: `username${i}`,
          password: `password${i}`,
          role: 'teacher'
        })

        needIds.push(id.toString())
      } else {
        await userService.repo.saveUser({
          username: `username${i}`,
          password: `password${i}`
        })
      }
    }

    const mockRequest = {
      method: 'DELETE',
      params: { },
      query: { id: needIds },
      body: {}
    }

    const dto = new DTO(mockRequest)

    await userService.removeUser(dto)

    const documents = await userService.repo.getAllUsers()

    expect(dto.success).toBeTruthy()
    expect(dto.status).toBe(200)
    expect(dto.data.deletedCount).toBe(3)
    expect(documents.length).toBe(7)
  })

  it('removeByQuery', async () => {
    const length = 10
    for (let i = 0; i < length; i += 1) {
      if ([2, 4, 8].includes(i)) {
        const id = new mongoose.Types.ObjectId()
        await userService.repo.saveUser({
          id: id.toString(),
          username: `username${i}`,
          password: `password${i}`,
          role: 'teacher'
        })
      } else {
        await userService.repo.saveUser({
          username: `username${i}`,
          password: `password${i}`
        })
      }
    }

    const mockRequest = {
      method: 'DELETE',
      params: { },
      query: { role: 'student' },
      body: {}
    }

    const dto = new DTO(mockRequest)

    await userService.removeUser(dto)

    const documents = await userService.repo.getAllUsers()

    expect(dto.success).toBeTruthy()
    expect(dto.status).toBe(200)
    expect(dto.data.deletedCount).toBe(7)
    expect(documents.length).toBe(3)
  })

  it('nothing if empty query ', async () => {
    const length = 10
    for (let i = 0; i < length; i += 1) {
      if ([2, 4, 8].includes(i)) {
        const id = new mongoose.Types.ObjectId()
        await userService.repo.saveUser({
          id: id.toString(),
          username: `username${i}`,
          password: `password${i}`,
          role: 'teacher'
        })
      } else {
        await userService.repo.saveUser({
          username: `username${i}`,
          password: `password${i}`
        })
      }
    }

    const mockRequest = {
      method: 'DELETE',
      params: {},
      query: {},
      body: {}
    }

    const dto = new DTO(mockRequest)

    await userService.removeUser(dto)

    const documents = await userService.repo.getAllUsers()

    expect(dto.success).toBeFalsy()
    expect(dto.status).toBe(404)
    expect(documents.length).toBe(10)
  })

  it('update record', async () => {
    const id = new mongoose.Types.ObjectId()

    await userService.repo.saveUser({
      id: id.toString(),
      username: 'username',
      password: 'password',
      role: 'student'
    })

    const mockRequest = {
      method: 'UPDATE',
      params: { id: id.toString() },
      query: {},
      body: { role: 'teacher' }
    }

    const dto = new DTO(mockRequest)

    await userService.updateUser(dto)

    const user = await userService.repo.findUserById(id.toString())

    expect(dto.success).toBeTruthy()
    expect(dto.status).toBe(200)
    expect(dto.data.id).toBe(id.toString())
    expect(user.role).toBe('teacher')
  })

  it('404 if bad id record', async () => {
    const id = new mongoose.Types.ObjectId()

    await userService.repo.saveUser({
      id: id.toString(),
      username: 'username',
      password: 'password',
      role: 'student'
    })

    const mockRequest = {
      method: 'UPDATE',
      params: { id: 'bad id' },
      query: {},
      body: { role: 'teacher' }
    }

    const dto = new DTO(mockRequest)

    await userService.updateUser(dto)

    const user = await userService.repo.findUserById(id.toString())

    expect(dto.success).toBeFalsy()
    expect(dto.status).toBe(404)
    expect(user.id).toBe(id.toString())
    expect(user.role).toBe('student')
  })
})
