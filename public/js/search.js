'use strict'

// socket.io接続
const socket = io.connect(location.origin);

// 接続時
socket.on('connect', function() {
  // socket.emit('get cover');
//       socket.emit('get systemid');
//       socket.emit('get online stock');
});

socket.on('systemid result', function(msg) {
  console.log(msg);
});

socket.on('cover result', function(msg) {

  const bookSummary = msg[0].summary;
  console.log(bookSummary);
  
  $('title').text('[' + bookSummary.title + ']の検索結果');

  $('#book-title').text(bookSummary.title);
  $('#book-author').text(bookSummary.author);
  $('#book-publisher').text(bookSummary.publisher);
  $('#book-cover').children('img').attr('src', bookSummary.cover);

});

socket.on('online stock result', function(msg) {
  console.log(msg);
});

$('#search-button').on('click', function() {
  
  const isbnVal = $('#ISBN').val();
  
  if (!isbnVal) {
    // ISBNの入力がない場合、エラー
  // 	if (!confirm('設定を保存します\nよろしいですか？')) {
  // 		return false;
	 // }
  }
  
  const addressArray = $('#address').val().match(/(.+?[都道府県])*(.+?[市区町村])*/);
  const addressJson = {};
  
  if (addressArray[1]) {
    addressJson.pref = addressArray[1];
  }
  if (addressArray[2]) {
    addressJson.city = addressArray[2];
  }
  
  socket.emit('get cover', {isbn: isbnVal});
  socket.emit('get systemid', addressJson);

  $('#search-result').removeClass('hidden');
  $('#search-result-li').removeClass('hidden');
  
  const $anchor = $(this);
  $('html, body').stop().animate({
      scrollTop: $('#search-result').offset().top
  }, 1500, 'easeInOutExpo');
  event.preventDefault();
});


// 切断時
socket.on('disconnect', function(client) {});
