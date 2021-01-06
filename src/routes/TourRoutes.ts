import { Router } from "express";
import AuthController from "../controllers/AuthController";
import TourController from "../controllers/TourController";
import ImageUploader from "../utils/ImageUploader";
import resizeImages from "../middlewares/resizeImages";
import UserTypes from "../types/UserTypes";
import reviewRouter from "./reviewRoutes";




const tourRouter = Router()


tourRouter.use("/:tourId/reviews", reviewRouter)


tourRouter.route("/top-5-cheap")
    .get(TourController.aliasTopTours)

tourRouter.route("/monthly-plan/:year")
    .get(TourController.monthlyPlan)

tourRouter.route("/tour-stats")
    .get(TourController.tourStats)

tourRouter.route("/tours-within/:distance/center/:latlng/unit/:unit")
    .get(AuthController.protect, TourController.toursWithin)

tourRouter.route("/distances/:latlng/unit/:unit")
    .get(AuthController.protect, TourController.distances)

tourRouter.use(AuthController.protect, AuthController.restrictTo(UserTypes.UserRoles.Admin))

tourRouter.route("/")
    .get(TourController.getAllTours)
    .post(TourController.createTour)


tourRouter.route("/:id")
    .get(TourController.getTour)
    .patch(
        AuthController.protect,
        ImageUploader.uploadTourImages,
        resizeImages("tour", "public/img/tours"),
        AuthController.restrictTo(UserTypes.UserRoles.Admin, UserTypes.UserRoles.LeadGuide),
        TourController.updateTour
    )
    .delete(TourController.deleteTour)


export default tourRouter