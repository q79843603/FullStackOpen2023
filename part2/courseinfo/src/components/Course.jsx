const Course = ({ course }) => {
    return (
      <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
      </div>
    )
  }
  
  const Header = (props) => {
    return (
      <div>
        <h1>{props.name}</h1>
      </div>
    )
  }
  
  const Content = ({ parts }) => {
    const total = parts.reduce((sum, part) => {
      console.log("Sum", sum, part)
      return sum + part.exercises
    }, 0)
    return (
      <div>
        {parts.map(part =>
          <Part key={part.id} part={part} />
        )}
        <Sum total={total} />
      </div>
    )
  }
  
  const Part = ({ part }) => {
    return (
      <p>{part.name} {part.exercises}</p>
    )
  }
  
  const Sum = ({ total }) => {
    return (
      <p><b>total of {total} exercises</b></p>
    )
  }
  
  export default Course