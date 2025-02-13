import mongoose from "mongoose";
import slugify from "slugify";
import { User } from "./UserModel.js";
const TourSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A tour must have Name'],
        trim:true,
        maxLength:[40,'Too Long Name For the Tour!!'],
        minLength:[1,'Minimum number of elements should be 1'],
        unique:true,
    },
    price:{
        type:Number,
        required:[true,'A tour Must Not Be Free!!!'],
     },
    //  rating:{
    //     type:Number,
    //     max:[5,'Max Rating must be 5'],
    //     min:[1,'Min Rating must be 1'],
    //     default:0 
    //  },
     duration:{
        type:Number,
        required:[true,'A Tour must Have A duration']
     },
    difficulty:{
        type:String,
        required:[true,'A tour must have a difficulty Rating'],
        enum:{
            values:['easy','medium','hard'],
            message:"Difficulty must be hard,easy and medium"
        }
    },
    ratingsAverage:{
     type:Number,
     min:[1,'Min Rating must be 1'],
     max:[5,'Min Rating must be 5'],
     default:4.5
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    priceDisount:{
        type:Number,
        validate:{
            validator:function(val){return val<this.price},
            message:'priceDiscount should be less than {val}'
        } 

    },
    summary:{
        type:String,
        trim:true,
        required:[true,'A summary For A Tour is Neccessary!!!']
    },
    description:{
        type:String,
        trim:true,
    },
    imageCover:{
        type:String,
        required:[true,'A Tour must have an Image Cover!']
    },
    images:[
     {
        type:String,
        required:[true,'Images For a Tour Is Required!!!']
     }
    ],
    startDates:[
        {
            type:Date,
            required:[true,'Start Date IS Required']
        }
    ],
    slug:{
        type:String,
    },
    secretTour:{
        type:Boolean,
        default:false
    },
    startLocation:{
       type:{
        type:String,
        default:'Point',
        enum:['Point']
       },
       coordinates:[Number],
       address:String,
       description:String
    },
    locations:[
        {
        type:{
            type:String,
            default:'Point',
            enum:['Point']
            },
        coordinates:[Number],
        address:String,
        description:String
        }
    ],
    guides:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'User'
        }
    ],
    createdBy:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    isReviewSubmitted:{
     type:Boolean,
     default:false
    }
},
{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}  
},
{
    timeStamps:true
})
// TourSchema.set('toJSON',{virtuals:true})
TourSchema.index({price:1,ratingsAverage:-1});
TourSchema.index({slug:1});
TourSchema.index({startLocation:"2dsphere"});
TourSchema.pre(/^find/,function(next)
{
    this.find({secretTour:{$ne:true}})
    let filteredFeilds='-__v,-passwordChangedAt,-password,-confirmPassword,-passwordChangeDate,-passwordResetToken,-passwordResetTokenExpires,-role'
    this.populate({path:'guides',select:filteredFeilds.split(',').join(" ")});
    next()
})
TourSchema.virtual('tourReviews',{
    ref:'Reviews',
    foreignField:'tour',
    localField:'_id',
});
TourSchema.virtual("weekDuration").get(function()
{
  return this.duration/7;   
})
TourSchema.pre("save",function(next)
{
    this.slug=slugify(this.name,{lower:true})
    next()
})
TourSchema.pre('save',async function(next)
{
    const guides=this.guides.map(async(id)=>await User.findById(id));
    this.guides=await Promise.all(guides);

    next();
})
TourSchema.pre("aggregate",function(next)
{
    this.pipeline().unshift({$match:{secretTour:{$ne:true}}})
    next()
})
export const Tour=new mongoose.model('Tour',TourSchema)