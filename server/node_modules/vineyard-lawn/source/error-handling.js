"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sendErrorResponse(res, error) {
    var message = error.message = error.status == 500 ? "Server Error" : error.message;
    res.statusMessage = message;
    var body = {
        error: {
            code: error.status,
            message: message
        }
    };
    if (error.body && (typeof error.body != 'object' || Object.keys(error.body).length > 0))
        body.additional = error.body;
    error.body = body;
    res.status(error.status).send(body);
}
exports.sendErrorResponse = sendErrorResponse;
function handleError(res, error, listener, request) {
    if (request === void 0) { request = null; }
    error.status = error.status || 500;
    try {
        listener.onError(error, request);
    }
    catch (error) {
        console.error('Error while logging http handling error', error);
    }
    return sendErrorResponse(res, error);
}
exports.handleError = handleError;
//# sourceMappingURL=error-handling.js.map