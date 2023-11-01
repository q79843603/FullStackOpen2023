import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const initialState = []

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(state, action) {
      console.log('Setting',action.payload)
      return action.payload
    }
  }
})

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs.sort((prev, current) => current.likes - prev.likes)))
  }
}

export const createBlogs = (blog) => {
  return async dispatch => {
    await blogService.create(blog)
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs.sort((prev, current) => current.likes - prev.likes)))
  }
}

export const updateBlog = (id, newblog) => {
  return async dispatch => {
    await blogService.update(id, newblog)
    const blogs = await blogService.getAll()
    blogs.sort((prev, current) => current.likes - prev.likes)
    dispatch(setBlogs(blogs))
  }
}

export const removeBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    const blogs = await blogService.getAll()
    blogs.sort((prev, current) => current.likes - prev.likes)
    dispatch(setBlogs(blogs.filter(blog => blog.id !== id)))
  }
}
export const { setBlogs } = blogSlice.actions
export default blogSlice.reducer