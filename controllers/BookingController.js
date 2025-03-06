import { Tour } from "../models/TourModel.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import ApiError from '../utils/ApiError.js'
import Stripe from "stripe";
import { Bookings } from "../models/BookingModel.js";
export const getBooking = asyncHandler(async (req, res, next) => {
    const tour=await Tour.findById(req.params.id);
    if(!tour)
    {
      return next(new ApiError(404,"Tour Not Found!!!"))
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?${req.params.id}&${req.user.id}&${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.id,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [tour.imageCover], 
                    },
                    unit_amount: tour.price * 100, 
                },
                quantity: 1
            }
        ],
        mode: 'payment' // Required field for checkout session
    });
    
    res.status(200).send({
        status:"Success",
        data:session
    })
})
export const createBooking=asyncHandler(async(req,res,next)=>{
    let {tour,user,price}=req.query;

    if(!tour || !user ||! price) next(new ApiError(500,'Invalid Booking'))
    const booking=await Bookings.create({
     tour,
     user,
     price
})
res.status(200).send({
    success:true,
    data:booking
})
})
export const getAllBookings=asyncHandler(async(req,res,next)=>{
    
    const bookings=await Bookings.find({createdBy:req.user.id});
    if(bookings.length==0)res.status(200).send({
        success:true,
        items:bookings.length,
        message:'No Bookings found !',
        data:bookings
    })
    res.status(200).send({
        success:true,
        items:bookings.length,
        message:'Success',
        data:bookings
    })
})
export const cancelBooking=asyncHandler(async(req,res,next)=>{
 if(!req.params.id)next(new ApiError(400,'Booking with Given Id is Not Found!!'));
    const canceledBooking=await Bookings.findByIdAndUpdate(req.params.id,{$set:{active:false}});
 if(!canceledBooking)next(new ApiError(400,'Booking Cancelation Request Failed '));
 res.status(200).send({
    success:true,
    message:"Booking Canceled Successfully",
    data:canceledBooking
 })
    
})