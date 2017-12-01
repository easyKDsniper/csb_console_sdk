'use strict';

const {parse, format} = require('url');
const crypto = require('crypto');

// const uuid = require('uuid');
const httpx = require('httpx');
const debug = require('debug')('csb');

const ua = require('./ua');
const Base = require('./base');
const querystring = require('querystring');

const hasOwnProperty = function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
};

/**
 * CSB CONSOLE-SDK node.js Client
 */
class Client extends Base {
    constructor(stage = 'RELEASE') {
        super();

        this.stage = stage;
    }

    sign(stringToSign, secretKey) {
        var appSecret = Buffer.from(secretKey, 'utf8');
        return crypto.createHmac('sha1', appSecret)
            .update(stringToSign, 'utf8').digest('base64');
    }

    md5(content) {
        return crypto.createHash('md5')
            .update(content, 'utf8')
            .digest('base64');
    }

    splitQuery(str) {
        var rtn = {};
        if (str) {
            var kvs = str.toString().split("&");
            for (var i = 0; i < kvs.length; i++) {
                var iPos = kvs[i].indexOf("=");
                if (iPos >= 0) {
                    rtn[kvs[i].substr(0, iPos)] = kvs[i].substr(iPos + 1);
                }
            }
        }
        return rtn;
    }

    buildStringToSign(query, data, accessKeyObj) {
        var arr = {};
        var toStringify = Object.assign(arr, query, data, accessKeyObj);
        // console.log(toStringify);

        var result = '';
        if (Object.keys(toStringify).length) {
            var keys = Object.keys(toStringify).sort();
            var list = new Array(keys.length);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (toStringify[key] && ('' + toStringify[key])) {
                    list[i] = `${key}=${toStringify[key]}`;
                } else {
                    list[i] = `${key}`;
                }
            }
            result += list.join('&');
        }
        return result;
    }

    calculateSignature(query, data, ak, sk) {
        var signature;
        if (ak != null) {
            // do sign process
            var accessKeyObj = {_api_access_key: ak};
            var stringToSign = this.buildStringToSign(query, data, accessKeyObj);
            signature = this.sign(stringToSign, sk);
        }

        return signature;
    }

    addQueryParam(url, kvs) {
        if (!url.endsWith('?')) {
            url += '&';
        }
        url += querystring.stringify(kvs);
        return url;
    }

    buildUrl(url, api, query, ak, signature) {
        var newRequestUrl = url;
        if (newRequestUrl.endsWith('/')) {
            if (api.startsWith('/')) {
                newRequestUrl = newRequestUrl.substring(0, newRequestUrl.length - 1);
            }
        } else if (!api.startsWith('/')) {
            newRequestUrl += '/';
        }

        newRequestUrl += api;
        newRequestUrl += '?';
        newRequestUrl = this.addQueryParam(newRequestUrl, query);

        var accessKeyObj = {_api_access_key: ak};
        var signatureObj = {_api_signature: signature};
        newRequestUrl = this.addQueryParam(newRequestUrl, accessKeyObj);
        newRequestUrl = this.addQueryParam(newRequestUrl, signatureObj);
        return newRequestUrl;
    }

    // async
    request(method, url, opts, originData) {
        var signature = this.calculateSignature(opts.query, opts.data, opts.accessKey, opts.secretKey);
        // console.log(signature);

        var newRequestUrl = this.buildUrl(url, opts.api, opts.query, opts.accessKey, signature);
        // console.log(newRequestUrl);

        var headers = {};
        headers['User-Agent'] = ua;
        Object.assign(headers, opts.headers);

        if (debug.enabled) {
            debug('post body:');
            debug('%s', originData);
        }

        var entry = {
            // url: newRequestUrl ,
            request: null,
            response: null
        };
        var scode = 100;

        // await
        var res = httpx.request(newRequestUrl, {
            method: method,
            data: originData,
            headers: headers
        }).then((response) => {
            entry.request = {
                headers: response.req._headers
            };
            entry.response = {
                statusCode: response.statusCode,
                headers: response.headers
            };

            return httpx.read(response);
        }).then((buffer) => {
            // console.log("buffer=" + buffer);
            var code = entry.response.statusCode;
            // console.log("code=" + code);
            if (code !== 200) {
                var err = new Error(buffer);
                err.entry = entry;
                return Promise.reject(err);
            };

            if (this.verbose) {
                return [buffer + "", entry];
            }

            return buffer + "";
        });


        // await
        // var result = httpx.read(response, 'utf8');
        /*var contentType = response.headers['content-type'] || '';
        if (contentType.startsWith('application/json')) {
            result = JSON.parse(result);
        }*/

        return res;
    }
}

module.exports = Client;
