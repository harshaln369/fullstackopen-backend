const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'My First Blog',
    author: 'Harshal Nikhare',
    url: 'http://some-dummy-url.com',
    likes: 1,
  },
  {
    title: 'My Second Blog',
    author: 'Lalit Nikhare',
    url: 'http://some-dummy-lalit-url.com',
    likes: 2,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'To Be deleted',
    author: 'harshal',
    url: 'http://some-dummy-url.com',
    likes: 2,
  })

  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
}
