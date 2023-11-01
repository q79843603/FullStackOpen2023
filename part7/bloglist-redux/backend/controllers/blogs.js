const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')


// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogsRouter.get('/', async (request, response) => {
  // Blog
  //   .find({})
  //   .then(blogs => {
  //     response.json(blogs)
  //   })

  const blogs = await Blog.find({}).populate('user').populate('comments')
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {


  // blog
  //   .save()
  //   .then(result => {
  //     response.status(201).json(result)
  //   })

  try {
    const body = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    console.log(decodedToken.id)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const username = request.user
    console.log("The username post", username)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user.id
    })
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result)
    console.log('201')
  }
  catch (exception) {
    next(exception)
  }

})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    console.log(decodedToken.id)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const blog = await Blog.findById(request.params.id)

    const username = request.user
    console.log("The username delete", username)

    if (blog.user.toString() === decodedToken.id) {
      await Blog.findByIdAndRemove(request.params.id)
      const originalBlogInUser = await User.findById(decodedToken.id)
      const newUserBlog = originalBlogInUser.blogs.filter(blogId => blogId.toString() != request.params.id)
      await User.findByIdAndUpdate(decodedToken.id, { blogs: newUserBlog }, { new: true })
      response.status(204).end()
    }
    else {
      return response.status(401).json({ error: 'user id does not match' })
    }
  }
  catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    console.log(decodedToken.id)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const body = request.body
    console.log("The update", body)
    // const blog = {
    //   title: body.title
    // }
    const blog = await Blog.findById(request.params.id)

    const username = request.user
    console.log("The username update", username)

    if (blog.user.toString() === decodedToken.id) {
      const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, { new: true })
      response.json(updatedBlog)
    }
    else {
      return response.status(401).json({ error: 'user id does not match' })
    }
  }
  catch (exception) {
    next(exception)
  }
})

blogsRouter.post('/:id/comments', async (request, response) => {
  
    const body = request.body
    console.log('Testing', body)
    if(!body.comment){
      return response.status(401).json({ error: 'Comment cannot be empty'})
    }
    const blog = await Blog.findById(request.params.id)
    const comment = new Comment({
      comment: body.comment,
      blog: blog._id
    })
    const result = await comment.save()
    console.log('Finding blog',blog._id)
    blog.comments = blog.comments.concat(result._id)
    await blog.save()
    response.status(201).json(result)
    console.log('201')
})

blogsRouter.get('/comments', async (request, response) => {
  
  const comments = await Comment.find({}).populate('blog')
  response.json(comments)
})
module.exports = blogsRouter