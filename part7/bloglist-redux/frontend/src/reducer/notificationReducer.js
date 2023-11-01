import { createSlice } from '@reduxjs/toolkit'

const initialState = { message: null, error: false }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showMessage(state, action) {
      return action.payload
    },
    removeMessage() {
      return initialState
    },
  },
})

export const setNotification = (message, error, delay) => {
  return async (dispatch) => {
    dispatch(showMessage({ message: message, error: error }))
    setTimeout(() => {
      dispatch(removeMessage())
    }, delay * 1000)
  }
}
export const { showMessage, removeMessage } = notificationSlice.actions
export default notificationSlice.reducer
