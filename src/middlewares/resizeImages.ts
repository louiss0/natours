import { RequestHandler } from "express";
import sharp from "sharp";
import catchAsync from "../utils/catchAsync";



interface ResizeImages {
    (startName: string, folderPath: string): RequestHandler
}

/**  

    *  @param startName  :string the word used to name the image its, placed at the start

    *  @param folderPath :string  this is the path to the folder you want to use 

    *  ! Don't  start with / with folder path or end with /

*/

const resizeImages: ResizeImages = (startName, folderPath = "public/img") =>

    catchAsync(async (req, res, next) => {


        const [width, height, quality] = [2000, 1333, 90]

        if (Array.isArray(req.files)) {

            return next()
        }

        req.body.imageCover = `${startName}-${req.params.id}-${Date.now()}.jpeg`


        const fileName = `${folderPath}/${req.body.imageCover}`

        await returnSharp(req.files.imageCover[0].buffer, fileName)

        req.body.images = await Promise.all(
            req.files.images.map(async (file, i) => {

                const fileFormat = `${startName}-${req.params.id}-${Date.now()}-${i + 1}.jpeg`

                const fileName = `${folderPath}/${fileFormat}`

                await returnSharp(file.buffer, fileName)

                return fileFormat

            }))


        function returnSharp(buffer: Buffer, fileName: string) {


            return sharp(buffer)
                .resize(width, height)
                .toFormat("jpeg")
                .jpeg({ quality })
                .toFile(fileName)


        }

        next()
    })

export default resizeImages