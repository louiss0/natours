"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = __importStar(require("jsonwebtoken"));
var util_1 = require("util");
var sendJson_1 = __importDefault(require("./sendJson"));
var _a = process.env, JWT_SECRET = _a.JWT_SECRET, JWT_EXPIRES_IN = _a.JWT_EXPIRES_IN, JWT_COOKIE_EXPIRES_IN = _a.JWT_COOKIE_EXPIRES_IN, NODE_ENV = _a.NODE_ENV;
var JWTTokenSenderAndManipulator = /** @class */ (function () {
    function JWTTokenSenderAndManipulator() {
    }
    JWTTokenSenderAndManipulator.signToken = function (id) {
        if (JWT_SECRET && JWT_EXPIRES_IN) {
            return jwt.sign({ id: id }, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN
            });
        }
        else {
            console.table({ JWT_SECRET: JWT_SECRET, JWT_EXPIRES_IN: JWT_EXPIRES_IN });
        }
    };
    ;
    JWTTokenSenderAndManipulator.createSendToken = function (user, res, statusCode) {
        if (statusCode === void 0) { statusCode = 200; }
        var token = JWTTokenSenderAndManipulator.signToken(user.id);
        if (token) {
            if (JWT_COOKIE_EXPIRES_IN) {
                var oneDay = 24 * Math.pow(60, 2) * 1000;
                var ninetyDays = parseInt(JWT_COOKIE_EXPIRES_IN) * oneDay;
                var cookieOptions = {
                    httpOnly: true,
                    expires: new Date(Date.now() + ninetyDays)
                };
                if (NODE_ENV === "production") {
                    cookieOptions.secure = true;
                }
                res.cookie("jwt", token, cookieOptions);
            }
            //  Remove password from output
            user.password = null;
            sendJson_1.default(res, {
                status: 'success',
                token: token,
                message: "Here is the token an the user",
                data: {
                    user: user
                }
            }, statusCode);
        }
        else {
            console.error(token);
        }
    };
    ;
    JWTTokenSenderAndManipulator.sendLogoutCookie = function (res) {
        res.cookie("jwt", "loggedOut", {
            httpOnly: true,
            expires: new Date(Date.now() - 10 * 1000)
        });
        sendJson_1.default(res, {
            status: "success",
            data: null,
            message: "You are logged out"
        });
    };
    JWTTokenSenderAndManipulator.decodeToken = function (token) {
        if (JWT_SECRET) {
            return util_1.promisify(jwt.verify)(token, JWT_SECRET);
        }
        else {
            console.table({ JWT_SECRET: JWT_SECRET, JWT_EXPIRES_IN: JWT_EXPIRES_IN });
        }
    };
    return JWTTokenSenderAndManipulator;
}());
exports.default = JWTTokenSenderAndManipulator;
