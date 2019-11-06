"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var promiseRequest = require('./request-promise');
var WebClient = (function () {
    function WebClient(url) {
        this.url = url;
    }
    WebClient.prototype.request = function (method, path, params, data) {
        return promiseRequest({
            method: method,
            url: this.url + '/' + path,
            qs: params,
            body: data,
            json: true,
            jar: true,
        });
    };
    WebClient.prototype.get = function (path, params) {
        var paramString = '';
        if (params && Object.keys(params).length > 0) {
            var array = [];
            for (var i in params) {
                array.push(i + '=' + params[i]);
            }
            paramString = '?' + array.join('&');
        }
        return this.request('get', path, params, null);
    };
    WebClient.prototype.post = function (path, data) {
        if (data === void 0) { data = {}; }
        return this.request('post', path, null, data);
    };
    WebClient.prototype.put = function (path, data) {
        return this.request('put', path, null, data);
    };
    return WebClient;
}());
exports.WebClient = WebClient;
//# sourceMappingURL=web-client.js.map