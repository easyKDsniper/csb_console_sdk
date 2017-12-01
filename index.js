'use strict';

function supportAsyncFunctions() {
    try {
        new Function('(async function () {})()');
        //console.log("async okay")
        return true;
    } catch (ex) {
        // console.log("async not okay")
        return false;
    }
}

const asyncSupported = supportAsyncFunctions();

//always use not async implement by now
exports.Client = asyncSupported ? require('./lib/client') : require('./lib/client');
