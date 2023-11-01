import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from '../reducer/notificationReducer'
import { updateBlog,removeBlog } from '../reducer/blogReducer'
import { useParams, useNavigate } from 'react-router-dom'
import { createComments, setComments } from '../reducer/commentReducer'

const BlogDetails = ({ currentUser }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const id = useParams().id
  const blogs = useSelector(state => state.blogs)
  const comments = useSelector(state => state.comments )
  const blog = blogs.find((blog) => blog.id === id)
  console.log('comment',comments)
  const comment2 = comments.filter((el) => (el.blog.id === id) || (el.blog === id))
  console.log('The comment22 in blog details', comment2)
  if (!blog){
    return null
  }

  const update = () => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }
    dispatch(updateBlog(blog.id, blogObject))
  }


  const remove = () => {
    if (window.confirm(`Remove blog ${blog.title}`)) {
      if (currentUser === blog.user.name) {
        dispatch(removeBlog(blog.id))
        navigate('/')
      } else {
        dispatch(setNotification('No permission to remove this blog',true,5))
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

  const addComment = async (event) => {
    event.preventDefault()
    const newComment = event.target.commentInput.value
    event.target.commentInput.value = ''
    dispatch(createComments(id, newComment))
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      {blog.url}<br />
      {blog.likes} likes  <button onClick={update} id='likeButton'>like</button><br />
        added by {blog.user.name}<br />
      <RemoveButton/>
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <input type='text' name='commentInput'/>
        <button type='submit'>add comment</button>
      </form>
      <ul>
        {comment2.map((comment) => (
          <li key={comment.id}> {comment.comment} </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogDetails