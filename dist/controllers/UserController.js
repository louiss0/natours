"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var UserModel_1 = __importDefault(require("../models/UserModel"));
var HTTPStatusCodes_1 = __importDefault(require("../types/HTTPStatusCodes"));
var AppError_1 = __importDefault(require("../utils/AppError"));
var catchAsync_1 = __importDefault(require("../utils/catchAsync"));
var filterObject_1 = __importDefault(require("../utils/filterObject"));
var sendJson_1 = __importDefault(require("../utils/sendJson"));
var CrudFactory_1 = __importDefault(require("./CrudFactory"));
var UserController = /** @class */ (function (_super) {
    __extends(UserController, _super);
    function UserController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(UserController, "me", {
        get: function () {
            var _this = this;
            return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var userRequest;
                return __generator(this, function (_a) {
                    userRequest = req;
                    req.params.id = userRequest.user.id;
                    this.getUser(req, res, next);
                    return [2 /*return*/];
                });
            }); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserController, "updateMe", {
        get: function () {
            var _this = this;
            return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var userRequest, filterBody, checkIfUserPasswordOrPasswordConfirmIsInBody, updatedUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            userRequest = req;
                            if (req.file) {
                                userRequest.body.photo = req.file.filename;
                            }
                            filterBody = filterObject_1.default(userRequest.body, "name", "email", "photo");
                            checkIfUserPasswordOrPasswordConfirmIsInBody = userRequest.body.password || userRequest.body.passwordConfirm;
                            if (checkIfUserPasswordOrPasswordConfirmIsInBody) {
                                return [2 /*return*/, next(new AppError_1.default("Cannot update password please use update-my-password route", HTTPStatusCodes_1.default.BadRequest))];
                            }
                            return [4 /*yield*/, UserModel_1.default.findByIdAndUpdate(userRequest.user.id, filterBody, { new: true, runValidators: true })];
                        case 1:
                            updatedUser = _a.sent();
                            if (!updatedUser) {
                                return [2 /*return*/, next(new AppError_1.default("Could not update user", HTTPStatusCodes_1.default.ServerError))];
                            }
                            sendJson_1.default(res, {
                                status: 'success',
                                message: "User updated",
                                data: {
                                    updatedUser: updatedUser
                                }
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserController, "deleteMe", {
        get: function () {
            var _this = this;
            return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var userRequest, deletedUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            userRequest = req;
                            return [4 /*yield*/, UserModel_1.default.findByIdAndUpdate(userRequest.user.id, { active: false })];
                        case 1:
                            deletedUser = _a.sent();
                            if (!deletedUser) {
                                return [2 /*return*/, next(new AppError_1.default("Could not update user", HTTPStatusCodes_1.default.ServerError))];
                            }
                            sendJson_1.default(res, {
                                status: "success",
                                message: "Your were deleted",
                                data: null
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserController, "getAllUsers", {
        get: function () {
            return UserController.getAll(UserModel_1.default);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserController, "getUser", {
        get: function () {
            return UserController.getOne(UserModel_1.default);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserController, "updateUser", {
        get: function () {
            return UserController.updateOne(UserModel_1.default);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserController, "deleteUser", {
        get: function () {
            return UserController.deleteOne(UserModel_1.default);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserController, "createUser", {
        get: function () {
            return UserController.createOne(UserModel_1.default);
        },
        enumerable: false,
        configurable: true
    });
    return UserController;
}(CrudFactory_1.default));
exports.default = UserController;
