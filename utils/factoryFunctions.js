import { uploadOnCloudinary } from "../cloudinary/cloudinary.js";
import { User } from "../models/UserModel.js";
import ApiError from "./ApiError.js";
import { asyncHandler } from "./AsyncHandler.js";
import ApiFeature from "./FilteredQuery.js";
const getUserId = async (id) => {
  const user = await User.findById(id);
  return user._id;
};
export const deleteOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const deletedItem = await Model.findByIdAndDelete(req.params?.id);
    res.status(200).send({
      status: "Success",
      message: `Tour deleted SuccessFully!!!`,
      data: deletedItem,
    });
  });
};
export const updateOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    let imageCover, tourImages;

    console.log('req',req.body);
    // console.log('files',req.files);
    if (req.files) {
      // console.log('here',req.files)
      const imageCoverPromise = req.files.imageCover
        ? uploadOnCloudinary(req.files.imageCover[0].path)
        : null;
      const tourImagesPromises = req.files.tourImages
        ? req.files.tourImages.map((file) => uploadOnCloudinary(file.path))
        : [];

      // Execute uploads in parallel
      const [imageCoverResult, tourImagesResults] = await Promise.all([
        imageCoverPromise,
        Promise.all(tourImagesPromises),
      ]);
      if (imageCoverResult) imageCover = imageCoverResult;
      if (tourImagesResults.length) tourImages = tourImagesResults;
    }
    // if(req.body.locations)
    //   {  
    //    let locations=JSON.parse(req.body.locations)
    //    req.body={...req.body,locations:locations}
    //   }
      if (req.body.startLocation ) {
        req.body.startLocation = JSON.parse(req.body.startLocation);
    }
        
    if(req.files.imageCover){
     let imageCoverUrl=await uploadOnCloudinary(req.files.imageCover[0].path);
     req.body={...req.body,imageCover:imageCoverUrl};
    }
    if(req.files.images)
    {
      let imageUrls=req.files.images.map((file)=>uploadOnCloudinary(file.path));
      imageUrls = await Promise.all(imageUrls);
      req.body={...req.body,images:imageUrls};
    }
    if(req.body.startDates)JSON.parse(req.body.startDates)
    const updatedItem = await Model.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedItem) return next(new ApiError(400, "Id Not Found!!"));
    res.status(200).send({
      status: "Success",
      message: "Tour Updated Successfully",
      data: updatedItem,
    });
  });
};

export const createOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
  
    if (req.body.startDates) {
      if (typeof req.body.startDates === "string") {
        try {
          req.body.startDates = JSON.parse(req.body.startDates).map(
            (date) => new Date(date)
          );
        } catch (error) {
          console.error("Error parsing startDates:", error);
          req.body.startDates = []; // Prevent errors by setting a fallback
        }
      }
    }

   if(req.body.locations)
   {  
    req.body.locations=JSON.parse(req.body.locations)
   }
   if(req.body.startLocation)req.body.startLocation=JSON.parse(req.body.startLocation);


    if (req.body.createdBy) {
      let user_id = await getUserId(req.body.createdBy);
      req.body = { ...req.body, createdBy: user_id };
    }
    
 if(req.files.imageCover){
  let imageCoverUrl=await uploadOnCloudinary(req.files.imageCover[0].path);
  req.body={...req.body,imageCover:imageCoverUrl};
 }
 if(req.files.images)
 {
   let imageUrls=req.files.images.map((file)=>uploadOnCloudinary(file.path));
   imageUrls = await Promise.all(imageUrls);
   req.body={...req.body,images:imageUrls};
 }
    // console.log('here');
    const newData = await Model.create(req.body);

    res.status(201).json({
      success:true,
      status: "Success",
      data: {
        tour: newData,
      },
    });
  });
};
export const getOne = (Model, populateOptions) => {
  return asyncHandler(async (req, res, next) => {
    // console.log('user',req.user)
    let data = await Model.findById(req.params.id)
      .populate(populateOptions)
      .lean();

    let isReviewSubmitted = await data?.tourReviews?.some(
      (review) => review.user._id == req.user.id
    );
    //  c
    // console.log('review',isReviewSubmitted)
    data = { ...data, isReviewSubmitted: isReviewSubmitted };

    res.status(201).json({
      status: "Success",
      data,
    });
  });
};
export const readAll = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const features = new ApiFeature(Model.find(), req.query)
      .filter()
      .sort()
      .limitFeilds()
      .paginate();
    const total = await Model.countDocuments();


    const data = await features.query;

    let hasNext =
      total <= req.query?.limit * 1 * req.query.page * 1 ? false : true;
    if (data.length > 0) {
      res.status(201).json({
        status: "Success",
        items: data.length,
        total,
        data: [...data],
        hasNext,
      });
    } else {
      res.status(201).json({
        status: "Success",
        message: "No Tour To Display!!",
      });
    }
  });
};
