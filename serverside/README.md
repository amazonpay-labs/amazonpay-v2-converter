# サーバ側導入手順

## 概要

AWS上のAmazon Pay V2 APIを構築し、APIをHTTPリクエストするまでの手順です。

#### 目次
[1. AWS上にAPIを構築する](#1-aws上にapiを構築する)

[2. AWS上に構築したAPIをECサイトのサーバ側で実行するコードを実装する](#2-aws上に構築したapiをecサイトのサーバ側で実行するコードを実装する)

[エラーの対処方法](#エラーの対処方法)

<br/>

#### 前提
* AWSを利用できること

<br/>

## 1. AWS上にAPIを構築する
### 構築に必要なパラメータを取得する

|パラメータ|取得方法|
|---|---|
|PUBLIC_KEY_ID|[Generate public and private key pair, Get your publicKeyId](https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-checkout/get-set-up-for-integration.html#4-get-your-public-key-id)を参考にpublicKeyIdを発行する|
|PRIVATE_KEY|privateKey.pemを開き、改行を改行コード(\n)に置換する<br>※[改行コード変換ツール](./LinefeedCode.html)をローカルへダウンロードし、privateKeyを入力してください。改行コードが挿入された状態で出力します。<br>例)<br>変更前:<br><img width="500" alt="before" src="https://user-images.githubusercontent.com/61146815/79066075-e937d600-7cef-11ea-8bda-3c2f862317ea.png"><br><br>変更後:<br><img width="700" alt="after" src="https://user-images.githubusercontent.com/61146815/79066074-e806a900-7cef-11ea-8868-bd9c75fe01dc.png">|
<br>

### 以下のボタンを別タブで表示し、AWS cloudformationを開く

|region|button|
|---|:---:|
|ap-northeast-1|[![image](https://user-images.githubusercontent.com/61146815/75303877-48976f00-5885-11ea-98e0-ad390e8cb2e9.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-1#/stacks/new?stackName=v2handler&amp;templateURL=https://amazonpay-v2-converter.s3-ap-northeast-1.amazonaws.com/v2HandlerApi.yml)|
<br>

### 「次へ」ボタンを押下する
<img src="https://user-images.githubusercontent.com/61146815/75250132-01749400-581b-11ea-8b14-baf329cb5c4e.png" width="500px">
<br>

### PUBLIC_KEY_ID、PRIVATE_KEYをフィールドに入れ、「次へ」ボタンを押下する
<img src="https://user-images.githubusercontent.com/61146815/77886956-b67bef80-72a4-11ea-96e1-5a6b69ced038.png" width="500px">
<br>

### 「次へ」ボタンを押下する
<img src="https://user-images.githubusercontent.com/61146815/75250883-bfe4e880-581c-11ea-9b54-161ea2c5265b.png" width="500px">
<br>

### チェックボックスにチェックを入れ、「スタックの作成」を押下する
<img src="https://user-images.githubusercontent.com/61146815/75250973-f6bafe80-581c-11ea-899e-63a4520749a3.png" width="500px">
<br>

### ```V2HandlerApiUsagePlanKey```のステータスが```CREATE_COMPLETE```に変わるまで待ち、「出力」タブを選択する
<img src="https://user-images.githubusercontent.com/61146815/75363170-1590c200-58fd-11ea-99b5-00c4f9d9ff91.png" width="500px">
<br>

### 以下の手順に従い、```API Endpoint```と　```API Key```を取得する

#### API Endpoint（*1）
<img src="https://user-images.githubusercontent.com/61146815/77887212-29856600-72a5-11ea-9d7a-209b8f20ce5d.png" width="500px">
<br>

#### API Key(*2)
<span><img src="https://user-images.githubusercontent.com/61146815/77887260-41f58080-72a5-11ea-91cb-1056e2033b8e.png" width="500px"><img src="https://user-images.githubusercontent.com/61146815/75364465-204c5680-58ff-11ea-983a-d1b2871d9e79.png" width="200px">
</span>

<br>

### `API Endpoint`と`API Key`を使って、構築したAPIをテスト実行する

|パラメータ|取得方法|
|---|---|
|STORE_ID|SellerCentral > Amazon Login > ウェブ設定 のclientIdを取得|
|CHECKOUT_REVIEW_RETURN_URL|ユーザがAmazonアカウントでログイン後に遷移するURLを指定<br> [参考: Create an Amazon Pay checkout session](https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-checkout/add-the-amazon-pay-button.html#1-create-an-amazon-pay-checkout-session)|
|API_KEY|refer to ```API Key(*2)```を設定|
|API_ENDPOINT|refer to ```API Endpoint(*1)```を設定|
<br>

#### 実行方法
以下のコマンドをコンソールで実行する

<pre>
<code>
curl -X POST -H "Content-Type: application/json" \
-d '{"action": "CreateCheckoutSession", "webCheckoutDetails": {"checkoutReviewReturnUrl":"CHECKOUT_REVIEW_RETURN_URL"},"storeId":"STORE_ID"}' \
--header 'x-api-key:API_KEY' \
API_ENDPOINT
</code>
</pre>

<div>例)</div>
<pre>
<code>
curl -X POST -H "Content-Type: application/json" \
-d '{"action": "CreateCheckoutSession", "webCheckoutDetails": {"checkoutReviewReturnUrl":"http://XXX.html"},"storeId":"amzn1.application-oa2-client.XXX"}' \
--header 'x-api-key:XXX' \
https://XXX.execute-api.ap-northeast-1.amazonaws.com/AmazonPay/
</code>
</pre>
<br>

#### コマンド実行後の出力例

<details>
<summary>出力例</summary>
<pre>
<code>
{
	"checkoutSessionId": "XXXX-XXXX-XXXX-XXXX-XXXX",
	"webCheckoutDetails": {
		"checkoutReviewReturnUrl": "http://XXX.html",
		"checkoutResultReturnUrl": null,
		"amazonPayRedirectUrl": null
	},
	"productType": null,
	"paymentDetails": {
		"paymentIntent": null,
		"canHandlePendingAuthorization": false,
		"chargeAmount": null,
		"softDescriptor": null,
		"presentmentCurrency": null
	},
	"merchantMetadata": {
		"merchantReferenceId": null,
		"merchantStoreName": null,
		"noteToBuyer": null,
		"customInformation": null
	},
	"supplementaryData": null,
	"buyer": null,
	"paymentPreferences": [
		null
	],
	"statusDetail": {
		"state": "Open",
		"reasonCode": null,
		"reasonDescription": null,
		"lastUpdatedTimestamp": "20200412T101414Z"
	},
	"shippingAddress": null,
	"platformId": null,
	"chargePermissionId": null,
	"chargeId": null,
	"constraints": [
		{
			"constraintId": "BuyerNotAssociated",
			"description": "There is no buyer associated with the Checkout Session. Return the checkout session id to the Amazon Pay Button to allow buyer to login."
		},
		{
			"constraintId": "ChargeAmountNotSet",
			"description": "chargeAmount is not set."
		},
		{
			"constraintId": "CheckoutResultReturnUrlNotSet",
			"description": "checkoutResultReturnUrl is not set."
		},
		{
			"constraintId": "PaymentIntentNotSet",
			"description": "paymentIntent is not set."
		}
	],
	"creationTimestamp": "20200412T101414Z",
	"expirationTimestamp": "20200413T101414Z",
	"storeId": "amzn1.application-oa2-client.XXX",
	"providerMetadata": {
		"providerReferenceId": null
	},
	"releaseEnvironment": "Sandbox",
	"deliverySpecifications": null
}
</code>
</pre>
</details>

<br>

## 2. AWS上に構築したAPIをECサイトのサーバ側で実行するコードを実装する
以下、PHPで実装した例です。

### HTTPをリクエストするfunctionを実装する
HTTPClient等すでにご利用のモジュールがございましたら、そちらをご利用ください。

<details>
<summary>HTTPをリクエストするfunction例（php/post.php）</summary>
<pre>
<code>
// TODOの箇所を変更してください。
&lt;?php
	function execute($requestJson) {
		$header = [
		'Content-Type: application/json',
		'x-api-key: API_KEY' //TODO set API_KEY
		];
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, API_ENDPOINT); //TODO set API_ENDPOINT
		curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
		curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($requestJson));
		curl_setopt($curl, CURLOPT_HTTPHEADER, $header); 
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_HEADER, true);
		$response = curl_exec($curl);
		$header_size = curl_getinfo($curl, CURLINFO_HEADER_SIZE); 
		$header = substr($response, 0, $header_size);
		$body = substr($response, $header_size);
		$result = json_decode($body, true); 
		curl_close($curl);
		return json_encode($result);
	}
</code>
</pre>
</details>

<br>

### HTTPリクエストするfunctionを利用してAWS上のAPIを実行する
APIへのリクエスト方法やリクエスト・レスポンスについては、[こちら](https://github.com/amazonpay-labs/v2handlerjs)を確認してください。

#### CreateCheckoutSession APIの実行例
Amazon Payボタン表示にjavascriptへ設定

<details>
<summary>実行例（php/createCheckoutSession.php）</summary>
<pre>
<code>
// TODOの箇所を変更してください。
&lt;?php
	require_once("post.php");
	$request = [
	"action" => "CreateCheckoutSession",
	"webCheckoutDetails" => [
		"checkoutReviewReturnUrl"=> "CHECKOUT_REVIEW_RETURN_URL" //TODO Amazonログイン後の遷移先を指定
	],
	"storeId" => "STORE_ID" //TODO (sellercentralの store id)を設定
	];
	return execute($request);
</code>
</pre>
</details>

#### GetCheckoutSession APIの実行例
ユーザが指定したお届け先・お支払い方法表示に利用

<details>
<summary>実行例（php/getCheckoutSession.php）</summary>
<pre>
<code>
&lt;?php
	require_once("post.php");
	$requestJson = file_get_contents('php://input');
	$request = json_decode($requestJson);
	$request->action = 'GetCheckoutSession';
	return execute($request);
</code>
</pre>
</details>

#### UpdateCheckoutSession APIの実行例
ユーザが購入確定選択時に実行

<details>
<summary>実行例（php/updateCheckoutSession.php）</summary>
<pre><code>
// TODOの箇所を変更してください。
&lt;?php
   require_once(&quot;post.php&quot;);
   $updateCheckoutSession = [
      &quot;action&quot; =&gt; &quot;UpdateCheckoutSession&quot;,
      &quot;checkoutSessionId&quot; =&gt; $_POST[&#039;checkoutSessionId&#039;],
      &quot;webCheckoutDetails&quot; =&gt; [
         &quot;checkoutResultReturnUrl&quot; =&gt; &quot;http://.../php/completeCheckoutSession.php&quot; //TODO 以下のcompleteCheckoutSession.phpを指定
      ],
      &quot;paymentDetails&quot; =&gt; [
         &quot;paymentIntent&quot; =&gt; &quot;AuthorizeWithCapture&quot;, //TODO 注文時にオーソリのみ実行:Authorize 即時売上請求まで実行：AuthorizeWithCapture
         &quot;chargeAmount&quot; =&gt; [
            &quot;amount&quot; =&gt; &quot;1000&quot;, //TODO 注文金額を設定
            &quot;currencyCode&quot; =&gt; &quot;JPY&quot;
         ]
      ],
      &quot;merchantMetadata&quot; =&gt; [
         &quot;merchantReferenceId&quot; =&gt; &quot;Merchant store order id&quot;, //TODO ECサイトの注文番号を指定（任意だが指定することをおすすめする）
         &quot;merchantStoreName&quot; =&gt; &quot;Merchant store name&quot;, //TODO ECサイト名を指定（必要なときのみ）
         &quot;noteToBuyer&quot; =&gt; &quot;Note to buyer&quot;, //TODO Buyerへ通知するメッセージを指定（必要なときのみ）
         &quot;customInformation&quot; =&gt; &quot;v2converter:v2&quot;
      ]
   ];
   $updateCheckoutSessionResult = execute($updateCheckoutSession);
   $updateJson = json_decode($updateCheckoutSessionResult);
   try {
      header(&quot;Location: &quot; . $updateJson-&gt;webCheckoutDetails-&gt;amazonPayRedirectUrl);
   } catch(Exception $e) {
      //TODO エラーページへ遷移
      header(&quot;Location: ../1.cart.html?error=failure&quot;); // 売上請求に失敗した場合の遷移先を設定。Amazon Payボタンを表示する画面に遷移し、エラーメッセージを表示する
   }</code></pre>
</details>

#### CompleteCheckoutSession APIの実行例
オーソリ成功・失敗を確認し、成功・失敗した場合の遷移先を指定

<details>
<summary>実行例（php/completeCheckoutSession.php）</summary>
<pre>
<code>
// TODOの箇所を修正してください。
&lt;?php
require_once(&quot;post.php&quot;);
try {
    $checkoutSessionId = $_GET[&quot;amazonCheckoutSessionId&quot;];
    $completeCheckoutSessionRequest = array(
        &quot;action&quot; =&gt; &quot;CompleteCheckoutSession&quot;,
        &quot;checkoutSessionId&quot;=&gt;$checkoutSessionId,
        &quot;chargeAmount&quot; =&gt; [
            &quot;amount&quot; =&gt; &quot;1000&quot;,//TODO 請求する金額を設定
            &quot;currencyCode&quot; =&gt; &quot;JPY&quot;
        ]
    );
    $completeCheckoutSessionResult = execute($completeCheckoutSessionRequest);
    $completeCheckoutSessionJsonResult = json_decode($completeCheckoutSessionResult);
    $authorizeState = $completeCheckoutSessionJsonResult-&gt;statusDetails-&gt;state;
    if (&quot;Completed&quot; == $authorizeState) {
        header(&quot;location: ../3.thanks.html&quot;); //TODO 決済に成功した場合の遷移先を設定
        exit();
    }
    header(&quot;location: ../1.cart.html?error=payment-failure&quot;); //TODO 決済に失敗した場合の遷移先を設定。Amazon Payボタンを表示する画面に遷移し、エラーメッセージを表示する
    exit();
} catch (\Exception $e) {
    header(&quot;location: ../1.cart.html?error=payment-failure&quot;); //TODO 決済に失敗した場合の遷移先を設定。Amazon Payボタンを表示する画面に遷移し、エラーメッセージを表示する
}
</code>
</pre>
</details>

<br>

## エラーの対処方法
ブラウザのコンソールログを確認してください。

#### Can not parse the result of creating checkout session's response: {"message":"Forbidden"}
パラメータに不備がある可能性があります。
HTTPリクエスト時にheaderに設定する```API_KEY```に誤りがないか確認してください。

#### Can not parse the result of creating checkout session's response: {"message":"createcheckoutsession: An unexpected error has occurred. {\"reasonCode\":\"MissingParameterValue\",\"message\":\"Value is missing for the required parameter XXX\"}"}
記載のパラメータに不備がある可能性があります。
privateKeyやpublicKeyIdに不備がある場合、Lambdaに指定したパラメータに誤りがないか確認してください。

#### Can not parse the result of creating checkout session's response: {"message": "Endpoint request timed out"}
API Gatewayでタイムアウトが発生している可能性があります。

API実行時に[idempotencykey](https://github.com/amazonpay-labs/v2handlerjs#how-to-set-idempotencykey)を設定することで、APIをリトライすることが可能です。

こちらの機能を利用し、リトライ処理を実装することをおすすめします。

##### Lambdaに指定したパラメータの確認方法
1.CloudformationからLambdaへ遷移

<img src="https://user-images.githubusercontent.com/61146815/79810742-a4c2cf00-83ae-11ea-8b87-f53e7e7eef49.png" width="500px">
2.Lambdaのパラメータを確認

<img src="https://user-images.githubusercontent.com/61146815/79810747-a7bdbf80-83ae-11ea-8ed1-872db2259be0.png" width="500px">

<br>

## 終了
サーバ側の構築は以上です。
続いてクライアント側の実装に進んでください。
