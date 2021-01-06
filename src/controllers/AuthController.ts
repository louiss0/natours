import crypto from 'crypto';
import User from './../models/UserModel';
import catchAsync, { AsyncMiddleware } from './../utils/catchAsync';
import AppError from './../utils/AppError';
import UserTypes from '../types/UserTypes';
import HTTPStatusCodes from '../types/HTTPStatusCodes';
import Email from '../utils/Email';
import JWTTokenSenderAndManipulator, { Decoded } from '../utils/JWTTokenSenderAndManipulator';
import { RequestHandler } from 'express';



export default class AuthController {



    static restrictTo(...roles: Array<UserTypes.UserRoles>): RequestHandler {

        return (req, res, next) => {

            const userRequest = req as UserTypes.UserRequest

            const userRoles = [...roles] as Array<string>

            if (userRequest.user.role && !userRoles.includes(userRequest.user.role)) {

                return next(new AppError(
                    "You are not authorized to perform this action",
                    HTTPStatusCodes.Forbidden
                ))
            }

            next()
        }

    }


    static logOut: RequestHandler = (req, res, next) => {


        JWTTokenSenderAndManipulator.sendLogoutCookie(res)

        res.redirect("/")
        next()
    }


    static signUp = catchAsync(async (req, res, next) => {


        const { name, email, password, passwordConfirm } = req.body

        const userInDatabase = await User
            .findOne({ email })
            .select('+password');

        if (userInDatabase?.email === email) {


            return next(
                new AppError("You already signed up for this site", HTTPStatusCodes.BadRequest))
        }

        const user = await User.create({
            name,
            email,
            password,
            passwordConfirm
        });

        const url = `${req.protocol}://${req.get("host")}/me`

        await new Email(user, url).sendWelcome()

        JWTTokenSenderAndManipulator.createSendToken(
            user, res, HTTPStatusCodes.Created
        );

    });

    static logIn = catchAsync(async (req, res, next) => {

        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {

            return next(new AppError('Please provide email and password!', 400));

        }

        // 2) Check if user exists && password is correct

        const user = await User.findOne({ email }).select('+password');


        if (!user || !(await user.correctPassword(password, user.password as string))) {

            return next(new AppError('Incorrect email or password', 401));

        }

        // 3) If everything ok, send token to client
        JWTTokenSenderAndManipulator.createSendToken(user, res,);
    });



    static protect = catchAsync(async (req, res, next) => {
        // 1) Getting token and check of it's there
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies?.jwt) {


            token = req.cookies.jwt
        }

        if (!token) {
            return next(
                new AppError('You are not logged in! Please log in to get access.', 401)
            );
        }

        // 2) Verification token


        const decoder = JWTTokenSenderAndManipulator.decodeToken(token)


        if (!decoder) {

            return next(new AppError("Could not decode token", HTTPStatusCodes.ServerError))
        }

        const decoded = await decoder as Decoded

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return next(
                new AppError(
                    'The user belonging to this token does no longer exist.',
                    401
                )
            );
        }

        // 4) Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(
                new AppError('User recently changed password! Please log in again.', 401)
            );
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        Object.assign(req, { user: currentUser })
        res.locals.user = currentUser;
        next();
    });

    static isLoggedIn: AsyncMiddleware = async (req, res, next) => {

        // 1) Getting token and check of it's there

        if (req.cookies.jwt) {

            // 1) Verification token


            const decoded = await JWTTokenSenderAndManipulator
                .decodeToken(req.cookies.jwt) as Decoded


            // 2) Check if user still exists
            if (!decoded) {

                return next()
            }

            const currentUser = await User.findById(decoded.id);

            if (!currentUser) {
                return next();
            }

            // 4) Check if user changed password after the token was issued

            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            // GRANT ACCESS TO PROTECTED ROUTE

            res.locals.user = currentUser;
        }

        return next()
    }


    static forgotPassword = catchAsync(async (req, res, next) => {
        // 1) Get user based on POSTed email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(new AppError('There is no user with email address.', 404));
        }

        // 2) Generate the random reset token
        const resetToken = user.createPasswordResetToken();

        await user.save({ validateBeforeSave: false });

        // 3) Send it to user's email
        try {
            const resetURL =
                `${req.protocol}://${req.get('host')}/api/v1/user/reset-password/${resetToken}`;

            await new Email(user, resetURL).sendPasswordReset()


            res.status(200).json({
                status: 'success',
                message: 'Token sent to email!'
            });

        } catch (err: unknown) {
            user.passwordResetToken = null;
            user.passwordResetExpires = null;
            await user.save({ validateBeforeSave: false });



            console.error(err)
            return next(
                new AppError('There was an error sending the email. Try again later!', 500)
            );
        }



    });




    static resetPassword = catchAsync(async (req, res, next) => {
        // 1) Get user based on the token
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        // 2) If token has not expired, and there is user, set the new password
        if (!user) {
            return next(new AppError('Token is invalid or has expired', 400));
        }
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        // 3) Update changedPasswordAt property for the user
        // 4) Log the user in, send JWT
        JWTTokenSenderAndManipulator.createSendToken(user, res,);
    });

    static updatePassword = catchAsync(async (req, res, next) => {
        // 1) Get user from collection

        const userRequest = { ...req } as UserTypes.UserRequest
        const user = await User.findById(userRequest.user.id).select('+password');


        if (user) {

            // 2) Check if POSTed current password is correct
            if (!(await user.correctPassword(req.body.passwordCurrent, user.password as string))) {
                return next(new AppError('Your current password is wrong.', 401));
            }

            // 3) If so, update password
            user.password = req.body.password;
            user.passwordConfirm = req.body.passwordConfirm;
            await user.save();
            // User.findByIdAndUpdate will NOT work as intended!

            // 4) Log user in, send JWT

            JWTTokenSenderAndManipulator.createSendToken(user, res);
        }

    });

}