'use strict'

const ResultDTO = require('../models/result-dto')

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

    if (user && user.validatePassword(password)) {
      console.log('Good boy')
    }

    return resDTO
  }
}

module.exports = AuthService
