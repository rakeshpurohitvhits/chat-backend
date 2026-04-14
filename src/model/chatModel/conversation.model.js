import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }],
    requestAccept:{
        type:Boolean,
        default:false
    },
    isPending:{
        type:Boolean,
        default:false
    },
    requestSend:{
        type:Boolean,
        default:false
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true });

export const conversationModel = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
