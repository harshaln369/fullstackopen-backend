// const http = require('http')
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

mongoose
  // eslint-disable-next-line no-undef
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

// eslint-disable-next-line no-undef
app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-undef
  console.log(`Server running on port ${process.env.PORT}`)
})
