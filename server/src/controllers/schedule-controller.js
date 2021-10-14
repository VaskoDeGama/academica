'use strict'

const BaseController = require('./base-controller')
const RequestDTO = require('../models/request-dto')
const { Roles, Types, Methods, Validators, Actions } = require('./../models')
const { ResultDTO } = require('../models')

class ScheduleController extends BaseController {
  constructor (authorize, checkPermission, validate) {
    super()
    this.path = '/schedule'
    this.ALL = authorize([Roles.teacher, Roles.admin, Roles.student])
    this.NOT_STUDENT = authorize([Roles.teacher, Roles.admin])

    this.SCHEDULE_CREATE = checkPermission('schedule', Actions.CREATE)
    this.SCHEDULE_DELETE = checkPermission('schedule', Actions.DELETE)
    this.SCHEDULE_UPDATE = checkPermission('schedule', Actions.UPDATE)
    this.SCHEDULE_READ = checkPermission('schedule', Actions.READ)

    this.LESSON_CREATE = checkPermission('lesson', Actions.CREATE)
    this.LESSON_DELETE = checkPermission('lesson', Actions.DELETE)
    this.LESSON_UPDATE = checkPermission('lesson', Actions.UPDATE)
    this.LESSON_READ = checkPermission('lesson', Actions.READ)

    this.WINDOW_CREATE = checkPermission('window', Actions.CREATE)
    this.WINDOW_DELETE = checkPermission('window', Actions.DELETE)
    this.WINDOW_UPDATE = checkPermission('window', Actions.UPDATE)
    this.WINDOW_READ = checkPermission('window', Actions.READ)

    this.COMMENT_CREATE = checkPermission('comment', Actions.CREATE)
    this.COMMENT_DELETE = checkPermission('comment', Actions.DELETE)
    this.COMMENT_UPDATE = checkPermission('comment', Actions.UPDATE)
    this.COMMENT_READ = checkPermission('comment', Actions.READ)

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
        localMiddleware: [this.ALL, this.SCHEDULE_READ, this.ID_VALIDATE]
      },
      {
        path: '/:scheduleId/:windowId',
        method: Methods.GET,
        handler: this.getWindowById,
        localMiddleware: [this.ALL, this.WINDOW_READ, this.ID_VALIDATE]
      },
      {
        path: '/:scheduleId/:windowId/:lessonId',
        method: Methods.GET,
        handler: this.getLessonById,
        localMiddleware: [this.ALL, this.LESSON_READ, this.ID_VALIDATE]
      },
      {
        path: '/:scheduleId/:windowId/:lessonId/:commentId',
        method: Methods.GET,
        handler: this.getCommentById,
        localMiddleware: [this.ALL, this.COMMENT_READ, this.ID_VALIDATE]
      },
      // POST
      {
        path: '',
        method: Methods.POST,
        handler: this.createSchedule,
        localMiddleware: [this.NOT_STUDENT, this.SCHEDULE_CREATE, this.SCHEDULE_VALIDATE]
      },
      {
        path: '/:scheduleId',
        method: Methods.POST,
        handler: this.createWindow,
        localMiddleware: [this.NOT_STUDENT, this.WINDOW_CREATE, this.ID_VALIDATE, this.WINDOW_VALIDATE]
      },
      {
        path: '/:scheduleId/:windowId',
        method: Methods.POST,
        handler: this.createLesson,
        localMiddleware: [this.ALL, this.LESSON_CREATE, this.ID_VALIDATE, this.LESSON_VALIDATE]
      },
      {
        path: '/:scheduleId/:windowId/:lessonId',
        method: Methods.POST,
        handler: this.createComment,
        localMiddleware: [this.ALL, this.COMMENT_CREATE, this.ID_VALIDATE, this.COMMENT_VALIDATE]
      },
      // PUT
      {
        path: '/:scheduleId',
        method: Methods.PUT,
        handler: this.updateSchedule,
        localMiddleware: [this.NOT_STUDENT, this.SCHEDULE_UPDATE, this.ID_VALIDATE, this.SCHEDULE_VALIDATE]
      },
      {
        path: '/:scheduleId/:windowId',
        method: Methods.PUT,
        handler: this.updateWindow,
        localMiddleware: [this.NOT_STUDENT, this.WINDOW_UPDATE, this.ID_VALIDATE, this.WINDOW_VALIDATE]
      },
      {
        path: '/:scheduleId/:windowId/:lessonId',
        method: Methods.PUT,
        handler: this.updateLesson,
        localMiddleware: [this.ALL, this.LESSON_UPDATE, this.ID_VALIDATE, this.LESSON_VALIDATE]
      },
      {
        path: '/:scheduleId/:windowId/:lessonId/:commentId',
        method: Methods.PUT,
        handler: this.updateComment,
        localMiddleware: [this.ALL, this.COMMENT_UPDATE, this.ID_VALIDATE, this.COMMENT_VALIDATE]
      },
      // DELETE
      {
        path: '/:scheduleId',
        method: Methods.DELETE,
        handler: this.deleteSchedule,
        localMiddleware: [this.NOT_STUDENT, this.SCHEDULE_DELETE, this.ID_VALIDATE]
      },
      {
        path: '/:scheduleId/:windowId',
        method: Methods.DELETE,
        handler: this.deleteWindow,
        localMiddleware: [this.NOT_STUDENT, this.WINDOW_DELETE, this.ID_VALIDATE]
      },
      {
        path: '/:scheduleId/:windowId/:lessonId',
        method: Methods.DELETE,
        handler: this.deleteLesson,
        localMiddleware: [this.ALL, this.LESSON_DELETE, this.ID_VALIDATE]
      },
      {
        path: '/:scheduleId/:windowId/:lessonId/:commentId',
        method: Methods.DELETE,
        handler: this.deleteComment,
        localMiddleware: [this.ALL, this.COMMENT_DELETE, this.ID_VALIDATE]
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
    const scheduleService = reqDTO.ioc.get(Types.scheduleService)
    console.log(scheduleService?.toString())
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

  // PUT
  async updateSchedule (req, res, next) {
    const reqDTO = new RequestDTO(req)
    // const scheduleService = reqDTO.ioc.get(Types.scheduleService)
    // const resultDTO =  await scheduleService.createSchedule(reqDTO)
    const resultDTO = new ResultDTO(reqDTO)
    resultDTO.data = 'updateSchedule fn'
    this.setResp({ res, req, resultDTO })
    next()
  }

  async updateWindow (req, res, next) {
    const reqDTO = new RequestDTO(req)
    // const scheduleService = reqDTO.ioc.get(Types.scheduleService)
    // const resultDTO =  await scheduleService.createSchedule(reqDTO)
    const resultDTO = new ResultDTO(reqDTO)
    resultDTO.data = 'updateWindow fn'
    this.setResp({ res, req, resultDTO })
    next()
  }

  async updateLesson (req, res, next) {
    const reqDTO = new RequestDTO(req)
    // const scheduleService = reqDTO.ioc.get(Types.scheduleService)
    // const resultDTO =  await scheduleService.createSchedule(reqDTO)
    const resultDTO = new ResultDTO(reqDTO)
    resultDTO.data = 'updateLesson fn'
    this.setResp({ res, req, resultDTO })
    next()
  }

  async updateComment (req, res, next) {
    const reqDTO = new RequestDTO(req)
    // const scheduleService = reqDTO.ioc.get(Types.scheduleService)
    // const resultDTO =  await scheduleService.createSchedule(reqDTO)
    const resultDTO = new ResultDTO(reqDTO)
    resultDTO.data = 'updateComment fn'
    this.setResp({ res, req, resultDTO })
    next()
  }

  // DELETE
  async deleteSchedule (req, res, next) {
    const reqDTO = new RequestDTO(req)
    // const scheduleService = reqDTO.ioc.get(Types.scheduleService)
    // const resultDTO =  await scheduleService.createSchedule(reqDTO)
    const resultDTO = new ResultDTO(reqDTO)
    resultDTO.data = 'deleteSchedule fn'
    this.setResp({ res, req, resultDTO })
    next()
  }

  async deleteWindow (req, res, next) {
    const reqDTO = new RequestDTO(req)
    // const scheduleService = reqDTO.ioc.get(Types.scheduleService)
    // const resultDTO =  await scheduleService.createSchedule(reqDTO)
    const resultDTO = new ResultDTO(reqDTO)
    resultDTO.data = 'deleteWindow fn'
    this.setResp({ res, req, resultDTO })
    next()
  }

  async deleteLesson (req, res, next) {
    const reqDTO = new RequestDTO(req)
    // const scheduleService = reqDTO.ioc.get(Types.scheduleService)
    // const resultDTO =  await scheduleService.createSchedule(reqDTO)
    const resultDTO = new ResultDTO(reqDTO)
    resultDTO.data = 'deleteLesson fn'
    this.setResp({ res, req, resultDTO })
    next()
  }

  async deleteComment (req, res, next) {
    const reqDTO = new RequestDTO(req)
    // const scheduleService = reqDTO.ioc.get(Types.scheduleService)
    // const resultDTO =  await scheduleService.createSchedule(reqDTO)
    const resultDTO = new ResultDTO(reqDTO)
    resultDTO.data = 'deleteComment fn'
    this.setResp({ res, req, resultDTO })
    next()
  }
}

module.exports = ScheduleController
