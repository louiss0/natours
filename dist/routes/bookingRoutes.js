"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var AuthController_1 = __importDefault(require("../controllers/AuthController"));
var BookingController_1 = __importDefault(require("../controllers/BookingController"));
var bookingRouter = express_1.Router();
bookingRouter.get("/checkout-session/:tourId", AuthController_1.default.protect, BookingController_1.default.checkoutSession);
exports.default = bookingRouter;
