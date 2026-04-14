import express from 'express'
import dotenv from 'dotenv'
dotenv.config({ override: true })
import { connectToDataBase } from './src/config/DB.config.js'
import { app, server } from "./src/config/Socket.config.js";
import { userRouter } from './src/router/userRouter/user.router.js';
import cors from 'cors'
import { chatRouter } from './src/router/chatRouter/chat.router.js';
import "./src/controller/socketController/socket.controller.js";

let port = process.env.PORT || 4500

await connectToDataBase()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/image', express.static('./public/uploads'))

app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)

server.listen(port, () => {
    console.log(`port running at ${port}`);
})
