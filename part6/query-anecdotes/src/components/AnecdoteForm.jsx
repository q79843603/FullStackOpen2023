import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { createAnecdote } from "../requests"
import { useNotiDispatch } from "../NotiContext"

const AnecdoteForm = () => {
  const dispatch = useNotiDispatch()
  const getId = () => (100000 * Math.random()).toFixed(0)
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      dispatch({type:'SHOW_NOTI', payload:`new anecdote '${newAnecdote.content}'`})
      setTimeout(() => {dispatch({type:'REMOVE_NOTI'})},5000)
    },
    onError: (error) => {
      dispatch({type:'SHOW_NOTI', payload:`too short anecdote,mush have length 5 or more`})
      setTimeout(() => {dispatch({type:'REMOVE_NOTI'})},5000)
    }
  })

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, id: getId(), votes: 0 })
    console.log('new anecdote')
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
