import { Document, Model, Schema } from "mongoose";



namespace ReviewTypes {


    interface Tour {
        type: Schema.Types.ObjectId
        ref: string
    }
    interface User {
        type: Schema.Types.ObjectId
        ref: string
    }


    export interface ReviewDocument
        extends Document {
        review: string
        rating: number
        tour: Tour
        user: User
        createdAt?: Date
    }

    export interface ReviewStats {
        numRating: number
        avgRating: number
    }

    export type ReviewModel = Model<ReviewDocument>



}

export default ReviewTypes