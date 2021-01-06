import { Router } from "express";
import AuthController from "../controllers/AuthController";
import BookingController from "../controllers/BookingController";



const bookingRouter = Router()

bookingRouter.get("/checkout-session/:tourId",
    AuthController.protect,
    BookingController.checkoutSession
)


export default bookingRouter