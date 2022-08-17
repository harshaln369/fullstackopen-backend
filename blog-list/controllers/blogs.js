const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const users = await User.find({})
  const newBlog = {
    ...body,
    user: users[0].id,
  }

  const blog = new Blog(newBlog)

  const result = await blog.save()

  const user = await User.findById(users[0].id)
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
