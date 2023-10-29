import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotiDispatch } from './NotiContext'
const App = () => {
  
  const dispatch = useNotiDispatch()
  const queryClient = useQueryClient()

  // const updateAnecdoteMutation = useMutation({
  //   mutationFn: updateAnecdote,
  //   onSuccess: (updated) => {
  //     // queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
  //     console.log('The update', updated)
  //     const anecdotes = queryClient.getQueryData(['anecdotes'])
  //     const updatedAnecdotes = anecdotes.map(anecdote => anecdote.id === updated.id ? updateAnecdote : anecdote)
  //     queryClient.setQueryData(['anecdotes'], updatedAnecdotes)
  //   }
  // })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const handleVote = (anecdote) => {
    console.log('vote',anecdote)
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    dispatch({type:'SHOW_NOTI',payload:`anecdote '${anecdote.content}' voted`})
    setTimeout(() => {dispatch({type:'REMOVE_NOTI'})},5000)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
    refetchOnWindowFocus: false
  })
  console.log(JSON.parse(JSON.stringify(result)))

  if (result.isLoading) {
    return <div>Loading...</div>
  }
  else if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
