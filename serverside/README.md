# サーバ側
## 1.AWS上にAPIを構築する
### 構築に必要なパラメータを取得する

|パラメータ|取得方法|
|---|---|
|PUBLIC_KEY_ID|[Generate public and private key pair, Get your publicKeyId](https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-checkout/get-set-up-for-integration.html#4-get-your-public-key-id)を参考にpublicKeyIdを発行する|
|PRIVATE_KEY|privateKey.pemを開き、改行を改行コード(\n)に置換する<br><br>例)<br>変更前:<br><img width="500" alt="before" src="https://user-images.githubusercontent.com/61146815/79066075-e937d600-7cef-11ea-8bda-3c2f862317ea.png"><br><br>変更後:<br><img width="700" alt="after" src="https://user-images.githubusercontent.com/61146815/79066074-e806a900-7cef-11ea-8868-bd9c75fe01dc.png">|
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
-d '{"action": "CreateCheckoutSession", "webCheckoutDetail": {"checkoutReviewReturnUrl":"CHECKOUT_REVIEW_RETURN_URL"},"storeId":"STORE_ID"}' \
--header 'x-api-key:API_KEY' \
API_ENDPOINT
</code>
</pre>

<div>例)</div>
<pre>
<code>
curl -X POST -H "Content-Type: application/json" \
-d '{"action": "CreateCheckoutSession", "webCheckoutDetail": {"checkoutReviewReturnUrl":"http://XXX.html"},"storeId":"amzn1.application-oa2-client.XXX"}' \
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
	"webCheckoutDetail": {
		"checkoutReviewReturnUrl": "http://XXX.html",
		"checkoutResultReturnUrl": null,
		"amazonPayRedirectUrl": null
	},
	"productType": null,
	"paymentDetail": {
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
