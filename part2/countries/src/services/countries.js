import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const api_key = import.meta.env.VITE_SOME_KEY

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getWeather = (capital) => {
    const request = axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${capital}&limit=5&appid=${api_key}`)
    console.log(api_key)
    return request.then(response => response.data)
}
export default {
    getAll: getAll,
    getWeather: getWeather
}