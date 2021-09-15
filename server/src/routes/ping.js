'use strict'

const httpContext = require('express-http-context')
const express = require('express')
const ResultDTO = require('../models/result-dto')
const BaseController = require('../controllers/base-controller')
const DB = require('../infrastructure/database')
const { Types } = require('../models')

const pingRouter = express.Router()

pingRouter.get('', (req, res, next) => {
  const startTime = httpContext.get('reqStartTime')
  const resultDTO = new ResultDTO(req)
  const cache = req.app.get('ioc')?.get(Types.cache)
  resultDTO.data = {
    isOnline: true,
    timing: Date.now() - startTime,
    dbStatus: DB.ping(),
    cacheStatus: cache?.ping() ? 'connected' : 'disconnected'
  }

  BaseController.setResponse({ req, res, resultDTO })
  next()
})

module.exports = pingRouter
