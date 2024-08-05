import React, { useEffect, useState } from 'react';  

const WeatherDateToggle = () => {  
    const [weather, setWeather] = useState('Loading weather...');  
    const [dateTime, setDateTime] = useState('');  

    // Function to get the current date and time  
    const getCurrentDateTime = () => {  
        const options = {   
            weekday: 'long',   
            year: 'numeric',   
            month: 'long',   
            day: 'numeric',   
            hour: '2-digit',   
            minute: '2-digit',   
            hour12: false   
        };  
        return new Date().toLocaleString(undefined, options);  
    };  

    // Simulate or hard-code weather data  
    const getWeather = () => {  
        const weatherData = {  
            temperature: '29°C',  
     // Simulated weather condition  
        };  
        return `${weatherData.temperature}`;  
    };  

    // Update weather and date/time on component mount  
    useEffect(() => {  
        setWeather(getWeather());  
        setDateTime(getCurrentDateTime());  
        
        // Update time every minute  
        const interval = setInterval(() => {  
            setDateTime(getCurrentDateTime());  
        }, 60000);  

        return () => clearInterval(interval); // Cleanup on unmount  
    }, []);  

    return (  
        <div className="container">  
            <div className="weather">{weather}</div>  
            <div className="date-time">{dateTime}</div>  
        </div>  
    );  
};  

export default WeatherDateToggle;  