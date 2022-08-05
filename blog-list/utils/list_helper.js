const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return total + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce(
    (maxBlog, blog) => {
      if (maxBlog.likes > blog.likes) {
        return maxBlog
      } else {
        return blog
      }
    },
    { likes: 0 }
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
