import { RequestHandler, Response } from "express";
import Tour from "../models/TourModel";
import User from "../models/UserModel";
import HTTPStatusCodes from "../types/HTTPStatusCodes";
import UserTypes from "../types/UserTypes";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";




export default class ViewController {


    private static viewRenderer<T extends { title: string }>(res: Response, template: string, data: T, statusCode = 200) {


        res
            .status(statusCode)
            .render(template, {
                ...data
            })

    }

    static overview: RequestHandler = catchAsync(

        async (req, res, next) => {


            const tours = await Tour.find()



            ViewController.viewRenderer(res, "overview",
                {
                    title: "All Tours",
                    tours
                })

        })



    static renderTourPage: RequestHandler =

        async (req, res, next) => {


            const tour = await Tour
                .findOne({ slug: req.params.slug })
                .populate({
                    path: "reviews",
                    select: "review rating user"
                })



            if (!tour) {

                return next(new AppError("There is no tour with that name",
                    HTTPStatusCodes.BadRequest))

            }


            res
                .status(200)
                .set(
                    'Content-Security-Policy',
                    "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
                )
                .render('tour', {
                    title: `${tour.name} Tour`,
                    tour,
                });


        }





    static renderLoginPage: RequestHandler = (req, res, next) => {



        ViewController.viewRenderer(res, "login", {
            title: "Log into your account"
        })


    }

    static renderAccountPage: RequestHandler = (req, res, next) => {



        ViewController.viewRenderer(res, "account", {
            title: "Account Page",
        })

    }



}
