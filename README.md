# 書籍一括検索
図書館蔵書一括検索するシステムです。  

[Demo](https://searchbooks.herokuapp.com/)  
  
##使用API
図書館の蔵書はカーリルの[図書館 API](https://calil.jp/doc/api.html)を使用しています。  
  
##実行環境  
以下のバージョンにて確認しています。  
Node.js: 7.6.0  
npm: 4.1.2  
  
##起動  
###アプリケーションキー    
以下のキーの申請と指定が必要です。

* カーリル
	* キー：calil
	* 申請先：[APIダッシュボード](https://calil.jp/api/dashboard/)

###キーの指定と起動
* 直接指定する場合  
  * ENVにアプリケーションキーを追加
  * $ npm start
  
* .envに指定する場合  
  * package.jsonと同じ階層に.envファイルを作成
  * .envファイルに以下のように記述  
  キー=アプリケーションキー
  * $ npm run dev
  
##TODO  
オンライン書店の在庫の検索の追加  
  

