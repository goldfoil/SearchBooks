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
      calil.library('石川', '', '', '', 'library result', socket);
    });
    socket.on('get cover', function(msg) {
      openBD(msg.isbn, 'cover result', socket);
    });
    socket.on('get online stock', function(msg) {});
  });
}

module.exports = socketio;
