import { asyncHandler } from "../utils/AsyncHandler.js";
import { Tour } from "../models/TourModel.js";
import ApiError from "../utils/ApiError.js";
class ApiFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    let query = { ...this.queryString };
    const excludeFeilds = ["page", "limit", "sort", "fields"];
    excludeFeilds.forEach((field) => delete query[field]);
    let queryStr = JSON.stringify(query);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    }
    else{
      this.query = this.query.sort("-ratingAverage");
    }
    return this;
  }
  limitFeilds() {
    if (this.queryString.fields) {
      const selectedFeilds = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(selectedFeilds);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
export const injectQuery = async (req, res, next) => {
  req.query.sort = "ratingAverage";
  req.query.limit = "5";
  req.query.fields = "name,price,ratingAverage,summary,difficulty";
  next();
};
export const getTours = asyncHandler(async (req, res,next) => {
  
    const features = new ApiFeature(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFeilds()
      .paginate();
    const Tours = await features.query;
    if (Tours.length > 0) {
      res.status(201).json({
        status: "Success",
        items: Tours.length,
        data: {
          Tours,
        },
      });
    } else {
      res.status(201).json({
        status: "Success",
        message: "No Tour To Display!!",
      });
    }
  }
   )
export const addTour =asyncHandler( async (req, res,next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "Success",
      data: {
        tour: newTour,
      },
    });
})
export const getTourById = asyncHandler(async (req, res,next) => {
    const id = req.params?.id;
    const tour = await Tour.findById(id);
    if(!tour){
      next(new ApiError(404,'No Tour Found With that id!'))
    }
    res.status(200).json({
      status: "Success",
      data: tour,
    });
  
})
export const updateTourById = asyncHandler(async (req, res,next) => {
    const id = req.params?.id;
    const data = req?.body;
    const updatedTour = await Tour.findByIdAndUpdate(id, data, {
      runValidations: true,
      new: true,
    });
    if(!updatedTour){
      next(new ApiError(404,'No Tour Found With that id!'))
    }
    res.status(201).json({
      message: "Success",
      data: {
        updatedTour,
      },
    });
})
export const deleteTourById = asyncHandler(async (req, res,next) => {
    const id = req.params?.id;
    const deletedTour = await Tour.findByIdAndDelete(id);
    if(!deletedTour){
      next(new ApiError(404,'No Tour Found With that id!'))
    }
    res.status(201).json({
      status: "Success",
      message: {
        deletedTour,
      },
})
})
export const getTourStats = (async(req, res,next) => {
    let stats = await Tour.aggregate([
       { $match: {
          ratingsAverage: { $gte: 4, $lte: 5 },
        }},
        {$group: {
          _id: "$difficulty",
          avgRating: { $avg: "$ratingsAverage" },
          total: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },},
        {
          $sort:{ratingsAverage:1}
        }
      
    ]);
    res.status(200).send({
      status:"Success",
      data:stats
    })
  
})
export const mostSellingTourData=asyncHandler(async(req,res)=>
{
  let year=req.query?.year
  const topSellingTour=await Tour.aggregate([
  {
     $unwind:"$startDates"
  },
  {
       $match:{
        startDates:{
         $gte:new Date(`${year}-01-01`),
         $lte:new Date(`${year}-12-31`)
        }
       }
  },
  {
    $group:{
      _id:{$month:"$startDates"},
      totalTours:{$sum:1},
      name:{$push:'$name'}
    }
  },
  {
    $addFields:{month:'$_id'}
  },
  {  $sort:{
    totalTours:-1
  }
  },
  {
    $limit:1
  }
  ])
  res.status(200).send({
    status:"Success",
    total:topSellingTour.length,
    data:{topSellingTour},
   
  })
})