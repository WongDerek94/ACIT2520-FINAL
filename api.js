const request = require('request');

var getLocation = (address) => {
    return new Promise((resolve, reject) => {
      request({
        url: `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBZAfPNgUTOzHCiaRrVLpzRVmEKu6_AZyU&address=${encodeURIComponent(address)}`,
        json: true
      }, (error, response, body) => {
        if (error) {
            reject('Cannot connect to Google Maps');
        }	else if (body.status === 'ZERO_RESULTS') {
            reject('Cannot find requested address');
        }	else if (body.status === 'OK') {
            resolve({
              latitude: body.results[0].geometry.location.lat,
				      longitude: body.results[0].geometry.location.lng
            });
          }
        }
      )
    })
};

var getTemperature = (latitude, longitude) => {
  return new Promise((resolve, reject) => {
    request({
    url: `https://api.darksky.net/forecast/b7f9ef1ae781e56f1d6380750407549c/${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}`,
    json: true
  }, (error, response, body) => {
    if (error) {
        reject(error);
    }	else {
        resolve({
          temperature: body.currently.temperature,
          weather: body.currently.summary,
          icon: body.currently.icon
        });
      }
    });
  })
};

var getPicture = (picturetype) => {
  return new Promise((resolve, reject) => {
    request({
      url: `https://pixabay.com/api/?key=10962724-9cc2fe8bb2d1f0c4f6e509d7a&q=${encodeURIComponent(picturetype)}&image_type=photo`,
      json: true
    }, (error, response, body) => {
      resolve({
        'pic1': `<img class=pictures src=${body.hits[0].largeImageURL}>`,
        'pic2': `<img class=pictures src=${body.hits[1].largeImageURL}>`,
        'pic3': `<img class=pictures src=${body.hits[2].largeImageURL}>`,
        'pic4': `<img class=pictures src=${body.hits[3].largeImageURL}>`
      });
    })
  })
}

module.exports = {
  getLocation: getLocation,
  getTemperature: getTemperature,
  getPicture: getPicture
}