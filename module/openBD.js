const config = require('config');
const rest = require('./rest.js');

const openBDUrl = 'http://api.openbd.jp/v1/get';

// 書影、書籍情報の取得
module.exports = function(isbn, msg, socket) {

  const param = {
    parameters: {
      isbn: isbn,
    }
  }

  rest.getJson(openBDUrl, param, msg, socket);
};
