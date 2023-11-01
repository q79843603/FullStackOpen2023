import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const initialState = []

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments(state, action) {
      console.log('Comments',action.payload)
      return action.payload
    },
    appendComment(state, action) {
      state.push(action.payload)
    },
  }
})

export const initializeComments = () => {
  return async dispatch => {
    const comments = await blogService.getAllComments()
    dispatch(setComments(comments))
  }
}

export const createComments = (id, newComment) => {
  return async dispatch => {
    console.log(id, newComment)
    newComment = { comment:newComment }
    const update = await blogService.createComments(id, newComment)
    dispatch(appendComment(update))
  }
}

export const { setComments, appendComment } = commentSlice.actions
export default commentSlice.reducer