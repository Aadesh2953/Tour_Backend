import {Router} from 'express'
import {addReview, getReviews,deleteReview} from "../controllers/ReviewController.js"
const reviewRouter=Router({mergeParams:true});
reviewRouter.route("/").get(getReviews).post(addReview).delete(deleteReview);
export {reviewRouter};