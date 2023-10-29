import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from "../services/anecdotes"


// export const voteId = (id) => {
//   return {
//     type: 'VOTE',
//     payload: { id }
//   }
// }

// export const createAnecdote = (content) => {
//   return {
//     type: 'CREATE_ANECDOTE',
//     payload: {
//       content: content,
//       id: getId(),
//       votes: 0
//     }
//   }
// }

// const anecdoteReducer = (state = initialState, action) => {
//   console.log('state now (ane): ', state)
//   console.log('action', action)

//   switch (action.type) {
//     case 'VOTE':
//       {
//         const id = action.payload.id
//         const toBeVoted = state.find(n => n.id === id)
//         const votedAnecdote = {
//           ...toBeVoted,
//           votes: toBeVoted.votes + 1
//         }
//         return state.map(el => el.id !== id ? el : votedAnecdote)
//       }
//     case 'CREATE_ANECDOTE':
//       {
//         const newAnecdote = action.payload
//         return state.concat(newAnecdote)
//       }
//     default: return state
//   }
// }

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    updateAnecdote(state, action) {
      const updateAnecdote = action.payload
      return state.map(anecdote => anecdote.id === updateAnecdote.id ? updateAnecdote : anecdote)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdote(state, action) {
      return action.payload
    }
  }
})

export const initializeAnecdote = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdote(anecdotes))
  }
}

export const createAnecdote = anecdote => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const updateVote = id => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    const toBeVoted = anecdotes.find(n => n.id === id)
    const votedAnecdote = {
      ...toBeVoted,
      votes: toBeVoted.votes + 1
    }
    const updatedVote = await anecdoteService.update(id, votedAnecdote)
    dispatch(updateAnecdote(updatedVote))
  }
}

export const { updateAnecdote, appendAnecdote, setAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer