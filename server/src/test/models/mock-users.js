const mongoose = require('mongoose')
const getRandomInt = require('../../utils/get-random-int')
const mockUsers = []
const mockUsersLength = 10
const role = 'teacher'

for (let i = 0; i < mockUsersLength; i += 1) {
  mockUsers.push({
    _id: new mongoose.Types.ObjectId(),
    username: `Username${i}`,
    password: `Username${i}`,
    email: `username${i}@mail.ru`,
    role: [1, 3, 5].includes(i) ? role : 'student',
    skype: `UserSkype${i}`,
    balance: getRandomInt(1000, 10000)
  })
}

module.exports = {
  mockUsers,
  mockUsersLength
}
