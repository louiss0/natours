import { RequestHandler } from "express";
import User from "../models/UserModel";
import HTTPStatusCodes from "../types/HTTPStatusCodes";
import UserTypes from "../types/UserTypes";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import filterObject from "../utils/filterObject";
import sendJson from "../utils/sendJson";
import CrudFactory from "./CrudFactory";

export default class UserController extends CrudFactory {



    static get me(): RequestHandler {

        return catchAsync(async (req) => {

            const userRequest = req as UserTypes.UserRequest

            req.params.id = userRequest.user.id
        })
    }

    static get updateMe(): RequestHandler {

        return catchAsync(async (req, res, next) => {


            const userRequest = req as UserTypes.UserRequest


            if (req.file) {

                userRequest.body.photo = req.file.filename
            }

            const filterBody = filterObject(userRequest.body, "name", "email", "photo")


            const checkIfUserPasswordOrPasswordConfirmIsInBody =

                userRequest.body.password || userRequest.body.passwordConfirm

            if (checkIfUserPasswordOrPasswordConfirmIsInBody) {


                return next(new AppError(
                    "Cannot update password please use update-my-password route", HTTPStatusCodes.BadRequest

                ))

            }

            const updatedUser = await User.findByIdAndUpdate(
                userRequest.user.id,
                filterBody,
                { new: true, runValidators: true }
            )

            if (!updatedUser) {

                return next(new AppError("Could not update user", HTTPStatusCodes.ServerError))
            }

            sendJson(res, {
                status: 'success',
                message: "User updated",
                data: {
                    updatedUser
                }
            })


        })

    }

    static get deleteMe() {

        return catchAsync(async (req, res, next) => {


            const userBody = req.body as
                Pick<UserTypes.UserDocument, "id" | "email" | "name" | "password" | "passwordConfirm">

            const deletedUser = await User.findByIdAndUpdate(userBody.id, { active: false })


            if (!deletedUser) {

                return next(new AppError("Could not update user", HTTPStatusCodes.ServerError))
            }

            sendJson(res, {
                status: "success",
                message: "Your were deleted",
                data: null
            })

        })
    }



    static get getAllUsers() {
        return UserController.getAll(User)
    }

    static get getUser() {
        return UserController.getOne(User)

    }

    static get updateUser() {
        return UserController.updateOne(User)
    }

    static get deleteUser() {
        return UserController.deleteOne(User)

    }

    static get createUser() {
        return UserController.createOne(User)

    }
}



