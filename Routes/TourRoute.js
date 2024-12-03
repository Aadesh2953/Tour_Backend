import { Router } from "express";
import { getTours,addTour,getTourById,updateTourById,deleteTourById,injectQuery,getTourStats,mostSellingTourData} from "../controllers/TourController.js";
const tourRouter = Router();
// tourRouter.param('id',checkId)
tourRouter.route('/top-5-tour').get(injectQuery,getTours)
tourRouter.route("/getTourStats").get(getTourStats)
tourRouter.route("/topSellers").get(mostSellingTourData)
tourRouter
.route("/")
.get(getTours)
.post(addTour);
tourRouter
  .route("/:id")
  .post(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);
export {tourRouter}
