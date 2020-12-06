import { ErrorRequestHandler, Request, Response } from "express";
import { Error } from "mongoose"
import HTTPStatusCodes from "../types/HTTPStatusCodes";
import AppError from "../utils/AppError";

interface DuplicateFieldsError {
    driver: boolean
    name: string
    index: number
    errmsg: string
    code: number
    status: string
    statusCode: number
}

const handleCastErrorDB = (err: Error.CastError) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: DuplicateFieldsError) => {

    let value: string

    const regExpressionResult = err.errmsg.match(/(["'])(\\?.)*?\1/);

    if (!regExpressionResult) {
        return;
    }

    value = regExpressionResult[0]

    const message = `Duplicate field value: ${value}. Please use another value!`;

    return new AppError(message, 400);
};

const handleValidationErrorDB = (err: Error.ValidationError) => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('.')}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err: AppError, req: Request, res: Response) => {

    // A) API

    if (req.originalUrl.startsWith('/api')) {

        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });

    }

    console.error('ERROR 💥', err);

    return res.status(err.statusCode).render("errorTemplate", {
        title: "Something went wrong",
        msg: err.message
    })




};

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
    // A) API

    if (req.originalUrl.startsWith('/api')) {
        // A) Operational, trusted error: send message to client

        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });

            // B) Programming or other unknown error: don't leak error details

        }
        // 1) Log error
        console.error('ERROR 💥', err);

        return res.status(HTTPStatusCodes.ServerError).json({
            status: "error",
            message: "Something went very wrong"
        })



    }

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });

        // B) Programming or other unknown error: don't leak error details

    }
    // 1) Log error
    console.error('ERROR 💥', err);

    return res.status(err.statusCode).render("errorTemplate", {
        title: "Something went wrong",
        msg: err.message
    })

};

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {

    err.statusCode ||= 500;
    err.status ||= 'error';




    if (process.env.NODE_ENV === 'development') {

        sendErrorDev(err, req, res);

    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, req, res);
    }
};

export default globalErrorHandler
