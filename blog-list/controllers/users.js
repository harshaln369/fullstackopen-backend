const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

usersRouter.post('/signup', async (request, response) => {
  const { username, name, password } = request.body

  // Check if username already exists

  const existingUser = await User.find({ username })

  if (existingUser && password.trim().length < 3)
    response.status(401).json({ error: 'Invalid username or password' })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const allUsers = await User.find({})

  response.status(200).json(allUsers)
})

module.exports = usersRouter
