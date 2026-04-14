import express from 'express'
import {  acceptRequest, createConversation, getChat, getConversationRoom, reactionMessage, saveChat } from '../../controller/chatController/chat.controller.js'
import { socketRoute } from '../../config/Socket.config.js'



export const chatRouter =express.Router()


chatRouter.post('/create-conersation',createConversation)
chatRouter.post('/accept-request',acceptRequest)
chatRouter.post('/get-conersation-room',getConversationRoom)
chatRouter.post('/get-chat',getChat)
chatRouter.post('/save-chat',saveChat)
chatRouter.post('/save-reaction',reactionMessage)


export const chatSocket=socketRoute("/chat",{isAuth:false})