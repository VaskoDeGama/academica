const mongoose = require('mongoose')
const config = require('config')
const { Roles } = require('../../models')
const { refreshTokenExp } = config.get('server')
const getRandomInt = require('../../utils/get-random-int')
const randomString = require('../../utils/random-string')

const roles = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: Roles.student,
    permissions: [
      {
        resource: 'users',
        read: true,
        write: false,
        delete: false,
        onlyOwned: true
      }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: Roles.teacher,
    permissions: [
      {
        resource: 'users',
        read: true,
        write: true,
        delete: true,
        onlyOwned: true
      }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: Roles.admin,
    permissions: [
      {
        resource: 'users',
        read: true,
        write: true,
        delete: true,
        onlyOwned: false
      }
    ]
  }
]

const teachers = [
]

for (let i = 0; i < 4; i += 1) {
  teachers.push({
    _id: new mongoose.Types.ObjectId(),
    username: `teacher${i}`,
    password: `teacher${i}`,
    skype: `teacher${i}Skype`,
    email: `teacher${i}Email@mail.ru`,
    balance: getRandomInt(1000, 10000),
    lastName: `teacher${i}`,
    firstName: `firstname${i}`,
    role: roles[1]._id,
    students: []
  })
}

const students = []

for (const teacher of teachers) {
  const { _id, students: refs, username } = teacher
  for (let i = 0; i < 10; i += 1) {
    const studId = new mongoose.Types.ObjectId()
    students.push({
      _id: studId,
      username: `Student${i}${username}`,
      password: `Student${i}`,
      skype: `Student${i}Skype`,
      email: `Student${i}${username}Skype@mail.ru`,
      balance: getRandomInt(1000, 10000),
      lastName: `Student${i}`,
      firstName: `${username}`,
      teacher: _id,
      role: roles[0]._id
    })

    refs.push(studId)
  }
}

const admins = [
  {
    _id: new mongoose.Types.ObjectId(),
    username: 'SuperAdmin',
    password: 'SuperAdmin',
    skype: 'SuperAdmin',
    email: 'SuperAdmin@mail.ru',
    role: roles[2]._id,
    lastName: 'Super',
    firstName: 'Admin'
  }
]

const mockUsers = [
  ...admins,
  ...teachers,
  ...students
]

const mockTokens = []

for (let i = 0; i < 10; i += 1) {
  const { _id } = mockUsers[i % 2 === 0 ? 0 : 1]

  mockTokens.push({
    _id: new mongoose.Types.ObjectId(),
    token: randomString(),
    createdByIp: `127.0.0.${i}`,
    expires: new Date([1, 4, 5].includes(i) ? Date.now() - refreshTokenExp : Date.now() + refreshTokenExp),
    user: _id
  })
}

module.exports = {
  mockUsers,
  mockUsersLength: mockUsers.length,
  mockTokens,
  mockTokensLength: mockTokens.length,
  roles
}
