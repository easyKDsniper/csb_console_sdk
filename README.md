Aliware CSB CONSOLE-SDK for Node.js
==================================

该工具包提供node.js方式调由用CSB OPEN API.

## Status Code

Git Source: [https://github.com/easy-money-sniper/csb_console_sdk](https://github.com/easy-money-sniper/csb_console_sdk)

## Installation

You can install it as dependency with npm.

```sh
$ # save into package.json dependencies
$ npm install dtdream-aliware-csb -g
```

## Usage

The SDK contains Simple client, user can invoke it with post or get method.

```js
'use strict';

const co = require('co');

const {
    Client
} = require('dtdream-aliware-csb');

const client = new Client();

//使用Client类的一个具体的例子,详细功能参见各个字段的备注
co(function* () {
	var svr = 'http://csb.console.xxx.xxx';
    var result = yield client.post(  //支持client.get() 和 client.post() 两种方式调用
        svr,   //参数1: 请求地址 csb console url e.g. http://csb.console.xxx.xxx
        //参数2: 如下的opts结构:
        {
			api: '/api/xxx/xxx',
			accessKey: 'ak',
			secretKey: "sk",
			query: {    //请求参数, 它们将在内部并作为URL参数拼接到请求URL中
				'a-query1': 'query1Value',
				'b-query2': 'query2Value'
			},
			data: {    //body参数
				'a-body1': 'body1Value',
				'b-body2': 'body2Value'
			}
        }
    );
    console.log(result);  //调用返回的结果串
});
co(function* () {
	var svr = 'http://csb.console.xxx.xxx';
    var result = yield client.get(  //支持client.get() 和 client.post() 两种方式调用
        svr,   //参数1: 请求地址 csb console url e.g. http://csb.console.xxx.xxx
        //参数2: 如下的opts结构:
        {
			api: '/api/xxx/xxx',
			accessKey: 'ak',
			secretKey: "sk",
			query: {    //请求参数, 它们将在内部并作为URL参数拼接到请求URL中
				'a-query1': 'query1Value',
				'b-query2': 'query2Value'
			},
			data: {    //body参数
				'a-body1': 'body1Value',
				'b-body2': 'body2Value'
			}
        }
    );
    console.log(result);  //调用返回的结果串
});
```

## Question?

Please submit an issue.

## License

The MIT License