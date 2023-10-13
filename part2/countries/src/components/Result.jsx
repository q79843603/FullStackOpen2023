import "../index.css"
import { useState } from "react"
import searchService from  "../services/countries"

const Result = ({ result}) => {
    const [show, setShow] = useState([])
    const [temp, setTemp] = useState(0) 
    const [wind, setWind] = useState(0)
    const [icon, setIcon] = useState('')

    const handleShow = (country) => {
        setShow(country)
    }

    const handleTemp = (temp) => {
        setTemp(temp)
    }

    const handleWind = (wind) => {
        setWind(wind)
    }

    const handleIcon = (icon) => {
        setIcon(icon)
    }

    if (result.length <= 10 && result.length > 1) {
        return (
            <div>
                {result.map(country => <Country key={country.name.common} country={country} check={false} setShow={handleShow} show={show}/>)}
                <View show={show} />
            </div>
        )
    }
    else if (result.length === 1) {
        return (
            <div>
                {result.map(country => <Country key={country.name.common} country={country} check={true} temp={temp} handleTemp={handleTemp} wind={wind} handleWind={handleWind} icon={icon} handleIcon={handleIcon}/>)}
            </div>
        )
    }
    return (
        <div>Too many matches, specify another filter</div>
    )
}

const View = ({show}) => {

    if(show!=0){
        const language = Object.values((show.languages))
        console.log("=1",show)
        return (
            <div>
                <h1>{show.name.common}</h1>
                capital {show.capital}
                <br></br>area {show.area}
                <br></br>
                <br></br>
                <b>languages:
                    <ul>
                        {language.map((language) => <li key={language}>{language}</li>)}
                    </ul>
                </b>
                <img src={show.flags.png} />
            </div>
        )
        }
}

const Country = ({ country, check, setShow, show, temp, handleTemp, wind, handleWind, icon, handleIcon }) => {
    
    const handleClick = () =>{
        setShow(country)
        console.log("Clicking",show)
    }
    
    const kelvinToDegree = (temp) => {
        return Math.round((temp-273) * 100) / 100
    }

    if (!check)
        return (
            <div>
                {country.name.common}
                <button onClick={handleClick}>show</button>
            </div>
        )
    else {
        searchService
            .getWeather(country.capital)
            .then(weather => {
                handleTemp(kelvinToDegree(weather.main.temp))
                handleWind(weather.wind.speed)
                handleIcon(`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`)
            })
        const language = Object.values((country.languages))
 
        return (
            <div>
                <h1>{country.name.common}</h1>
                capital {country.capital}
                <br></br>area {country.area}
                <br></br>
                <br></br>
                <b>languages:
                    <ul>
                        {language.map((language) => <li key={language}>{language}</li>)}
                    </ul>
                </b>
                <img src={country.flags.png} />
                <h1>Weather in {country.capital}</h1>
                <div>temperature {temp} Celcius </div>
                <div><img src={icon} /></div>
                <div>wind {wind} m/s</div>
            </div>
        )
    }
}

export default Result