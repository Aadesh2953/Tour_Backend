import { Router } from "express";
import { getTours,addTour,getTourById,updateTourById,deleteTourById,checkId,checkTourBody} from "../controllers/TourController.js";
const tourRouter = Router();
tourRouter.param('id',checkId)

tourRouter
.route("/")
.get(getTours)
.post(checkTourBody,addTour);
tourRouter
  .route("/:id")
  .post(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);
export {tourRouter}
