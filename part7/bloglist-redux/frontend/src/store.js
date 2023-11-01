import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducer/notificationReducer'
import blogReducer from './reducer/blogReducer'
import loginReducer from './reducer/loginReducer'
import commentReducer from './reducer/commentReducer'


const store = configureStore({
  reducer: {
    notification : notificationReducer,
    blogs : blogReducer,
    user : loginReducer,
    comments : commentReducer
  }
})
store.subscribe(() => {console.log('The state',store.getState())})

export default store