import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [showError, setError] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.toSorted((prev, current) => current.likes - prev.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('loggin in with', username, password)

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      console.log('The blog', blogs)
    }
    catch (exception) {
      console.log(exception)
      setError(true)
      setMessage('wrong username or password')
      setTimeout(() => { setMessage(null) }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createBlog = async (blog) => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url
    }
    try {
      const response = await blogService.create(blogObject)
      console.log('Created', response)
      const newBlog = await blogService.getAll()
      newBlog.sort((prev, current) => current.likes - prev.likes)
      setBlogs(newBlog)
      setMessage(`a new blog ${blogObject.title} added`)
      setError(false)
      setTimeout(() => { setMessage(null) }, 5000)
    }
    catch (exception) {
      setMessage(`Create Failed: ${exception}`)
      setError(true)
      setTimeout(() => { setMessage(null) }, 5000)
      console.error(exception)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <Notification error={showError} message={message} />
      <div>
        username <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password <input type="text" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">login</button>
    </form>
  )


  const blogForm = () => (
    <Togglable buttonLabel='create new blog'>
      <BlogForm createBlog={createBlog} />
    </Togglable>
  )

  return (
    <div>
      {user === null && loginForm()}
      {user !== null &&
        <div>
          <h2>blogs</h2>
          <Notification error={showError} message={message} />
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}
          {blogs
            .sort((prev, current) => current.likes - prev.likes)
            .map(blog =>
              <Blog key={blog.id} blog={blog} updateLikes={blogService.update} getAll={blogService.getAll} setBlogs={setBlogs} removeBlog={blogService.remove} currentUser={user.name} setMessage={setMessage} setError={setError}/>
            )}
        </div>}
    </div>
  )
}

export default App