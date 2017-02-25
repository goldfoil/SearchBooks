const config = require('config');
const rest = require('./rest.js');

const libraryUrl = 'http://api.calil.jp/library';

module.exports.library = function(pref, city, geocode, limit, msg, socket) {

  const param = {
    parameters: {
      appKey: config.get('calil.api_key'),
      format: 'json',
      callback: ''
    }
  }

  if (geocode) {
    param.parameters.geocode = geocode;
  }
  else {
    if (pref) {
      param.parameters.pref = pref;
    }
    if (city) {
      param.parameters.city = city;
    }
  }

  if (limit) {
    param.parameters.limit = limit;
  }

  rest.getJson(libraryUrl, param, msg, socket);

};
