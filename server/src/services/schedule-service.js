'use strict'

const ResultDTO = require('../models/result-dto')
const { Roles } = require('../models')
const { allSchedulePopulate, schedulePopulate, windowPopulate, lessonPopulate, commentPopulate } = require('../models/populate')

class ScheduleService {
  constructor (userRepository, scheduleRepository, windowRepository, lessonRepository, commentRepository) {
    this.userRepository = userRepository
    this.scheduleRepository = scheduleRepository
    this.windowRepository = windowRepository
    this.lessonRepository = lessonRepository
    this.commentRepository = commentRepository

    this.populateOptions = {
      schedule: schedulePopulate,
      window: windowPopulate,
      lesson: lessonPopulate,
      comment: commentPopulate
    }
  }

  /**
   *
   * @param {User} user
   * @param {string} resourceName
   * @param {object[]} resource
   * @returns {object[]}
   */
  getOnlyOwned (user, resourceName, resource = []) {
    const permissions = user.permissions.find(p => p.resource === resourceName)
    switch (resourceName) {
      case 'schedule':
        return resource.filter(r => this.isScheduleOwner(user, r, permissions))
      case 'comment':
        return resource.filter(r => this.isCommentOwner(user, r, permissions))
      case 'window':
        return resource.filter(r => this.isWindowOwner(user, r, permissions))
      case 'lesson':
        return resource.filter(r => this.isLessonOwner(user, r, permissions))
    }
  }

  /**
   *
   * @param {User} user
   * @param {Lesson} lesson
   * @param {object} permissions
   * @returns {boolean}
   */
  isLessonOwner (user, lesson, permissions) {
    const { id, role } = user
    switch (role) {
      case Roles.student: {
        return lesson.student.id === id
      }
      case Roles.teacher: {
        return lesson?.student?.teacher?.toString() === id
      }
      case Roles.admin: {
        return true
      }
    }
  }

  /**
   *
   * @param {User} user
   * @param {Window} window
   * @param {object} permissions
   * @returns {boolean}
   */
  isWindowOwner (user, window, permissions) {
    const { id, role, teacherId } = user
    switch (role) {
      case Roles.student: {
        return window.schedule.teacher.id === teacherId
      }
      case Roles.teacher: {
        return window.schedule.teacher.id === id
      }
      case Roles.admin: {
        return true
      }
    }
  }

  /**
   *
   * @param {User} user
   * @param {Schedule} schedule
   * @param {object} permissions
   * @returns {boolean}
   */
  isScheduleOwner (user, schedule, permissions) {
    const { id, role, teacherId } = user
    switch (role) {
      case Roles.student: {
        return schedule.teacher.id === teacherId
      }
      case Roles.teacher: {
        return schedule.teacher.id === id
      }
      case Roles.admin: {
        return true
      }
    }
  }

  /**
   *
   * @param {User} user
   * @param {Comment} comment
   * @param {object} permissions
   * @returns {boolean}
   */
  isCommentOwner (user, comment, permissions) {
    return user.role === Roles.admin || !comment.isPrivate || (comment.isPrivate && user.id === comment.author.id)
  }

  /**
   *
   * @param {RequestDTO} reqDTO
   * @returns {Promise<ResultDto>}
   */
  async getAllSchedule (reqDTO) {
    const resDTO = new ResultDTO(reqDTO)

    const select = {
    }

    try {
      const schedules = await this.scheduleRepository.getAll(select, allSchedulePopulate)

      const result = this.getOnlyOwned(reqDTO.user, 'schedule', schedules)

      if (result.length) {
        resDTO.data = {
          count: result.length,
          schedules: result
        }

        return resDTO
      } else {
        return resDTO.addError('Resource not found', 404, 'RequestError')
      }
    } catch (e) {
      return resDTO.addError(e)
    }
  }

  /**
   *
   * @param {string[]|string} ids
   * @param {string} resourceName
   * @param {User} user
   * @returns {Promise<object[]>}
   */
  async getByIds (ids = [], resourceName = '', user) {
    if (!Array.isArray(ids)) {
      ids = [ids]
    }

    const repo = this.getRepo(resourceName)

    if (!repo) {
      throw new Error('Not found repository:', resourceName)
    }

    const select = {}

    const populate = this.populateOptions[resourceName]

    if (!populate) {
      throw new Error('Not found populateOptions for:', resourceName)
    }

    const resources = await repo.findByIds(ids, select, populate)

    if (!resources?.length) {
      return []
    }

    return this.getOnlyOwned(user, resourceName, resources)
  }

  /**
   *
   * @param {string} resourceName
   * @returns {MongoRepository}
   */
  getRepo (resourceName = '') {
    return this[`${resourceName}Repository`]
  }

  /**
   *
   * @param {RequestDTO} reqDTO
   * @returns {Promise<ResultDto>}
   */
  async get (reqDTO) {
    const resDTO = new ResultDTO(reqDTO)

    try {
      const { scheduleId, windowId, lessonId, commentId } = reqDTO.params

      let result = null

      if (scheduleId) {
        [result] = await this.getByIds(scheduleId, 'schedule', reqDTO.user)
      } else if (windowId) {
        [result] = await this.getByIds(windowId, 'window', reqDTO.user)
      } else if (lessonId) {
        const [lesson] = await this.getByIds(lessonId, 'lesson', reqDTO.user)
        if (lesson) {
          lesson.comments = this.getOnlyOwned(reqDTO.user, 'comment', lesson.comments)
          result = lesson
        }
      } else if (commentId) {
        [result] = await this.getByIds(commentId, 'comment', reqDTO.user)
      }

      if (result) {
        resDTO.data = result

        return resDTO
      } else {
        return resDTO.addError('Resource not found', 404, 'RequestError')
      }
    } catch (e) {
      return resDTO.addError(e)
    }
  }

  /**
   *
   * @param {RequestDTO} reqDTO
   * @returns {Promise<ResultDTO>}
   */
  async delete (reqDTO) {
    const resDTO = new ResultDTO(reqDTO)

    try {
      const result = null

      // TODO

      if (result) {
        resDTO.data = result

        return resDTO
      } else {
        return resDTO.addError('Resource not found', 404, 'RequestError')
      }
    } catch (e) {
      return resDTO.addError(e)
    }
  }

  /**
   *
   * @param {string[]} id
   * @param {string} resourceName
   * @returns {object}
   */
  deleteByIds (id = [], resourceName = '') {
    return {}
  }
}

module.exports = ScheduleService
