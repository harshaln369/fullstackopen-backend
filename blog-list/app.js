const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('express-async-errors')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  // eslint-disable-next-line quotes
  .catch(() => logger.error("Couldn't connect to MongoDB"))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
