const rest = require('./rest.js');

const libraryUrl = 'http://api.calil.jp/library';
const checklibraryUrl = 'http://api.calil.jp/check';

console.log(process.env.calil);

// 図書館のリスト取得
module.exports.library = function(pref, city, geocode, limit, msg, socket) {

  const param = {
    parameters: {
      appKey: process.env.calil,
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

// 図書館の蔵書取得
module.exports.checkLibrary = function(isbn, systemid, msg, socket) {

  const param = {
    parameters: {
      isbn: isbn,
      systemid: systemid,
      appKey: process.env.calil,
      format: 'json',
      callback: 'no'
    }
  }

  rest.getJson(checklibraryUrl, param, msg, socket);

};

// 図書館の蔵書取得(ポーリング)
module.exports.checkSession = function(session, msg, socket) {

  const param = {
    parameters: {
      session: session,
      appKey: process.env.calil,
      format: 'json',
      callback: 'no'
    }
  }

  rest.getJson(checklibraryUrl, param, msg, socket);

};