const mongoose = require('mongoose')

const mockUsers = []
const mockUsersLength = 10
const role = 'teacher'

for (let i = 0; i < mockUsersLength; i += 1) {
  mockUsers.push({
    _id: new mongoose.Types.ObjectId(),
    username: `Username${i}`,
    password: `Username${i}`,
    email: `username${i}@mail.ru`,
    role: [1, 3, 5].includes(i) ? role : 'student'
  })
}

module.exports = {
  mockUsers,
  mockUsersLength
}
