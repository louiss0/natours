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
var reviewModel_1 = __importDefault(require("../models/reviewModel"));
var CrudFactory_1 = __importDefault(require("./CrudFactory"));
var ReviewController = /** @class */ (function (_super) {
    __extends(ReviewController, _super);
    function ReviewController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ReviewController, "setUserAndTourFields", {
        get: function () {
            return function (req, res, next) {
                var _a, _b;
                var _c, _d;
                var userRequest = __assign({}, req);
                (_a = (_c = req.body).tour) !== null && _a !== void 0 ? _a : (_c.tour = req.params.tourId);
                (_b = (_d = req.body).user) !== null && _b !== void 0 ? _b : (_d.user = userRequest.user.id);
                next();
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReviewController, "setTourField", {
        get: function () {
            return function (req, res, next) {
                var filterRequest = __assign({}, req);
                filterRequest.filter = {
                    tour: req.params.tourId
                };
                next();
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReviewController, "allReviews", {
        get: function () {
            return ReviewController.getAll(reviewModel_1.default);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReviewController, "review", {
        get: function () {
            return ReviewController.getOne(reviewModel_1.default);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReviewController, "createReview", {
        get: function () {
            return ReviewController.createOne(reviewModel_1.default);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReviewController, "updateReview", {
        get: function () {
            return ReviewController.updateOne(reviewModel_1.default);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReviewController, "deleteReview", {
        get: function () {
            return ReviewController.deleteOne(reviewModel_1.default);
        },
        enumerable: false,
        configurable: true
    });
    return ReviewController;
}(CrudFactory_1.default));
exports.default = ReviewController;
