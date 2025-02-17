import { Reviews } from "../models/ReviewModel.js";
import { Tour } from "../models/TourModel.js";
import { User } from "../models/UserModel.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { deleteOne } from "../utils/factoryFunctions.js";

export const getReviews = asyncHandler(async (req, res, next) => {
  const reviews = Reviews.find();
  const queryString = { ...req.query };
  // console.log('queryString',queryString)
  if (Object.keys(queryString).length>0) {
    const excludeFeilds = ["page", "limit", "sort", "fields"];
    excludeFeilds.forEach((feilds) => delete queryString[feilds]);
    let stringify = JSON.stringify(...queryString);
    stringify = stringify.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
  }
  
  // console.log('reviews',reviews);
  if (req.query.sort) {
    const sortBy = req.query.split(",").join(" ");
    reviews.sort(sortBy);
  }
  if (req.query.page) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    let skip = page - 1 * limit;
    reviews.skip(skip).limit(req.query.limit);
  }
  if (req.query.feilds) {
    const filteredFeilds = req.query.feilds?.split(",").join(" ");
    reviews.select(filteredFeilds);
  }
  let newReview=await reviews;
  
  return res.status(200).json({
    data: newReview,
    items: reviews.length,
    success: true,
  });
});
export const addReview = asyncHandler(async (req, res, next) => {
  if(!req.body.tour)req.body.tour=req.params.tourId;
  if(!req.body.user)req.body.user=req.user._id;
  if (!req.body.review || !req.body.ratings) {
    next(
      new ApiError(
        401,
        "Invalid Request pls enter review and Ratings Correctly"
      )
    );
  }
  const tour = await Tour.findById(req.body.tour);
  if (!tour) {
    next(new ApiError(401, "Invalid Request Please Enter a Valid Tour Id"));
  }
  const user = await User.findById(req.body.user._id);
  if (!user) {
    next(new ApiError(401, "User Not Found!!!"));
  }
  const review = await Reviews.create({
    ratings: req.body.ratings,
    review: req.body.review,
    tour: req.body.tour,
    user: user._id,
  });
  res.status(200).send({
    success:true,
    status: "Success",
    message: "Review Added Successfully",
    review,
  });
});
export const updatedReview=asyncHandler(async(req,res,next)=>
{
    if(!req.params.id)return next(new ApiError(401,'Please Enter a Valid Tour Id'))
      if(!req.body)return next(new ApiError(401,'Please Enter a Valid Data'))
      const updatedReview=await Reviews.findByIdAndUpdate(req.params.id,{...req.body},{
    runValidations:true,
    new:true
  })
  res.status(200).send({
    status:sucess,
    message:"Tour Review Updated Successfully",
    data:updateReview
  })

})
export const deleteReview=deleteOne(Reviews);