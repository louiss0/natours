import { Router } from "express"
import AuthController from "../controllers/AuthController"
import ReviewController from "../controllers/reviewController"



const reviewRouter = Router({ mergeParams: true })



reviewRouter
    .route("/")
    .get(AuthController.protect, ReviewController.setTourField, ReviewController.allReviews)
    .post(AuthController.protect, ReviewController.setUserAndTourFields,
        ReviewController.createReview)

reviewRouter
    .route("/:id")
    .get(ReviewController.review)
    .patch(ReviewController.updateReview)
    .delete(ReviewController.deleteReview)


export default reviewRouter