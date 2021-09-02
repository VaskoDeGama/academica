'use strict'

const express = require('express')
const { AuthController } = require('../../controllers')
const { authorize } = require('../../middleware')
const authRouter = express.Router()

/**
 * Login
 */
authRouter.post('/login', AuthController.authenticate)

/**
 * update Token
 */
authRouter.get('/refresh', authorize(), AuthController.refreshToken)

/**
 * blacklist Token
 */
authRouter.get('/tokens', authorize(), AuthController.getTokens)

/**
 * blacklist Token
 */
authRouter.get('/logout', authorize(), AuthController.revokeToken)

module.exports = authRouter
