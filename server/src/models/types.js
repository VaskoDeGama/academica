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
  role: Symbol('role'),

  userRepository: Symbol('userRepository'),
  tokenRepository: Symbol('tokenRepository'),
  roleRepository: Symbol('roleRepository'),

  userService: Symbol('userService'),
  authService: Symbol('authService')
}
