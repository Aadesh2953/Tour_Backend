import { Router } from "express";
import { getTours,addTour,getTourById,updateTourById,deleteTourById,injectQuery,getTourStats,mostSellingTourData, getToursWithIn, getNearestTours} from "../controllers/TourController.js";
import {restrictTo, verifyToken} from "../middlewares/AuthMiddleWare.js"
import { reviewRouter } from "./ReviewRoute.js";
const tourRouter = Router();
// tourRouter.param('id',checkId)QUERY MIDDLEWARE THIS IS QUERY MIDDLEWARE
tourRouter.use('/:tourId/reviews',verifyToken,restrictTo('admin'),reviewRouter);
tourRouter.route('/top-5-tour').get(restrictTo('user'),injectQuery,getTours)
tourRouter.route("/getTourStats").get(verifyToken,restrictTo('admin'),getTourStats)
tourRouter.route("/topSellers").get(mostSellingTourData)
tourRouter.route("/tours-within/distance/:distance/latlng/:latlng/unit/:unit").get(getToursWithIn);
tourRouter
.route("/")
.get(getTours)
.post(verifyToken,addTour);
tourRouter.use(verifyToken);
tourRouter
  .route("/:id")
  .post(getTourById)
  .patch(restrictTo('admin,lead-guide'),updateTourById)
  .delete(restrictTo('admin,lead-guide'),deleteTourById);
tourRouter.route("/nearest-tours/:latlng/unit/:unit").get(getNearestTours);
export {tourRouter}
