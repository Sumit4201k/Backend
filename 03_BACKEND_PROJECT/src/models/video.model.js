import mongoose, { Schema } from "mongoose";
import mongooseAggregate from 'mongoose-aggregate-paginate-v2'

const Videoschema = new Schema({

    videoFile:{
        type:String,//urrrrl
        required:true,

    },
    thumbnail:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    discription:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        requiied:true
    },
    views:{
        type:Number,
        default:0

    },
    isOublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})

Videoschema.plugin(mongooseAggregate)
export const video = mongoose.model("video",Videoschema)