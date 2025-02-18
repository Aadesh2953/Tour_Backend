import mongoose from 'mongoose';
import { Tour } from './TourModel.js';
const reviewSchema=new mongoose.Schema({
    ratings:{
        type:Number,
        min:1,
        max:5
    },
    review:{
        type:String,
        required:[true,'A review is a must Required']
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'Review must belong to a tour']
    },
    user:{
       type:mongoose.Schema.ObjectId,
       ref:'User',
       required:[true,'Review must belong to a user']
    }
},
{ 
    timeStamps:true
})
reviewSchema.index({tour:1,user:1},{unique:true});
reviewSchema.statics.calculateAverageRatings=async function (tourId)
{
    const stats=await this.aggregate([
        {
            $match:{tour:tourId}
        },
        {
           $group:{
            _id:"$tour",
            nRating:{$sum:1},
            avgRatings:{$avg:"$ratings"},
           }
        }
    ]);
    await Tour.findByIdAndUpdate(tourId,{
        ratingsAverage:stats[0].avgRatings, 
        ratingsQuantity:stats[0].nRating   
    })
}
reviewSchema.post('save',async function(next)
{
    console.log('here')
   await this.constructor.calculateAverageRatings(this.tour);
    next();
}
)
reviewSchema.pre(/^findOneAnd/,async function(next)
{
  this.r=await this.findOne();
  console.log('here')
  next()
})
reviewSchema.post(/^findOneAnd/,async function(next)
{
   await this.r.constructor.calculateAverageRatings(this.tour);
   console.log('here2')
   next();
})
reviewSchema.pre(/^find/,function(next)
{
    this.populate({
        path:'user',
        select:'name id email'
    })
    next();
} 
)
export const Reviews= new mongoose.model('Reviews',reviewSchema);