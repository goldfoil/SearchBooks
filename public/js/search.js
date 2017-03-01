'use strict'

// socket.io接続
const socket = io.connect(location.origin);

const noImage = 'img/m_e_others_501.png';

let inputIsbn;
let inputIsbn10;
let inputAddress;
let libraryListWork = [];
let registeredLibrary = [];

// 蔵書の検索結果データ
const libraryViewModelData = {
  libraryList: [],
  checkMsg: '検索中...',
  isHidden: true
};

// 書籍情報データ
const bookViewModelData = {
  data: {
    // 書影の初期値はNo Imageの画像とする
    cover: noImage
  }
};

// 検索部分
const searchViewModel = new Vue({
  el: '#search_view',
  data: {
    ISBN: '',
    address: ''
  },

  // クリック時
  methods: {
    searchClickHandler: function(e) {

      if (!this.ISBN) {
        // ISBNの入力がない場合、終了
        // TODO:修正する
        return false;
      }

      inputIsbn = $.trim(this.ISBN).replace(/-/g, '');
      const isbnWork = ISBN.parse(inputIsbn);
      if (isbnWork == null) {
        // TODO:修正する
        alert('ISBNが不正です');
        return false;
      }

      // 住所未入力の場合を考慮し蔵書の検索結果は隠す
      libraryViewModelData.isHidden = true;
      libraryViewModelData.checkMsg = '検索中...';
      libraryViewModel.$forceUpdate();

      if (this.address) {
        // 住所が入力された場合

        inputAddress = this.address;
        const addressArray = this.address.match(/(.+?[都道府県])*(.+?[市区町村郡])*/);
        const addressJson = {};

        if (addressArray[1]) {
          addressJson.pref = addressArray[1];
        }
        if (addressArray[2]) {
          addressJson.city = addressArray[2];
        }

        // 住所に該当する図書館のリストを取得する        
        socket.emit('get systemid', addressJson);
      }

      // ISBN10に変換し、書影を取得
      inputIsbn10 = ISBN.parse(inputIsbn);
      inputIsbn10 = inputIsbn10.asIsbn10();
      socket.emit('get cover', {
        isbn: inputIsbn
      });

      $('#search-result').removeClass('hidden');
      $('#search-result-li').removeClass('hidden');

      // 検索結果へスクロール
      scroll('#search-result');
    }
  }
});

// 蔵書の検索結果
const libraryViewModel = new Vue({
  el: '#library',
  data: libraryViewModelData,
});

// 書籍情報
const bookViewModel = new Vue({
  el: '#book',
  data: bookViewModelData
});

// 接続時
socket.on('connect', function() {});

socket.on('systemid result', function(msg) {
  // 図書館のリスト取得時

  const systemids = [];
  for (const data of msg) {
    const id = data.systemid;
    if (!systemids.includes(id)) {
      systemids.push(id);
    }
  }

  registeredLibrary = [];
  libraryViewModelData.libraryList = [];
  libraryViewModel.$forceUpdate();
  libraryListWork = msg;

  // 取得した図書館に蔵書があるか検索
  socket.emit('check library', {
    systemid: systemids.join(','),
    isbn: inputIsbn
  });
});

socket.on('check library result', function(msg) {
  // 図書館の蔵書取得時
  checkSession(msg);
  checkStatus(msg);
  libraryViewModel.$forceUpdate();
});

socket.on('check session result', function(msg) {
  // 図書館の蔵書取得時(ポーリング中)
  checkSession(msg);
  checkStatus(msg);
  libraryViewModel.$forceUpdate();
});

// 図書館の蔵書の検索結果を確認
function checkSession(msg) {
  if (msg.continue == '1') {
    // ポーリングが必要な場合

    const sessionId = msg.session;
    setTimeout(function() {
      socket.emit('check session', {
        session: sessionId
      });
    }, 3000);
  }
  else {
    // 取得完了の場合

    if (libraryViewModelData.checkMsg != '') {
      // 図書館に蔵書が1件もない場合
      libraryViewModelData.isHidden = false;
      libraryViewModelData.checkMsg = inputAddress + 'の図書館に蔵書が見つかりませんでした'
    }
  }
}

// 蔵書のチェック結果を判定
function checkStatus(msg) {

  for (const data of libraryListWork) {
    // 事前に取得した図書館の一覧分ループ

    const checkLibraryResult = msg.books[inputIsbn][data.systemid];

    if (registeredLibrary.includes(data.systemid + data.libkey)) {
      // 蔵書の検索結果を保持している場合、次の結果へ
      continue;
    }

    switch (checkLibraryResult['status']) {
      case 'OK':
      case 'Cache':
        // 蔵書の検索結果が有効な場合、表示ように保持
        data.lending_status = checkLibraryResult['libkey'][data.libkey];
        if (data.lending_status) {
          data.reserveurl = checkLibraryResult['reserveurl'];
          libraryViewModelData.libraryList.push(data);
          registeredLibrary.push(data.systemid + data.libkey);
          // 検索結果のリストを表示
          libraryViewModelData.isHidden = false;
          libraryViewModelData.checkMsg = '';
        }
        break;
    }
  }
}

socket.on('cover result', function(msg) {
  // 書影の取得時

  const noData = 'No Data';

  if (msg[0]) {
    // 該当データあり

    const bookSummary = msg[0].summary;

    $('title').text('[' + bookSummary.title + ']の検索結果');

    bookViewModelData.data = bookSummary;

    if (bookViewModelData.data.cover == '') {
      bookViewModelData.data.cover = noImage;
    }
  }
  else {
    // 該当データなし

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

// スクロー
function scroll(id) {
  const $anchor = $(this);
  $('html, body').stop().animate({
    scrollTop: $(id).offset().top
  }, 1500, 'easeInOutExpo');
  event.preventDefault();
}
