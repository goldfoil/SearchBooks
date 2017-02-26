const app = require('../app');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const calil = require('../module/calil');
const openBD = require('../module/openBD');

function socketio() {
  // Socket.IO
  http.listen(app.get('port'), function() {
    console.log('listening!!!');
  });

  io.on('connection', function(socket) {
    socket.on('get systemid', function(msg) {
      calil.library(msg.pref, msg.city, msg.geocode, msg.limit, 'systemid result', socket);
    });
    socket.on('check library', function(msg) {
      console.log(msg);
      calil.checkLibrary(msg.isbn, msg.systemid, 'check library result', socket);
    });
    socket.on('check session', function(msg) {
      console.log(msg);
      calil.checkSession(msg.session, 'check session result', socket);
    });
    socket.on('get cover', function(msg) {
      openBD(msg.isbn, 'cover result', socket);
    });
    socket.on('get online stock', function(msg) {});
  });
}

module.exports = socketio;
