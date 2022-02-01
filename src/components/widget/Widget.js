import React from "react";
import { useState } from "react";
import "./Widget.css";
import { Textfit } from "react-textfit";
import cold from "../../assets/images/cold.png";
import hot from "../../assets/images/hot.png";
import medium from "../../assets/images/medium.png";
import {
  Box,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

export default function Widget() {
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [condition, setCondition] = useState("");
  const [temperatureF, setTemperatureF] = useState("");
  const [temperatureC, setTemperatureC] = useState("");
  const [degree, setDegree] = useState("C");
  const [icon, setIcon] = useState("");

  const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const updateWeatherInput = (e) => {
    setCity(e.target.value);
  };

  const handleDegree = (e, newDegree) => {
    if (newDegree !== null) {
      setDegree(newDegree);
    }
  };

  const convertTempToF = (k) => {
    setTemperatureF(Math.round((parseFloat(k) - 273.15) * 1.8 + 32));
  };

  const convertTempToC = (k) => {
    setTemperatureC(Math.round(parseFloat(k) - 273.15));
  };

  const displayTemperature = () => {
    if (degree === "C") {
      return temperatureC;
    } else {
      return temperatureF;
    }
  };

  const getWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${WEATHER_API_KEY}`
      );
      if (response.ok) {
        const data = await response.json();

        convertTempToF(data.main.temp);
        convertTempToC(data.main.temp);
        setLocation(data.name);
        setCountry(data.sys.country);
        setCondition(data.weather[0].description);
        setIcon(data.weather[0].icon);
      }
    } catch (error) {
      console.log("hi");
    }
  };

  return (
    <Box
      className="main"
      style={
        !temperatureC && temperatureC !== 0
          ? { backgroundColor: "#f4f4f4" }
          : temperatureC <= 0
          ? { backgroundImage: `url(${cold})` }
          : temperatureC <= 20
          ? {
              backgroundImage: `url(${medium})`,
            }
          : { backgroundImage: `url(${hot})` }
      }
    >
      <Box className="no-bottom-border-radius">
        <TextField
          style={{ width: "100%" }}
          id="weather-input"
          color="primary"
          label="City"
          variant="outlined"
          onChange={updateWeatherInput}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              getWeather();
            }
          }}
        />
      </Box>
      <Button
        style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        variant="contained"
        label="weather"
        color="primary"
        onClick={getWeather}
      >
        Get Weather
      </Button>
      {location && (
        <Box className="weather-info">
          <Textfit className="location" mode="single">
            {location}
          </Textfit>
          <Box className="country">{country}</Box>
          <Box className="temperature">
            {displayTemperature()}&#x00B0;{degree}
            <ToggleButtonGroup
              className="degree-toggle"
              value={degree}
              exclusive
              onChange={handleDegree}
              aria-label="text alignment"
            >
              <ToggleButton value="C">C</ToggleButton>
              <ToggleButton value="F">F</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box className="condition">{condition}</Box>
          <img
            className="condition-icon"
            src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
            alt="condition"
          />
        </Box>
      )}
    </Box>
  );
}
