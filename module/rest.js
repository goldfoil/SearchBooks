const config = require('config');
const Client = require('node-rest-client').Client;
const client = new Client();

Object.assign = require('object-assign');

// JSON形式でREST APIを呼び出し、結果を送信
module.exports.getJson = function(url, args, msg, socket) {
  client.get(url, args, function(data, response) {
    socket.emit(msg, data);
  });
};
