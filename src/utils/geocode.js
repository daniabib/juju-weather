const request = require('request');

const geocode = (adress, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(adress)}.json?access_token=pk.eyJ1IjoiZGFuYWJpYiIsImEiOiJjanhkNzQzN2MwYjJ4M3lvMGN1eGFxMnVnIn0.QL9NA9Tz0z71hDAIFaaVMQ&limit=1`

    request({ url: url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to location services!', undefined); 
        } else if (body.features.length === 0){
            callback('Unable to find location', undefined);
        } else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            });
        }
    })
};

module.exports = geocode;