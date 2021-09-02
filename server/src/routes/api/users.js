'use strict'

const express = require('express')
const usersRouter = express.Router()

const { UserController } = require('../../controllers')

usersRouter.post('', UserController.create)
usersRouter.get('/:id', UserController.get)
usersRouter.get('', UserController.get)
usersRouter.put('/:id', UserController.update)
usersRouter.delete('/:id', UserController.delete)
usersRouter.delete('', UserController.delete)

module.exports = usersRouter
