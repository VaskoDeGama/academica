'use strict'

const ResultDTO = require('../models/result-dto')
const randomString = require('../utils/random-string')
const config = require('config')
const jwt = require('jsonwebtoken')
const { Roles } = require('../models')
const { isMongoId } = require('validator')
const Types = require('../ioc/types')

class AuthService {
  /**
   *
   * @param {MongoRepository} userRepository
   * @param {MongoRepository} tokenRepository
   * @param {Cache} cache
   */
  constructor (userRepository, tokenRepository, cache) {
    this.userRepository = userRepository
    this.tokenRepository = tokenRepository
    this.cache = cache
  }

  /**
   * Find user by username, check password, generate refresh and jwt token
   * if no user send 404
   * if bad password send 403
   *
   * @param {RequestDTO} reqDTO
   * @returns {ResultDTO}
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

    return resDTO.addCookie('refresh', refreshToken.token, { httpOnly: true, expires: new Date(Date.now() + config.server.refreshTokenExp) })
  }

  /**
   * @param {RequestDTO} reqDTO
   * @returns {ResultDTO}
   */
  async refreshToken (reqDTO) {
    const resDTO = new ResultDTO(reqDTO)

    const { refresh: token } = reqDTO.cookies
    try {
      const refreshToken = await this.getRefreshToken(token)
      const { user } = refreshToken

      const newRefreshToken = await this.generateRefreshToken(user, reqDTO.ipAddress)
      await this.revoke(token, newRefreshToken.token, reqDTO.ipAddress)
      const accessToken = this.generateJwtToken(user)
      resDTO.data = {
        token: accessToken
      }

      return resDTO.addCookie('refresh', newRefreshToken.token, { httpOnly: true, expires: new Date(Date.now() + config.server.refreshTokenExp) })
    } catch (e) {
      return resDTO.addError('Invalid token', 401)
    }
  }

  /**
   * @param {RequestDTO} reqDTO
   * @returns {ResultDTO}
   */
  async revokeToken (reqDTO) {
    const resDTO = new ResultDTO(reqDTO)
    const cache = reqDTO.ioc.get(Types.cache)
    const token = reqDTO.cookies.refresh || reqDTO.body.refresh
    const { id: userId, jti } = reqDTO.user
    const ipAddress = reqDTO.ipAddress

    if (!token || !userId || !jti) {
      return resDTO.addError('Token required', 400)
    }

    if (!reqDTO.user.ownsToken(token) && reqDTO.user.role !== Roles.admin) {
      return resDTO.addError('Unauthorized', 401)
    }

    await this.revoke(token, null, ipAddress)

    if (userId) {
      await cache.set(`${userId}:${jti}`, token, new Date(reqDTO.user.exp) - (Math.trunc(Date.now() / 1000)))
    }

    resDTO.data = {
      message: 'Token revoked'
    }

    return resDTO
  }

  /**
   * @param {RequestDTO} reqDTO
   * @returns {ResultDTO}
   */
  async getAllTokens (reqDTO) {
    const resDTO = new ResultDTO(reqDTO)

    const id = reqDTO.user.id || reqDTO.body.id || reqDTO.params.id

    if (!id || !isMongoId(id)) {
      return resDTO.addError('Id required', 400)
    }

    const tokens = await this.tokenRepository.findByQuery({ user: id })

    resDTO.data = {
      count: tokens.length,
      tokens
    }

    return resDTO
  }

  /**
   *
   * @param {string} token
   * @throws
   * @returns {Promise<Token>}
   */
  async getRefreshToken (token) {
    const [refreshToken] = await this.tokenRepository.findByQuery({ token }, {}, { populate: 'user' })
    if (!refreshToken || !refreshToken.isActive) {
      throw new Error('Invalid token')
    }
    return refreshToken
  }

  /**
   * @param {string} oldTOken
   * @param {string|null} newToken
   * @param {string} ipAddress
   * @returns {Promise<Token>}
   */
  async revoke (oldTOken, newToken, ipAddress) {
    await this.tokenRepository.findAndUpdate({ token: oldTOken }, {
      revoked: Date.now(),
      revokedByIp: ipAddress,
      replacedByToken: newToken
    })
  }

  /**
   * @param {User} user
   * @returns {string}
   */
  generateJwtToken (user) {
    return jwt.sign({ id: user.id, role: user.role }, config.server.secret, { expiresIn: config.server.tokenExp, jwtid: randomString(6) })
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
