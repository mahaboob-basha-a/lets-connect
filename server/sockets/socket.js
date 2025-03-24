import 'dotenv/config';
import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import Message from '../models/Message.js';

export const app = express();
export const server = http.createServer(app);

app.use(express.json());

const io = new Server(server,{
    cors:{
        origin:process.env.CLIENT_URI,
        methods:["GET","POST"],
        credentials:true
    }
});

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
    // typing on
    socket.on('typing-on',({ senderId,receiverId,typing })=>{
        if (onlineUsers.has(senderId)) {
            io.to(onlineUsers.get(senderId)).emit('typing-status', { senderId, receiverId,typing });
        }
    })
    // typing stop
    socket.on('typing-stop',({ senderId,receiverId,typing })=>{
        if (onlineUsers.has(senderId)) {
            io.to(onlineUsers.get(senderId)).emit('typing-status', { senderId, receiverId,typing });
        }
    })
    

    // Mark messages as seen
    socket.on('mark-seen', async ({ senderId, receiverId }) => {

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
