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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var UserModel_1 = __importDefault(require("./../models/UserModel"));
var catchAsync_1 = __importDefault(require("./../utils/catchAsync"));
var AppError_1 = __importDefault(require("./../utils/AppError"));
var HTTPStatusCodes_1 = __importDefault(require("../types/HTTPStatusCodes"));
var Email_1 = __importDefault(require("../utils/Email"));
var JWTTokenSenderAndManipulator_1 = __importDefault(require("../utils/JWTTokenSenderAndManipulator"));
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.restrictTo = function () {
        var roles = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            roles[_i] = arguments[_i];
        }
        return function (req, res, next) {
            var userRequest = req;
            var userRoles = __spreadArrays(roles);
            if (userRequest.user.role && !userRoles.includes(userRequest.user.role)) {
                return next(new AppError_1.default("You are not authorized to perform this action", HTTPStatusCodes_1.default.Forbidden));
            }
            next();
        };
    };
    AuthController.logOut = function (req, res, next) {
        JWTTokenSenderAndManipulator_1.default.sendLogoutCookie(res);
        res.redirect("/");
        next();
    };
    AuthController.signUp = catchAsync_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, name, email, password, passwordConfirm, userInDatabase, user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, name = _a.name, email = _a.email, password = _a.password, passwordConfirm = _a.passwordConfirm;
                    return [4 /*yield*/, UserModel_1.default
                            .findOne({ email: email })
                            .select('+password')];
                case 1:
                    userInDatabase = _b.sent();
                    if ((userInDatabase === null || userInDatabase === void 0 ? void 0 : userInDatabase.email) === email) {
                        return [2 /*return*/, next(new AppError_1.default("You already signed up for this site", HTTPStatusCodes_1.default.BadRequest))];
                    }
                    return [4 /*yield*/, UserModel_1.default.create({
                            name: name,
                            email: email,
                            password: password,
                            passwordConfirm: passwordConfirm
                        })];
                case 2:
                    user = _b.sent();
                    JWTTokenSenderAndManipulator_1.default.createSendToken(user, res, HTTPStatusCodes_1.default.Created);
                    return [2 /*return*/];
            }
        });
    }); });
    AuthController.logIn = catchAsync_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, email, password, user, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = req.body, email = _a.email, password = _a.password;
                    // 1) Check if email and password exist
                    if (!email || !password) {
                        return [2 /*return*/, next(new AppError_1.default('Please provide email and password!', 400))];
                    }
                    return [4 /*yield*/, UserModel_1.default.findOne({ email: email }).select('+password')];
                case 1:
                    user = _c.sent();
                    _b = !user;
                    if (_b) return [3 /*break*/, 3];
                    return [4 /*yield*/, user.correctPassword(password, user.password)];
                case 2:
                    _b = !(_c.sent());
                    _c.label = 3;
                case 3:
                    if (_b) {
                        return [2 /*return*/, next(new AppError_1.default('Incorrect email or password', 401))];
                    }
                    // 3) If everything ok, send token to client
                    JWTTokenSenderAndManipulator_1.default.createSendToken(user, res);
                    return [2 /*return*/];
            }
        });
    }); });
    AuthController.protect = catchAsync_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var token, decoder, decoded, currentUser;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (req.headers.authorization &&
                        req.headers.authorization.startsWith('Bearer')) {
                        token = req.headers.authorization.split(' ')[1];
                    }
                    else if ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt) {
                        token = req.cookies.jwt;
                    }
                    if (!token) {
                        return [2 /*return*/, next(new AppError_1.default('You are not logged in! Please log in to get access.', 401))];
                    }
                    decoder = JWTTokenSenderAndManipulator_1.default.decodeToken(token);
                    if (!decoder) {
                        return [2 /*return*/, next(new AppError_1.default("Could not decode token", HTTPStatusCodes_1.default.ServerError))];
                    }
                    return [4 /*yield*/, decoder];
                case 1:
                    decoded = _b.sent();
                    return [4 /*yield*/, UserModel_1.default.findById(decoded.id)];
                case 2:
                    currentUser = _b.sent();
                    if (!currentUser) {
                        return [2 /*return*/, next(new AppError_1.default('The user belonging to this token does no longer exist.', 401))];
                    }
                    // 4) Check if user changed password after the token was issued
                    if (currentUser.changedPasswordAfter(decoded.iat)) {
                        return [2 /*return*/, next(new AppError_1.default('User recently changed password! Please log in again.', 401))];
                    }
                    // GRANT ACCESS TO PROTECTED ROUTE
                    Object.assign(req, { user: currentUser });
                    res.locals.user = currentUser;
                    next();
                    return [2 /*return*/];
            }
        });
    }); });
    AuthController.isLoggedIn = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var decoded, currentUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.cookies.jwt) return [3 /*break*/, 3];
                    return [4 /*yield*/, JWTTokenSenderAndManipulator_1.default
                            .decodeToken(req.cookies.jwt)];
                case 1:
                    decoded = _a.sent();
                    // 2) Check if user still exists
                    if (!decoded) {
                        return [2 /*return*/, next()];
                    }
                    return [4 /*yield*/, UserModel_1.default.findById(decoded.id)];
                case 2:
                    currentUser = _a.sent();
                    if (!currentUser) {
                        return [2 /*return*/, next()];
                    }
                    // 4) Check if user changed password after the token was issued
                    if (currentUser.changedPasswordAfter(decoded.iat)) {
                        return [2 /*return*/, next()];
                    }
                    // GRANT ACCESS TO PROTECTED ROUTE
                    res.locals.user = currentUser;
                    _a.label = 3;
                case 3: return [2 /*return*/, next()];
            }
        });
    }); };
    AuthController.forgotPassword = catchAsync_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var user, resetToken, resetURL, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, UserModel_1.default.findOne({ email: req.body.email })];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, next(new AppError_1.default('There is no user with email address.', 404))];
                    }
                    resetToken = user.createPasswordResetToken();
                    return [4 /*yield*/, user.save({ validateBeforeSave: false })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 7]);
                    resetURL = req.protocol + "://" + req.get('host') + "/api/v1/user/reset-password/" + resetToken;
                    return [4 /*yield*/, new Email_1.default(user, resetURL).sendPasswordReset()];
                case 4:
                    _a.sent();
                    res.status(200).json({
                        status: 'success',
                        message: 'Token sent to email!'
                    });
                    return [3 /*break*/, 7];
                case 5:
                    err_1 = _a.sent();
                    user.passwordResetToken = null;
                    user.passwordResetExpires = null;
                    return [4 /*yield*/, user.save({ validateBeforeSave: false })];
                case 6:
                    _a.sent();
                    return [2 /*return*/, next(new AppError_1.default('There was an error sending the email. Try again later!', 500))];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    AuthController.resetPassword = catchAsync_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var hashedToken, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hashedToken = crypto_1.default
                        .createHash('sha256')
                        .update(req.params.token)
                        .digest('hex');
                    return [4 /*yield*/, UserModel_1.default.findOne({
                            passwordResetToken: hashedToken,
                            passwordResetExpires: { $gt: Date.now() }
                        })];
                case 1:
                    user = _a.sent();
                    // 2) If token has not expired, and there is user, set the new password
                    if (!user) {
                        return [2 /*return*/, next(new AppError_1.default('Token is invalid or has expired', 400))];
                    }
                    user.password = req.body.password;
                    user.passwordConfirm = req.body.passwordConfirm;
                    user.passwordResetToken = null;
                    user.passwordResetExpires = null;
                    return [4 /*yield*/, user.save()];
                case 2:
                    _a.sent();
                    // 3) Update changedPasswordAt property for the user
                    // 4) Log the user in, send JWT
                    JWTTokenSenderAndManipulator_1.default.createSendToken(user, res);
                    return [2 /*return*/];
            }
        });
    }); });
    AuthController.updatePassword = catchAsync_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var userRequest, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userRequest = __assign({}, req);
                    return [4 /*yield*/, UserModel_1.default.findById(userRequest.user.id).select('+password')];
                case 1:
                    user = _a.sent();
                    if (!user) return [3 /*break*/, 4];
                    return [4 /*yield*/, user.correctPassword(req.body.passwordCurrent, user.password)];
                case 2:
                    // 2) Check if POSTed current password is correct
                    if (!(_a.sent())) {
                        return [2 /*return*/, next(new AppError_1.default('Your current password is wrong.', 401))];
                    }
                    // 3) If so, update password
                    user.password = req.body.password;
                    user.passwordConfirm = req.body.passwordConfirm;
                    return [4 /*yield*/, user.save()];
                case 3:
                    _a.sent();
                    // User.findByIdAndUpdate will NOT work as intended!
                    // 4) Log user in, send JWT
                    JWTTokenSenderAndManipulator_1.default.createSendToken(user, res);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); });
    return AuthController;
}());
exports.default = AuthController;
