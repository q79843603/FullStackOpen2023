import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const remove = (id, name, persons, setPersons, setError, setMessage) => {
    if (window.confirm(`Delete ${name}`)) {
        const request = axios.delete(`${baseUrl}/${id}`)
        console.log("In delete",persons)
        setPersons(persons.filter(person => person.id !== id))
        const promise = request.then(response => console.log('Deleted Post', response))
        .catch(error => {
            setError(true)
            setMessage(`${name} has already been deleted from server`)
            console.log(error)
            setTimeout(() => {
                setMessage(null)
                setError(false)
              }, 5000)
        })
        return promise
    }

}

const update = ( person, newContact ) => {
    
    const newPerson = {...person,name: newContact.name, number: newContact.number}
    if (window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        console.log(newPerson.number)
        const request = axios.put(`${baseUrl}/${newPerson.id}`, newPerson)
        return request.then(response => response.data)
    }

}

export default {
    getAll: getAll,
    create: create,
    remove: remove,
    update: update,
}