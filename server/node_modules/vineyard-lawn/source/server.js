"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var api_1 = require("./api");
var Server = (function () {
    function Server(default_preprocessor, requestedListener) {
        if (default_preprocessor === void 0) { default_preprocessor = null; }
        if (requestedListener === void 0) { requestedListener = null; }
        this.port = 3000;
        this.default_preprocessor = null;
        this.ajv = null;
        this.app = express();
        this.default_preprocessor = default_preprocessor;
        this.requestListener = requestedListener;
    }
    Server.prototype.checkAjv = function () {
        if (!this.ajv) {
            var Ajv = require('ajv');
            this.ajv = new Ajv();
        }
    };
    Server.prototype.compileApiSchema = function (schema) {
        this.checkAjv();
        var result = {};
        for (var i in schema) {
            var entry = schema[i];
            if (entry.additionalProperties !== true && entry.additionalProperties !== false)
                entry.additionalProperties = false;
            result[i] = this.ajv.compile(schema[i]);
        }
        return result;
    };
    Server.prototype.addApiSchemaHelper = function (schema) {
        this.checkAjv();
        this.ajv.addSchema(schema);
    };
    Server.prototype.getApiSchema = function () {
        this.checkAjv();
        return this.ajv;
    };
    Server.prototype.createEndpoints = function (endpoints, preprocessor) {
        if (preprocessor === void 0) { preprocessor = this.default_preprocessor; }
        api_1.create_endpoints(this.app, endpoints, preprocessor, this.ajv, this.requestListener);
    };
    Server.prototype.add_endpoints = function (endpoints, preprocessor) {
        this.createEndpoints(endpoints, preprocessor);
    };
    Server.prototype.enable_cors = function () {
        this.app.use(require('cors')({
            origin: function (origin, callback) {
                callback(null, true);
            },
            credentials: true
        }));
    };
    Server.prototype.start = function (config) {
        var _this = this;
        this.port = (config && config.port) || 3000;
        return start_express(this.app, this.port, config.ssl || {})
            .then(function (server) {
            _this.node_server = server;
            console.log('Listening on port ' + _this.port + '.');
        });
    };
    Server.prototype.get_app = function () {
        return this.app;
    };
    Server.prototype.get_port = function () {
        return this.port;
    };
    Server.prototype.stop = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.node_server.close(function () { return resolve(); });
        });
    };
    return Server;
}());
exports.Server = Server;
function start_express(app, port, ssl) {
    return new Promise(function (resolve, reject) {
        try {
            if (ssl.enabled) {
                var https = require('https');
                var fs = require('fs');
                var privateCert = void 0, publicCert = void 0;
                try {
                    privateCert = fs.readFileSync(ssl.privateFile);
                    publicCert = fs.readFileSync(ssl.publicFile);
                }
                catch (error) {
                    console.error('Error loading ssl cert file.', error);
                    reject(error);
                }
                var server_1 = https.createServer({
                    key: privateCert,
                    cert: publicCert
                }, app)
                    .listen(port, function (err) {
                    if (err)
                        reject("Error starting server (SSL)");
                    console.log('API is listening on port ' + port + ' (SSL)');
                    resolve(server_1);
                });
            }
            else {
                var server_2 = app.listen(port, function (err) {
                    if (err)
                        reject("Error starting server");
                    console.log('API is listening on port ' + port);
                    resolve(server_2);
                });
            }
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.start_express = start_express;
//# sourceMappingURL=server.js.map