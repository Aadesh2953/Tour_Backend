import mongoose from 'mongoose';
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
       required:[true,'User must belong to a user']
    }
},
{ 
    timeStamps:true
})
reviewSchema.statics.methods=async function calculateAverageRatings(tourId)
{
    const stats=await this.aggregate([
        {
            $match:{tour:tourId}
        },
        {
           $group:{
            _id:"$tour",
            nRating:{$sum:1},
            avgRatings:{$avg:1},
           }
        }
    ]);
    console.log('stats',stats);
}
await TourSchema.findByIdAndUpdate(tourId,{
    ratingsAverage:stats[0].avgRatings, 
    ratingsQuantity:stats[0].nRating   
})
reviewSchema.post('save',function()
{
    this.constructor.calculateAverageRatings(this.tour);
}
)
reviewSchema.pre(/^findOneAnd/,async function()
{
  this.r=await this.findOne();
})
reviewSchema.pre(/^find/,function(next)
{
    this.populate({
        path:'user',
        select:'name id'
    })
    next();
} 
)
export const Reviews= new mongoose.model('Reviews',reviewSchema);