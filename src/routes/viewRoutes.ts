import { Router } from "express";
import AuthController from "../controllers/AuthController";
import BookingController from "../controllers/BookingController";
import ViewController from "../controllers/viewController";



const viewRouter = Router()


viewRouter.get('/',
    BookingController.createBookingCheckout,
    AuthController.isLoggedIn,
    ViewController.overview) 

viewRouter.get('/tour/:slug',
    AuthController.isLoggedIn,
    ViewController.renderTourPage)

viewRouter.get('/login',
    AuthController.isLoggedIn,
    ViewController.renderLoginPage)


viewRouter.get('/me',
    AuthController.protect,
    ViewController.renderAccountPage)


export default viewRouter