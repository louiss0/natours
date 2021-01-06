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
var stripe_1 = __importDefault(require("stripe"));
var BookingModel_1 = __importDefault(require("../models/BookingModel"));
var TourModel_1 = __importDefault(require("../models/TourModel"));
var HTTPStatusCodes_1 = __importDefault(require("../types/HTTPStatusCodes"));
var AppError_1 = __importDefault(require("../utils/AppError"));
var catchAsync_1 = __importDefault(require("../utils/catchAsync"));
var sendJson_1 = __importDefault(require("../utils/sendJson"));
var CrudFactory_1 = __importDefault(require("./CrudFactory"));
var BookingController = /** @class */ (function (_super) {
    __extends(BookingController, _super);
    function BookingController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BookingController, "checkoutSession", {
        get: function () {
            var _this = this;
            return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var userRequest, tour, _a, quantity, amountMultiplier, session;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            userRequest = req;
                            return [4 /*yield*/, TourModel_1.default.findById(userRequest.params.tourId)];
                        case 1:
                            tour = _b.sent();
                            if (!tour) {
                                return [2 /*return*/, next(new AppError_1.default("Could not find the tour or one", HTTPStatusCodes_1.default.NotFound))];
                            }
                            if (!(BookingController.stripe instanceof stripe_1.default)) return [3 /*break*/, 3];
                            _a = [1, 100], quantity = _a[0], amountMultiplier = _a[1];
                            return [4 /*yield*/, BookingController
                                    .stripe
                                    .checkout
                                    .sessions
                                    .create({
                                    payment_method_types: ["card"],
                                    success_url: req.protocol + "://" + req.get("host") + "/",
                                    cancel_url: req.protocol + "://" + req.get("host") + "/tour/" + tour.slug,
                                    customer_email: userRequest.user.email,
                                    line_items: [
                                        {
                                            name: tour.name + " Name",
                                            description: tour.summary,
                                            quantity: quantity,
                                            images: [
                                                " /" + tour.imageCover
                                            ],
                                            amount: tour.price * amountMultiplier,
                                            currency: "usd",
                                        }
                                    ]
                                })];
                        case 2:
                            session = _b.sent();
                            sendJson_1.default(res, {
                                status: "success",
                                message: "Here is the session",
                                data: {
                                    session: session,
                                    sessionRequestTime: userRequest.requestTime
                                }
                            });
                            return [3 /*break*/, 4];
                        case 3: return [2 /*return*/, next(new AppError_1.default("Cannot access stripe ", HTTPStatusCodes_1.default.ServerError))];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BookingController, "stripe", {
        get: function () {
            var STRIPE_TEST_KEY = process.env.STRIPE_TEST_KEY;
            return STRIPE_TEST_KEY
                ? new stripe_1.default(STRIPE_TEST_KEY, { apiVersion: "2020-08-27" })
                : console.table({ STRIPE_TEST_KEY: STRIPE_TEST_KEY });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BookingController, "createBookingCheckout", {
        get: function () {
            var _this = this;
            return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var _a, tour, user, price;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = req.query, tour = _a.tour, user = _a.user, price = _a.price;
                            if (![tour, user, price].every(function (value) {
                                return !Array.isArray(value) && typeof value !== "string";
                            })) return [3 /*break*/, 1];
                            return [2 /*return*/, next()];
                        case 1:
                            console.log(req.query);
                            return [4 /*yield*/, BookingModel_1.default.create({ tour: tour, user: user, price: price })];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BookingController, "allBookings", {
        get: function () {
            return BookingController.getAll(BookingModel_1.default);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BookingController, "singleBooking", {
        get: function () { return BookingController.getOne(BookingModel_1.default); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BookingController, "updateBooking", {
        get: function () { return BookingController.updateOne(BookingModel_1.default); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BookingController, "createBooking", {
        get: function () { return BookingController.createOne(BookingModel_1.default); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BookingController, "deleteBooking", {
        get: function () { return BookingController.deleteOne(BookingModel_1.default); },
        enumerable: false,
        configurable: true
    });
    return BookingController;
}(CrudFactory_1.default));
exports.default = BookingController;
