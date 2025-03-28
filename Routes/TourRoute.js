import { Router } from "express";
import { getTours,addTour,getTourById,updateTourById,deleteTourById,injectQuery,getTourStats,mostSellingTourData, getToursWithIn, getNearestTours} from "../controllers/TourController.js";
import {restrictTo, verifyToken} from "../middlewares/AuthMiddleWare.js"
import { reviewRouter } from "./ReviewRoute.js";
import { upload } from "../middlewares/multerMiddleWare.js";
const tourRouter = Router();
// tourRouter.param('id',checkId)QUERY MIDDLEWARE THIS IS QUERY MIDDLEWARE
tourRouter.use('/:tourId/reviews',verifyToken,restrictTo('user','admin'),reviewRouter);
tourRouter.route('/top-5-tour').get(restrictTo('user'),injectQuery,getTours)
tourRouter.route("/getTourStats").get(verifyToken,restrictTo('admin'),getTourStats)
tourRouter.route("/topSellers").get(mostSellingTourData)
tourRouter.route("/tours-within/distance/:distance/latlng/:latlng/unit/:unit").get(getToursWithIn);
tourRouter
.route("/")
.get(getTours)
.post(upload.fields([{name:"imageCover",maxCount:1},{name:"images",maxCount:3}]),addTour);
tourRouter.use(verifyToken);
tourRouter
  .route("/:id")
  .post(getTourById)
  .patch(upload.fields([{name:'imageCover',maxCount:1},{name:'tourImages',maxCount:3}]),updateTourById)
  .delete(deleteTourById);
tourRouter.route("/nearest-tours/:latlng/unit/:unit").get(getNearestTours);
export {tourRouter}
