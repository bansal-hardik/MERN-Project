import { useState, useEffect } from 'react'
import axios from 'axios';


function Weather() {
    const [weatherData, setWeatherData] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [cityInput, setCityInput] = useState('');

    // API URL and API key
    const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather'; // Replace with the API URL you are using
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    // Fetch user's current location using geolocation API
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                error => {
                    console.error('Error getting user location:', error);
                }
            );
        } else {
            console.error('Geolocation is not available on this device.');
        }
    }, []);

    // Fetch weather data for the specified city
    useEffect(() => {
        if (cityInput) {
            axios
                .get(weatherApiUrl, { params: { appid: apiKey, q: cityInput } })
                .then(response => {
                    setWeatherData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching weather data for the specified city:', error);
                });
        }
    }, [cityInput]);

    // Fetch weather data for the user's current location
    useEffect(() => {
        if (currentLocation) {
            axios
                .get(weatherApiUrl, { params: { appid: apiKey, lat: currentLocation.lat, lon: currentLocation.lon } })
                .then(response => {
                    setWeatherData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching weather data for current location:', error);
                });
        }
    }, [currentLocation]);
    const handleCityChange = (event) => {
        console.log("Handling the city changes");
        setCityInput(event.target.value);
    }

    const handleCitySubmit = (event) => {
        console.log("Handling city submit");
        event.preventDefault();
        // Fetch weather data for the specified city
        axios
            .get(weatherApiUrl, { params: { appid: apiKey, q: cityInput , units :'metric' } })
            .then(response => {
                setWeatherData(response.data);
            })
            .catch(error => {
                console.error('Error fetching weather data for the specified city:', error);
            });
    }
    return (
        <div>
            <form onSubmit={handleCitySubmit}>
                <input className = 'text-black' type="text" value={cityInput} onChange={handleCityChange} />
                <br />
                <button type="submit">Get Weather</button>
            </form>
            {weatherData ? (
                <div>
                    <h2>{weatherData.name}</h2>
                    <p>Temperature: {weatherData.main.temp}°C</p>
                    <p>Description: {weatherData.weather[0].description}</p>
                </div>
            ) : (
                <p>Loading weather data...</p>
            )}
        </div>
    )
}

export default Weather