"use strict";
// Lawn will handle any type of thrown errors, but also provides these helper Error types.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HTTP_Error = (function (_super) {
    __extends(HTTP_Error, _super);
    function HTTP_Error(message, status, body) {
        if (message === void 0) { message = "Server Error"; }
        if (status === void 0) { status = 500; }
        if (body === void 0) { body = {}; }
        var _this = _super.call(this, message) || this;
        _this.status = status;
        _this.message = message; // super(message) doesn't seem to be working.
        _this.body = body;
        return _this;
    }
    return HTTP_Error;
}(Error));
exports.HTTP_Error = HTTP_Error;
var Bad_Request = (function (_super) {
    __extends(Bad_Request, _super);
    function Bad_Request(message, bodyOrKey) {
        if (message === void 0) { message = "Bad Request"; }
        if (bodyOrKey === void 0) { bodyOrKey = {}; }
        var _this = this;
        if (typeof bodyOrKey === 'string') {
            _this = _super.call(this, message, 400) || this;
            _this.key = bodyOrKey;
        }
        else {
            _this = _super.call(this, message, 400, bodyOrKey) || this;
        }
        return _this;
    }
    return Bad_Request;
}(HTTP_Error));
exports.Bad_Request = Bad_Request;
var BadRequest = (function (_super) {
    __extends(BadRequest, _super);
    function BadRequest(message, bodyOrKey) {
        if (message === void 0) { message = "Bad Request"; }
        if (bodyOrKey === void 0) { bodyOrKey = {}; }
        var _this = this;
        if (typeof bodyOrKey === 'string') {
            _this = _super.call(this, message, 400) || this;
            _this.key = bodyOrKey;
        }
        else {
            _this = _super.call(this, message, 400, bodyOrKey) || this;
        }
        return _this;
    }
    return BadRequest;
}(HTTP_Error));
exports.BadRequest = BadRequest;
var Needs_Login = (function (_super) {
    __extends(Needs_Login, _super);
    function Needs_Login(message) {
        if (message === void 0) { message = "This request requires a logged in user."; }
        return _super.call(this, message, 401) || this;
    }
    return Needs_Login;
}(HTTP_Error));
exports.Needs_Login = Needs_Login;
var Unauthorized = (function (_super) {
    __extends(Unauthorized, _super);
    function Unauthorized(message) {
        if (message === void 0) { message = "You are not authorized to perform this request."; }
        return _super.call(this, message, 403) || this;
    }
    return Unauthorized;
}(HTTP_Error));
exports.Unauthorized = Unauthorized;
//# sourceMappingURL=errors.js.map