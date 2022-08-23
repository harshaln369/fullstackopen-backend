const blogsRouter = require('express').Router()

const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const user = request.user

  if (!user) {
    response.status(401).json({ error: 'Not authorized' })
  }

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
  const user = request.user

  if (!user) {
    response.status(401).json({ error: 'Not authorized' })
  }

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
