'use strict'

/**
 * @typedef {object} ResourceRights
 * @property {string} resource - resource name
 * @property {boolean} onlyOwned - can do action with only owned resource
 * @property {boolean} read - can do read with resource
 * @property {boolean} create - can do create with resource
 * @property {boolean} delete - can do delete with resource
 * @property {boolean} update - can do update with resource
 * @property {string[]} mutableFields - list filed
 */

const Roles = {
  admin: 'admin',
  teacher: 'teacher',
  student: 'student'
}

const PERMISSIONS = {}
PERMISSIONS[Roles.student] = [
  {
    resource: 'users',
    read: true,
    create: false,
    delete: false,
    update: true,
    mutableFields: ['password', 'lastName', 'firstName', 'skype', 'email'],
    onlyOwned: true
  }
]

PERMISSIONS[Roles.teacher] = [
  {
    resource: 'users',
    read: true,
    create: true,
    delete: true,
    update: true,
    mutableFields: [],
    onlyOwned: true
  }
]

PERMISSIONS[Roles.admin] = [
  {
    resource: 'users',
    read: true,
    create: true,
    delete: true,
    update: true,
    mutableFields: [],
    onlyOwned: false
  }
]

module.exports = { Roles, PERMISSIONS }
