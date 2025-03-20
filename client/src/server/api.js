import io from 'socket.io-client';
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URI;

// Axios instance
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const socket = io(import.meta.env.VITE_SERVER_URI,{
    transports: ["websocket"],
    withCredentials: true
});

export const connectUser = (userId) => {
    socket.emit("userOnline", userId);
};

export const sendMessage = (senderId, receiverId, message) => {
    socket.emit("sendMessage", { senderId, receiverId, message });
};

socket.on("receiveMessage", (message) => {
    console.log("New message received:", message);
});


// Send OTP to email
export const sendOtp = async (email) => {
    const response = await api.post(`${API_URL}/auth/send-otp`, { email });
    return response;
};

// Verify OTP (Sign in)
export const verifyOtp = async (email, name, otp) => {
    const response = await api.post(`${API_URL}/auth/verify-otp`, { email, name, otp });
    return response;
};

// Logout user
export const logout = async () => {
    const response = await api.post(`${API_URL}/auth/logout`);
    return response;
};

// get profile
export const getProfile = async () => {
    const response = await api.get(`${API_URL}/chat/profile`);
    return response;
};

// get new chat email
export const searchUserByEmail = async (email) => {
        const response = await api.get(`/chat/search?email=${email}`);
        return response // Returns user object with `_id` & `email`
    
};

// fetch chat details
export const fetchChatDetails = async (senderId, receiverId) => {
    const response = await api.get(`/chat/${senderId}/${receiverId}`);
    return response;
}

// Fetch Recent Chats
export const fetchRecentChats = async () => {
    const response = await api.get(`/chat/recent-chats`);
    return response; // Return the array of users
};
