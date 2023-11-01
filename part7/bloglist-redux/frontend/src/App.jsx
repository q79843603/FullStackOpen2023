import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import './index.css'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import BlogDetails from './components/BlogDetails'
import { setNotification } from './reducer/notificationReducer'
import { initializeBlogs, createBlogs } from './reducer/blogReducer'
import { userLogin, userLogut, login } from './reducer/loginReducer'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom'
import { initializeComments } from './reducer/commentReducer'
import { Table, Form, Button } from 'react-bootstrap'

const App = () => {

  const [users, setUsers] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeComments())
    blogService.getAllUsers()
      .then(res => {
        const mappedUser = res.map(user => ({ 'name': user.name, 'number': user.blogs.length, 'id': user.id }))
        setUsers(mappedUser)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(login(user))
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('loggin in with', username, password)

    try {
      await dispatch(userLogin(username,password))
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      console.log(exception)
      dispatch(setNotification('wrong username or password', true, 5))
      setUsername('')
      setPassword('')
    }
  }

  const handleLogout = () => {
    dispatch(userLogut())
  }

  const createBlog = async (blog) => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user:{
        name: user.name
      }
    }
    try {
      await dispatch(createBlogs(blogObject))
      dispatch(setNotification(`a new blog ${blogObject.title} added`, false, 5))
    }
    catch (exception) {
      dispatch(setNotification(`Create Failed: ${exception}`, true, 5))
      console.error(exception)
    }
  }

  const Users = () => {
    console.log('The users',users)
    return(
      <div>
        <h2>Users</h2>
        <Table striped>
          <tbody>
            <tr>
              <th></th>
              <th>blogs created</th>
            </tr>

            {users.map(user => (
              <tr key={user.name}>
                <td ><Link to={`/users/${user.id}`}>{user.name}</Link></td>
                <td>{user.number}</td>
              </tr>
            ))}

          </tbody>
        </Table>
      </div>
    )
  }

  const loginForm = () => (
    <Form onSubmit={handleLogin}>
      <Form.Group>
        <h2>log in to application</h2>
        <Notification />
        <div>
          <Form.Label>username </Form.Label><input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          <Form.Label>password </Form.Label><input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
        </div>
        <Button variant='primary' type="submit">login</Button>
      </Form.Group>
    </Form>
  )

  const AddedBlog = () => {
    const id = useParams().id
    const userBlogs = blogs.filter((blog) => blog.user.id === id)
    const blogOwner = users.find((user) => user.id === id)

    if (!blogOwner) {
      return null
    }
    return (
      <div>
        <h2>{blogOwner.name}</h2>
        <br/>
        added blogs
        <ul>
          {userBlogs.map(blog => ( <li key={ blog.id }> { blog.title } </li>))}
        </ul>
      </div>
    )
  }

  const BlogFormpParent = () => (
    <Togglable buttonLabel='create new blog'>
      <BlogForm createBlog={createBlog} />
    </Togglable>
  )

  const BlogList = () => (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} currentUser={user.name} />
      )}
    </div>
  )

  const style = {
    backgroundColor: 'lightgrey',
    padding: '5px 5px 5px 5px',
  }
  const padding = {
    paddingRight: 5
  }
  return (
    <Router>
      <div className="container">
        {user === null && loginForm()}
        {user !== null &&
        <div>
          <h2>blogs</h2>
          <Notification />
          <p style={style}>
            <Link style={padding} to="/">blogs</Link>
            <Link style={padding} to="/users">users</Link>
            {user.name} logged in <button onClick={handleLogout}> logout </button>
          </p>
          <Routes>
            <Route path="/blogs/:id" element={<BlogDetails currentUser={user.name}/>} />
            <Route path="/users/:id" element={<AddedBlog/>} />
            <Route path="/users" element={<Users />} />
            <Route path="/" element={<><BlogFormpParent /><BlogList /></>} />
          </Routes>
        </div>}
      </div>
    </Router>
  )
}

export default App