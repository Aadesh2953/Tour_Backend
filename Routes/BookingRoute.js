import { verifyToken } from "../middlewares/AuthMiddleWare.js"
import { Router } from "express";
import { getBooking,createBooking, getAllBookings, getBookingDetails, cancelBooking, getAnalytics } from "../controllers/BookingController.js";
let bookingRouter = Router();
// console.log('here')
bookingRouter.use(verifyToken)
bookingRouter.route("/checkout/:id").post(getBooking);
bookingRouter.route("/book").get(createBooking);
bookingRouter.route('/booking').get(getAllBookings);
bookingRouter.route('/booking/:id').get(getBookingDetails);
bookingRouter.route('/booking/:id').patch(cancelBooking);
bookingRouter.route('/analytics').get(getAnalytics);
export { bookingRouter };