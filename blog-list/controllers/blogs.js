const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const config = require('../utils/config')
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    return authorization.subString(7)
  }

  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, config.SECRET)

  if (!decodedToken.id) {
    response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const newBlog = {
    ...body,
    user: user.id,
  }

  const blog = new Blog(newBlog)

  const result = await blog.save()

  user.blogs = user.blogs.concat(result.id)
  await user.save()

  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes || 0,
  }

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then((updatedBlog) => {
      response.json(updatedBlog)
    })
    .catch((error) => next(error))
})

module.exports = blogsRouter
