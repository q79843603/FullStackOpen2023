import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const getId = () => (100000 * Math.random()).toFixed(0)

const AnecdoteForm = () => {
    const dispatch = useDispatch()
    const addAnecdote = (event) => {
        event.preventDefault()
        const newAnecdote = {
            content: event.target.anecdote.value,
            id: getId(),
            votes: 0
        }
        event.target.anecdote.value = ''
        dispatch(createAnecdote(newAnecdote))
        dispatch(setNotification(`new anecdote '${newAnecdote.content}'`, 5))
    }
    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div><input name='anecdote' /></div>
                <button type='submit'>create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm