import { uploadOnCloudinary } from "../cloudinary/cloudinary.js";
import { User } from "../models/UserModel.js";
import ApiError from "./ApiError.js";
import { asyncHandler } from "./AsyncHandler.js";
import ApiFeature from "./FilteredQuery.js";
const getUserId=async(email)=>
{
   const user=await User.findOne({email});
   return user._id;
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
      let imageCover,tourImages ;
      if (req.files) {
        const imageCoverPromise = req.files.imageCover
          ? uploadOnCloudinary(req.files.imageCover[0].path)
          : null;
        const tourImagesPromises = req.files.tourImages
          ? req.files.tourImages.map(file => uploadOnCloudinary(file.path))
          : [];
      
        // Execute uploads in parallel
        const [imageCoverResult, tourImagesResults] = await Promise.all([
          imageCoverPromise,
          Promise.all(tourImagesPromises),
        ]);
        if (imageCoverResult) imageCover = imageCoverResult;
        if (tourImagesResults.length) tourImages = tourImagesResults;
      }
        const updatedItem=await Model.findByIdAndUpdate(req.params.id,{...req.body,imageCover,images:tourImages},{new:true});
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
      if(req.body.files)
      {
        console.log('files',req.body.files);
       const paths=req.body.files.map((file)=>file.path)
      //  let urls=await uploadOnCloudinary(paths)
      }
      if(req.body.createdBy)
      {
         let user_id=await getUserId(req.body.createdBy)
         req.body={...req.body,createdBy:user_id}
      }
      let imageurls
      if(Array.isArray(req.files))
      {
        imageurls=await uploadOnCloudinary(req.files); //pending  
      }
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
        let data = await Model.findById(req.params.id).populate(populateOptions).lean();
        
        let isReviewSubmitted=await data?.tourReviews?.some((review)=>review.user._id==req.user.id)
        //  c
        // console.log('review',isReviewSubmitted)
          data={...data,isReviewSubmitted:isReviewSubmitted};
          console.log('data',data);
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