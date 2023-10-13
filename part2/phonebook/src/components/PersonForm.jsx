const PersonForm = (props) => {
    return (
        <form onSubmit={props.addContact}>
        <div>
          name: <input value={props.newName} onChange={props.handleName} />
        </div>
        <div>
          number: <input value={props.newNum} onChange={props.handleNum} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default PersonForm