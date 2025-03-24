import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.js";
import chatRouter from "./routes/chat.js";
import { app,server } from './sockets/socket.js';

app.use(cors({ origin: process.env.CLIENT_URI, credentials:true }));
app.use(cookieParser());

app.use("/auth", authRoutes); 
app.use("/chat", chatRouter);

// Default route
app.use((_,res)=>{
    res.json({message:"server running..."})
})

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
