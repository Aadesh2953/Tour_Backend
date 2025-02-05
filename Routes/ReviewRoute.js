import {Router} from 'express'
import {addReview, getReviews,deleteReview,updatedReview} from "../controllers/ReviewController.js"
const reviewRouter=Router({mergeParams:true});
reviewRouter.route("/").get(getReviews).post(addReview).delete(deleteReview);
reviewRouter.route("/:id").patch(updatedReview)
export {reviewRouter};