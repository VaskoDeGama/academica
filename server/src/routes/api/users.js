'use strict'

const express = require('express')
const { User, userScheme } = require('../../models')
const { UserController } = require('../../controllers')
const { UserService } = require('../../services')
const { MongoRepository } = require('../../repositories')
const usersRouter = express.Router()

const userRepository = new MongoRepository(User)
const userService = new UserService(userRepository)
const userController = new UserController(userService, userScheme)

usersRouter.post('', async (req, res, next) => {
  await userController.create(req, res, next)
})
usersRouter.get('/:id', async (req, res, next) => {
  await userController.get(req, res, next)
})
usersRouter.get('', async (req, res, next) => {
  await userController.get(req, res, next)
})
usersRouter.put('/:id', async (req, res, next) => {
  await userController.update(req, res, next)
})
usersRouter.delete('/:id', async (req, res, next) => {
  await userController.delete(req, res, next)
})
usersRouter.delete('', async (req, res, next) => {
  await userController.delete(req, res, next)
})

module.exports = usersRouter
