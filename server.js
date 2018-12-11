//Include npm packages
const api = require('./api');
const express = require('express');
const request = require('request');
const hbs = require('hbs');
const fs = require('fs');
const _ = require('lodash');
const bodyParser = require('body-parser');
var port = process.env.PORT || 8080;

//Setup express
var app = express();
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// PATHS
// Main page
app.get('/', (request, response) => {
  response.render('index.hbs', {
    render: 'Weather Report'
  });
});

app.get('/pics', (request, response) => {
  response.render('pics.hbs', {
  });
});

// Post to form on main page
app.post('/', (request, response) => {
  if (request.body.location == '') {
    response.render('index.hbs', {
      location: `No location entered`
    });
  } else {
    api.getLocation(request.body.location).then((coordinates) => {
      return api.getTemperature(coordinates.latitude, coordinates.longitude);
    }).then((result) => {
      response.render('index.hbs', {
        location: `Location: ${request.body.location}`,
        icon: `<img src=/icons/${result['icon']}.png>`,
        summary: `Summary: ${result['weather']}`,
        temp: `Temp: ${result['temperature']}°C`
      });
    }).catch((error) => {
      serverError(response, error);
    });
  }
});

app.post('/pics', (request, response) => {
  if (request.body.picsentry == '') {
    response.render('pics.hbs', {
    });
  } else {
    api.getPicture(request.body.picsentry).then((results) => {
      response.render('pics.hbs', {
        pic1: results['pic1'],
        pic2: results['pic2'],
        pic3: results['pic3'],
        pic4: results['pic4']
      });
    }).catch((error) => {
      serverError(response, error);
    });
  }
});

// Handle all other paths and render 404 error page
app.use((request, response) => {
  response.status(404);
  response.render('404.hbs');
});

var serverError = (response, errorMsg) => {
console.log(errorMsg);
response.status(500);
response.render('404.hbs');
}

// Listen on port 8080
app.listen(port, () => {
  console.log(`Server is up on the port ${port}`);
});