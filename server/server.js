import 'dotenv/config';
import http from 'http';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import Message from './models/Message.js';
import authRoutes from "./routes/auth.js";
import chatRouter from "./routes/chat.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:process.env.CLIENT_URI,
        methods:["GET","POST"],
        credentials:true
    }
});

app.use(cors({ origin: process.env.CLIENT_URI, credentials:true }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/chat", chatRouter);

// Default route
app.use((req,res)=>{
    res.json({message:"server running..."})
})

const onlineUsers = new Map(); // Store online users

io.on("connection", (socket) => {
    // console.log("New user connected:", socket.id);
    
    // Handle user online status
    socket.on("user-online", async (userId) => {
        onlineUsers.set(userId, socket.id);
        // console.log(`User ${userId} is online`);
        io.emit("update-user-status", Array.from(onlineUsers.keys()));
    });

    // Handle sending messages
    socket.on("send-message", async ({ senderId, receiverId, message }) => {
        // console.log(senderId,receiverId,message)
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        // Emit to sender
        io.to(onlineUsers.get(senderId)).emit('message', newMessage);

        // Emit to receiver if online
        if (onlineUsers.has(receiverId)) {
            io.to(onlineUsers.get(receiverId)).emit('message', newMessage);
        }
    });

    // Mark messages as seen
    io.on('mark-seen', async ({ senderId, receiverId }) => {
        await Message.updateMany({ senderId, receiverId, seen: false }, { seen: true });

        // Notify sender that messages are seen
        if (onlineUsers.has(senderId)) {
            io.to(onlineUsers.get(senderId)).emit('messages-seen', { senderId, receiverId });
        }
    });

     // Handle user disconnect
     socket.on('disconnect', () => {
        onlineUsers.forEach((value, key) => {
            if (value === socket.id) {
                onlineUsers.delete(key);
            }
        });
        io.emit('update-user-status', Array.from(onlineUsers.keys()));
        // console.log('User disconnected:', socket.id);
    });
});

const connectServer = async () =>{
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log("Db connected")
        server.listen(process.env.PORT,()=>console.log(`server running on ${process.env.PORT}`))
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

connectServer();
