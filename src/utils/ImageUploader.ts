import multer from "multer"
import HTTPStatusCodes from "../types/HTTPStatusCodes"
import AppError from "../utils/AppError"

const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback) => {

    if (file.mimetype.startsWith("image")) {

        callback(null, true)

    } else {

        callback(new AppError(

            "Not an image please upload an image",

            HTTPStatusCodes.BadRequest
        ),
        )

    }

}
export default class ImageUploader {

    protected static uploader = multer({
        storage: multer.memoryStorage(),
        fileFilter

    })

    static get uploadUserPhoto() {

        return this.uploader.single("photo")
    }

    static get uploadTourImages() {

        return this.uploader.fields(
            [
                { name: "imageCover", maxCount: 1 },
                { name: "images", maxCount: 3 }
            ]
        )
    }


}