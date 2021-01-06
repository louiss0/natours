import { RequestHandler } from "express";
import stripe from "stripe"
import Booking from "../models/BookingModel";
import Tour from "../models/TourModel";
import HTTPStatusCodes from "../types/HTTPStatusCodes";
import UserTypes from "../types/UserTypes";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import sendJson from "../utils/sendJson";
import CrudFactory from "./CrudFactory";



export default class BookingController extends CrudFactory {


    static get checkoutSession(): RequestHandler {



        return catchAsync(async (req, res, next) => {


            // 1) Get the currently booked tour

            const userRequest = req as UserTypes.UserRequest
            const tour = await Tour.findById(userRequest.params.tourId)


            if (!tour) {

                return next(new AppError(
                    "Could not find the tour or one",
                    HTTPStatusCodes.NotFound
                ))
            }

            if (BookingController.stripe instanceof stripe) {


                // 2) Create checkout session
                const [quantity, amountMultiplier] = [1, 100]

                const session = await BookingController
                    .stripe
                    .checkout
                    .sessions
                    .create({
                        payment_method_types: ["card"],
                        success_url: `${req.protocol}://${req.get("host")}/`,
                        cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
                        customer_email: userRequest.user.email,
                        line_items: [
                            {
                                name: `${tour.name} Name`,
                                description: tour.summary,
                                quantity,
                                images: [
                                    ` /${tour.imageCover}`
                                ],
                                amount: tour.price * amountMultiplier,
                                currency: "usd",
                            }
                        ]
                    })

                sendJson(res, {
                    status: "success",
                    message: "Here is the session",
                    data: {
                        session,
                        sessionRequestTime: userRequest.requestTime
                    }
                })


            } else {

                return next(new AppError("Cannot access stripe ", HTTPStatusCodes.ServerError))

            }

            // 3) Create session as response

        })
    }

    private static get stripe() {

        const { STRIPE_TEST_KEY } = process.env

        return STRIPE_TEST_KEY

            ? new stripe(STRIPE_TEST_KEY, { apiVersion: "2020-08-27" })

            : console.table({ STRIPE_TEST_KEY })


    }

    static get createBookingCheckout(): RequestHandler {

        return catchAsync(async (req, res, next) => {

            const { tour, user, price } = req.query as Record<string, string>


            if ([tour, user, price].every((value) => {

                return !Array.isArray(value) && typeof value !== "string"
            })) {

                return next()
            }
            else {
                await Booking.create({ tour, user, price })
            }

        })
    }

    static get allBookings() { return BookingController.getAll(Booking) }
    static get singleBooking() { return BookingController.getOne(Booking) }
    static get updateBooking() { return BookingController.updateOne(Booking) }
    static get createBooking() { return BookingController.createOne(Booking) }
    static get deleteBooking() { return BookingController.deleteOne(Booking) }

}