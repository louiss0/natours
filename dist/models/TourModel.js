"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var TourTypes_1 = __importDefault(require("../types/TourTypes"));
var returnToObjectAndToJsonOptions_1 = __importDefault(require("../utils/returnToObjectAndToJsonOptions"));
var slugify_1 = __importDefault(require("slugify"));
var validator_1 = __importDefault(require("validator"));
var tourSchemaOptions = returnToObjectAndToJsonOptions_1.default();
var tourSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        maxlength: [40, "A tour must have less than or equal to 40 characters"],
        minlength: [10, "A tour must have more than or equal to 10 characters"],
        validate: function (val) {
            var value = val.split(" ").join("");
            return validator_1.default.isAlpha(value);
        },
    },
    slug: String,
    duration: {
        type: String,
        required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a max group size"],
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have a difficulty"],
        enum: [
            TourTypes_1.default.TourDifficulties.Difficult,
            TourTypes_1.default.TourDifficulties.Medium,
            TourTypes_1.default.TourDifficulties.Easy
        ],
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        max: 5,
        min: 1,
        set: function (val) { return Math.floor(Math.round(val)); }
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"],
    },
    imageCover: {
        type: String,
        required: [true, "A tour must have a cover image"],
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price;
            },
            message: "Discount price should be below regular price"
        }
    },
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: [true, "A tour must have a description"],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    images: [String],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: mongoose_1.SchemaTypes.Mixed,
    locations: [
        mongoose_1.SchemaTypes.Mixed,
    ],
    guides: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    startDates: [Date],
}, tourSchemaOptions);
tourSchema.virtual("durationWeeks")
    .get(function () {
    return this.duration / 7;
});
tourSchema.virtual("reviews", {
    ref: "Review",
    foreignField: "tour",
    localField: "_id"
});
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });
//  * Document Middleware
tourSchema.pre("save", function (next) {
    this.slug = slugify_1.default(this.name, { lower: true });
    next(null);
});
//  * Query Middleware
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    next(null);
});
tourSchema.pre(/^find/, function (next) {
    this.populate({ path: "guides", select: "-__v" });
    next(null);
});
tourSchema.pre("aggregate", function (next) {
    var things = this.pipeline()[0];
    if (Object.keys(things)[0] !== '$geoNear') {
        this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    }
    next(null);
});
var Tour = mongoose_1.model("Tour", tourSchema);
exports.default = Tour;
