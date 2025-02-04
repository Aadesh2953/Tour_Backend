import ApiError from "./ApiError.js";
import { asyncHandler } from "./AsyncHandler.js";
import ApiFeature from "./FilteredQuery.js";

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
        
        const data = await Model.findById(req.params.id).populate(populateOptions);
            res.status(201).json({
              status: "Success",
              data
            });
    })
}
export const readAll=(Model)=>{
  return asyncHandler(async(req,res,next)=>{
    console.log('query',req.query)
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