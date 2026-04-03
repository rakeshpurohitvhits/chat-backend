
import { chatModel } from "../../model/chatModel/chat.model.js";
import { conversationModel } from "../../model/chatModel/conversation.model.js";
import { chatSocket } from "../../router/chatRouter/chat.router.js";
import { ResponseMessage } from "../../utils/ResponseMessage.js";
import { acceptRequestFun, sendRequest } from "../chatController/chat.controller.js";




chatSocket.on("connection", function (socket) {
    console.log("socket connected", socket.id);

    socket.on('joinRoom', async (roomId) => {
        socket.join(roomId);
        console.log(roomId,'roomId');
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    })

        socket.on('sendMessage', (data) => {
            chatSocket.to(data?.conversationId).emit("receiveMessage", data);
        })
        socket.on('messageReaction', (data) => {
            chatSocket.to(data?.conversationId).emit("recieveMessageReaction", data);
        })

        socket.on('sendRequest',async(data)=>{
            console.log(data,'data');
            await sendRequest(data).then((res)=>{
                console.log(res,'res');
                chatSocket.to(data?.id).emit("getSendRequest", res); 
           })
        })
        socket.on('acceptRequest',async(data)=>{
            await acceptRequestFun(data).then((res)=>{
               console.log(res);
                chatSocket.to(data?.id).emit("getSendRequest", res); 
           })
        })
   

    // socket.on("disconnect", () => {
    //   console.log("socket connected");
    //   //   activeUsers.delete(socket.userId);
    //   //   io.emit("user disconnected", socket.userId);
    // });

})