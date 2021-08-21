'use strict'

const express = require('express')
const config = require('config')
const jwt = require('jsonwebtoken')
const authRouter = express.Router()

const tokens = {}
const { secret, secretRefresh, tokenExp, refreshTokenExp } = config.get('server')

/**
 * Login
 */
authRouter.post('/login', async (req, res, next) => {
  // TODO: валидациия
  const user = {
    username: req.body.username,
    password: req.body.password
  }
  // TODO: существует ли юзер и совпадает ли пароль
  if (user.username && user.password) {
    const token = jwt.sign({ user, refresh: false }, secret, { expiresIn: tokenExp })
    const refreshToken = jwt.sign({ user, refresh: true }, secretRefresh, { expiresIn: refreshTokenExp })

    tokens[user.username] = { user, refreshToken, token }
    // TODO: пишим RefreshToken в бд к юзеру

    res.status(200).json({
      token,
      user: user.username
    })
  } else {
    res.status(401).json({
      message: 'Very bad password'
    })
  }

  console.log(user, { secretRefresh, secret, tokenExp, refreshTokenExp })

  next()
})

/**
 * update Token
 */
authRouter.get('/token', async (req, res, next) => {
  // TODO: валидациия
  const username = req.body.username
  // TODO: берем юзера с токеном  из бд
  const { refreshToken, user } = tokens[username]
  // TODO: проверям рефрешь токен
  if (refreshToken) {
    // TODO: пишим RefreshToken в бд к юзеру
    const token = jwt.sign({ user, refresh: false }, secret, { expiresIn: tokenExp })

    tokens[user.username] = { user, refreshToken, token }
    res.status(200).json({
      user: username,
      token
    })
  } else {
    res.status(404).json({
      message: 'Very bad request'
    })
  }

  console.log(user, { secretRefresh, secret, tokenExp, refreshTokenExp })

  next()
})

/**
 * blacklist Token
 */
authRouter.get('/logout', async (req, res, next) => {
  // TODO:  добавляем токен в блеклист с expire
  res.status(2001).json({
    message: 'Good logout'
  })
  next()
})

module.exports = authRouter
