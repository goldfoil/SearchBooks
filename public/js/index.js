// let mobliePosition = '';

$(function() {
  var agent = window.navigator.userAgent;
  if (agent.search(/iPhone/) != -1 || agent.search(/iPad/) != -1 || agent.search(/iPod/) != -1 || agent.search(/Android/) != -1) {
    //モバイルブザウザの場合、位置情報から近くの図書館を判定する

    console.log(agent);

    // if (!navigator.geolocation) {
    //   // 現在位置を取得できない場合
    //   return;
    // }
    // navigator.geolocation.getCurrentPosition(success, null, null);

  }



});

// function success(position) {
//   alert(position);
//   mobilePosition = position;
// }

$(document).on('click', '#search', function() {
  $('form').submit();
});
