import { useState } from 'react'

const Anecdote = (props) => {

  const maxVotes = () =>{
    const arr = Object.values(props.votes)
    const max = Math.max(...arr)
    const index = arr.indexOf(max)
    return index
  }
  
  return (
    <>
    <h1>Anecdote with most votes</h1>
    <p>{props.anecdotes[maxVotes()]}</p>
    <p>{"has " + props.votes[maxVotes()] + " votes"}</p>
    </>)
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Uint8Array(8))

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const randomNum = () => {
    const num = getRandomInt(0, anecdotes.length - 1)
    setSelected(num)
  }

  const voteThis = () => {
    const copy = { ...votes }
    copy[selected] += 1
    setVotes(copy)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>{"has " + votes[selected] + " votes"}</p>
      <button onClick={voteThis}>vote</button>
      <button onClick={randomNum}>next anecdote</button>
      <Anecdote votes={votes} anecdotes={anecdotes}/>
    </div>
  )
}

export default App