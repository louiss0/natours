import UserTypes from "../types/UserTypes";
import { CookieOptions, Response } from 'express';
import * as  jwt from 'jsonwebtoken';
import { promisify } from 'util';
import sendJson from "./sendJson";

export interface Decoded {
    id: string
    iat: number
    exp: number
}

const { JWT_SECRET, JWT_EXPIRES_IN, JWT_COOKIE_EXPIRES_IN, NODE_ENV } = process.env


class JWTTokenSenderAndManipulator {

    private static signToken(id: string) {

        if (JWT_SECRET && JWT_EXPIRES_IN) {

            return jwt.sign({ id }, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN
            });
        } else {

            console.table({ JWT_SECRET, JWT_EXPIRES_IN })
        }
    };

    static createSendToken(user: UserTypes.UserDocument, res: Response, statusCode = 200) {
        const token = JWTTokenSenderAndManipulator.signToken(user.id);

        if (token) {


            if (JWT_COOKIE_EXPIRES_IN) {

                const oneDay = 24 * 60 ** 2 * 1000

                const ninetyDays = parseInt(JWT_COOKIE_EXPIRES_IN) * oneDay

                const cookieOptions: CookieOptions = {
                    httpOnly: true,
                    expires: new Date(Date.now() + ninetyDays)
                }

                if (NODE_ENV === "production") {

                    cookieOptions.secure = true
                }

                res.cookie("jwt", token, cookieOptions)
            }

            //  Remove password from output
            user.password = null

            sendJson(res, {
                status: 'success',
                token,
                message: "Here is the token an the user",
                data: {
                    user
                }
            })
        } else {

            console.error(token)
        }

    };


    static sendLogoutCookie(res: Response) {


        res.cookie("jwt", "loggedOut", {
            httpOnly: true,
            expires: new Date(Date.now() - 10 * 1000)
        })

        sendJson(res, {
            status: "success",
            data: null,
            message: "You are logged out"
        })
    }

    static decodeToken(token: string) {

        if (JWT_SECRET) {
            return promisify(jwt.verify)(token, JWT_SECRET)

        } else {
            console.table({ JWT_SECRET, JWT_EXPIRES_IN })

        }

    }
}


export default JWTTokenSenderAndManipulator