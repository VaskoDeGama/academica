'use strict'

const BaseService = require('./base-service')
const userRepo = require('./../repositories/user-repository')

class UserService extends BaseService {

}

module.exports = new UserService(userRepo)
