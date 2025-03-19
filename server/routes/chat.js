import express from "express";
import authenticateUser from "../middleware/authenticateUser.js";
import { getProfile, searchUserByEmail } from "../controllers/getProfile.js";
import { getRecentChats, recieverAndConversationController } from "../controllers/chatController.js";

const chatRouter = express.Router();

// Get profile
chatRouter.get("/profile",authenticateUser,getProfile)

// Get User by Email
chatRouter.get("/search",authenticateUser,searchUserByEmail)

// Fetch reciever details and conversation
chatRouter.get("/:senderId/:receiverId",authenticateUser,recieverAndConversationController);

// Fetch recent chats
chatRouter.get("/recent-chats",authenticateUser,getRecentChats)

export default chatRouter;

