import { RequestHandler } from "express";
import sharp from 'sharp'
import crypto from "crypto"
import catchAsync from "../utils/catchAsync";




interface ResizeImage {
    (startName: string, folderPath: string): RequestHandler;
}

/**

    *  @param startName  :string the word used to name the image its, placed at the start

    *  @param folderPath :string  this is the path to the folder you want to use

    *  ! Don't  start with / with folder path

*/

const resizeImage: ResizeImage = (startName, folderPath) =>

    catchAsync(async (req, res, next) => {

        const width = 500, height = 500, quality = 90



        const id = crypto.randomBytes(16).toString()


        req.file.filename = `${startName}-${id}-${Date.now()}.jpeg`

        if (!req.file) return next()

        await sharp(req.file.buffer)
            .resize(width, height)
            .toFormat("jpeg")
            .jpeg({ quality, })
            .toFile(`${folderPath}/${req.file.filename}`)

        next()
    })


export default resizeImage




