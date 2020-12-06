import multer from "multer"
import HTTPStatusCodes from "../types/HTTPStatusCodes"
import UserTypes from "../types/UserTypes"
import AppError from "../utils/AppError"





export default function imageUploader() {


    return multer({

        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {

            if (file.mimetype.startsWith("image")) {

                cb(null, true)

            } else {

                cb(new AppError(

                    "Not an image please upload an image",

                    HTTPStatusCodes.BadRequest
                ),
                )

            }

        }

    })
}