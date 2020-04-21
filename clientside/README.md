# クライアント側

## 目次

<br>

## 前提
* v1のjavascriptを[Code Generator](http://amzn.github.io/amazon-pay-sdk-samples/code_generator/?region=JP&ld=APJPLPADirect)に沿って実装していること

<br>

## 0. `amazonpayV2Converter.js` を取得する

## 1. Aamzon Payボタンをv1からv2へ移行する

### 1-1. v1用のjavascript `Widgets.js` を削除 または コメントアウトする

```
<script type="text/javascript" 
src="https://static-fe.payments-amazon.com/OffAmazonPayments/jp/sandbox/lpa/js/Widgets.js" 
async></script>
```

<br>

### 1-2. v2用のjavascript `checkout.js` と、v2converter用のjavascript を追加する

#### createCheckoutSessionを実行するURLを取得する
以下で実装したAPIを利用してください。

[2. AWS上に構築したAPIをECサイトのサーバ側で実行するコードを実装する](https://github.com/amazonpay-labs/amazonpay-v2-converter/blob/master/serverside/README.md#2-aws%E4%B8%8A%E3%81%AB%E6%A7%8B%E7%AF%89%E3%81%97%E3%81%9Fapi%E3%82%92ec%E3%82%B5%E3%82%A4%E3%83%88%E3%81%AE%E3%82%B5%E3%83%BC%E3%83%90%E5%81%B4%E3%81%A7%E5%AE%9F%E8%A1%8C%E3%81%99%E3%82%8B%E3%82%B3%E3%83%BC%E3%83%89%E3%82%92%E5%AE%9F%E8%A3%85%E3%81%99%E3%82%8B)

##### 注意点
* セキュリティ上、クライアント側から直接AWS上のAPIを実行しないようお願いします。
* ここでは、`php/createCheckoutSession.php` というURLとします。

#### `Widgets.js` を削除/コメントアウトした箇所に、以下のjavascriptを追加する
TODOの箇所を、取得したcreateCheckoutSessionを実行するURLに修正してください。

```
<script src="https://static-fe.payments-amazon.com/checkout.js"></script>
<script src="amazonpayV2Converter.js"></script>
<script>
var createCheckoutSessionUrl = `php/createCheckoutSession.php`; // TODO createCheckoutSessionを実行するURLに修正
amazonpayV2Converter.showButton(createCheckoutSessionUrl, {
  sandbox: true, // sandbox flag
  // productType: 'PayOnly', // お支払い方法のみで利用したい場合
});
</script>
```

<br>

### 実装した結果

<details>
<summary>Amazon Payボタンをv1からv2へ移行した全体像</summary>
<pre>
<code>
...
<script type="text/javascript">
window.onAmazonLoginReady = function() {
    amazon.Login.setClientId(
        'amzn1.application-oa2-client.XXX'
    );
};

window.onAmazonPaymentsReady = function() {
    showLoginButton();
};

function showLoginButton() {
    OffAmazonPayments.Button('AmazonPayButton', ‘XXX', {
        ..    
    });
}
</script>

<!-- remove this tag -->
<script type="text/javascript" 
src="https://static-fe.payments-amazon.com/OffAmazonPayments/jp/sandbox/lpa/js/Widgets.js" 
async></script>
<!-- remove this tag -->

<!-- add this tag -->
<script src="https://static-fe.payments-amazon.com/checkout.js"></script>
<script src="amazonpayV2Converter.js"></script>
<script>
var createCheckoutSessionUrl = `php/createCheckoutSession.php`; // TODO change your CreateCheckoutSession which you implement in 2-2.
amazonpayV2Converter.showButton(createCheckoutSessionUrl, {
  sandbox: true, // sandbox flag
});
</script>
<!-- add this tag -->

...
</code>
</pre>
</details>

<br>

### （補足）amazonpayV2Converter.showButtonの仕様

#### v1のjavascript上のclientIdを、v2のstoreIdとして利用したい場合
* フロント側で、`amazonpayV2Converter.getClientId()` を実行し、clientIdを取得、URLのGETパラメータでサーバ側へ渡す
* サーバ側（ここでは `php/createCheckoutSession.php`）で、GETパラメータを取得し、CreateCheckoutSessionのリクエストパラメータに設定する

<details>
<summary>実装例</summary>
<pre>
<code>
var createCheckoutSessionUrl = `php/createCheckoutSession.php`;
var clientId = amazonpayV2Converter.getClientId();

amazonpayV2Converter.showButton(createCheckoutSessionUrl + '?&clientId=' + clientId, {
    sandbox: true,
});
</code>
</pre>
</details>

<br>

#### お支払い方法のみで利用したい、または　Amazon Payボタンのパラメータを変更したい場合
[Render the button](https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-checkout/add-the-amazon-pay-button.html#3-render-the-button)の以下のパラメータを設定できます。

* ledgerCurrency
* checkoutLanguage
* productType
* placement

<details>
<summary>実装例</summary>
<pre>
<code>
var createCheckoutSessionUrl = `php/createCheckoutSession.php`;

amazonpayV2Converter.showButton(createCheckoutSessionUrl, {
    sandbox: true,
    // ledgerCurrency: 'JPY',  // option
    // checkoutLanguage: 'ja_JP', // option
    // productType: 'PayOnly', // option
    // placement: 'Cart' // option
});
</code>
</pre>
</details>


<br>

## 2. アドレス帳/お支払い方法ウィジェットをv1からv2へ移行する

