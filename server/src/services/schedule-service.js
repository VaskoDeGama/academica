'use strict'

const ResultDTO = require('../models/result-dto')
const { Roles } = require('../models')

class ScheduleService {
  constructor (userService, scheduleService) {
    this.userService = userService
    this.scheduleService = scheduleService
  }

  /**
   *
   * @param {string} role
   * @param {string} userId
   * @param {User[]} schedules
   * @returns {User[]}
   */
  getOnlyOwned (role, userId, schedules = []) {
    return schedules.filter(schedule => this.isOwner(role, userId, schedule))
  }

  /**
   *
   * @param {string} role
   * @param {string} userId
   * @param {Schedule} schedule
   * @returns {boolean}
   */
  isOwner (role, userId, schedule) {
    switch (role) {
      case Roles.student: {
        // TODO
        return true
      }
      case Roles.teacher: {
        // TODO
        return true
      }
      case Roles.admin: {
        return true
      }
    }
  }

  /**
   *
   * @param {RequestDTO} reqDTO
   * @returns {Promise<ResultDto>}
   */
  async getAllSchedule (reqDTO) {
    const resDTO = new ResultDTO(reqDTO)
    const { hasQuery, query, user } = reqDTO
    const schedules = []

    const opt = {
      populate: [
        {
          path: 'teacher',
          select: 'firstName + lastName + skype'
        },
        {
          path: 'windows.lessons.student',
          select: 'firstName + lastName + skype'
        }
      ]
    }

    const select = {
      'windows.lessons.comments': 0
    }

    try {
      if (hasQuery) {
        schedules.push(...await this.scheduleService.findByQuery(query, select, opt))
      } else {
        schedules.push(...await this.scheduleService.getAll(select, opt))
      }

      const result = this.getOnlyOwned(user.role, user.id, schedules)

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
}

module.exports = ScheduleService
