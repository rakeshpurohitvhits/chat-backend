import mongoose, { Types } from "mongoose";

const userSchema=new mongoose.Schema({

    fullName:{
        type:String
    },
    userName:{
        type:String
    },
    email:{
        type:String
    },
    profileImage:{
        type:String
    },
    mobileNumber:{
        type:Number
    },
    password:{
        type:String
    },
    isDelete:{
        type:Boolean,
        default:false
    },
    fcmToken:{
        type:String,
        default: null
    }

},{timestamps:true})

export const userModel = mongoose.models.User || mongoose.model('User', userSchema);