const config = require('config');
const Client = require('node-rest-client').Client;
const client = new Client();

Object.assign = require('object-assign');

// direct way
module.exports.getJson = function(url, args, msg, socket) {
  client.get(url, args, function(data, response) {
    console.log(args);
    console.log(url);
    console.log(data);
    socket.emit(msg, data);
  });
};
