import { Router } from "express";
import { getTours,addTour,getTourById,updateTourById,deleteTourById,injectQuery} from "../controllers/TourController.js";
const tourRouter = Router();
// tourRouter.param('id',checkId)
tourRouter.route('/top-5-tour').get(injectQuery,getTours)
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
