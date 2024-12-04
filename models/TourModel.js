import mongoose from "mongoose";
import slugify from "slugify";
const TourSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A tour must have Name'],
        trim:true,
        unique:true,
    },
    price:{
        type:Number,
        required:[true,'A tour Must Not Be Free!!!'],
     },
     rating:{
        type:Number,
        default:0 
     },
     duration:{
        type:Number,
        required:[true,'A Tour must Have A duration']
     },
    difficulty:{
        type:String,
        required:[true,'A tour must have a difficulty Rating']
    },
    ratingsAverage:{
     type:Number,
     default:4.5
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    priceDisount:Number,
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
    image:[
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
TourSchema.pre(/^find/,function(next)
{
    this.find({secretTour:{$ne:true}})
    next()
})
TourSchema.virtual("weekDuration").get(function()
{
  return this.duration/7;
})
TourSchema.pre("save",function(next)
{
    this.slug=slugify(this.name,{lower:true})
    next()
})
export const Tour=new mongoose.model('Tour',TourSchema)