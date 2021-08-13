const express = require('express')
const usersRouter = express.Router()

/**
 * Get user by id
 */
usersRouter.get('/:id', async (req, res, next) => {
  next()
})

module.exports = usersRouter
