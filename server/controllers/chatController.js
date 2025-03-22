import User from "../models/User.js";
import Message from "../models/Message.js";

export const recieverAndConversationController = async (req, res) => {
    const { senderId, receiverId } = req.params;

    try {
        // Fetch receiver details
        const receiver = await User.findById(receiverId).select("name");

        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        if (!senderId || !receiverId) {
            return res.status(400).json({ message: 'Sender ID and Receiver ID are required' });
        }

        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ timestamp: 1 }); // Sort messages by timestamp (oldest to newest)}

        res.json({ receiver, messages });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getRecentChats = async (req, res) => {
    try {
        const { userId } = req.user; // Logged-in user ID
        

         // Find unique user IDs the logged-in user has chatted with
         const recentMessages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        });

        const uniqueUserIds = new Set();

        recentMessages.forEach((msg) => {
            if (msg.senderId.toString() !== userId) {
                uniqueUserIds.add(msg.senderId.toString());
            }
            if (msg.receiverId.toString() !== userId) {
                uniqueUserIds.add(msg.receiverId.toString());
            }
        });

        // Fetch user details (ID and email) for these unique users
        const recentChats = await User.find(
            { _id: { $in: Array.from(uniqueUserIds) } },
            { _id: 1, email: 1, name: 1 } // Only return ID and email
        );

        return res.status(200).json(recentChats.reverse());
    } catch (error) {
        console.error("Error fetching recent chats:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
