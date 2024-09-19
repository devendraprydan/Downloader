import React, { useEffect, useState } from 'react';

const API_KEY = 'cc2ed1e89f044f7aaa8107f5fb47ed0e';

const WeatherDateToggle = () => {
    const [weather, setWeather] = useState('');
    const [dateTime, setDateTime] = useState({ time: '', date: '' });

    // Function to get the current date and time
    const getCurrentDateTime = () => {
        const now = new Date();
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        const dateOptions = {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        };

        const time = now.toLocaleString(undefined, timeOptions);
        const date = now.toLocaleString(undefined, dateOptions);
        return { time, date };
    };

    // Function to fetch weather data
    const fetchWeatherData = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            const data = await response.json();
            const roundedTemp = Math.round(data.main.temp); // Round the temperature to the nearest integer
            setWeather(`${roundedTemp}°C`);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setWeather('Error loading weather');
        }
    };

    // Get the user's location
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeatherData(position.coords.latitude, position.coords.longitude);
                    return true
                },
                (error) => {
                    console.error('Error getting location:', error);
                    // alert('turn on the location');
                    // return false
                }
            );
        } else {
            setWeather('Geolocation not supported');
        }
    };

    // Update weather and date/time on component mount
    useEffect(() => {
        getLocation();
        setDateTime(getCurrentDateTime());

        // Update time every minute
        const interval = setInterval(() => {
            setDateTime(getCurrentDateTime());
        }, 60000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
    <div className="w-[100%] h-[70px] relative flex items-center mb-5">
        <label className="switch">  
          <input type="checkbox" id="toggle-switch"/>  
          <span className="slider round"></span>  
        </label>  
      <div className="container bg-purple-500">
            <div className="weather">{weather}</div>
            <div className="date-time flex flex-col">
                <div className='Time'>{dateTime.time}</div>
                <div className='Date'>{dateTime.date}</div>
            </div>
        </div>
    </div>
    );
};

export default WeatherDateToggle;



