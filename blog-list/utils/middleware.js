const jwt = require('jsonwebtoken')

const config = require('../utils/config')
const logger = require('../utils/logger')
const User = require('../models/user')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    return authorization.subString(7)
  }

  return null
}

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:', request.path)
  logger.info('Body:', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token',
    })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const token = getTokenFrom(request)
  // 4.19 already done
  const decodedToken = jwt.verify(token, config.SECRET)

  if (!decodedToken.id) {
    response.status(401).json({ error: 'token missing or invalid' })
  }

  request.token = decodedToken.id

  next()
}

const userExtractor = async (request, response, next) => {
  const userId = request.token

  let user
  if (userId) {
    user = await User.findById(userId)
  }
  request.user = user

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
