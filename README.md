# amazonpay-v2-converter

## Amazon Pay V2 Converterとは
すでにAmazon Pay V1を利用しているECサイトを簡単にV2へ移行するためのツールです。

| V2を独自に実装した場合  |  V2Converterを利用した場合  |
| ---- | ---- |
|  <img src="https://user-images.githubusercontent.com/61146815/79706558-9ca65900-82f4-11ea-9a13-82110feb1586.png" width="600px">  |  <img src="https://user-images.githubusercontent.com/61146815/79706802-6a492b80-82f5-11ea-800b-a01a4530708f.png" width="600px">  |

### 利用するメリット
* v1のjavascriptを修正することなく、v2へ移行できるため、実装が簡単になる
* SDKを導入することなく、v2のAPIを利用できる
* SDKのバージョンアップがあった場合でも、AWS上のSDKをバージョンアップするのみであるため、移行が簡単になる

### 前提
* AWSを利用できること
* v1のjavascriptを[Code Generator](http://amzn.github.io/amazon-pay-sdk-samples/code_generator/?region=JP&ld=APJPLPADirect)に沿って実装していること

## 導入方法
### 1. サーバ側：AWS上にAPIを構築する

### 2. クライアント側：ECサイトにV2 converterを導入する
