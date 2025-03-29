import { verifyToken } from "../middlewares/AuthMiddleWare.js"
import { Router } from "express";
import { getBooking,createBooking, getAllBookings, getBookingDetails } from "../controllers/BookingController.js";
let bookingRouter = Router();
// console.log('here')
bookingRouter.route("/checkout/:id").post(verifyToken,getBooking);
bookingRouter.route("/book").get(verifyToken,createBooking);
bookingRouter.route('/booking').get(verifyToken,getAllBookings);
bookingRouter.route('/booking/:id').get(verifyToken,getBookingDetails);
export { bookingRouter };