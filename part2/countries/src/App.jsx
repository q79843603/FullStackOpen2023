import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Result from './components/Result'
import searchService from './services/countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    searchService
      .getAll()
      .then(result => {
        setCountries(result)
      })
  }, [])

  const handleInputChange = (event) => {
    console.log(event.target.value)
    setInput(event.target.value)
  }

  
  const result = countries.filter(el => el.name.common.toLowerCase().includes(input.toLowerCase()))

  return (
    <div>
      <Filter handleInput={handleInputChange} />
      <Result result={result}/>
    </div>
  )
}

export default App
