import { createSlice } from "@reduxjs/toolkit"

const initialState = null

const notificationSlice = createSlice({
    name: 'notification', initialState, reducers: {
        showMessage(state, action) {
            console.log(action.payload)
            return action.payload
        },
        removeMessage() {
            return initialState
        }
    }
})

export const setNotification = (message, delay) => {
    return async dispatch => {
        dispatch(showMessage(message))
        console.log(delay)
        setTimeout(()=>{dispatch(removeMessage())}, delay * 1000)
      }
}
export const { showMessage, removeMessage } = notificationSlice.actions
export default notificationSlice.reducer