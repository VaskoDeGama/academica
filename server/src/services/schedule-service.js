'use strict'

const ResultDTO = require('../models/result-dto')
const { Roles } = require('../models')

class ScheduleService {
  constructor (userRepository, scheduleRepository, windowRepository, lessonRepository, commentRepository) {
    this.userRepository = userRepository
    this.scheduleRepository = scheduleRepository
    this.windowRepository = windowRepository
    this.lessonRepository = lessonRepository
    this.commentRepository = commentRepository
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
    const { id, role, teacherId } = user
    switch (role) {
      case Roles.student: {
        return lesson.student.id === id
      }
      case Roles.teacher: {
        return lesson.student.teacher.toString() === id
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

    const opt = {
      populate: [
        {
          path: 'teacher',
          select: 'firstName + lastName + skype'
        },
        {
          path: 'windows',
          populate: [
            {
              path: 'lessons',
              select: '-comments',
              populate: [
                {
                  path: 'student',
                  select: 'firstName + lastName + skype'
                }
              ]
            }
          ]
        }
      ]
    }

    const select = {
    }

    try {
      const schedules = await this.scheduleRepository.getAll(select, opt)

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
   * @param {RequestDTO} reqDTO
   * @returns {Promise<ResultDto>}
   */
  async getById (reqDTO) {
    const resDTO = new ResultDTO(reqDTO)

    const select = {}

    const schedulePopulate = {
      populate: [
        {
          path: 'teacher',
          select: 'firstName + lastName + skype'
        },
        {
          path: 'windows',
          populate: [
            {
              path: 'lessons',
              select: '-comments',
              populate: [
                {
                  path: 'student',
                  select: 'firstName + lastName + skype'
                }
              ]
            }
          ]
        }
      ]
    }

    const windowPopulate = {
      populate: [
        {
          path: 'schedule',
          select: 'teacher',
          populate: [
            {
              path: 'teacher',
              select: 'firstName + lastName + skype'
            }
          ]
        },
        {
          path: 'lessons',
          select: '-comments',
          populate: [
            {
              path: 'student',
              select: 'firstName + lastName + skype'
            }
          ]
        }
      ]
    }

    const lessonPopulate = {
      populate: [
        {
          path: 'student',
          select: 'firstName + lastName + skype + teacher'
        },
        {
          path: 'window',
          select: 'startTime + endTime'
        },
        {
          path: 'comments',
          select: '-lesson'
        }
      ]
    }

    const commentPopulate = {
      populate: [
        {
          path: 'author',
          select: 'firstName + lastName + skype + teacher'
        },
        {
          path: 'lesson',
          select: '-comments',
          populate: [
            {
              path: 'student',
              select: 'firstName + lastName + skype + teacher'
            },
            {
              path: 'window',
              select: 'startTime + endTime'
            },
            {
              path: 'comments',
              select: '-lesson'
            }
          ]
        }
      ]
    }

    try {
      const { scheduleId, windowId, lessonId, commentId } = reqDTO.params

      let result = null

      if (scheduleId) {
        const schedule = await this.scheduleRepository.findById(scheduleId, select, schedulePopulate)
        if (schedule && this.isScheduleOwner(reqDTO.user, schedule)) {
          result = schedule
        }
      } else if (windowId) {
        const window = await this.windowRepository.findById(windowId, select, windowPopulate)
        if (window && this.isWindowOwner(reqDTO.user, window)) {
          result = window
        }
      } else if (lessonId) {
        const lesson = await this.lessonRepository.findById(lessonId, select, lessonPopulate)
        if (lesson && this.isLessonOwner(reqDTO.user, lesson)) {
          lesson.comments = this.getOnlyOwned(reqDTO.user, 'comment', lesson.comments)
          result = lesson
        }
      } else if (commentId) {
        const comment = await this.commentRepository.findById(commentId, select, commentPopulate)
        if (comment && this.isCommentOwner(reqDTO.user, comment)) {
          result = comment
        }
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
}

module.exports = ScheduleService
