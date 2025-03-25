import { Tour } from "../models/TourModel.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import ApiError from '../utils/ApiError.js'
import Stripe from "stripe";
import { Bookings } from "../models/BookingModel.js";
import { User } from "../models/UserModel.js";
export const getBooking = asyncHandler(async (req, res, next) => {
    const tour=await Tour.findById(req.params.id);
    if(!tour)
    {
      return next(new ApiError(404,"Tour Not Found!!!"))
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `http://localhost:5173/myTours`,
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
        success:true,
        data:session
    })
})
export const createBooking=async (session)=>{
    const tour=session.client_reference_id;
    const user=await User.findOne({email:session.customer_email});
    const price=100;
    // const price=session.line_items[0].price_data.unit_amount/100;
    await Bookings.create({tour,user,price});
return

}

export const webHookController=asyncHandler(async (req,res,next)=>{
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    let  stripeSignature=req.headers['stripe-signature'];
    let event;
    try {
        event=stripe.webhooks.constructEvent(
            req.body,
            stripeSignature,
           process.env.STRIPE_SIGNING_SECRET
        )
    } catch (error) {
         res.status(500).send(
            `${error}`
        )
    }
    if(event.type==='checkout.session.completed')
    {
        await createBooking(event.data.object)
        // res.status(200).send({data:event.data.object});
    }
    // res.status(400).send('')
    res.status(200).json({ success: true, message: "Webhook processed",data:event.data.object });
})

export const getAllBookings=asyncHandler(async(req,res,next)=>{
      const bookings=await Bookings.find({user:req.user.id}).populate('tour');
    if(bookings.length==0){res.status(200).send({
        success:true,
        items:bookings.length,
        message:'No Bookings found !',
        data:bookings
    })
return 
}
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