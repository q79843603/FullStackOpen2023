import { createContext, useReducer, useContext } from 'react'

const loginReducer = (state, action) => {
  switch (action.type) {
  case 'LOGIN':
    return action.payload
  case 'LOGOUT':
    return null
  default:
    return state
  }
}

const LoginContext = createContext()

export const LoginContextProvider = (props) => {
  const [user, userDispatch] = useReducer(loginReducer, null)

  return (
    <LoginContext.Provider value={[user, userDispatch]}>
      {props.children}
    </LoginContext.Provider>
  )
}

export const useUserValue = () => {
  const userAndDispatch = useContext(LoginContext)
  return userAndDispatch[0]
}

export const useUserDispatch = () => {
  const userAndDispatch = useContext(LoginContext)
  return userAndDispatch[1]
}

export default LoginContext