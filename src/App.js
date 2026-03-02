import React, { useState } from "react";
import axios from "axios";

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
    <div style={{ padding: "20px" }}>
      <h2>🌤️ Weather App</h2>

      <input value={city} onChange={(e) => setCity(e.target.value)} />
      <button onClick={fetchWeather} style={{ marginLeft: "8px" }}>
        Search
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <p>
          {weather.place}: {weather.temp}°C, Wind {weather.wind} km/h
        </p>
      )}
    </div>
  );
}
