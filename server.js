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

app.get('/weather', (request, response) => {
  const weatherData = weatherDaily(request.query.data)

  response.send(weatherData);
})

function weatherDaily(query){
  const skyData = require('./data/darksky.json');
  const weather = new Weather(skyData);
  return weather;
}

function Weather(weather){
  this.latitude = Location.latitude;
  this.longitude = Location.longitude;
  this.weatherByDays = weather.daily.data[0].time;
  this.weatherType = weather.daily.data[0].summary;
  // console.log(this.weatherByDays);


}


// Error messages
app.get('/*', function(req, res){
  res.status(404).send('you are in the wrong place');
})

app.listen(PORT, () => {
  console.log(`app is running on port: ${PORT}`);
})
