const config = require('config');
const rest = require('./rest.js');

const libraryUrl = 'http://api.calil.jp/library';
const checklibraryUrl = 'http://api.calil.jp/check';

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

module.exports.checkLibrary = function(isbn, systemid, msg, socket) {

  const param = {
    parameters: {
      isbn: isbn,
      systemid: systemid,
      appKey: config.get('calil.api_key'),
      format: 'json',
      callback: 'no'
    }
  }

  rest.getJson(checklibraryUrl, param, msg, socket);

};

module.exports.checkSession = function(session, msg, socket) {

  const param = {
    parameters: {
      session: session,
      appKey: config.get('calil.api_key'),
      format: 'json',
      callback: 'no'
    }
  }

  rest.getJson(checklibraryUrl, param, msg, socket);

};