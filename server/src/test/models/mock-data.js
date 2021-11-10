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
const scheduleIds = [
  '6172ea75448c32a24d34bf13',
  '6172ea75d0a87ebe2a3c3b98',
  '6172ea75a2bef5997c86a9ac',
  '6172ea757d46cbe584783198',
  '6172ea7523e24e98d5858f47',
  '6172ea757573843963efa46a',
  '6172ea751c19ca1afa627cbf',
  '6172ea75b5fa0414ef127a1e',
  '6172ea75c5848bed1095970c',
  '6172ea75a9b4fb55cd5169ff',
  '6172ea75dd6eb8803a4ec1f3',
  '6172ea757c9053df000bcd82',
  '6172ea75dcf46b627670e4ba',
  '6172ea75e4a4345f7c01c572',
  '6172ea75929e8a2beb53d0c5',
  '6172ea756ec47d9642662586',
  '6172ea751cee67bafe1c34ca',
  '6172ea75581f2a7c8f134c47',
  '6172ea753c89401d011727b8',
  '6172ea75b726f86430ac698c',
  '6172ea75885a10f7091bd93c',
  '6172ea75180c7ac50262ac67',
  '6172ea75773bfd0c80a62774',
  '6172ea751bea06065f5241c2',
  '6172ea75cbb5b6f99ed01f2c',
  '6172ea758ff5197708d09df8',
  '6172ea753b5a7198b18a6084',
  '6172ea7562dcb82e41e863fd',
  '6172ea758cf39ee35365bbce',
  '6172ea75559391c3ff5770e3',
  '6172ea758a06daaa5db3182c',
  '6172ea75f6d99a6ae20a8806',
  '6172ea753969df001e86ac61',
  '6172ea752f8c42b4a1d703bf',
  '6172ea75e97affaf8b0d65c1',
  '6172ea75e9ace9f5d1064ecb',
  '6172ea751cd7d3a01d9ad1f3',
  '6172ea756c22e0c321868140',
  '6172ea75918d45b7cc8fa200',
  '6172ea751c8e99a2399465f8',
  '6172ea7571ec54deb6850d5a',
  '6172ea75182160e689de8e31',
  '6172ea7509731b3095524aef',
  '6172ea750ff9ae1d35c9f96d',
  '6172ea75df4a0910d5a2a60b',
  '6172ea75fb6350561c634509',
  '6172ea75a2aff647c37cf04c',
  '6172ea7525f3403c9cf863bc',
  '6172ea7593c4f59c130d6a34',
  '6172ea7537aecd40198a8465',
  '6172ea7540fe159c0446e813',
  '6172ea7534c90523081638b4',
  '6172ea750fd6d5a2ae621535',
  '6172ea751be8747f02523c63',
  '6172ea7550ac9d3b0b5eac8e',
  '6172ea752940c79ad3d736bc',
  '6172ea7573ecadcdc41ee99e',
  '6172ea7583036b56c4722081',
  '6172ea757aecd465f6917ccc',
  '6172ea752501a85ef9d49f25',
  '6172ea756c2b72786d21fc7e',
  '6172ea7547be34aa011961a3',
  '6172ea75670e4b52500284b7',
  '6172ea756d44c39a523addf2',
  '6172ea75d2a5023e256c4d6e',
  '6172ea75a1733782e52d6eff',
  '6172ea75f323ebea13c1ce49',
  '6172ea75b82836003527a869',
  '6172ea75b40c3b47167219cd',
  '6172ea75bf159555337c2c68',
  '6172ea75a3f6ad2a57f3c5b9',
  '6172ea757042574a2479c4ab',
  '6172ea75bca0d666c5010341',
  '6172ea753ca1ff883d99c5ec',
  '6172ea754dce67cc2075d31c',
  '6172ea7552f4d1db5e657bce',
  '6172ea750e3d7f27f0711c9b',
  '6172ea75e6e9cf5ceb059cd7',
  '6172ea75eb493d8c3a0f3b48',
  '6172ea7544ed0f25bef689a9',
  '6172ea752b4d1a94ec9f3c4e',
  '6172ea75eef046e0b4eca29a',
  '6172ea75315da20e1a523d75',
  '6172ea7580e81b4ee620b2af',
  '6172ea757a6c059650450028',
  '6172ea7547dcec21a85fc26d',
  '6172ea75a3bcd87e5bcada7b',
  '6172ea75563bcee955f8bbfd',
  '6172ea75918512e36bd778ce',
  '6172ea759d5c5e2643124c9c',
  '6172ea75a5ad9dabfff23b4e',
  '6172ea7510b8194b196a916d',
  '6172ea75e1ababbce6433b5d',
  '6172ea75951c2d262a8b8b34',
  '6172ea7585886be2e3059fd2',
  '6172ea75ef5e78c812b3f558',
  '6172ea754a04eb5c7740f969',
  '6172ea758f94251aec26a670',
  '6172ea759b5f427ad5a8aa13',
  '6172ea7599510f9a39da382b'
]

const mockSchedule = []
const mockWindows = []
const mockLessons = []
const mockComments = []
const day = 24 * 60 * 60 * 1000
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
function generateDaysForTeacher (
  teacherId,
  daysCount,
  daysIds,
  basePrice,
  breakTime,
  minLessonTime,
  maxLessonTimeByOneUser
) {
  const schedules = []

  for (let i = 0; i <= daysCount; i += 1) {
    const _id = new mongoose.Types.ObjectId(daysIds[i])
    const date = getDay(Date.now() + ((i - (daysCount / 2)) * day))
    const teacher = teacherId
    const windows = []

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

idIndex = 0
for (const schedule of mockSchedule) {
  const { date, teacher, minLessonTime, maxLessonTimeByOneUser, breakTime } = schedule
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
      schedule: schedule._id,
      _id: new mongoose.Types.ObjectId(scheduleIds[idIndex]),
      lessons: []
    }

    idIndex += 1
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
          window: window._id,
          _id: new mongoose.Types.ObjectId(scheduleIds[idIndex]),
          student: studentsByTeacher[studentIndex]._id,
          comments: []
        }
        idIndex += 1

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
          const _id = new mongoose.Types.ObjectId(scheduleIds[idIndex])
          idIndex += 1
          lesson.comments.push(_id)
          mockComments.push({
            _id,
            lesson: lesson._id,
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
        window.lessons.push(lesson._id)
        mockLessons.push(lesson)
      }
    }
  }

  mockWindows.push(...windows)
  schedule.windows = windows.map(s => s._id)
}

module.exports = {
  mockWindows,
  mockComments,
  mockLessons,
  mockUsers,
  mockUsersLength: mockUsers.length,
  mockTokens,
  mockTokensLength: mockTokens.length,
  mockSchedule,
  mockScheduleLength: mockSchedule.length
}
