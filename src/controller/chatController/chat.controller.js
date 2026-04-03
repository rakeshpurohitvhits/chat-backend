import { StatusCodes } from "http-status-codes";
import { conversationModel } from "../../model/chatModel/conversation.model.js"
import { ResponseMessage } from "../../utils/ResponseMessage.js";
import { chatModel } from "../../model/chatModel/chat.model.js";
import { SendPushNotification } from "../../services/services.js";


export const createConversation = async (req, res) => {
    try {
        const findData = await conversationModel.findOne({ user: { $all: req.body.user } });
        if (!findData) {
            await conversationModel.create(req.body)
            return res.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: ResponseMessage.ROOM_JOIN_SUCCESSFULLY,
            });
        }
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: ResponseMessage.ROOM_ALREADY_JOINED,
        });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ data: error, status: StatusCodes.INTERNAL_SERVER_ERROR, message: ResponseMessage.INTERNAL_SERVER })
    }
}




export const getConversationRoom = async (req, res) => {
    try {
        const findData = await conversationModel.findOne({ user: { $all: req.body.ids } });
        if (findData) {

            return res.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: ResponseMessage.CONVERSATION_ROOM_FETCHED,
                data: findData
            });
        }
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: ResponseMessage.CONVERSATION_ROOM_NOT_FOUND,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ data: error, status: StatusCodes.INTERNAL_SERVER_ERROR, message: ResponseMessage.INTERNAL_SERVER })
    }
}


export const saveChat = async (req, res) => {
    try {
        const findconversation = await conversationModel.findOne({ _id: req.body.conversationId })
        if (findconversation) {
            const findChat = await chatModel.create(req.body)
            const data = await chatModel.findById(findChat._id)
            .populate("sender", "fullName userName profileImage")
            .populate("receiver", "fullName userName profileImage fcmToken")
            console.log(data);
            // await SendPushNotification(data.sender.fullName,data.message,data.receiver.fcmToken)
            console.log(data,123);
            return res.status(StatusCodes.CREATED).json({
                status: StatusCodes.CREATED,
                message: ResponseMessage.CHAT_SAVED_SUCCESSFULLY,
                data: data
            });
        }

        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: ResponseMessage.CONVERSATION_ROOM_NOT_FOUND,
            data: []
        });


    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ data: error, status: StatusCodes.INTERNAL_SERVER_ERROR, message: ResponseMessage.INTERNAL_SERVER })
    }
}

export const reactionMessage = async (req, res) => {
    try {
        const findconversation = await chatModel.findOne({ _id: req.body.messageId })
        if (findconversation) {
            const findChat = await chatModel.updateOne({_id:req.body.messageId},{$set:{messageReaction:req.body.messageReaction}})

            const data = await chatModel.findById(req.body.messageId)
            .populate("sender", "fullName userName profileImage")
            .populate("receiver", "fullName userName profileImage fcmToken")
            // console.log(data);
            // await SendPushNotification(data.sender.fullName,data.message,data.receiver.fcmToken)
            console.log(findChat,123);
            return res.status(StatusCodes.CREATED).json({
                status: StatusCodes.CREATED,
                message: ResponseMessage.CHAT_SAVED_SUCCESSFULLY,
                data: data
            });
        }

        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: ResponseMessage.CONVERSATION_ROOM_NOT_FOUND,
            data: []
        });


    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ data: error, status: StatusCodes.INTERNAL_SERVER_ERROR, message: ResponseMessage.INTERNAL_SERVER })
    }
}



export const getChat = async (req, res) => {

    // const { page = 1 } = req.body
    // const pageSize = 5
    // const skip = (page - 1) * pageSize;
    try {
        const findconversation = await conversationModel.findOne({ user: { $all: req.body.ids } })
        if (findconversation) {
            const findChat = await chatModel.find({ conversationId: findconversation._id })
                // .skip(skip)
                // .limit(pageSize)
                .populate("sender", "fullName userName profileImage")
                .populate("receiver", "fullName userName profileImage")
            if (findChat) {

                return res.status(StatusCodes.OK).json({
                    status: StatusCodes.OK,
                    message: ResponseMessage.CHAT_FETCHED_FETCHED,
                    data: findChat
                });
            }
            return res.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: ResponseMessage.CHAT_NOT_FOUND,
                data: []
            });

        }

        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: ResponseMessage.CONVERSATION_ROOM_NOT_FOUND,
            data: []
        });


    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ data: error, status: StatusCodes.INTERNAL_SERVER_ERROR, message: ResponseMessage.INTERNAL_SERVER })
    }
}










// event functions
export const sendRequest = async (data) => {
    console.log(data,'sendRequest');
    try {
        const findconversation = await conversationModel.findOne({ _id: data.id })
        if (findconversation) {
            findconversation.requestSend = true
            findconversation.isPending = true
            const data = await findconversation.save()
            return data
        }
    } catch (error) {
        console.log("send request error", error);
    }
}



export const acceptRequestFun = async (data) => {
    try {
        const findconversation = await conversationModel.findOne({ _id: data.id })
        if (findconversation) {
            findconversation.requestAccept = true
            findconversation.isPending = false
            const data = await findconversation.save()
            return data
        }
    } catch (error) {
        console.log("send request error", error);
    }
}

