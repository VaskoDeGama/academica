'use strict'

const ResultDTO = require('../models/result-dto')
const randomString = require('../utils/random-string')
const config = require('config')
const jwt = require('jsonwebtoken')

class AuthService {
  constructor (userRepository, tokenRepository) {
    this.userRepository = userRepository
    this.tokenRepository = tokenRepository
  }

  /**
   *
   * @param {RequestDTO} reqDTO
   * @returns {Promise<void>}
   */
  async authenticate (reqDTO) {
    const resDTO = new ResultDTO(reqDTO)

    const { username, password } = reqDTO.body

    const [user] = await this.userRepository.findByQuery({ username })

    if (!user) {
      return resDTO.addError('User not found', 404)
    }

    const isValidPassword = await user.validatePassword(password)

    if (!isValidPassword) {
      return resDTO.addError('The username or password is incorrect', 403)
    }

    const accessToken = this.generateJwtToken(user)
    const refreshToken = await this.generateRefreshToken(user, reqDTO.ipAddress)

    resDTO.data = {
      token: accessToken,
      user: this.basicDetails(user)
    }

    return resDTO.addCookie('refreshToken', refreshToken.token, { httpOnly: true, expires: new Date(Date.now() + config.server.refreshTokenExp) })
  }

  /**
   * @param {User} user
   * @returns {string}
   */
  generateJwtToken (user) {
    return jwt.sign({ id: user.id, role: user.role }, config.server.secret, { expiresIn: config.server.tokenExp })
  }

  /**
   * @param {User} user
   * @param {string} ipAddress
   * @returns {Token}
   */
  async generateRefreshToken (user, ipAddress) {
    return this.tokenRepository.save({
      user: user.id,
      token: randomString(),
      expires: new Date(Date.now() + config.server.refreshTokenExp),
      createdByIp: ipAddress
    })
  }

  /**
   * @param {User} user
   * @returns {{role: string, id: string, username: string}}
   */
  basicDetails (user) {
    const { id, username, role, balance, skype } = user
    return { id, username, role, balance, skype }
  }
}

module.exports = AuthService
