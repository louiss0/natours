"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var HTTPStatusCodes_1 = __importDefault(require("../types/HTTPStatusCodes"));
var AppError_1 = __importDefault(require("../utils/AppError"));
var handleCastErrorDB = function (err) {
    var message = "Invalid " + err.path + ": " + err.value + ".";
    return new AppError_1.default(message, 400);
};
var handleDuplicateFieldsDB = function (err) {
    var value;
    var regExpressionResult = err.errmsg.match(/(["'])(\\?.)*?\1/);
    if (!regExpressionResult) {
        return;
    }
    value = regExpressionResult[0];
    var message = "Duplicate field value: " + value + ". Please use another value!";
    return new AppError_1.default(message, 400);
};
var handleValidationErrorDB = function (err) {
    var errors = Object.values(err.errors).map(function (el) { return el.message; });
    var message = "Invalid input data. " + errors.join('.');
    return new AppError_1.default(message, 400);
};
var handleJWTError = function () {
    return new AppError_1.default('Invalid token. Please log in again!', 401);
};
var handleJWTExpiredError = function () {
    return new AppError_1.default('Your token has expired! Please log in again.', 401);
};
var sendErrorDev = function (err, req, res) {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).render("errorTemplate", {
        title: "Something went wrong",
        msg: err.message
    });
};
var sendErrorProd = function (err, req, res) {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        // A) Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
            // B) Programming or other unknown error: don't leak error details
        }
        // 1) Log error
        console.error('ERROR 💥', err);
        return res.status(HTTPStatusCodes_1.default.ServerError).json({
            status: "error",
            message: "Something went very wrong"
        });
    }
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
        // B) Programming or other unknown error: don't leak error details
    }
    // 1) Log error
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).render("errorTemplate", {
        title: "Something went wrong",
        msg: err.message
    });
};
var globalErrorHandler = function (err, req, res, next) {
    err.statusCode || (err.statusCode = 500);
    err.status || (err.status = 'error');
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        var error = __assign({}, err);
        error.message = err.message;
        if (error.name === 'CastError')
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError')
            error = handleJWTError();
        if (error.name === 'TokenExpiredError')
            error = handleJWTExpiredError();
        sendErrorProd(error, req, res);
    }
};
exports.default = globalErrorHandler;
