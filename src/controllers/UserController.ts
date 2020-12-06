import { RequestHandler } from "express";
import UserTypes from "../types/UserTypes";
import catchAsync from "../utils/catchAsync";

export default class UserController {



    static get me(): RequestHandler {

        return catchAsync(async (req) => {

            const userRequest = req as UserTypes.UserRequest

            req.params.id = userRequest.user.id
        })
    }




}



