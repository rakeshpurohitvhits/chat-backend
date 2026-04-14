
import { chatModel } from "../../model/chatModel/chat.model.js";
import { conversationModel } from "../../model/chatModel/conversation.model.js";
import { chatSocket } from "../../router/chatRouter/chat.router.js";
import { ResponseMessage } from "../../utils/ResponseMessage.js";
import { acceptRequestFun, sendRequest } from "../chatController/chat.controller.js";




chatSocket.on("connection", function (socket) {
    console.log("socket connected", socket.id);

    // Join personal room for notifications
    socket.on('joinPersonalRoom', (userId) => {
        if (userId) {
            socket.join(userId.toString());
            console.log(`Socket ${socket.id} joined personal room ${userId}`);
        }
    });

    socket.on('joinRoom', async (roomId) => {
        socket.join(roomId);
        console.log(roomId,'roomId');
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    })

        socket.on('sendMessage', (data) => {
            const roomId = data?.conversationId?._id || data?.conversationId;
            if (roomId) {
                console.log('sendMessage to room:', roomId, data);
                chatSocket.to(roomId.toString()).emit("receiveMessage", data);
            } else {
                console.error('sendMessage error: missing conversationId', data);
            }
        })
        socket.on('messageReaction', (data) => {
            chatSocket.to(data?.conversationId).emit("recieveMessageReaction", data);
        })

        socket.on('sendRequest', async (data) => {
            console.log('sendRequest received:', data);
            const res = await sendRequest(data);
            const conversationRoomId = data.id || data._id;
            if (res && conversationRoomId) {
                // Emit to the conversation room
                chatSocket.to(conversationRoomId.toString()).emit("getSendRequest", res);
                
                // Also emit to the specific users' personal rooms
                res.user.forEach(u => {
                    const userId = u._id || u;
                    chatSocket.to(userId.toString()).emit("getSendRequest", res);
                });
            }
        })
        socket.on('acceptRequest', async (data) => {
            console.log('acceptRequest received:', data);
            const res = await acceptRequestFun(data);
            const conversationRoomId = data.id || data._id;
            if (res && conversationRoomId) {
                // Emit to the conversation room
                chatSocket.to(conversationRoomId.toString()).emit("getAcceptRequest", res);
                
                // Also emit to the specific users' personal rooms
                res.user.forEach(u => {
                    const userId = u._id || u;
                    chatSocket.to(userId.toString()).emit("getAcceptRequest", res);
                });
            }
        })
   

    // socket.on("disconnect", () => {
    //   console.log("socket connected");
    //   //   activeUsers.delete(socket.userId);
    //   //   io.emit("user disconnected", socket.userId);
    // });

})