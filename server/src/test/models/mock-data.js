const mongoose = require('mongoose')
const config = require('config')
const { Roles } = require('../../models')
const { refreshTokenExp } = config.get('server')
const getRandomInt = require('../../utils/get-random-int')
const randomString = require('../../utils/random-string')
const { getDay, setTime } = require('../../utils/date')

const str = [
  '613a3a53cdf4359d49740cf6',
  '613a3a53cdf4359d49740cf7',
  '613a3a53cdf4359d49740cf8',
  '613a3a53cdf4359d49740cf9',
  '613a3a53cdf4359d49740cfa',
  '613a3a53cdf4359d49740cfb',
  '613a3a53cdf4359d49740cfc',
  '613a3a53cdf4359d49740cfd',
  '613a3a53cdf4359d49740cfe',
  '613a3a53cdf4359d49740cff',
  '613a3a53cdf4359d49740d00',
  '613a3a53cdf4359d49740d01',
  '613a3a53cdf4359d49740d02',
  '613a3a53cdf4359d49740d03',
  '613a3a53cdf4359d49740d04',
  '613a3a53cdf4359d49740d05',
  '613a3a53cdf4359d49740d06',
  '613a3a53cdf4359d49740d07',
  '613a3a53cdf4359d49740d08',
  '613a3a53cdf4359d49740d09',
  '613a3a53cdf4359d49740d0a',
  '613a3a53cdf4359d49740d0b',
  '613a3a53cdf4359d49740d0c',
  '613a3a53cdf4359d49740d0d',
  '613a3a53cdf4359d49740d0e',
  '613a3a53cdf4359d49740d0f',
  '613a3a53cdf4359d49740d10',
  '613a3a53cdf4359d49740d11',
  '613a3a53cdf4359d49740d12',
  '613a3a53cdf4359d49740d13',
  '613a3a53cdf4359d49740d14',
  '613a3a53cdf4359d49740d15',
  '613a3a53cdf4359d49740d16',
  '613a3a53cdf4359d49740d17',
  '613a3a53cdf4359d49740d18',
  '613a3a53cdf4359d49740d19',
  '613a3a53cdf4359d49740d1a',
  '613a3a53cdf4359d49740d1b',
  '613a3a53cdf4359d49740d1c',
  '613a3a53cdf4359d49740d1d',
  '613a3a53cdf4359d49740d1e',
  '613a3a53cdf4359d49740d1f',
  '613a3a53cdf4359d49740d20',
  '613a3a53cdf4359d49740d21',
  '613a3a53cdf4359d49740d22'
]

const ids = str.map(id => new mongoose.Types.ObjectId(id))

const teachers = []

let idIndex = 0

for (let i = 0; i < 4; i += 1) {
  teachers.push({
    _id: ids[idIndex]._id,
    username: `teacher${i}`,
    password: `teacher${i}`,
    skype: `teacher${i}Skype`,
    email: `teacher${i}Email@mail.ru`,
    balance: getRandomInt(1000, 10000),
    lastName: `teacher${i}`,
    firstName: `firstname${i}`,
    role: Roles.teacher,
    students: []
  })
  idIndex += 1
}

const students = []

for (const teacher of teachers) {
  const { _id, students: refs, username } = teacher
  for (let i = 0; i < 10; i += 1) {
    const studId = ids[idIndex]._id
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
      role: Roles.student
    })
    refs.push(studId)
    idIndex += 1
  }
}

const admins = [
  {
    _id: ids[idIndex]._id,
    username: 'SuperAdmin',
    password: 'SuperAdmin',
    skype: 'SuperAdmin',
    email: 'SuperAdmin@mail.ru',
    role: Roles.admin,
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
const day = 24 * 60 * 60 * 1000

const mockSchedule = [
  {
    _id: new mongoose.Types.ObjectId('61682e1e8bca91911c8878ae'),
    date: getDay(Date.now() - day),
    teacher: teachers[0]._id,
    basePrice: 15,
    windows: [
      {
        startTime: setTime(Date.now() - day, 8, 30),
        endTime: setTime(Date.now() - day, 15, 40),
        lessons: [
          {
            startTime: setTime(Date.now() - day, 8, 45),
            endTime: setTime(Date.now() - day, 9, 45),
            student: students[4]._id,
            comments: [
              {
                author: students[4]._id,
                message: 'Some cool message for teacher',
                isPrivate: false,
                createdAt: setTime(Date.now() - 2 * day, 10, 44),
                updatedAt: setTime(Date.now() - 2 * day, 10, 44)
              },
              {
                author: teachers[0]._id,
                message: 'Some cool answer for student',
                isPrivate: false,
                createdAt: setTime(Date.now() - 2 * day, 11, 20),
                updatedAt: setTime(Date.now() - 2 * day, 11, 20)
              },
              {
                author: teachers[0]._id,
                message: 'Note for self',
                isPrivate: true,
                createdAt: setTime(Date.now() - 2 * day, 13, 25),
                updatedAt: setTime(Date.now() - 2 * day, 13, 25)
              }
            ]
          },
          {
            startTime: setTime(Date.now() - day, 10, 0),
            endTime: setTime(Date.now() - day, 11, 20),
            student: students[2]._id,
            comments: [
              {
                author: teachers[0]._id,
                message: 'Note for self',
                isPrivate: true,
                createdAt: setTime(Date.now() - 2 * day, 22, 40),
                updatedAt: setTime(Date.now() - 2 * day, 22, 40)
              }
            ]
          }
        ]
      },
      {
        startTime: setTime(Date.now() - day, 16, 40),
        endTime: setTime(Date.now() - day, 21, 10),
        lessons: [
          {
            startTime: setTime(Date.now() - day, 17, 44),
            endTime: setTime(Date.now() - day, 18, 59),
            student: students[3]._id,
            comments: []
          }
        ]
      }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId('61683989fbb6798c90342545'),
    date: getDay(Date.now()),
    teacher: teachers[0]._id,
    basePrice: 20,
    windows: [
      {
        startTime: setTime(Date.now(), 10, 30),
        endTime: setTime(Date.now(), 15, 40),
        lessons: [
          {
            startTime: setTime(Date.now(), 11, 0),
            endTime: setTime(Date.now(), 12, 0),
            student: students[4]._id,
            comments: [
              {
                author: students[4]._id,
                message: 'Some cool message for teacher',
                isPrivate: false,
                createdAt: setTime(Date.now() - day, 10, 44),
                updatedAt: setTime(Date.now() - day, 10, 44)
              }
            ]
          },
          {
            startTime: setTime(Date.now(), 14, 20),
            endTime: setTime(Date.now(), 15, 15),
            student: students[2]._id,
            comments: []
          }
        ]
      },
      {
        startTime: setTime(Date.now(), 17, 50),
        endTime: setTime(Date.now(), 22, 0),
        lessons: [
          {
            startTime: setTime(Date.now(), 18, 30),
            endTime: setTime(Date.now(), 19, 50),
            student: students[3]._id,
            comments: []
          }
        ]
      }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId('61683b363d3a3669dfb1d1db'),
    date: getDay(Date.now() + day),
    teacher: teachers[0]._id,
    basePrice: 20,
    windows: [
      {
        startTime: setTime(Date.now() + day, 13, 50),
        endTime: setTime(Date.now() + day, 15, 40),
        lessons: [
          {
            startTime: setTime(Date.now() + day, 13, 55),
            endTime: setTime(Date.now() + day, 15, 10),
            student: students[4]._id,
            comments: [
              {
                author: students[4]._id,
                message: 'Some cool message for teacher',
                isPrivate: false,
                createdAt: setTime(Date.now(), 10, 44),
                updatedAt: setTime(Date.now(), 10, 44)
              }
            ]
          }
        ]
      }
    ]
  }
]

module.exports = {
  mockUsers,
  mockUsersLength: mockUsers.length,
  mockTokens,
  mockTokensLength: mockTokens.length,
  mockSchedule,
  mockScheduleLength: mockSchedule.length
}
