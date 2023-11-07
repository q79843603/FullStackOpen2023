import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from './queries'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [ updateAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })
  const [ name, setName ] = useState('')
  const [ born, setBorn ] = useState(0)
  
  if (!props.show) {
    return null
  }
  if (result.loading)  {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors

  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')

    updateAuthor({variables: { name, born }})

    setBorn(0)
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>Set birthyear</h2>
        <form onSubmit={submit}>
          <div>
          <select value={name} onChange={e => setName(e.target.value)}>
            {authors.map(author => (<option key={author.name}>{author.name}</option>))}
          </select>
         </div>
          <div>
            born <input type="number" name='born' value={born} onChange={(({target}) => setBorn(parseInt(target.value)))}></input>
          </div>
          <button type='submit'>update author</button>
        </form>
      </div>
    </div>
  )
}

export default Authors
