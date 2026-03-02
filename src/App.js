import React, { useState } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [city, setCity] = useState("Berlin");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    try {
      setError("");
      setWeather(null);

      // 1) City -> lat/lon (no key)
      const geo = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city.trim()
        )}&count=1&language=en&format=json`
      );

      const place = geo.data?.results?.[0];
      if (!place) {
        setError("City not found. Try another name.");
        return;
      }

      const { latitude, longitude, name, country } = place;

      // 2) lat/lon -> current weather (no key)
      const w = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      const cw = w.data?.current_weather;
      if (!cw) {
        setError("No weather data found.");
        return;
      }

      setWeather({
        place: `${name}${country ? ", " + country : ""}`,
        temp: cw.temperature,
        wind: cw.windspeed,
      });
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">🌤️ Weather App</h2>

        <div className="row">
          <input
            className="input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
          />
          <button className="btn" onClick={fetchWeather}>
            Search
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {weather && (
          <p className="result">
            <b>{weather.place}</b>: {weather.temp}°C, Wind {weather.wind} km/h
          </p>
        )}

        <p className="mini">Tip: Try “Berlin”, “Ilmenau”, “Karachi”.</p>
      </div>
    </div>
  );
}
