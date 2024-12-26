import { Router } from "express";
import { getTours,addTour,getTourById,updateTourById,deleteTourById,injectQuery,getTourStats,mostSellingTourData} from "../controllers/TourController.js";
import {restrictTo, verifyToken} from "../middlewares/AuthMiddleWare.js"
const tourRouter = Router();
// tourRouter.param('id',checkId)
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
  .delete(verifyToken,restrictTo('admin','lead-guide'),deleteTourById);
export {tourRouter}
