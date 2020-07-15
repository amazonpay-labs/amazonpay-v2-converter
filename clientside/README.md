# クライアント側導入手順

## 概要

Amazon Pay V1で実装されたECサイトページを、V2へ移行します。

#### 目次

[0. amazonpayv2converterjs-を取得する](#0-amazonpayv2converterjs-を取得する)

[1. aamzon-payボタンをv1からv2へ移行する](#1-aamzon-payボタンをv1からv2へ移行する)

[2. アドレス帳お支払い方法ウィジェットをv1からv2へ移行する](#2-アドレス帳お支払い方法ウィジェットをv1からv2へ移行する)

<br>

#### 前提
* v1のjavascriptを[Code Generator](http://amzn.github.io/amazon-pay-sdk-samples/code_generator/?region=JP&ld=APJPLPADirect)に沿って実装していること

<br>

## 0. `amazonpayV2Converter.js` を取得する

[amazonpayV2Converter.js](./amazonpayV2Converter.js)をダウンロードしてください。

<br>

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

[2. AWS上に構築したAPIをECサイトのサーバ側で実行するコードを実装する](../serverside/README.md#2-aws%E4%B8%8A%E3%81%AB%E6%A7%8B%E7%AF%89%E3%81%97%E3%81%9Fapi%E3%82%92ec%E3%82%B5%E3%82%A4%E3%83%88%E3%81%AE%E3%82%B5%E3%83%BC%E3%83%90%E5%81%B4%E3%81%A7%E5%AE%9F%E8%A1%8C%E3%81%99%E3%82%8B%E3%82%B3%E3%83%BC%E3%83%89%E3%82%92%E5%AE%9F%E8%A3%85%E3%81%99%E3%82%8B)

##### 注意点
* セキュリティ上、クライアント側から直接AWS上のAPIを実行しないようお願いします。
* ここでは、`php/createCheckoutSession.php` というURLとします。

#### `Widgets.js` を削除/コメントアウトした箇所に、以下のjavascriptを追加する
TODOの箇所を、取得したcreateCheckoutSessionを実行するURLに修正してください。

```
<script src="https://static-fe.payments-amazon.com/checkout.js"></script>
<script src="amazonpayV2Converter.js"></script>
<script>
amazonpayV2Converter.showButtonWithSignature( {
  sandbox: true,
  payloadJSON: 'XXX',
  signature: 'XXX',
  publicKeyId: 'XXX'
  // productType: 'PayOnly', // option お支払い方法のみで利用したい場合
  // https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-checkout/add-the-amazon-pay-button.html#3-render-the-button
});
</script>
```

<br>

### 1-3. 実装した結果

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
amazonpayV2Converter.showButtonWithSignature( {
  sandbox: true,
  payloadJSON: 'XXX',
  signature: 'XXX',
  publicKeyId: 'XXX'
  // productType: 'PayOnly', // option お支払い方法のみで利用したい場合
  // https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-checkout/add-the-amazon-pay-button.html#3-render-the-button
});
</script>
<!-- add this tag -->

...
</code>
</pre>
</details>

<br>

### 1-4. （補足）amazonpayV2Converter.showButtonの仕様

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
amazonpayV2Converter.showButtonWithSignature({
  sandbox: true,
  payloadJSON: 'XXX',
  signature: 'XXX',
  publicKeyId: 'XXX'
  // productType: 'PayOnly', // option お支払い方法のみで利用したい場合
  // https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-checkout/add-the-amazon-pay-button.html#3-render-the-button
  // ledgerCurrency: 'JPY',  // option
  // checkoutLanguage: 'ja_JP', // option
  // placement: 'Cart' // option
});
</code>
</pre>
</details>


<br>

## 2. アドレス帳/お支払い方法ウィジェットをv1からv2へ移行する

### 2-1. v1用のjavascript `Widgets.js` を削除 または コメントアウトする

```
<script type="text/javascript" 
src="https://static-fe.payments-amazon.com/OffAmazonPayments/jp/sandbox/lpa/js/Widgets.js" 
async></script>
```

<br>

### 2-2. v2用のjavascript `checkout.js` と、v2converter用のjavascript を追加する

#### getCheckoutSessionを実行するURLを取得する
以下で実装したAPIを利用してください。

[2. AWS上に構築したAPIをECサイトのサーバ側で実行するコードを実装する](../serverside/README.md#2-aws%E4%B8%8A%E3%81%AB%E6%A7%8B%E7%AF%89%E3%81%97%E3%81%9Fapi%E3%82%92ec%E3%82%B5%E3%82%A4%E3%83%88%E3%81%AE%E3%82%B5%E3%83%BC%E3%83%90%E5%81%B4%E3%81%A7%E5%AE%9F%E8%A1%8C%E3%81%99%E3%82%8B%E3%82%B3%E3%83%BC%E3%83%89%E3%82%92%E5%AE%9F%E8%A3%85%E3%81%99%E3%82%8B)

##### 注意点
* セキュリティ上、クライアント側から直接AWS上のAPIを実行しないようお願いします。
* ここでは、`php/getCheckoutSession.php` というURLとします。

#### `Widgets.js` を削除/コメントアウトした箇所に、以下のjavascriptを追加する
TODOの箇所を、取得したgetCheckoutSessionを実行するURLに修正してください。

```
<script src="https://static-fe.payments-amazon.com/checkout.js"></script>
<script src="amazonpayV2Converter.js"></script>
<script>
var getCheckoutSessionUrl = 'php/getCheckoutSession.php';  // TODO getCheckoutSessionを実行するURLに修正

// アドレス帳/お支払い方法ウィジェットを設置している場合
amazonpayV2Converter.showAddress(getCheckoutSessionUrl).showPayment();
// お支払い方法ウィジェットのみを設置している場合
// amazonpayV2Converter.showPayment(getCheckoutSessionUrl);
</script>
```

<br>

### 2-3. 実装した結果

<details>
<summary>Amazon Payボタンをv1からv2へ移行した全体像</summary>
<pre>
<code>
<script type="text/javascript">
window.onAmazonLoginReady = function() {
amazon.Login.setClientId("amzn1.application-oa2-client.5e1a4059588e47909368d628ba92eb5a");

window.onAmazonPaymentsReady = function() {
　showAddressBookWidget();
};

function showAddressBookWidget() {
  // AddressBook
  new OffAmazonPayments.Widgets.AddressBook({
  ...

function showWalletWidget(orderReferenceId) {
  // Wallet
  new OffAmazonPayments.Widgets.Wallet({
  ...
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
var getCheckoutSessionUrl = 'php/getCheckoutSession.php';
amazonpayV2Converter.showAddress(getCheckoutSessionUrl).showPayment();
</script>
<!-- add this tag -->

...
</code>
</pre>
</details>

<br>

<br>

### 2-4. （補足）amazonpayV2Converter.showAddress(...).showPayment()の仕様

#### アドレス帳/お支払い方法ウィジェットのデザイン　または　それぞれのウィジェットに表示される「変更」ボタンのデザイン　を修正したい場合
※現状v1で、同一の画面にアドレス帳・お支払い方法ウィジェットを設置しているときは、こちらを利用してください。

<details>
<summary>実装例</summary>
<pre>
<code>
      amazonpayV2Converter.showAddress(
        // 第一引数：GetCheckoutSessionを実行するURL
      'php/getCheckoutSession.php', 
        // 第二引数：アドレス帳のフレームデザインを変更したい場合、CSSをjson形式で指定。不要な場合は指定なし
        // 指定例）
        {
          border: '1px solid #bbb',
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 10px 0 10px',
        }, 
        // 第三引数：アドレス帳の「変更」ボタンのデザインを修正したい場合、CSSをjson形式で指定。不要な場合は指定なし
        // 指定例）
        {
          display: 'block',
          position: 'relative',
          fontSize: '1rem',
          padding: '.375rem .75rem',
          textAlign: 'center',
          lineHeight: '1.5',
          borderRadius: '.25rem',
          color: '#fff',
          background: '#6c757d',
        }
      ).showPayment(
        // 第一引数：お支払い方法のフレームデザインを変更したい場合、CSSをjson形式で指定。不要な場合は指定なし
        // 指定例）
        {
          border: '1px solid #bbb',
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 10px 0 10px',
        }, 
        // 第二引数：お支払い方法の「変更」ボタンのデザインを修正したい場合、CSSをjson形式で指定。不要な場合は指定なし
        // 指定例）
        {
          display: 'block',
          position: 'relative',
          fontSize: '1rem',
          padding: '.375rem .75rem',
          textAlign: 'center',
          lineHeight: '1.5',
          borderRadius: '.25rem',
          color: '#fff',
          background: '#6c757d',
        }
      );
</code>
</pre>
</details>

#### お支払い方法ウィジェットのデザイン　または　「変更」ボタンのデザイン　を修正したい場合
※現状v1で、お支払い方法ウィジェットのみを設置しているときは、こちらを利用してください。

<details>
<summary>実装例</summary>
<pre>
<code>
      amazonpayV2Converter.showPayment(
        // 第一引数：GetCheckoutSessionを実行するURL
      'php/getCheckoutSession.php', 
        // 第二引数：アドレス帳のフレームデザインを変更したい場合、CSSをjson形式で指定。不要な場合は指定なし
        // 指定例）
        {
          border: '1px solid #bbb',
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 10px 0 10px',
        }, 
        // 第三引数：「変更」ボタンのデザインを修正したい場合、CSSをjson形式で指定。不要な場合は指定なし
        // 指定例）
        {
          display: 'block',
          position: 'relative',
          fontSize: '1rem',
          padding: '.375rem .75rem',
          textAlign: 'center',
          lineHeight: '1.5',
          borderRadius: '.25rem',
          color: '#fff',
          background: '#6c757d',
        }
      );
</code>
</pre>
</details>

<br>

## その他

### amazonpayV2Converterの仕様
v1のjavascriptで記述している一部の情報を取得できます。

#### loginOptions内のパラメータを取得する

```
amazonpayV2Converter.getLoginOptions();
```

#### clientIdを取得する

```
amazonpayV2Converter.getClientId();
```

#### GETパラメータからCheckoutSessionIdを取得する

```
amazonpayV2Converter.getCheckoutSessionId();
```

<br>

## 終了
クライアント側の実装は以上です。
