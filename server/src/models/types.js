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

  user: Symbol('user'),
  token: Symbol('token'),

  userRepository: Symbol('userRepository'),
  tokenRepository: Symbol('tokenRepository'),

  userService: Symbol('userService'),
  authService: Symbol('authService')
}
