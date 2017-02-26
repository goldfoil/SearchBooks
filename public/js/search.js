'use strict'

// socket.io接続
const socket = io.connect(location.origin);

let inputIsbn = '';
const libraryViewModelData = {libraryList: []};

const libraryViewModel = new Vue({
  el: '#library',
  data: libraryViewModelData
});

// 接続時
socket.on('connect', function() {
  // socket.emit('get cover');
  //       socket.emit('get systemid');
  //       socket.emit('get online stock');
});

socket.on('systemid result', function(msg) {
  console.log(msg);
  console.log(libraryViewModel);

  const systemids = [];
  for (let data of msg) {
    const id = data.systemid;
    if (!systemids.includes(id)) {
      systemids.push(id);
    }
  }
  
  console.log(systemids);

  libraryViewModelData.libraryList = msg;
  libraryViewModel.$forceUpdate();
  
  socket.emit('check library', {
    systemid: systemids.join(','),
    isbn: inputIsbn
  });
});

socket.on('check library result', function(msg) {
  console.log(msg);
  checkSession(msg);
  // const systemidArray = ;
  // console.log(systemidArray);
  checkStatus(msg);
  libraryViewModel.$forceUpdate();
});

socket.on('check session result', function(msg) {
  console.log(msg);
  checkSession(msg);
  console.log(inputIsbn);
  checkStatus(msg);
  libraryViewModel.$forceUpdate();
});

function checkSession (msg) {
  if(msg.continue == '1') {
    const sessionId = msg.session;
  	setTimeout( function() {
      socket.emit('check session', {session: sessionId});
  	}, 5000);
  }
}

function checkStatus(msg) {
    for (let data of libraryViewModelData.libraryList) {

    const checkLibraryResult = msg.books[inputIsbn][data.systemid];

    if (!checkLibraryResult) {
      continue;
    }

    switch(checkLibraryResult['status']) {
      case 'OK':
      case 'Cache':
        // console.log('OK,Cache');
        console.log(checkLibraryResult['libkey'][data.libkey]);
        // console.log(checkLibraryResult['libkey']);
        data.lending_status = checkLibraryResult['libkey'][data.libkey];
        if(!data.lending_status) {
          data.lending_status = '蔵書なし';
        } else {
          data.reserveurl = checkLibraryResult['reserveurl'];
        }
        console.log(data.lending_status);
        break;
      case 'Error':
        break;
    }
    if (checkLibraryResult['status'] == 'Running') {
      
    }
  }
}

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

const searchViewModel = new Vue({
  el: '#search_view',
  data: {ISBN: ' 978-4797373141', address: '石川県金沢市'},

  // A click handler inside methods
  methods: {
    searchClickHandler: function(e) {
      // "this" here refers to the model

      if (!this.ISBN) {
        // ISBNの入力がない場合、エラー
        // 	if (!confirm('設定を保存します\nよろしいですか？')) {
        return false;
        // }
      }

      if (this.address) {
        const addressArray = this.address.match(/(.+?[都道府県])*(.+?[市区町村])*/);
        const addressJson = {};

        if (addressArray[1]) {
          addressJson.pref = addressArray[1];
        }
        if (addressArray[2]) {
          addressJson.city = addressArray[2];
        }
        socket.emit('get systemid', addressJson);
      }

      inputIsbn = $.trim(this.ISBN);
      socket.emit('get cover', {
        isbn: inputIsbn
      });

      $('#search-result').removeClass('hidden');
      $('#search-result-li').removeClass('hidden');

      scroll('#search-result');
    }
  }
});

// 切断時
socket.on('disconnect', function(client) {});

function scroll(id) {
  const $anchor = $(this);
  $('html, body').stop().animate({
    scrollTop: $(id).offset().top
  }, 1500, 'easeInOutExpo');
  event.preventDefault();
}
