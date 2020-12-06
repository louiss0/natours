import { NextFunction, Request, RequestHandler, Response } from "express";
import Tour from "../models/TourModel";
import HTTPStatusCodes from "../types/HTTPStatusCodes";
import TourTypes from "../types/TourTypes";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import sendJson from "../utils/sendJson";
import CrudFactory from "./CrudFactory";


export default class TourController extends CrudFactory {

    static get getAllTours() {
        return TourController.getAll(Tour)

    }
    static get getTour() {
        return TourController.getOne(Tour, { path: "reviews" })

    }
    static get createTour() {
        return TourController.createOne(Tour)

    }
    static get updateTour() {
        return TourController.updateOne(Tour)

    }
    static get deleteTour() {
        return TourController.deleteOne(Tour)

    }

    static aliasTopTours(req: Request, res: Response, next: NextFunction) {

        req.query.sort = "-ratingsAverage"

        req.query.limit = "5"

        req.query.fields = "name,ratingsAverage,summary,difficulty"


        next()
    }

    static get tourStats(): RequestHandler {
        return catchAsync(async (req, res, next) => {


            const tourStats = await Tour.aggregate
                <TourTypes.TourDocument>([
                    { $match: { ratingsAverage: { $gte: 4.5 } } },
                    {
                        $group: {
                            _id: "difficulty",
                            numOfRatings: { $sum: "$ratingsQuantity" },
                            avgPrice: { $avg: '$price' },
                            avgRatingsAverage: { $avg: '$ratingsAverage' },
                            maxPrice: { $max: "$price" },
                            minPrice: { $min: "$price" },
                            numOfTours: { $sum: 1 }
                        }
                    },
                    { $sort: { avgPrice: 1 } }

                ])

            sendJson(res, {
                status: "success",
                message: "These are the tour stats",
                data: {
                    tourStats
                }
            })


        })
    }

    static get monthlyPlan(): RequestHandler {

        return catchAsync(async (req, res, next) => {


            const year = parseInt(req.params.year)


            const plan = await Tour.aggregate<TourTypes.TourDocument>([
                { $unwind: "$startDates" },
                {
                    $match: {
                        startDates: {
                            $gte: new Date(`${year}-01-01`),
                            $lte: new Date(`${year}-12-31`)
                        },

                    }
                },
                {
                    $group: {
                        _id: { $month: "$startDates" },
                        numOfTourStarts: { $sum: 1 },
                        tours: { $push: "name" }
                    }
                },
                {
                    $addFields: {
                        month: "$_id"
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ])

            sendJson(res, {
                status: "success",
                message: "This is the monthly Plan for each tour",
                data: {
                    plan
                }
            })


        })

    }

    static get toursWithin(): RequestHandler {

        return catchAsync(async (req, res, next) => {


            const { distance, latlng, unit } = req.params

            const [lat, lng] = latlng.split(",").map((value) => parseFloat(value))

            const numericalDistance = parseInt(distance)

            const radius = unit === "mi"

                ? numericalDistance / 3963.2

                : numericalDistance / 6378.1

            if (!lat || !lng) {

                return next(new AppError(
                    "Please provide longitude and latitude in the format lat, lng",
                    HTTPStatusCodes.BadRequest)
                )
            }

            const tours = await Tour.find({
                startLocation: {
                    $geoWithin: {
                        $centerSphere: [[lng, lat], radius]
                    }
                }
            })

            sendJson(res, {
                status: "success",
                message: `Here are all the tours close this distance ${distance}`,
                results: tours.length,
                data: {
                    tours
                }
            })


        })

    }

    static get distances(): RequestHandler {

        return catchAsync(async (req, res, next) => {


            const { latlng, unit } = req.params

            const [lat, lng] = latlng.split(",").map((value) => parseFloat(value))


            if (!lat || !lng) {

                return next(new AppError(
                    "Please provide longitude and latitude in the format lat, lng",
                    HTTPStatusCodes.BadRequest)
                )
            }


            const distanceMultiplier = unit === "mi" ? 0.000621371 : 0.001

            const distances = await Tour.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [lng, lat]

                        },
                        distanceField: "distance",
                        distanceMultiplier
                    }

                },
                {
                    $project: {
                        distance: 1,
                        name: 1
                    }
                }
            ])

            sendJson(res, {
                status: "success",
                message: `Here are the distances for all of the tours `,
                data: {
                    distances
                }
            })


        })


    }

}