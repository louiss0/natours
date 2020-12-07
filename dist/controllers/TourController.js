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
var TourModel_1 = __importDefault(require("../models/TourModel"));
var HTTPStatusCodes_1 = __importDefault(require("../types/HTTPStatusCodes"));
var AppError_1 = __importDefault(require("../utils/AppError"));
var catchAsync_1 = __importDefault(require("../utils/catchAsync"));
var sendJson_1 = __importDefault(require("../utils/sendJson"));
var CrudFactory_1 = __importDefault(require("./CrudFactory"));
var TourController = /** @class */ (function (_super) {
    __extends(TourController, _super);
    function TourController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TourController, "getAllTours", {
        get: function () {
            return TourController.getAll(TourModel_1.default);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TourController, "getTour", {
        get: function () {
            return TourController.getOne(TourModel_1.default, { path: "reviews" });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TourController, "createTour", {
        get: function () {
            return TourController.createOne(TourModel_1.default);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TourController, "updateTour", {
        get: function () {
            return TourController.updateOne(TourModel_1.default);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TourController, "deleteTour", {
        get: function () {
            return TourController.deleteOne(TourModel_1.default);
        },
        enumerable: false,
        configurable: true
    });
    TourController.aliasTopTours = function (req, res, next) {
        req.query.sort = "-ratingsAverage";
        req.query.limit = "5";
        req.query.fields = "name,ratingsAverage,summary,difficulty";
        this.getAllTours(req, res, next);
    };
    Object.defineProperty(TourController, "tourStats", {
        get: function () {
            var _this = this;
            return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var tourStats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, TourModel_1.default.aggregate([
                                { $match: { ratingsAverage: { $gte: 4.5 } } },
                                {
                                    $group: {
                                        _id: "difficulty",
                                        numOfRatings: { $sum: "$ratingsQuantity" },
                                        avgPrice: { $avg: '$price' },
                                        avgRatingsAverage: { $avg: '$ratingsAverage' },
                                        maxPrice: { $max: "$price" },
                                        minPrice: { $min: "$price" },
                                        numOfTours: { $sum: 1 }
                                    }
                                },
                                { $sort: { avgPrice: 1 } }
                            ])];
                        case 1:
                            tourStats = _a.sent();
                            sendJson_1.default(res, {
                                status: "success",
                                message: "These are the tour stats",
                                data: {
                                    tourStats: tourStats
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
    Object.defineProperty(TourController, "monthlyPlan", {
        get: function () {
            var _this = this;
            return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var year, plan;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            year = parseInt(req.params.year);
                            return [4 /*yield*/, TourModel_1.default.aggregate([
                                    { $unwind: "$startDates" },
                                    {
                                        $match: {
                                            startDates: {
                                                $gte: new Date(year + "-01-01"),
                                                $lte: new Date(year + "-12-31")
                                            },
                                        }
                                    },
                                    {
                                        $group: {
                                            _id: { $month: "$startDates" },
                                            numOfTourStarts: { $sum: 1 },
                                            tours: { $push: "name" }
                                        }
                                    },
                                    {
                                        $addFields: {
                                            month: "$_id"
                                        }
                                    },
                                    {
                                        $project: {
                                            _id: 0
                                        }
                                    }
                                ])];
                        case 1:
                            plan = _a.sent();
                            sendJson_1.default(res, {
                                status: "success",
                                message: "This is the monthly Plan for each tour",
                                data: {
                                    plan: plan
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
    Object.defineProperty(TourController, "toursWithin", {
        get: function () {
            var _this = this;
            return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var _a, distance, latlng, unit, _b, lat, lng, numericalDistance, radius, tours;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = req.params, distance = _a.distance, latlng = _a.latlng, unit = _a.unit;
                            _b = latlng.split(",").map(function (value) { return parseFloat(value); }), lat = _b[0], lng = _b[1];
                            numericalDistance = parseInt(distance);
                            radius = unit === "mi"
                                ? numericalDistance / 3963.2
                                : numericalDistance / 6378.1;
                            if (!lat || !lng) {
                                return [2 /*return*/, next(new AppError_1.default("Please provide longitude and latitude in the format lat, lng", HTTPStatusCodes_1.default.BadRequest))];
                            }
                            return [4 /*yield*/, TourModel_1.default.find({
                                    startLocation: {
                                        $geoWithin: {
                                            $centerSphere: [[lng, lat], radius]
                                        }
                                    }
                                })];
                        case 1:
                            tours = _c.sent();
                            sendJson_1.default(res, {
                                status: "success",
                                message: "Here are all the tours close this distance " + distance,
                                results: tours.length,
                                data: {
                                    tours: tours
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
    Object.defineProperty(TourController, "distances", {
        get: function () {
            var _this = this;
            return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var _a, latlng, unit, _b, lat, lng, distanceMultiplier, distances;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = req.params, latlng = _a.latlng, unit = _a.unit;
                            _b = latlng.split(",").map(function (value) { return parseFloat(value); }), lat = _b[0], lng = _b[1];
                            if (!lat || !lng) {
                                return [2 /*return*/, next(new AppError_1.default("Please provide longitude and latitude in the format lat, lng", HTTPStatusCodes_1.default.BadRequest))];
                            }
                            distanceMultiplier = unit === "mi" ? 0.000621371 : 0.001;
                            return [4 /*yield*/, TourModel_1.default.aggregate([
                                    {
                                        $geoNear: {
                                            near: {
                                                type: "Point",
                                                coordinates: [lng, lat]
                                            },
                                            distanceField: "distance",
                                            distanceMultiplier: distanceMultiplier
                                        }
                                    },
                                    {
                                        $project: {
                                            distance: 1,
                                            name: 1
                                        }
                                    }
                                ])];
                        case 1:
                            distances = _c.sent();
                            sendJson_1.default(res, {
                                status: "success",
                                message: "Here are the distances for all of the tours ",
                                data: {
                                    distances: distances
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
    return TourController;
}(CrudFactory_1.default));
exports.default = TourController;
