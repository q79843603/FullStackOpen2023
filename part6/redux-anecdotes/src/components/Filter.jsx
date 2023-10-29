import { useDispatch } from 'react-redux'
import { searchFor } from '../reducers/filterReducer'
const Filter = () => {
    const dispatch = useDispatch()

    const handleChange = (event) => {
      // input-field value is in variable event.target.value
      const content = event.target.value
      dispatch(searchFor(content))
    }
    const style = {
      marginBottom: 10
    }
  
    return (
      <div style={style}>
        filter <input onChange={handleChange} />
      </div>
    )
  }
  
  export default Filter