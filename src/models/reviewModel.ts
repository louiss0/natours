import { model, Query, Schema } from "mongoose";
import ReviewTypes from "../types/reviewTypes";
import TourTypes from "../types/TourTypes";
import returnToObjectAndToJsonOptions from "../utils/returnToObjectAndToJsonOptions";
import Tour from "./TourModel";


const reviewSchemaOptions = returnToObjectAndToJsonOptions()

const reviewSchema = new Schema({
    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    tour: {
        type: Schema.Types.ObjectId,
        ref: "Tour",
        required: [true,
            "A review must have a tour"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true,
            "A review must have a user"]

    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, reviewSchemaOptions)


reviewSchema.pre<TourTypes.TourDocument>(/^find/, function (next) {

    this.populate({ path: "user", select: 'name photo' })

    next(null)
})

reviewSchema.statics.calcAverageRating = async function (this: ReviewTypes.ReviewModel, tourId: string) {




    const stats = await this.aggregate<ReviewTypes.ReviewStats>([
        {
            $match: {
                tour: tourId
            }
        },
        {
            $group: {
                _id: "$tour",
                numRating: { $sum: 1 },
                avgRating: { $avg: "$rating" }
            }
        }
    ]
    )


    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].numRating,
        ratingsAverage: stats[0].avgRating
    })
}

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

reviewSchema.post<ReviewTypes.ReviewDocument>(/save|^findOneAnd/, async (doc, next) => {

    await doc.constructor?.calcAverageRating?.(doc.tour);
    next(null);
});


const Review = model<ReviewTypes.ReviewDocument, ReviewTypes.ReviewModel>("Review", reviewSchema)

export default Review 