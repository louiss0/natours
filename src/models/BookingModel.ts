import { model, Schema } from "mongoose";
import BookingTypes from "../types/BookingTypes";


const bookingSchema = new Schema({
    tour: {
        type: Schema.Types.ObjectId,
        required: [true, "A Booking must have a tour"]
    },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, "A Booking must have a user"],
    },
    paid: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    price: {
        type: Number,
        required: [true, "A Booking must have a price"]
    }

})



const Booking = model<BookingTypes.BookingDocument, BookingTypes.BookingModel>("Booking", bookingSchema)

bookingSchema.pre<BookingTypes.BookingDocument>(/^find/, function (next) {


    this.populate("user")
        .populate({ path: "tour", select: "name" })

    next(null)

})

export default Booking