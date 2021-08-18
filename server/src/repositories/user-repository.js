'use strict'

const BaseRepository = require('./base-repository')
const userSchema = require('../models/user')

class UserRepository extends BaseRepository {}

module.exports = new UserRepository('users', userSchema)
