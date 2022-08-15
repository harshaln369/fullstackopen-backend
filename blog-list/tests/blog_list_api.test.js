const mongoose = require('mongoose')
const supertest = require('supertest')

const Blog = require('../models/blog')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

describe('returns correct amount of blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  }, 10000)

  test('returns correct amount of blog posts', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  }, 10000)

  test('verifies that the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((data) => expect(data.id).toBeDefined())
  }, 10000)

  test('new blog saved to db', async () => {
    const newBlog = {
      title: 'My Test Blog',
      author: 'harshal',
      url: 'http://some-dummy-url.com',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map((blog) => blog.title)
    expect(contents).toContain('My Test Blog')
  }, 10000)

  test('if likes missing then default must be 0', async () => {
    const newBlog = {
      title: 'My Test Blog',
      author: 'harshal',
      url: 'http://some-dummy-url.com',
    }

    await api.post('/api/blogs').send(newBlog)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
  }, 10000)

  test('if title and url missing respond with 400', async () => {
    const newBlog = {
      title: 'My Test Blog',
      author: 'harshal',
    }

    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  }, 10000)
})

afterAll(() => {
  mongoose.connection.close()
})
