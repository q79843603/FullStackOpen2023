import { useState, useEffect } from 'react'
import Contact from './components/Contact'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [searchVar, setNewSearch] = useState('')
  const [showSearch, setSearched] = useState(false)
  const [showMessage, setMessage] = useState(null)
  const [showError, setError] = useState(false)
  useEffect(() => {
    personService
      .getAll()
      .then(initialPerson => {
        console.log('Promise fulfilled')
        setPersons(initialPerson)
      })
  }, [])

  const addContact = (event) => {
    event.preventDefault()
    const contact = {
      name: newName,
      number: newNum,
      id: persons.length + 1,
    }
    /*if(persons.some(obj => obj.name === contact.name))  //Since  objects are never the same, each object has its own reference:
    console.log("Correct")*/

    
    const checkKey = () => persons.some(obj => obj.name === contact.name)
      ? (
        personService
          .update(persons.find(obj => obj.name === contact.name), contact)
          .then(newOne =>{
              setPersons(persons.map(person => person.name !== contact.name ? person : newOne))
              setMessage(`Updated ${newOne.name}`),
             setTimeout(() => setMessage(null),5000)
             console.log("testing in update",persons)
          })
      )
      : (
          personService
            .create(contact)
            .then(newPerson => {
              console.log("The created contact = ", newPerson)
              setError(false)
              setMessage(`Added ${contact.name}`),
              setPersons(persons.concat(contact))
              setTimeout(() => setMessage(null),5000)
            })
            .catch(error => {
              console.log(error.response.data.error)
              setError(true)
              setMessage(error.response.data.error)
              setTimeout(() => setMessage(null),5000)
            })
        
      )


    checkKey()
    setNewName('')
    setNewNum('')
  }

  const checkEmpty = searchVar === ''
    ? false
    : true

  const searchedPerson = showSearch
    ? persons.filter((el) => el.name.toLowerCase().includes(searchVar.toLowerCase()))
    : persons

  const handleInputName = (event) => {
    setNewName(event.target.value)
  }

  const handleInputNum = (event) => {
    setNewNum(event.target.value)
  }

  const handleInputSearch = (event) => {
    setNewSearch(event.target.value)
    setSearched(checkEmpty)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification error={showError} message={showMessage}/>
      <Filter searchVar={searchVar} handleSearch={handleInputSearch} />
      <h2>add a new</h2>
      <PersonForm addContact={addContact} handleName={handleInputName} handleNum={handleInputNum} newName={newName} newNum={newNum} />
      <h2>Numbers</h2>
      <div>
        {searchedPerson.map(person =>
          <Contact key={person.name} person={person} remove={() => personService.remove(person.id, person.name, persons, setPersons, setError, setMessage)} />
        )}
      </div>
    </div>
  )
}

export default App