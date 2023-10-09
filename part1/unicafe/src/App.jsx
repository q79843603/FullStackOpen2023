import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const StatisticLine = (props) => {

  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const sum = props.list[0] + props.list[1] + props.list[2]
  const average = (props.list[0] - props.list[2]) / sum
  const positive = (props.list[0] / sum) * 100 + '%'

  if (sum === 0)
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={props.list[0]} />
          <StatisticLine text="neutral" value={props.list[1]} />
          <StatisticLine text="bad" value={props.list[2]} />
          <StatisticLine text="all" value={sum} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive} />
        </tbody>
      </table>
    </div>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const list = [good, neutral, bad]

  const clickGood = () => {
    console.log('Current Good: ', good)
    setGood(good + 1)
  }

  const clickNeutral = () => {
    console.log('Current Neutral: ', neutral)
    setNeutral(neutral + 1)
  }

  const clickBad = () => {
    console.log('Current Bad: ', bad)
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={clickGood} text={'good'} />
      <Button handleClick={clickNeutral} text={'neutral'} />
      <Button handleClick={clickBad} text={'bad'} />
      <Statistics list={list} />
    </div>
  )
}

export default App