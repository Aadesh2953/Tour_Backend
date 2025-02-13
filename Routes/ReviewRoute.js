import {Router} from 'express'
import { verifyToken } from '../middlewares/AuthMiddleWare.js';
import {addReview, getReviews,deleteReview,updatedReview} from "../controllers/ReviewController.js"
const reviewRouter=Router({mergeParams:true});
reviewRouter.use(verifyToken)
reviewRouter.route("/").get(getReviews).post(addReview).delete(deleteReview);
reviewRouter.route("/:id").patch(updatedReview)
export {reviewRouter};