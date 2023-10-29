import { useSelector, useDispatch } from 'react-redux'
import { updateVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        if (state.search !== '') {
            return state.anecdotes.filter(el => {
                if(el.content.toLowerCase().includes(state.search.toLowerCase()))
                return el
            })
        }
        return state.anecdotes
    })
    const dispatch = useDispatch()

    const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)
    const vote = (anecdote) => {
        console.log('vote', anecdote.id)
        console.log('vote', anecdote.content)
        dispatch(updateVote(anecdote.id))
        dispatch(setNotification(`you voted '${anecdote.content}'`,10))
    }
    return (
        <div>
            {sortedAnecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList