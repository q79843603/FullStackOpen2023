const Filter = (props) => {
    return (
        <p>
            filter shown with
            <input value={props.searchVar} onChange={props.handleSearch}></input>
        </p>
    )
}

export default Filter