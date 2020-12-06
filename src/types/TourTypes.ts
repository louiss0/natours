import { Document, Model, Schema, } from "mongoose";


namespace TourTypes {



    interface StartLocation {
        address: string
        description: string
        type: "Point"
        coordinates: Array<number>
    }

    interface Guide {
        type: Schema.Types.ObjectId
        ref: string
    }

    type Locations = StartLocation & Record<"day", number>

    export interface TourDocument extends Document {
        id: string
        name: string
        slug?: string
        duration: number
        maxGroupSize: number
        difficulty: string
        ratingsQuantity?: number
        ratingsAverage?: number
        price: number
        priceDiscount?: number
        summary?: string
        description: string
        imageCover?: string
        images?: Array<string>
        startDates?: Array<Date>
        createdAt?: Date
        secretTour?: Boolean
        startLocation?: StartLocation
        locations?: Locations
        guides: Array<Guide>
    }

    export enum TourDifficulties {
        Difficult = "difficult",
        Medium = "medium",
        Easy = "easy",
    }

    export type TourModel = Model<TourDocument>
}


export default TourTypes