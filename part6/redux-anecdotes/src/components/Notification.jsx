/* eslint-disable react/no-unescaped-entities */
import { useSelector } from 'react-redux'

const Notification = () => {

  const notification = useSelector(state => state.message)
  console.log('From noti',notification)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  if (notification){
  return (
    <div style={style}>

      {notification}
    </div>
  )
  }
  return (
    <div></div>
  )
}


export default Notification