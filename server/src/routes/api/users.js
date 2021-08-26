'use strict'

const express = require('express')
const usersRouter = express.Router()
const controllerFactory = require('../../utils/controller-factory')

const userController = controllerFactory('user')

usersRouter.post('', (req, res, next) => {
  userController.create(req, res, next)
})
usersRouter.get('/:id', (req, res, next) => {
  userController.get(req, res, next)
})
usersRouter.get('', (req, res, next) => {
  userController.get(req, res, next)
})
usersRouter.put('/:id', (req, res, next) => {
  userController.update(req, res, next)
})
usersRouter.delete('/:id', (req, res, next) => {
  userController.delete(req, res, next)
})
usersRouter.delete('', (req, res, next) => {
  userController.delete(req, res, next)
})

module.exports = usersRouter
