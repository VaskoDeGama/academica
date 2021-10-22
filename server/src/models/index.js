const { User } = require('./user')
const { Token } = require('./token')
const { Roles, PERMISSIONS } = require('./role')
const { Schedule, Comment, Lesson, Window } = require('./schedule')
const ResultDTO = require('./result-dto')
const RequestDTO = require('./request-dto')
const Methods = require('./methods')
const Types = require('./types')
const Actions = require('./actions')
const Validators = require('./validators')

module.exports = {
  Comment,
  Lesson,
  Window,
  User,
  Token,
  ResultDTO,
  RequestDTO,
  Roles,
  PERMISSIONS,
  Schedule,
  Methods,
  Types,
  Actions,
  Validators
}
