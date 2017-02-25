'use strict'

// socket.io接続
const socket = io.connect(location.origin);

// 接続時
socket.on('connect', function() {
  consle.log(isbn);
  // ログイン通知
  // alert('connect!');
  socket.emit('get cover');
  socket.emit('get systemid');
  socket.emit('get online stock');
});

socket.on('systemid result', function(msg) {
  console.log(msg);
});

socket.on('cover result', function(msg) {
  console.log(msg);
});

socket.on('online stock result', function(msg) {
  console.log(msg);
});

// 切断時
socket.on('disconnect', function(client) {});
