import { verifyToken } from "../middlewares/AuthMiddleWare.js"
import { Router } from "express";
import { getBooking,createBooking } from "../controllers/BookingController.js";
let bookingRouter = Router();
// console.log('here')
bookingRouter.route("/checkout/:id").get(verifyToken,getBooking);
bookingRouter.route("/book").get(verifyToken,createBooking);
export { bookingRouter };