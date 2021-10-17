'use strict'

/**
 * @typedef {object} ResourceRights
 * @property {string} resource - resource name
 * @property {boolean} onlyOwned - can do action with only owned resource
 * @property {boolean} read - can do read with resource
 * @property {boolean} create - can do create with resource
 * @property {boolean} delete - can do delete with resource
 * @property {boolean} update - can do update with resource
 * @property {string[]} mutableFields - list filed which can change
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
  },
  {
    resource: 'schedule',
    read: true,
    create: false,
    delete: false,
    update: false,
    mutableFields: [],
    onlyOwned: true
  },
  {
    resource: 'window',
    read: true,
    create: false,
    delete: false,
    update: false,
    mutableFields: [],
    onlyOwned: true
  },
  {
    resource: 'lesson',
    read: true,
    create: true,
    delete: false,
    update: false,
    mutableFields: [],
    onlyOwned: true
  },
  {
    resource: 'comment',
    read: true,
    create: true,
    delete: false,
    update: false,
    mutableFields: [],
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
  },
  {
    resource: 'schedule',
    read: true,
    create: true,
    delete: true,
    update: false,
    mutableFields: [],
    onlyOwned: true
  },
  {
    resource: 'window',
    read: true,
    create: true,
    delete: true,
    update: false,
    mutableFields: [],
    onlyOwned: false
  },
  {
    resource: 'lesson',
    read: true,
    create: false,
    delete: true,
    update: true,
    mutableFields: ['startTime', 'endTime'],
    onlyOwned: false
  },
  {
    resource: 'comment',
    read: true,
    create: true,
    delete: true,
    update: true,
    mutableFields: ['isPrivate', 'message'],
    onlyOwned: false
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
  },
  {
    resource: 'schedule',
    read: true,
    create: true,
    delete: true,
    update: true,
    mutableFields: [],
    onlyOwned: false
  },
  {
    resource: 'window',
    read: true,
    create: true,
    delete: true,
    update: true,
    mutableFields: [],
    onlyOwned: false
  },
  {
    resource: 'lesson',
    read: true,
    create: true,
    delete: true,
    update: true,
    mutableFields: [],
    onlyOwned: false
  },
  {
    resource: 'comment',
    read: true,
    create: true,
    delete: true,
    update: true,
    mutableFields: [],
    onlyOwned: false
  }
]

module.exports = { Roles, PERMISSIONS }
