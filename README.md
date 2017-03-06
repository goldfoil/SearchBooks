# 書籍一括検索
図書館蔵書一括検索するシステムです。  

[Demo](https://searchbooks.herokuapp.com/)  
  
##使用API
図書館の蔵書はカーリルの[図書館 API](https://calil.jp/doc/api.html)を使用しています。  
  
  
  
  
##実行環境  
以下のバージョンにて確認しています。  
Node.js:7.6.0  
npm:4.1.2  
  
  
##起動方法  
アプリケーションキーが必要です。  
  
* 直接指定する場合  
  * ENVにアプリケーションキーを追加
  * npm start
  
* .envに指定する場合  
  * package.jsonと同じ階層に.envファイルを作成
  * .envファイルに以下のように記述  
  キー=アプリケーションキー
  * npm run dev
  
