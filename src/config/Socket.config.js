import express from "express";
import http from "http";
import { Server } from "socket.io";
import { SocketAuth } from "../middleware/Auth.js";

export const app = express();
export const server = http.createServer(app);
const io = new Server(server, {
  path: "/chat",
  cors: {
    origin: "*",
  }
});

export const socketRoute = (path, { isAuth }) => {
    return io.of(path).use((socket, next) => {
        if (!isAuth){
            next();
        }else{
            SocketAuth(socket, next)
        }
    })
}
