import { User } from "../models/UserModel.js";
import ApiError from "./ApiError.js";
import { asyncHandler } from "./AsyncHandler.js";
import ApiFeature from "./FilteredQuery.js";
<<<<<<< Updated upstream
async function getUserId(email)
{
  
  let user_id=await User.findOne({email})
  return user_id._id
=======
const getUserId=async(email)=>
{
   const user=await User.findOne({email});
   return user._id;
>>>>>>> Stashed changes
}
export const deleteOne=(Model)=>{
return  asyncHandler(async (req,res,next)=>
{
   const deletedItem=await Model.findByIdAndDelete(req.params?.id);
   res.status(200).send({
    status:'Success',
    message:`Tour deleted SuccessFully!!!`,
    data:deletedItem
   })
})
}
export const updateOne=(Model)=>{
    return asyncHandler(async(req,res,next)=>
    {
        const updatedItem=await Model.findByIdAndUpdate(req.params.id);
        if(!updatedItem)return next(new ApiError(400,"Id Not Found!!"));
        res.status(200).send({
            status:"Success",
            message:"Tour Updated Successfully",
            data:updatedItem
        })
    })
}

export const createOne=(Model)=>{
    return asyncHandler(async(req,res,next)=>
    {
<<<<<<< Updated upstream
          let userId=await getUserId(req.body.createdBy)
           req.body={...req.body,createdBy:userId}
           console.log('body',req.body)
=======
      // if(Model)
      // {
      //   console.log("Hi")
      // }
      if(req.body.createdBy)
      {
         let user_id=await getUserId(req.body.createdBy)
         req.body={...req.body,createdBy:user_id}
      }
>>>>>>> Stashed changes
        const newData = await Model.create(req.body);
       
            res.status(201).json({
              status: "Success",
              data: {
                tour: newData,
              },
            });
    })
}
export const getOne=(Model,populateOptions)=>{
     return asyncHandler(async(req,res,next)=>
    {
        // console.log('user',req.user)
        let data = await Model.findById(req.params.id).populate(populateOptions);
        
        let isReviewSubmitted=await data?.tourReviews?.some((review)=>review.user.id==req.user.id)
       
          data={...data,isReviewSubmitted}
            res.status(201).json({
              status: "Success",
              data
            });
    })
}
export const readAll=(Model)=>{
  return asyncHandler(async(req,res,next)=>{
     const features = new ApiFeature(Model.find(), req.query)
           .filter()
           .sort()
           .limitFeilds()
           .paginate();
         const data = await features.query;
        //  console.log('query',req.query?.page*1*req.query?.limit*1);
         const hasNext=data.length<req.query?.page*1*req.query?.limit*1?false:true;
         if (data.length > 0) {
           res.status(201).json({
             status: "Success",
             items: data.length,
             data:[...data],
             hasNext
           });
         } else {
           res.status(201).json({
             status: "Success",
             message: "No Tour To Display!!",
           });
         }
  })
}