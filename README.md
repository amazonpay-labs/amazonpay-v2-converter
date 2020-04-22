# amazonpay-v2-converter

## Amazon Pay V2 Converterとは
すでにAmazon Pay V1を利用しているECサイトを、簡単にV2へ移行するツールです。

| V2を独自に実装した場合  |  V2Converterを利用した場合  |
| ---- | ---- |
|  <img src="https://user-images.githubusercontent.com/61146815/79706558-9ca65900-82f4-11ea-9a13-82110feb1586.png" width="600px">  |  <img src="https://user-images.githubusercontent.com/61146815/79706802-6a492b80-82f5-11ea-800b-a01a4530708f.png" width="600px">  |

<br/>

### 利用するメリット
* v1のjavascriptを修正することなく、基本「Copy & Paste」と一部の修正でv2へ移行できるため、実装が簡単になる
* SDKを導入することなく、v2のAPIを利用できる
* SDKのバージョンアップがあった場合でも、AWS上のSDKをバージョンアップするのみであるため、移行が簡単になる

<br/>

### 前提
* AWSを利用できること
* v1のjavascriptを[Code Generator](http://amzn.github.io/amazon-pay-sdk-samples/code_generator/?region=JP&ld=APJPLPADirect)に沿って実装していること

<br/>

### 導入の流れ
[デモサイト](./demosite/)をローカルで実行することで、導入の流れを掴むことができます。

まずは、こちらをお試しください。

<br/>

## 導入方法
### 1. サーバ側：AWS上にAPIを構築する

[サーバ側導入手順](./serverside/README.md)に従い、構築してください。

### 2. クライアント側：ECサイトにV2 converterを導入する

[クライアント側導入手順](./clientside/README.md)に従い、導入してください。

<br/>

## 本番への移行方法
### サーバ側
* `CHECKOUT_REVIEW_RETURN_URL` を本番用に変更する
* [Lambdaに設定するパラメータ](https://github.com/amazonpay-labs/amazonpay-v2-converter-readme/tree/master/serverside#lambda%E3%81%AB%E6%8C%87%E5%AE%9A%E3%81%97%E3%81%9F%E3%83%91%E3%83%A9%E3%83%A1%E3%83%BC%E3%82%BF%E3%81%AE%E7%A2%BA%E8%AA%8D%E6%96%B9%E6%B3%95)の `sandbox` を `true` から `false` へ変更する
* (推奨)[リソースポリシーを設定し、API gatewayにIP制限をかける](https://aws.amazon.com/jp/premiumsupport/knowledge-center/api-gateway-resource-policy-whitelist/)

<details>
<summary>例)リソースポリシーの設定例</summary>
<pre>
<code>
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "execute-api:Invoke",
            "Resource": "arn:aws:execute-api:ap-northeast-1:account-id:api-id/*",
            "Condition": {
                "IpAddress": {
                    "aws:SourceIp": [
                        "XXX.XXX.XXX.XXX/XX",
                        "XXX.XXX.XXX.XXX/XX"
                    ]
                }
            }
        }
    ]
}
</code>
</pre>
</details>


### クライアント側

* Amazon Payボタンを設置するjavascript内のパラメータ `sandbox: true` を削除する

```
    <script>
      amazonpayV2Converter.showButton('php/createCheckoutSession.php', 
        {
          sandbox: true, // このパラメータを削除
        }
      );
    </script>
```

<br/>

## その他

<details>
<summary>当サンプルコードの利用規約</summary>
<pre>
<code>
* 本ページで紹介しているサンプルコードの機能または性能に関して、明示的にも黙示的にも、法律上の瑕疵担保責任、商品性の保証および特定目的適合性の保証についての暗黙の保証を含め（ただし、これらに限定されません）、いかなる保証または表明もいたしません。
* 本サンプルコードは現状有姿にて提供され、利用者は自己の単独の責任で使用するものとします。
* 本サンプルコードの使用に起因または関連する直接的、間接的、結果的、特別、付随的、懲罰的損害賠償（営業権の喪失、事業の中断、利益もしくはデータの逸失、補償費用、コンピュータの障害もしくは故障を含みます。）を含むがこれらに限定されることなく、原因の如何を問わずおよび責任の法理にかかわらず、いかなる損害に対しても、責任を負いません。
* 上記を条件に、本サンプルコードをご利用いただけます。
</code>
</pre>
</details>
