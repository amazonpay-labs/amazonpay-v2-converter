# デモサイトの実行方法
## 概要
Amazon Pay V2 Converterのデモサイトです。ローカル環境で起動することで、こちらのサイトで導入のイメージを掴むことができます。

<br>

## ローカルでの起動方法
### 1. デモサイトをダウンロード

<br>

### 2. AWS上にAmazon Pay V2 APIを構築

[サーバ側導入手順](../serverside/README.md)に従い、構築してください。

<br>

### 3. パラメータを修正

#### 3-1. (クライアント側)htmlの修正
`1.cart.html` と `2.confirmation.html` の `//TODO` を修正してください。

<details>
<summary>1.cart.htmlの修正箇所</summary>
<pre>
<code>
window.onAmazonLoginReady = function() {
  amazon.Login.setClientId(
    'amzn1.application-oa2-client.XXX' //TODO v1で利用するclientIdを設定
  );
  amazon.Login.setUseCookie(true); //popup=falseにときに必要
};
...
function showLoginButton() {
  var authRequest;
  OffAmazonPayments.Button('AmazonPayButton', 'AXXXX', { //TODO v1で利用するmerchantId(出品者ID)を設定
...
</code>
</pre>
</details>

<details>
<summary>2.confirmation.htmlの修正箇所</summary>
<pre>
<code>
window.onAmazonLoginReady = function() {
  amazon.Login.setClientId("amzn1.application-oa2-client.XXX"); //TODO v1で利用するclientIdを設定
  amazon.Login.setUseCookie(true); //popup=falseにときに必要
...
function showAddressBookWidget() {
    // AddressBook
    new OffAmazonPayments.Widgets.AddressBook({
      sellerId: 'AXXXX', //TODO v1で利用するmerchantId(出品者ID)を設定
</code>
</pre>
</details>

#### 3-2. (サーバ側)phpの修正
`post.php` の `//TODO` を修正してください。

<details>
<summary>post.phpの修正箇所</summary>
<pre>
<code>
$header = [
    'Content-Type: application/json',
    'x-api-key: 8e3RSbbV4NausXKlvb4Pc3ZA7KII6WTV3YcKvvqb' //TODO AWS上に構築した API_KEY を設定
];
...
curl_setopt($curl, CURLOPT_URL, 'https://XXX.execute-api.ap-northeast-1.amazonaws.com/AmazonPay/'); //TODO AWS上に構築した API_ENDPOINT を設定
...
</code>
</pre>
</details>


<br>

### 4. ローカル環境で起動
webサーバを立ち上げ、http://localhost:8080/1.cart.html をブラウザで開く
```
cd v2converter-demoshop
/usr/bin/php -S 0.0.0.0:8080
```
