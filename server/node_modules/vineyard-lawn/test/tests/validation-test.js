"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var server_1 = require("../../source/server");
var index_1 = require("../../source/index");
var error_handling_1 = require("../../source/error-handling");
require('source-map-support').install();
var request_original = require('request').defaults({ jar: true, json: true });
error_handling_1.setErrorLogging(false);
function request(options) {
    return new Promise(function (resolve, reject) {
        request_original(options, function (error, response, body) {
            var options2 = options;
            if (error)
                reject(error);
            else if (response.statusCode != 200) {
                var error_1 = new Error(response.statusCode + " " + response.statusMessage);
                error_1['body'] = response.body;
                reject(error_1);
            }
            else
                resolve(body);
        });
    });
}
describe('validation test', function () {
    var server;
    this.timeout(5000);
    function local_request(method, url, body) {
        return request({
            url: "http://localhost:3000/" + url,
            method: method,
            body: body
        });
    }
    function login(username, password) {
        return local_request('post', 'user/login', {
            username: username,
            password: password
        });
    }
    before(function () {
        server = new server_1.Server();
        var validators = server.compileApiSchema(require('../source/api.json'));
        server.createEndpoints([
            {
                method: index_1.Method.post,
                path: "test",
                action: function (request) { return Promise.resolve(); },
                validator: validators.test
            },
        ]);
        return server.start();
    });
    it('missing required', function () {
        return local_request('post', 'test')
            .then(function (result) {
            assert(false, 'Should have thrown an error.');
        })
            .catch(function (error) {
            assert.equal(1, error.body.errors.length);
            assert.equal('Missing property "weapon".', error.body.errors[0]);
        });
    });
    it('wrong property type', function () {
        return local_request('post', 'test', {
            weapon: 640
        })
            .then(function (result) {
            assert(false, 'Should have thrown an error.');
        })
            .catch(function (error) {
            assert.equal(1, error.body.errors.length);
            assert.equal('Property "weapon" should be a string.', error.body.errors[0]);
        });
    });
});
//# sourceMappingURL=validation-test.js.map