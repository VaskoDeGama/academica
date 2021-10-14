'use strict'

const BaseController = require('./base-controller')
const RequestDTO = require('../models/request-dto')
const { Roles, Types, Methods, Validators } = require('./../models')
const { ResultDTO } = require('../models')

class ScheduleController extends BaseController {
  constructor (authorize, checkPermission, validate) {
    super()
    this.path = '/schedule'
    this.ALL = authorize([Roles.teacher, Roles.admin, Roles.student])
    this.NOT_STUDENT = authorize([Roles.teacher, Roles.admin])
    this.SCHEDULE_VALIDATE = validate(Validators.scheduleSchema)
    this.WINDOW_VALIDATE = validate(Validators.windowSchema)
    this.LESSON_VALIDATE = validate(Validators.lessonSchema)
    this.COMMENT_VALIDATE = validate(Validators.commentSchema)
    this.ID_VALIDATE = validate(Validators.idSchema)

    this.routes = [
      // GET
      {
        path: '',
        method: Methods.GET,
        handler: this.getSchedule,
        localMiddleware: [this.ALL, this.ID_VALIDATE]
      },
      {
        path: '/:scheduleId',
        method: Methods.GET,
        handler: this.getScheduleById,
        localMiddleware: [this.ALL, this.ID_VALIDATE]
      },
      {
        path: '/:scheduleId/:windowId',
        method: Methods.GET,
        handler: this.getWindowById,
        localMiddleware: [this.ALL, this.ID_VALIDATE]
      },
      {
        path: '/:scheduleId/:windowId/:lessonId',
        method: Methods.GET,
        handler: this.getLessonById,
        localMiddleware: [this.ALL, this.ID_VALIDATE]
      },
      {
        path: '/:scheduleId/:windowId/:lessonId/:commentId',
        method: Methods.GET,
        handler: this.getCommentById,
        localMiddleware: [this.ALL, this.ID_VALIDATE]
      },
      // POST
      {
        path: '',
        method: Methods.POST,
        handler: this.createSchedule,
        localMiddleware: [this.NOT_STUDENT, this.SCHEDULE_VALIDATE]
      },
      {
        path: '/:scheduleId',
        method: Methods.POST,
        handler: this.createWindow,
        localMiddleware: [this.NOT_STUDENT, this.ID_VALIDATE, this.WINDOW_VALIDATE]
      },
      {
        path: '/:scheduleId/:windowId',
        method: Methods.POST,
        handler: this.createLesson,
        localMiddleware: [this.ALL, this.ID_VALIDATE, this.LESSON_VALIDATE]
      },
      {
        path: '/:scheduleId/:windowId/:lessonId',
        method: Methods.POST,
        handler: this.createComment,
        localMiddleware: [this.ALL, this.ID_VALIDATE, this.COMMENT_VALIDATE]
      }
    ]

    this.setRoutes()

    return {
      path: this.path,
      router: this.router
    }
  }

  // GET
  async getSchedule (req, res, next) {
    const reqDTO = new RequestDTO(req)
    // const scheduleService = reqDTO.ioc.get(Types.scheduleService)
    // const resultDTO =  await scheduleService.createSchedule(reqDTO)
    const resultDTO = new ResultDTO(reqDTO)
    resultDTO.data = 'getSchedule fn'
    this.setResp({ res, req, resultDTO })
    next()
  }

  async getScheduleById (req, res, next) {
    const reqDTO = new RequestDTO(req)
    // const scheduleService = reqDTO.ioc.get(Types.scheduleService)
    // const resultDTO =  await scheduleService.createSchedule(reqDTO)
    const resultDTO = new ResultDTO(reqDTO)
    resultDTO.data = 'getScheduleById fn'
    this.setResp({ res, req, resultDTO })
    next()
  }

  async getWindowById (req, res, next) {
    const reqDTO = new RequestDTO(req)
    // const scheduleService = reqDTO.ioc.get(Types.scheduleService)
    // const resultDTO =  await scheduleService.createSchedule(reqDTO)
    const resultDTO = new ResultDTO(reqDTO)
    resultDTO.data = 'getWindowById fn'
    this.setResp({ res, req, resultDTO })
    next()
  }

  async getLessonById (req, res, next) {
    const reqDTO = new RequestDTO(req)
    // const scheduleService = reqDTO.ioc.get(Types.scheduleService)
    // const resultDTO =  await scheduleService.createSchedule(reqDTO)
    const resultDTO = new ResultDTO(reqDTO)
    resultDTO.data = 'getLessonById fn'
    this.setResp({ res, req, resultDTO })
    next()
  }

  async getCommentById (req, res, next) {
    const reqDTO = new RequestDTO(req)
    // const scheduleService = reqDTO.ioc.get(Types.scheduleService)
    // const resultDTO =  await scheduleService.createSchedule(reqDTO)
    const resultDTO = new ResultDTO(reqDTO)
    resultDTO.data = 'getCommentById fn'
    this.setResp({ res, req, resultDTO })
    next()
  }

  // POST
  async createSchedule (req, res, next) {
    const reqDTO = new RequestDTO(req)
    // const scheduleService = reqDTO.ioc.get(Types.scheduleService)
    // const resultDTO =  await scheduleService.createSchedule(reqDTO)
    const resultDTO = new ResultDTO(reqDTO)
    resultDTO.data = 'createSchedule fn'
    this.setResp({ res, req, resultDTO })
    next()
  }

  async createWindow (req, res, next) {
    const reqDTO = new RequestDTO(req)
    // const scheduleService = reqDTO.ioc.get(Types.scheduleService)
    // const resultDTO =  await scheduleService.createSchedule(reqDTO)
    const resultDTO = new ResultDTO(reqDTO)
    resultDTO.data = 'createWindow fn'
    this.setResp({ res, req, resultDTO })
    next()
  }

  async createLesson (req, res, next) {
    const reqDTO = new RequestDTO(req)
    // const scheduleService = reqDTO.ioc.get(Types.scheduleService)
    // const resultDTO =  await scheduleService.createSchedule(reqDTO)
    const resultDTO = new ResultDTO(reqDTO)
    resultDTO.data = 'createLesson fn'
    this.setResp({ res, req, resultDTO })
    next()
  }

  async createComment (req, res, next) {
    const reqDTO = new RequestDTO(req)
    // const scheduleService = reqDTO.ioc.get(Types.scheduleService)
    // const resultDTO =  await scheduleService.createSchedule(reqDTO)
    const resultDTO = new ResultDTO(reqDTO)
    resultDTO.data = 'createComment fn'
    this.setResp({ res, req, resultDTO })
    next()
  }
}

module.exports = ScheduleController
