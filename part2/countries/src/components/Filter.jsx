const Filter = ({handleInput}) => {

    return(
    <p>
        find countries
        <input onChange={handleInput}/>
    </p>
    )
}

export default Filter