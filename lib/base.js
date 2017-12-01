'use strict';

const parse = require('url').parse;
const querystring = require('querystring');
const form_ct = 'application/x-www-form-urlencoded';

/**
 * CSB CONSOLE-SDK Client for node.js
 * 实现基类
 */
class Base {
    constructor() {
    }

    get(url, opts = {}) {
        opts.headers = {};
        return this.request('GET', url, opts, null);
    }

    post(url, opts = {}) {
        var originData = "";

        if (opts.data) {
            originData = querystring.stringify(opts.data);
            opts.headers = {};
            opts.headers['Content-Type'] = form_ct;
            Object.assign(opts.headers)
        }

        return this.request('POST', url, opts, originData);
    }
}

module.exports = Base;
