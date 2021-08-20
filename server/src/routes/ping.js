'use strict'

const httpContext = require('express-http-context')
const mongoose = require('mongoose')
const express = require('express')
const DTO = require('../models/DTO')
const BaseController = require('../controllers/base-controller')

const pingRouter = express.Router()

pingRouter.get('', (req, res, next) => {
  const startTime = httpContext.get('reqStartTime')
  const dto = new DTO(req)
  dto.data = {
    success: true,
    isOnline: true,
    timing: Date.now() - startTime,
    dbState: mongoose.STATES[mongoose.connection.readyState]
  }

  BaseController.setResponse({ req, res, dto })
  next()
})

module.exports = pingRouter
