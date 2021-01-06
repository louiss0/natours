import { Router } from "express";
import AuthController from "../controllers/AuthController";
import UserController from "../controllers/UserController";
import UserTypes from "../types/UserTypes";
const userRouter = Router()
import ImageUploader from "../utils/ImageUploader";
import resizeImage from "../middlewares/resizeImage";

userRouter.get("/me", AuthController.protect, UserController.me)

userRouter.delete("/delete-me", AuthController.protect, UserController.deleteMe)

userRouter.patch("/update-me",
    AuthController.protect,
    ImageUploader.uploadUserPhoto,
    resizeImage("users", "public/img/users"),
    UserController.updateMe
)

userRouter.post("/forgot-password", AuthController.forgotPassword)
userRouter.patch("/reset-password/:token", AuthController.resetPassword)

userRouter.patch("/update-my-password",
    AuthController.protect,
    AuthController.updatePassword
)

userRouter.post("/sign-up", AuthController.signUp)

userRouter.post("/log-in", AuthController.logIn)

userRouter.get("/log-out", AuthController.logOut)


userRouter
    .route("/")
    .get(UserController.getAllUsers)
    .post(UserController.createUser)


userRouter.use(
    AuthController.protect,
    AuthController.restrictTo(
        UserTypes.UserRoles.Admin,
    )
)

userRouter
    .route("/:id")
    .get(UserController.getUser)
    .patch(UserController.updateUser)
    .delete(UserController.deleteUser)

export default userRouter