'use strict'

const express = require('express')
const usersRouter = express.Router()

// const tokenChecker = require('../../middleware/token-checker')

const userController = require('./../../controllers/user-controller')

/**
 * GetQuery
 */
usersRouter.get('', async (req, res, next) => {
  await userController.getByQuery(req, res)
  next()
})

/**
 * Create
 */
usersRouter.post('', async (req, res, next) => {
  await userController.create(req, res)
  next()
})

/**
 * Get
 */
usersRouter.get('/:id', async (req, res, next) => {
  await userController.getById(req, res)
  next()
})

/**
 * Update
 */
usersRouter.put('/:id', async (req, res, next) => {
  res.status(200).json({ endpoint: 'Delete' })
  next()
})

/**
 * Delete
 */
usersRouter.delete('/:id', async (req, res, next) => {
  res.status(200).json({ endpoint: 'Delete' })
  next()
})

module.exports = usersRouter
