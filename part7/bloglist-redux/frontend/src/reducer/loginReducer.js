import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'

const initialState = null

const loginSlice = createSlice({
  name: 'user',
  initialState,
  reducers:{
    login(state,action){
      return action.payload
    },
    logout(state,action){
      return initialState
    }
  }
})

export const userLogin = (username, password) => {
  return async dispatch => {
    const user = await loginService.login({
      username, password
    })
    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
    )
    blogService.setToken(user.token)
    dispatch(login(user))
  }
}

export const userLogut = () => {
  return async dispatch => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(logout())
  }
}

export const { login, logout } = loginSlice.actions
export default loginSlice.reducer