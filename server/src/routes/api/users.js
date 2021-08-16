'use strict'

const express = require('express')
const usersRouter = express.Router()
const mock = require('./../../models/mock')
const BaseRepository = require('../../repositories/base-repository')
const BaseService = require('../../services/base-service')
const BaseController = require('../../controllers/base-controller')

const mockRepo = new BaseRepository('mock', mock)
const mockService = new BaseService(mockRepo)
const mockController = new BaseController(mockService)

/**
 * Get all users
 */
usersRouter.get('/', async (req, res, next) => {
  await mockController.getAll(req, res)
  next()
})

/**
 * Create one
 */
usersRouter.post('/', async (req, res, next) => {
  await mockController.createOne(req, res)
  next()
})

module.exports = usersRouter
