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

const mostBlogs = (blogList) => {
  const authors = blogList.map((blog) => blog.author)

  const authorCounter = authors.reduce((prev, curr) => {
    prev[curr] = prev[curr] + 1 || 1
    return prev
  }, {})

  let authorMostBlogs = { author: '', blogs: 0 }
  for (const author in authorCounter) {
    if (authorCounter[author] > authorMostBlogs.blogs) {
      authorMostBlogs = { author, blogs: authorCounter[author] }
    }
  }
  return authorMostBlogs
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
