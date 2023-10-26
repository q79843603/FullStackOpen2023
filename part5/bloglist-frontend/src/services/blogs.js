import axios from 'axios'
const baseUrl = 'http://localhost:10000/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (id, newBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  try {
    const response = await axios.put(`${baseUrl}/${id}`, newBlog, config)
    return response.data
  }
  catch (exception) {
    console.log('Cannot update', exception)
  }
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  try {
    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
  }
  catch (exception) {
    console.log('Cannnot remove',exception)
  }
}
export default { setToken, getAll, create, update, remove }