import { useState } from 'react'

const Blog = ({ blog, updateLikes, getAll, setBlogs, removeBlog, currentUser, setMessage, setError }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const [likes, setlikes] = useState(blog.likes)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const update = () => {
    setlikes(likes + 1)
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: likes + 1,
    }
    updateLikes(blog.id, blogObject)
    getAll()
      .then((blogs) => {
        blogs.sort((prev, current) => current.likes - prev.likes),
        setBlogs(blogs)
      })
  }


  const remove = () => {
    if (window.confirm(`Remove blog ${blog.title}`)) {
      removeBlog(blog.id)
      getAll()
        .then((blogs) => {
          if (currentUser === blog.user.name) {
            blogs.sort((prev, current) => current.likes - prev.likes),
            setBlogs(blogs.filter(obj => obj.id !== blog.id))
          } else {
            setError(true)
            setMessage('No permission to remove this blog')
            setTimeout(() => { setMessage(null) }, 5000)
          }
        })
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
        likes {likes} <button onClick={update} id='likeButton'>like</button><br />
        {blog.user.name}<br />
        <RemoveButton/>
      </div>
    </div>
  )
}



export default Blog