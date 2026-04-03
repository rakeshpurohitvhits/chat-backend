import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    message: {
        type: String
    },
    messageReaction:{
        type: String,
        // default:null
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation'
    },
   

}, {timestamps: true })
export const chatModel=new mongoose.model('Chat',chatSchema)
