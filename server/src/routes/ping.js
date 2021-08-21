'use strict'

const httpContext = require('express-http-context')
const express = require('express')
const ResultDTO = require('../models/result-dto')
const BaseController = require('../controllers/base-controller')
const DB = require('./../configs/database')

const pingRouter = express.Router()

pingRouter.get('', (req, res, next) => {
  const startTime = httpContext.get('reqStartTime')
  const resultDTO = new ResultDTO(req)
  resultDTO.data = {
    success: true,
    isOnline: true,
    timing: Date.now() - startTime,
    dbStatus: DB.ping()
  }

  BaseController.setResponse({ req, res, resultDTO })
  next()
})

module.exports = pingRouter
