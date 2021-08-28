'use strict'

const express = require('express')
const { MongoRepository } = require('../../repositories/')
const { AuthService } = require('../../services/')
const { AuthController } = require('../../controllers')
const { User, Token } = require('../../models')
const { authorize } = require('../../middleware')
const authRouter = express.Router()

const userRepository = new MongoRepository(User)
const tokenRepository = new MongoRepository(Token)
const authService = new AuthService(userRepository, tokenRepository)
const authController = new AuthController(authService)

/**
 * Login
 */
authRouter.post('/login', async (req, res, next) => {
  await authController.authenticate(req, res, next)
})

/**
 * update Token
 */
authRouter.get('/refresh', authorize(), async (req, res, next) => {
  await authController.refreshToken(req, res, next)
})

/**
 * blacklist Token
 */
authRouter.get('/tokens', authorize(), async (req, res, next) => {
  await authController.getTokens(req, res, next)
})

/**
 * blacklist Token
 */
authRouter.get('/logout', authorize(), async (req, res, next) => {
  await authController.revokeToken(req, res, next)
})

module.exports = authRouter
