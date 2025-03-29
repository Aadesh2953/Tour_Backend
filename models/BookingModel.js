import mongoose from "mongoose";
import {Tour} from "../models/TourModel.js";
// import User from "./UserModel.js";
const bookingSchema=new mongoose.Schema({
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'Booking must belong to a tour']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:[true,'Booking must belong to a user']
    },
    createdBy:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    paid:{
        type:Boolean,
        default:true
    },
    active:{
        type:Boolean,
        default:true
    },
    status:{
        type:String,
        enum:['Completed','Upcoming','Cancelled'],
        default:'Upcoming'
    },
    selectedDate:{
        type:Date,
        required:[true,'Please select a date']
        
    },
    paymentId:{
        type:String,
        required:true
    }
})
bookingSchema.pre('save',async function(next)
{
    console.log('selectedDate',this.selectedDate);
    let tour=await Tour.findById(this.tour).lean();
    this.createdBy=tour.createdBy;
    next();
})
bookingSchema.pre("/^find/",async function(next)
{
  this.populate('user').populate({
    path:'tour',
    select:'name'
  })
  next();
})
export const Bookings=mongoose.model('Bookings',bookingSchema);
