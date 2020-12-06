import { Response } from "express";

interface JSendObject {
    status: "success"
    data: object | null
    message: string
}


export default function sendJson<T extends JSendObject>
    (res: Response, object: T, statusCode = 200) {

    res.status(statusCode).json({ ...object })

}