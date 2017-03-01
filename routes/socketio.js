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
      // 図書館のリスト取得の場合
      calil.library(msg.pref, msg.city, msg.geocode, msg.limit, 'systemid result', socket);
    });
    socket.on('check library', function(msg) {
      // 図書館の蔵書取得の場合
      calil.checkLibrary(msg.isbn, msg.systemid, 'check library result', socket);
    });
    socket.on('check session', function(msg) {
      // 図書館の蔵書取得(ポーリング)の場合
      calil.checkSession(msg.session, 'check session result', socket);
    });
    socket.on('get cover', function(msg) {
      // 書影取得の場合
      openBD(msg.isbn, 'cover result', socket);
    });
    socket.on('get online stock', function(msg) {});
  });
}

module.exports = socketio;
