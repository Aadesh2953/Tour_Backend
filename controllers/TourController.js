import { Tour } from "../models/TourModel.js";
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
export const getTours = async (req, res) => {
  try {
    const features = new ApiFeature(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFeilds().paginate();
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
  } catch (err) {
    console.log("err", err);
    res.status(401).json({
      status: "Error",
      message: err,
    });
  }
};
export const addTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "Success",
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(401).json({ status: "Fail", message: error });
  }
};
export const getTourById = async (req, res) => {
  try {
    const id = req.params?.id;
    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({
        status: "Error",
        message: "Tour not found",
      });
    }

    res.status(200).json({
      status: "Success",
      data: tour,
    });
  } catch (err) {
    console.error("Error fetching tour:", err); // Useful for debugging
    res.status(500).json({
      status: "Fail",
      message: err.message || "An unexpected error occurred",
    });
  }
};
export const updateTourById = async (req, res) => {
  try {
    const id = req.params?.id;
    const data = req?.body;
    const updatedTour = await Tour.findByIdAndUpdate(id, data, {
      runValidations: true,
      new: true,
    });
    res.status(201).json({
      message: "Success",
      data: {
        updatedTour,
      },
    });
  } catch (error) {
    res.status(401).json({
      message: "Fail",
      error,
    });
  }
};
export const deleteTourById = async (req, res) => {
  try {
    const id = req.params?.id;
    const deletedTour = await Tour.findByIdAndDelete(id);
    res.status(201).json({
      status: "Success",
      message: {
        deletedTour,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: "Fail",
      message: {
        err,
      },
    });
  }
};
export const getTourStats=async(req,res)=>
{
  try {
    const stats=await Tour.aggregate([
    {
      $match:{
        ratingsAverage:{$gte:4,$lte:5}
    },
    $group:{
      _id:null,
      avgRating:{$avg:'$ratingsAverage'},
      total:{$sum:1},
      avgPrice:{$avg:'$price'},
      minPrice:{$min:'$price'},
      macPrice:{$max:'$price'},
    }
  }
    ])
  } catch (error) {
    
  }
}