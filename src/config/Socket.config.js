import express from "express";
import http from "http";
import * as io from "socket.io";
import { SocketAuth } from "../middleware/Auth.js";

export const app=express()
export const server=http.createServer(app)
const Socket = new io.Server(server, {
    cors: "*",
});

export const socketRoute = (path, { isAuth }) => {
    return Socket.of(path).use((socket, next) => {
        if (!isAuth){
            next();
        }else{
            SocketAuth(socket, next)
        }
    })
}
