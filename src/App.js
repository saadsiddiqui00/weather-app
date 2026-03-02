import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [city, setCity] = useState('Berlin');
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=demo&units=metric`)
      .then(res => setWeather(res.data))
      .catch(() => setWeather(null));
  }, [city]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>🌤️ Weather App</h2>
      <input value={city} onChange={(e) => setCity(e.target.value)} />
      {weather && (
        <p>{weather.name}: {weather.main.temp}°C, {weather.weather[0].description}</p>
      )}
    </div>
  );
}
