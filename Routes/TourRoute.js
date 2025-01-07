import { Router } from "express";
import { getTours,addTour,getTourById,updateTourById,deleteTourById,injectQuery,getTourStats,mostSellingTourData} from "../controllers/TourController.js";
import {getReviews,addReview} from '../controllers/ReviewController.js'
import {restrictTo, verifyToken} from "../middlewares/AuthMiddleWare.js"
import { reviewRouter } from "./ReviewRoute.js";
const tourRouter = Router();
// tourRouter.param('id',checkId)QUERY MIDDLEWARE THIS IS QUERY MIDDLEWARE
tourRouter.use('/:tourId/reviews',reviewRouter);
tourRouter.route('/top-5-tour').get(injectQuery,getTours)
tourRouter.route("/getTourStats").get(getTourStats)
tourRouter.route("/topSellers").get(mostSellingTourData)
tourRouter
.route("/")
.get(verifyToken,getTours)
.post(addTour);
tourRouter
  .route("/:id")
  .post(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);
export {tourRouter}
