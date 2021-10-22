module.exports = {
  container: Symbol('container'),
  logger: Symbol('logger'),
  reqLogger: Symbol('reqLogger'),
  server: Symbol('server'),
  db: Symbol('db'),
  cache: Symbol('cache'),
  ctx: Symbol('ctx'),

  mongoRepository: Symbol('mongoRepository'),

  userScheme: Symbol('userScheme'),
  loginScheme: Symbol('loginScheme'),
  tokenScheme: Symbol('tokenScheme'),
  scheduleSchema: Symbol('scheduleSchema'),
  windowSchema: Symbol('windowSchema'),
  lessonSchema: Symbol('lessonSchema'),
  commentSchema: Symbol('commentSchema'),

  user: Symbol('user'),
  token: Symbol('token'),
  role: Symbol('role'),
  schedule: Symbol('schedule'),
  window: Symbol('window'),
  lesson: Symbol('lesson'),
  comment: Symbol('comment'),

  userRepository: Symbol('userRepository'),
  tokenRepository: Symbol('tokenRepository'),
  roleRepository: Symbol('roleRepository'),
  scheduleRepository: Symbol('scheduleRepository'),
  windowRepository: Symbol('windowRepository'),
  lessonRepository: Symbol('lessonRepository'),
  commentRepository: Symbol('commentRepository'),

  userService: Symbol('userService'),
  authService: Symbol('authService'),
  scheduleService: Symbol('scheduleService')
}
