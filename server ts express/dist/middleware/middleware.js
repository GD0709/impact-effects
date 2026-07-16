"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingAfter = loggingAfter;
exports.loggingBefore = loggingBefore;
var express_http_context_1 = __importDefault(require("express-http-context"));
function loggingBefore(request, response, next) {
    console.log('do something Before...');
    console.log('set traceId = 123');
    express_http_context_1.default.set('traceId', 123);
    next();
}
function loggingAfter(request, response, next) {
    console.log('do something After...');
    console.log("tracedId = ".concat(express_http_context_1.default.get('traceId')));
    next();
}
