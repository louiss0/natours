"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var AuthController_1 = __importDefault(require("../controllers/AuthController"));
var UserController_1 = __importDefault(require("../controllers/UserController"));
var UserTypes_1 = __importDefault(require("../types/UserTypes"));
var userRouter = express_1.Router();
var ImageUploader_1 = __importDefault(require("../utils/ImageUploader"));
var resizeImage_1 = __importDefault(require("../middlewares/resizeImage"));
userRouter.get("/me", AuthController_1.default.protect, UserController_1.default.me);
userRouter.delete("/delete-me", AuthController_1.default.protect, UserController_1.default.deleteMe);
userRouter.patch("/update-me", AuthController_1.default.protect, ImageUploader_1.default.uploadUserPhoto, resizeImage_1.default("users", "public/img/users"), UserController_1.default.updateMe);
userRouter.post("/forgot-password", AuthController_1.default.forgotPassword);
userRouter.patch("/reset-password/:token", AuthController_1.default.resetPassword);
userRouter.patch("/update-my-password", AuthController_1.default.protect, AuthController_1.default.updatePassword);
userRouter.post("/sign-up", AuthController_1.default.signUp);
userRouter.post("/log-in", AuthController_1.default.logIn);
userRouter.get("/log-out", AuthController_1.default.logOut);
userRouter
    .route("/")
    .get(UserController_1.default.getAllUsers)
    .post(UserController_1.default.createUser);
userRouter.use(AuthController_1.default.protect, AuthController_1.default.restrictTo(UserTypes_1.default.UserRoles.Admin));
userRouter
    .route("/:id")
    .get(UserController_1.default.getUser)
    .patch(UserController_1.default.updateUser)
    .delete(UserController_1.default.deleteUser);
exports.default = userRouter;
