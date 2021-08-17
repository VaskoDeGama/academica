'use strict'

const express = require('express')
const usersRouter = express.Router()

const tokenChecker = require('../../middleware/token-checker')

const userController = require('./../../controllers/user-controller')

/**
 * GetQuery
 */
usersRouter.get('/', async (req, res, next) => {
  // res.status(200).json({ endpoint: 'GetQuery' })
  await userController.getAll(req, res)
  next()
})

/**
 * Create
 */
usersRouter.post('/', async (req, res, next) => {
  res.status(200).json({ endpoint: 'Create' })
  next()
})

/**
 * Get
 */
usersRouter.get('/:id', async (req, res, next) => {
  res.status(200).json({ endpoint: 'Get' })
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
