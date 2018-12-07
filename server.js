'use strict';

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());

// get location data

app.get('/location', (request, response) => {
  const locationData = searchToLatLong(request.query.data || 'Lynnwood, WA');

  response.send(locationData);
})


function searchToLatLong(query){
  const geoData = require('./data/geo.json');
  const location = new Location(geoData.results[0]);
  return location;
}

function Location(location){
  this.formatted_query = location.formatted_address;
  this.latitude = location.geometry.location.lat;
  this.longitude = location.geometry.location.lng;
}

let weatherData = [];
app.get('/weather', (request, response) => {
  const skyCast = weatherDaily(request.query.data)

  response.send(skyCast);
})

function weatherDaily(query){
  weatherData = [];
  const skyData = require('./data/darksky.json');
  skyData.daily.data.forEach((day) => {
    new Weather(day);
  })
  return weatherData;
}

function Weather(day){
  this.latitude = Location.latitude;
  this.longitude = Location.longitude;

  this.time = new Date(day.time * 1000).toDateString();
  this.forecast = day.summary;
  weatherData.push(this);
}


// Error messages
app.get('/*', function(req, res){
  res.status(404).send('you are in the wrong place');
})

app.listen(PORT, () => {
  console.log(`app is running on port: ${PORT}`);
})
