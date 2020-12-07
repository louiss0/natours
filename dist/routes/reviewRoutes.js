"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var AuthController_1 = __importDefault(require("../controllers/AuthController"));
var reviewController_1 = __importDefault(require("../controllers/reviewController"));
var reviewRouter = express_1.Router({ mergeParams: true });
reviewRouter
    .route("/")
    .get(AuthController_1.default.protect, reviewController_1.default.setTourField, reviewController_1.default.allReviews)
    .post(AuthController_1.default.protect, reviewController_1.default.setUserAndTourFields, reviewController_1.default.createReview);
reviewRouter
    .route("/:id")
    .get(reviewController_1.default.review)
    .patch(reviewController_1.default.updateReview)
    .delete(reviewController_1.default.deleteReview);
exports.default = reviewRouter;
