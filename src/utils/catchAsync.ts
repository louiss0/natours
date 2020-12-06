import { NextFunction, Request, RequestHandler, Response } from "express";

export type AsyncMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void>

export default function catchAsync(fn: AsyncMiddleware): RequestHandler {

    return (req, res, next) => {

        fn(req, res, next).catch(next)

    }

}