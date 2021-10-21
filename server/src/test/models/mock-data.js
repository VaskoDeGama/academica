const mongoose = require('mongoose')
const config = require('config')
const { Roles } = require('../../models')
const { refreshTokenExp = 100 } = config.get('server')
const getRandomInt = require('../../utils/get-random-int')
const randomString = require('../../utils/random-string')
const getRandomText = require('../../utils/get-random-text')
const { getDay, setTime, getSlots } = require('../../utils/date')

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

const daysIds = [
  '61719607cc75bb3ee2c144f8',
  '61719607fc1f0c3061811785',
  '61719607609e1eca6e06f805',
  '617196071dfbf95e1c44bfae',
  '61719607a7b98884e24888c9',
  '617196071a79038d7f655eb4',
  '61719607d3606dcb57864661',
  '6171960771aea5a83a0aacaa',
  '617196073afd73f0cb07fa67',
  '617196077d04c47b11f9bc8d',
  '61719607c452d49047c9f1ce',
  '61719607929ade06e733ab50',
  '61719607fd42134ebcdcf994',
  '6171960759f149bfe42a7d6f',
  '61719607f106b8edd3f34a4e',
  '61719607a4b1b91215ce9890',
  '617196076a4db99cad4236d7',
  '6171960740983e14246a4a8a',
  '61719607481ede0dd7ef6131',
  '61719607359c246624a356e3',
  '61719607855c1b9ccebf1183',
  '61719607be50a19d2ec919bf',
  '617196073ffe171c442a4d24',
  '61719607b51f6303973d711a',
  '61719607eb32ec547eaa9fec',
  '6171960740dce74de68df70e',
  '617196072ac85977059f5f14',
  '6171960728398a53fea022d1',
  '6171960773f74e9f8032d1f4',
  '61719607a9126bd2fa73e28c',
  '617196071f47c3de1d877a8e',
  '617196073c126d6cf1e9a6f0',
  '61719607abaee8169d049b0f',
  '617196072a2dd6721958d13f',
  '6171960748dabcb9ba1bfb08',
  '61719607c2eca0423da8db6c',
  '61719607dcfd1467b237ef7f',
  '61719607e302e36832ef25b0',
  '6171960753945f96a820c310',
  '61719607a0251318a7a723e9'
]

const mockSchedule = []

/**
 * @param {ObjectId} teacherId
 * @param {number} daysCount
 * @param {string[]} daysIds
 * @param {number} basePrice
 * @param {number} breakTime
 * @param {number} minLessonTime
 * @param {number} maxLessonTimeByOneUser
 * @returns {object[]}
 */
function generateDaysForTeacher (teacherId, daysCount, daysIds, basePrice, breakTime, minLessonTime, maxLessonTimeByOneUser) {
  const schedules = []
  const day = 24 * 60 * 60 * 1000

  for (let i = 0; i <= daysCount; i += 1) {
    const _id = new mongoose.Types.ObjectId(daysIds[i])
    const date = getDay(Date.now() + ((i - (daysCount / 2)) * day))
    const teacher = teacherId
    const windows = []

    // generate windows
    const windowCountRnd = getRandomInt(0, 100)
    const windowCount = windowCountRnd <= 33
      ? 1
      : windowCountRnd >= 66
        ? 2
        : 3

    const workDayInHours = getRandomInt(14, 17)

    for (let j = 0; j < windowCount; j += 1) {
      const window = {
        lessons: []
      }
      if (j === 0) {
        const startH = getRandomInt(6, 10)
        const startM = getRandomInt(0, 59)
        const endH = startH + ~~(workDayInHours / windowCount)
        const endM = getRandomInt(0, 59)
        window.startTime = setTime(date, startH, startM)
        window.endTime = setTime(date, endH, endM)
        windows.push(window)
      } else {
        const [prevWindow] = windows.slice(-1)
        const startH = prevWindow.endTime.getHours() + getRandomInt(1, 2)
        const startM = getRandomInt(0, 59)
        let endH = startH + ~~(workDayInHours / windowCount)

        if (endH > 23) {
          endH = 23
        }

        const endM = getRandomInt(0, 59)
        window.startTime = setTime(date, startH, startM)
        window.endTime = setTime(date, endH, endM)
        windows.push(window)
      }
    }

    const studentsByTeacher = students.filter(s => s.teacher === teacher)

    // generate lessons
    for (const window of windows) {
      const lessonCountRnd = getRandomInt(0, 100)
      const lessonCount = lessonCountRnd <= 33
        ? 1
        : lessonCountRnd >= 66
          ? 2
          : 3

      for (let i = 0; i < lessonCount; i += 1) {
        const lessonDuration = getRandomInt(minLessonTime, maxLessonTimeByOneUser)
        const slots = getSlots(window, minLessonTime, breakTime)
        const slot = slots.find(s => s.duration >= lessonDuration)

        if (slot) {
          const studentIndex = getRandomInt(0, studentsByTeacher.length - 1)

          const lesson = {
            student: studentsByTeacher[studentIndex]._id,
            comments: []
          }

          studentsByTeacher.splice(studentIndex, 1)

          const startH = getRandomInt(slot.startTime.getHours(), slot.endTime.getHours())
          let startM = getRandomInt(0, 59)

          if (startH === slot.startTime.getHours()) {
            startM = slot.startTime.getMinutes()
          }

          lesson.startTime = setTime(date, startH, startM)
          lesson.endTime = new Date(lesson.startTime?.getTime() + lessonDuration)

          // generateComments
          const commentsCount = getRandomInt(0, 10)

          for (let j = 0; j < commentsCount; j += 1) {
            const createTimestamp = date - getRandomInt(0, 3) * day
            const isToday = date - createTimestamp > 24 * 60 * 60 * 1000
            lesson.comments.push({
              author: getRandomInt(0, 100) > 50 ? teacher : lesson.student,
              message: getRandomText(getRandomInt(10, 50)),
              isPrivate: getRandomInt(0, 100) > 50,
              createdAt: setTime(
                createTimestamp,
                getRandomInt(0, 24 - (isToday ? lesson.startTime.getHours() : 0)),
                getRandomInt(0, 59 - (isToday ? lesson.startTime.getMinutes() : 0))
              )
            })
          }
          window.lessons.push(lesson)
        }
      }
    }

    schedules.push({
      _id,
      date,
      teacher,
      basePrice,
      breakTime,
      minLessonTime,
      maxLessonTimeByOneUser,
      windows
    })
  }

  return schedules
}

mockSchedule.push(...generateDaysForTeacher(
  teachers[0]._id,
  10,
  daysIds.slice(0, 11),
  15,
  10 * 60 * 1000,
  5 * 60 * 1000,
  120 * 60 * 1000
))

mockSchedule.push(...generateDaysForTeacher(
  teachers[1]._id,
  10,
  daysIds.slice(11, 22),
  20,
  5 * 60 * 1000,
  10 * 60 * 1000,
  60 * 60 * 1000
))

module.exports = {
  mockUsers,
  mockUsersLength: mockUsers.length,
  mockTokens,
  mockTokensLength: mockTokens.length,
  mockSchedule,
  mockScheduleLength: mockSchedule.length
}
