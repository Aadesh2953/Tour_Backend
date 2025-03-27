import { asyncHandler } from "../utils/AsyncHandler.js";
import { Tour } from "../models/TourModel.js";
import {deleteOne,createOne,updateOne,getOne, readAll} from '../utils/factoryFunctions.js'
import ApiError from "../utils/ApiError.js";

export const injectQuery = async (req, res, next) => {
  req.query.sort = "ratingAverage";
  req.query.limit = "5";
  req.query.fields = "name,price,ratingAverage,summary,difficulty";
  next();
};
export const getTours = readAll(Tour);
export const addTour = createOne(Tour);
export const getTourById = getOne(Tour,'tourReviews');
export const updateTourById = updateOne(Tour);
export const deleteTourById= deleteOne(Tour);
export const getTourStats =asyncHandler(async(req, res,next) => {
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
  if(!year)
  {
    year=2022;
    // console.log('year',year);
  }
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
      tours: { $push: "$$ROOT" },
      // startDates:{$push:'$startDates'}
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
    data:topSellingTour[0],
   
  })
})
export const getToursWithIn=asyncHandler(async(req,res,next)=>{
  let {distance,latlng,unit}=req.params;
  const [lat,lng]=latlng.split(',');
  if(!lat||!lng)
  {
    return next(new ApiError(400,'Please Provide Latitude and Longitude'));
  }
  const radius=unit==='mi'?distance/3963.2:distance/6378.1;
  const Tours=await Tour.find({startLocation:{$geoWithin:{$centerSphere:[[lat,lng],radius]}}});
  res.status(200).send({
    status:"Success",
    results:Tours.length,
    data:{Tours}
  })
  
})
export const getNearestTours=asyncHandler(async(req,res,next)=>
{
   let {latlng,unit}=req.params;
   let [lat,lng]=latlng.split(',');
   if(!lat||!lng)
   {
    next( new ApiError(400,'Please Provide Latitude and Longitude'));
   }
   const multiplier=unit==='mi'?0.000621371:0.001;
  const nearestTours=await Tour.aggregate([
    {
      $geoNear:{
        near:{
          type:'Point',
          coordinates:[lng*1,lat*1],
          distanceField:"distance",
          distanceMultiplier:multiplier
        },
        $project:{
          distance:1,
          name:1
        }
      }
    }
  ])
  res.status(200).send({
    message:"Success",
    items:nearestTours.length,
    data:nearestTours
  })
})
// export const getMostBookedTours=asyncHandler(async(req,res,next)=>{
  
// })