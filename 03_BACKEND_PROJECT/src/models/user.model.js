import mongoose, { Schema } from 'mongoose'
// import mongooseAggregate from 'mongoose-aggregate-paginate-v2'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


const userschema = new Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    Email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    Fullname:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,//url
        required:true

    },
    coverimage:{
        type:String,//url
        

    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"video"
        }
    ],
    password:{
        type:String,
        required:true
    },
    refreshTocken:{
        type:String
    },   
    },{timestamps:true}
)

userschema.pre("save",async function(next){
    if (this.isModified("password")) return next();

    this.password=await bcrypt.hash(this.password,10)
    next()
})

userschema.methods.isPasswordcorrect= async function(password){
    return await bcrypt.compare(password,this.password)
}

userschema.methods.generateAccesstoken= function(){
    jwt.sign({
        _id:this._id,
        Email:this.Email,
        usernmae:this.username,
        Fullname:this.Fullname
    },process.env.ACESS_TOKEN_SECRET,
{
    expiresIn: process.env.ACESS_TOKEN_EXPIRY
})
}
userschema.methods.generateRefreshtoken= function(){
    jwt.sign({
        _id:this._id,
        
    },process.env.REFRESH_TOKEN,
{
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
})
}
// userschema.plugin(mongooseAggregate)

export const User = mongoose.model("User",userschema)