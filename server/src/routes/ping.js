'use strict'

const httpContext = require('express-http-context')
const express = require('express')
const ResultDTO = require('../models/result-dto')
const BaseController = require('../controllers/base-controller')
const DB = require('../infrastructure/database')
const { Types } = require('../models')

const pingRouter = express.Router()
/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve server status
 *     description: Retrieve object with server parameters like db ready and ping
 *     responses:
 *       200:
 *         description: Server status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  reqId:
 *                    type: string
 *                    description: Request id from request
 *                    example: 'bc7faebf-4225-4bc0-a821-ae43c61da81f'
 *                  success:
 *                    type: boolean
 *                    example: true
 *                  status:
 *                    type: number
 *                    example: 200
 *                  data:
 *                     type: object
 *                     description: Response data
 *                     properties:
 *                       isOnline:
 *                        type: boolean
 *                        example: true
 *                       dbStatus:
 *                        type: string
 *                        description: Database status. ['connected', 'disconnected'] JOPA
 *                        example: 'connected'
 *                       cacheStatus:
 *                        type: string
 *                        description: Cache status. ['connected', 'disconnected']
 *                        example: 'connected'
 *                       timing:
 *                        type: number
 *                        description: Request processing time in milliseconds
 *                        example: 3
 */
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
