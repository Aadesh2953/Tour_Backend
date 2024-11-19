import { Tour } from '../models/TourModel.js';
export const getTours = async(req, res) => {
    try{
      let query={...req.query}
      const excludeFeilds=['page','limit','sort','fields']
      excludeFeilds.forEach((field)=>delete query[field])
      let queryStr=JSON.stringify(query)
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
      let reqQuery=Tour.find(JSON.parse(queryStr));
      if(req.query.sort)
      {
         const sortBy=req.query.sort.split(',').join(" ")
         reqQuery =  reqQuery.sort(sortBy);
      }
       
      if(req.query.fields)
      {
        const selectedFeilds=req.query.fields?.split(',').join(" ")
        reqQuery=reqQuery.select(selectedFeilds);
      }
      else
      {
        reqQuery=reqQuery.select('-__v')
      }
      const Tours=await reqQuery;
      console.log("Tours",Tours)
      if(Tours.length>0)
      {   res.status(201).json({
          status:"Success",
          items:Tours.length,
          data:{
            Tours
          }

         })
      }
      else
      {
        res.status(201).json({
          status:"Success",
          message:"No Tour To Display!!"
         })
      }
    }
    catch(err)
    {
      console.log('err',err)
      res.status(401).json({
        status:"Error",
        message:err
      })
    }
  };
  export const addTour = async(req, res) => {
    try{
      const newTour=await Tour.create(req.body);
      res.status(201).json({
        status:"Success",
        data:{
          tour:newTour
        }
      })
    }
    catch(error){
      res.status(401).json({status:"Fail",message:error})
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
  export const updateTourById = async(req, res) => {
    try{
    const id=req.params?.id
    const data=req?.body
    const updatedTour=await Tour.findByIdAndUpdate(id,data,{
      runValidations:true,
      new:true
    });
    res.status(201).json({
      message:"Success",
      data:{
        updatedTour
      }
    })
    }catch(error){
       res.status(401).json({
        message:"Fail",
        error
       })
    }
  };
  export const deleteTourById = async(req, res) => {
      try{
        const id=req.params?.id
       const deletedTour=await Tour.findByIdAndDelete(id)
        res.status(201).json({
          status:"Success",
          message:{
             deletedTour
          }
        })
      }catch(err)
      {
        res.status(401).json(
          {
            status:"Fail",
            message:{
              err
            }
          }
        )
      }
  };