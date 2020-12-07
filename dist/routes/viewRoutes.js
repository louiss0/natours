"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var AuthController_1 = __importDefault(require("../controllers/AuthController"));
var viewController_1 = __importDefault(require("../controllers/viewController"));
var viewRouter = express_1.Router();
viewRouter.get('/', AuthController_1.default.isLoggedIn, viewController_1.default.overview);
viewRouter.get('/tour/:slug', AuthController_1.default.isLoggedIn, viewController_1.default.renderTourPage);
viewRouter.get('/login', AuthController_1.default.isLoggedIn, viewController_1.default.renderLoginPage);
viewRouter.get('/me', AuthController_1.default.protect, viewController_1.default.renderAccountPage);
exports.default = viewRouter;
