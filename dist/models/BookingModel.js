"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var bookingSchema = new mongoose_1.Schema({
    tour: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "A Booking must have a tour"]
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
});
var Booking = mongoose_1.model("Booking", bookingSchema);
bookingSchema.pre(/^find/, function (next) {
    this.populate("user")
        .populate({ path: "tour", select: "name" });
    next(null);
});
exports.default = Booking;
