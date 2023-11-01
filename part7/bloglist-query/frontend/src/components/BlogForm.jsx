import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <h2>create new</h2>
      title:<input type="text" value={title} name="Title" id='title' onChange={({ target }) => setTitle(target.value)} /><br />
      author:<input type="text" value={author} name="Author" id='author' onChange={({ target }) => setAuthor(target.value)} /><br />
      url:<input type="text" value={url} name="Url" id='url' onChange={({ target }) => setUrl(target.value)} /><br />
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm