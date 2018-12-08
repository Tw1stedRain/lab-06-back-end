'use strict';

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

// Env Variables

require('dotenv').config();

// Application 
const app = express();

app.use(cors());

// Get API Data

app.get('/location', getLocation);
app.get('/weather', getWeather);

// handlers

function getLocation(request, response){
  const locationData = searchToLatLong(request.query.data); // 'Lynnwood, WA'
  response.send(locationData);
}

function getWeather (req, res){
  const weatherData = searchForWeather(req.query.data)
  res.send(weatherData);
}

// Constructors

function Daily(dayForecast){
  this.forecast = dayForecast.summary;
  this.time = new Date(dayForecast.time * 1000).toDateString();
}
function Location(location){
  this.formatted_query = location.formatted_address;
  this.latitude = location.geometry.location.lat;
  this.longitude = location.geometry.location.lng;
}

// Search for Resource 

function searchToLatLong(query){
  const geoData = require('./data/geo.json');
  const location = new Location(geoData.results[0]);
  return location;
}

function searchForWeather(query){
  let weatherData = require('./data/darksky.json');
  let dailyWeatherArray = [];
  weatherData.daily.data.forEach(forecast => dailyWeatherArray.push(new Daily(forecast)));
  return dailyWeatherArray;
}



// Error messages
app.get('/*', function(req, res){
  res.status(404).send('you are in the wrong place');
})

app.listen(PORT, () => {
  console.log(`app is running on port: ${PORT}`);
})
