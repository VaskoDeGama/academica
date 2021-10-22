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
   * @param {User} user
   * @param {string} resourceName
   * @param {Schedule[]} resource
   * @returns {Schedule[]}
   */
  getOnlyOwned (user, resourceName, resource = []) {
    const permissions = user.permissions.find(p => p.resource === resourceName)
    switch (resourceName) {
      case 'schedule':
        return resource.filter(r => this.isScheduleOwner(user, permissions, r))
    }
  }

  /**
   *
   * @param {User} user
   * @param {object} permissions
   * @param {Schedule} schedule
   * @returns {boolean}
   */
  isScheduleOwner (user, permissions, schedule) {
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
          path: 'windows.lessons.student',
          select: 'firstName + lastName + skype'
        }
      ]
    }

    const select = {
      'windows.lessons.comments': 0
    }

    try {
      const schedules = await this.scheduleService.getAll(select, opt)

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
}

module.exports = ScheduleService
