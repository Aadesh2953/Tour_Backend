import { Router } from "express";
import { getTours,addTour,getTourById,updateTourById,deleteTourById} from "../controllers/TourController.js";
const tourRouter = Router();
// tourRouter.param('id',checkId)

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
