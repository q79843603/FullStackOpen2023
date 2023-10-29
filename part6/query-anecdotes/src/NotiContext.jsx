import { createContext, useReducer, useContext } from "react";

const notificationReducer = (state, action) => {
    switch (action.type) {
        case "SHOW_NOTI":
            return action.payload
        case "REMOVE_NOTI":
            return null
        default:
            return state
    }
}

const NotiContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, '')

    return (
        <NotiContext.Provider value={[notification, notificationDispatch]}>
            {props.children}
        </NotiContext.Provider>
    )
}

export const useNotiValue = () => {
    const notificationAndDispatch = useContext(NotiContext)
    return notificationAndDispatch[0]
}

export const useNotiDispatch = () => {
    const notificationAndDispatch = useContext(NotiContext)
    return notificationAndDispatch[1]
}

export default NotiContext