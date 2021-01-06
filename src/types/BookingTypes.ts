import { Document, Model } from "mongoose";


namespace BookingTypes {


    export interface BookingDocument extends Document {
        tour: string
        user: string
        price: number
        createdAt?: Date
        paid?: boolean
    }

    export type BookingModel = Model<BookingDocument>

}


export default BookingTypes