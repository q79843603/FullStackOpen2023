import { useState } from 'react'
import { useNotificationDispatch } from '../NotificationContext'
import {  useQueryClient, useMutation } from '@tanstack/react-query'

const Blog = ({ blog, updateLikes, removeBlog, currentUser }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const updateBlogMutation = useMutation({
    mutationFn: updateLikes,
    onSuccess:  (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      const addUserName = { ...updatedBlog, user:{ name: currentUser } }
      queryClient.setQueryData(['blogs'], blogs.map(blog => blog.id === addUserName.id ? addUserName : blog))
    }
  })

  const toggleVisibility = () => {
    setVisible(!visible)
  }


  const update = () => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      id: blog.id
    }
    updateBlogMutation.mutate(blogObject)
  }

  const removeBlogMutation = useMutation({
    mutationFn: removeBlog,
    onSuccess:  () => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.filter(el => el.id !== blog.id ))
    }
  })

  const remove = () => {
    if (window.confirm(`Remove blog ${blog.title}`)) {
      if (currentUser === blog.user.name) {
        removeBlogMutation.mutate(blog.id)
      } else {
        dispatch({ type:'SHOW_NOTI',payload:{ message:'No permission to remove this blog' , error: true } })
        setTimeout(() => {dispatch({ type:'REMOVE_NOTI' })},5000)
      }
    }
  }

  const RemoveButton = () => {
    if (currentUser === blog.user.name) {
      return (<button onClick={remove} id='removeButton'>remove</button>)
    } else {
      return <></>
    }
  }
  return (
    <div style={blogStyle} className='blog'>
      <div style={hideWhenVisible} className='togglehide'>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} id='viewButton'>view</button>
      </div>
      <div style={showWhenVisible} className='toggleshow'>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button><br />
        {blog.url}<br />
        likes {blog.likes} <button onClick={update} id='likeButton'>like</button><br />
        {blog.user.name}<br />
        <RemoveButton/>
      </div>
    </div>
  )
}



export default Blog