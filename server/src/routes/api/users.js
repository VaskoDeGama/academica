'use strict'

const express = require('express')
const usersRouter = express.Router()

const userController = require('./../../controllers/user-controller')

/**
 * Create
 */
usersRouter.post('', async (req, res, next) => {
  await userController.post(req, res)
  next()
})

/**
 * Get by id
 */
usersRouter.get('/:id', async (req, res, next) => {
  await userController.get(req, res)
  next()
})

/**
 * Get by query
 */
usersRouter.get('', async (req, res, next) => {
  await userController.get(req, res)
  next()
})

/**
 * Update
 */
usersRouter.put('/:id', async (req, res, next) => {
  res.status(200).json({ endpoint: 'Update' })
  next()
})

/**
 * Delete by query
 */
usersRouter.delete('', async (req, res, next) => {
  await userController.delete(req, res)
  next()
})

/**
 * Delete by id
 */
usersRouter.delete('/:id', async (req, res, next) => {
  await userController.delete(req, res)
  next()
})

module.exports = usersRouter
