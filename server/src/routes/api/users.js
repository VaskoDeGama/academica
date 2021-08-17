'use strict'

const express = require('express')
const usersRouter = express.Router()
const mock = require('./../../models/mock')
const BaseRepository = require('../../repositories/base-repository')
const BaseService = require('../../services/base-service')
const BaseController = require('../../controllers/base-controller')
const tokenChecker = require('../../middleware/token-checker')

const mockRepo = new BaseRepository('mock', mock)
const mockService = new BaseService(mockRepo)
const mockController = new BaseController(mockService)

/**
 * GetQuery
 */
usersRouter.get('/', async (req, res, next) => {
  res.status(200).json({ endpoint: 'GetQuery' })
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
