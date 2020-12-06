import { RequestHandler } from "express";
import Review from "../models/reviewModel";
import UserTypes from "../types/UserTypes";
import CrudFactory, { FilterRequest } from "./CrudFactory";




export default class ReviewController extends CrudFactory {



    static get setUserAndTourFields(): RequestHandler {

        return (req, res, next) => {

            const userRequest = { ...req } as UserTypes.UserRequest
            req.body.tour ??= req.params.tourId
            req.body.user ??= userRequest.user.id

            next()
        }

    }
    static get setTourField(): RequestHandler {

        return (req, res, next) => {

            const filterRequest = { ...req } as FilterRequest
            filterRequest.filter = {
                tour: req.params.tourId
            }

            next()
        }

    }

    static get allReviews() {
        return ReviewController.getAll(Review)


    }
    static get review() {
        return ReviewController.getOne(Review)

    }
    static get createReview() {
        return ReviewController.createOne(Review)

    }
    static get updateReview() {
        return ReviewController.updateOne(Review)

    }
    static get deleteReview() {
        return ReviewController.deleteOne(Review)

    }


}