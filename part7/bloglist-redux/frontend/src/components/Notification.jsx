
import { useSelector } from 'react-redux'

const Notification = () => {

  const notification = useSelector(state => state.notification)

  if (notification.message === null) {
    console.log('Null')
    return null
  }

  if (notification.error === true) {
    console.log('Error')
    return (
      <div className="error">
        {notification.message}
      </div>
    )
  }

  if (notification.error === false)
  {
    console.log('Success')
    return (
      <div className="message">
        {notification.message}
      </div>
    )
  }
}

export default Notification