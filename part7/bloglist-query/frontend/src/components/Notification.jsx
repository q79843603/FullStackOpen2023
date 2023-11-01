import { useNotificationValue } from '../NotificationContext'

const Notification = () => {

  const notification = useNotificationValue()

  if (!notification) {
    return null
  }

  if (notification.error === true)
    return (
      <div className="error">
        {notification.message}
      </div>
    )
  return (
    <div className="message">
      {notification.message}
    </div>
  )
}

export default Notification