import { RequestHandler } from "express";

import sharp from 'sharp'
import UserTypes from "../types/UserTypes";

const resizeImage: RequestHandler = (req, res, next) => {

    const width = 500, height = 500, quality = 90

    const userRequest = req as UserTypes.UserRequest



    req.file.filename = `user-${userRequest.user.id}-${Date.now()}.jpeg`

    if (!req.file) return next()

    sharp(req.file.buffer)
        .resize(width, height)
        .toFormat("jpeg")
        .jpeg({
            quality
        }).toFile(`public/img/users/${req.file.filename}`)

    next()
}


export default resizeImage