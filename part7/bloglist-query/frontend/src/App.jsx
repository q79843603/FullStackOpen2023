import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useNotificationDispatch } from './NotificationContext'
import { useUserValue, useUserDispatch } from './LoginContext'

const App = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useNotificationDispatch()
  const userDispatch = useUserDispatch()
  const queryClient = useQueryClient()
  const savedUser  = useUserValue()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type:'LOGIN', payload: user })
      blogService.setToken(user.token)
    }
  }, [])

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: async () => {
      const newBlog = await blogService.getAll()
      queryClient.setQueryData(['blogs'], newBlog)
      dispatch({ type:'SHOW_NOTI',payload:{ message:`a new blog ${newBlog.title} added`, error: false } })
      setTimeout(() => {dispatch({ type:'REMOVE_NOTI' })},5000)
    },
    onError: (error) => {
      dispatch({ type:'SHOW_NOTI',payload:{ message:`Create Failed: ${error}`, error: true } })
      setTimeout(() => {dispatch({ type:'REMOVE_NOTI' })},5000)
    }
  })

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
      userDispatch({ type:'LOGIN', payload: user })
      setUsername('')
      setPassword('')
      console.log('The blog', blogs)
    }
    catch (exception) {
      console.log(exception)
      dispatch({ type:'SHOW_NOTI',payload:{ message:'wrong username or password', error: true } })
      setTimeout(() => {dispatch({ type:'REMOVE_NOTI' })},5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({ type:'LOGOUT' })
  }

  const createBlog = (blog) => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user:{
        name: savedUser.name
      }
    }
    newBlogMutation.mutate(blogObject)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <Notification/>
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

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1,
    refetchOnWindowFocus: false
  })
  console.log(result.data)

  if (result.isLoading) {
    return <div>Loading...</div>
  }
  else if (result.isError) {
    return <div>blog list service not available due to problems in server</div>
  }

  const blogs = result.data.toSorted((prev, current) => current.likes - prev.likes)
  console.log('Blog', blogs)
  return (
    <div>
      {savedUser === null && loginForm()}
      {savedUser !== null &&
        <div>
          <h2>blogs</h2>
          <Notification />
          <p>
            {savedUser.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}
          {blogs
            .map(blog =>
              <Blog key={blog.id} blog={blog} updateLikes={blogService.update} getAll={blogService.getAll} removeBlog={blogService.remove} currentUser={savedUser.name} />
            )}
        </div>}
    </div>
  )
}

export default App