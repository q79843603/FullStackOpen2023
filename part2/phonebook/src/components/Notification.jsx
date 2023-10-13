const Notification = ({ error, message }) => {
  
    if (message === null) {
      return null
    }
    
    if (error === true)
    return (
      <div className={'error'}>
        {message}
      </div>
    )
    return (
      <div className={'message'}>
        {message}
      </div>
    )
  }

  export default Notification