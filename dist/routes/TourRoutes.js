"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var AuthController_1 = __importDefault(require("../controllers/AuthController"));
var TourController_1 = __importDefault(require("../controllers/TourController"));
var UserTypes_1 = __importDefault(require("../types/UserTypes"));
var reviewRoutes_1 = __importDefault(require("./reviewRoutes"));
var tourRouter = express_1.Router();
tourRouter.use("/:tourId/reviews", reviewRoutes_1.default);
tourRouter.route("/top-5-cheap")
    .get(TourController_1.default.aliasTopTours);
tourRouter.route("/monthly-plan/:year")
    .get(TourController_1.default.monthlyPlan);
tourRouter.route("/tour-stats")
    .get(TourController_1.default.tourStats);
tourRouter.route("/tours-within/:distance/center/:latlng/unit/:unit")
    .get(AuthController_1.default.protect, TourController_1.default.toursWithin);
tourRouter.route("/distances/:latlng/unit/:unit")
    .get(AuthController_1.default.protect, TourController_1.default.distances);
tourRouter.use(AuthController_1.default.protect, AuthController_1.default.restrictTo(UserTypes_1.default.UserRoles.Admin));
tourRouter.route("/")
    .get(TourController_1.default.getAllTours)
    .post(TourController_1.default.createTour);
tourRouter.route("/:id")
    .get(TourController_1.default.getTour)
    .patch(TourController_1.default.updateTour)
    .delete(TourController_1.default.deleteTour);
exports.default = tourRouter;
