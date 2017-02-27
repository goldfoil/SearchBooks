'use strict'

// socket.io接続
const socket = io.connect(location.origin);

let inputIsbn;
let inputIsbn10;
let libraryListWork = [];
let registeredLibrary = [];

const searchViewModel = new Vue({
  el: '#search_view',
  data: {
    ISBN: '403217010X',
    address: '石川県金沢市'
  },

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
        const addressArray = this.address.match(/(.+?[都道府県])*(.+?[市区町村郡])*/);
        const addressJson = {};

        if (addressArray[1]) {
          addressJson.pref = addressArray[1];
        }
        if (addressArray[2]) {
          addressJson.city = addressArray[2];
        }
        socket.emit('get systemid', addressJson);
      }

      inputIsbn = $.trim(this.ISBN).replace( /-/g , '');
      inputIsbn10 = ISBN.parse(inputIsbn);
      inputIsbn10 = inputIsbn10.asIsbn10();
      socket.emit('get cover', {
        isbn: inputIsbn
      });

      $('#search-result').removeClass('hidden');
      $('#search-result-li').removeClass('hidden');

      scroll('#search-result');
    }
  }
});

const libraryViewModelData = {
  libraryList: []
};

const libraryViewModel = new Vue({
  el: '#library',
  data: libraryViewModelData
});

const bookViewModelData = {
  data: {}
}

const bookViewModel = new Vue({
  el: '#book',
  data: bookViewModelData
});

// 接続時
socket.on('connect', function() {});

socket.on('systemid result', function(msg) {
  // console.log(msg);
  // console.log(libraryViewModel);

  const systemids = [];
  for (const data of msg) {
    const id = data.systemid;
    if (!systemids.includes(id)) {
      systemids.push(id);
    }
  }

  // console.log(systemids);

  registeredLibrary = [];
  libraryViewModelData.libraryList = [];
  libraryViewModel.$forceUpdate();
  libraryListWork = msg;

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

function checkSession(msg) {
  if (msg.continue == '1') {
    const sessionId = msg.session;
    setTimeout(function() {
      socket.emit('check session', {
        session: sessionId
      });
    }, 3000);
  }
}

function checkStatus(msg) {
  for (const data of libraryListWork) {

    const checkLibraryResult = msg.books[inputIsbn][data.systemid];

    if (registeredLibrary.includes(data.systemid + data.libkey)) {
      // 蔵書の検索結果を保持している場合、次の結果へ
      continue;
    }

    switch (checkLibraryResult['status']) {
      case 'OK':
      case 'Cache':
        data.lending_status = checkLibraryResult['libkey'][data.libkey];
        if (data.lending_status) {
          data.reserveurl = checkLibraryResult['reserveurl'];
          libraryViewModelData.libraryList.push(data);
          registeredLibrary.push(data.systemid + data.libkey);
          $('#library').removeClass('hidden');
        }
        break;
    }
  }
}

socket.on('cover result', function(msg) {

  console.log(msg);

   const noData = 'No Data';
   const noImage = 'img/m_e_others_501.png';

  if (msg[0]) {
    const bookSummary = msg[0].summary;
    console.log(bookSummary);

    $('title').text('[' + bookSummary.title + ']の検索結果');
  
    bookViewModelData.data = bookSummary;
    
    if(bookViewModelData.data.cover == '') {
      bookViewModelData.data.cover = noImage;
    }
  } else {

    $('title').text('[]の検索結果');

     bookViewModelData.data = {
        author: noData,
        cover: noImage,
        isbn: '',
        pubdate: noData,
        publisher: noData,
        series: noData,
        title: noData,
        volume: noData        
     }   
  }

  bookViewModel.$forceUpdate();
});

socket.on('online stock result', function(msg) {
  console.log(msg);
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
