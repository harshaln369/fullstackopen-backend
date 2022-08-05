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

const mostLikes = (blogs) => {
  const authors = blogs.map((blog) => ({
    author: blog.author,
    likes: blog.likes,
  }))

  const authorLikesArray = []
  for (const authorObj of authors) {
    if (authorLikesArray.find((a) => a.author === authorObj.author)) {
      const authorObjIndex = authorLikesArray.findIndex(
        (a) => a.author === authorObj.author
      )
      authorLikesArray.splice(authorObjIndex, 1, {
        author: authorObj.author,
        likes: authorLikesArray[authorObjIndex].likes + authorObj.likes,
      })
    } else {
      authorLikesArray.push(authorObj)
    }
  }

  return authorLikesArray.reduce(
    (prev, curr) => {
      if (prev.likes > curr.likes) {
        return prev
      } else {
        return curr
      }
    },
    { author: '', likes: 0 }
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
