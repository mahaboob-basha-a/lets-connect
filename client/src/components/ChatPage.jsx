import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import RecentChats from "./RecentChats";
import { IoPersonCircleSharp } from "react-icons/io5";
import { IoMdSend, IoMdArrowBack } from "react-icons/io";
import { Link, Navigate, useParams } from "react-router-dom";
import { fetchChatDetails, socket } from "../server/api";
import { icons } from "../assets/assets";
import {format} from "date-fns";
import { useDispatch } from "react-redux";
import { setParamId } from "../context/reducer";
import TypingIndicator from "./TypingIndicator";

const ChatPage = () => {
  const { id } = useParams(); // Receiver ID from URL
  const dispatch = useDispatch();
  const [reciever, setReciever] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [typing,setTyping] = useState(false)
  const { user } = JSON.parse(localStorage.getItem("token"));
  const chatContainerRef = useRef(null);
  const lastSeenMessageIndex = messages
  .map((msg, index) => (msg.senderId === user._id && msg.seen ? index : null))
  .filter((index) => index !== null)
  .pop();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

useEffect(() => {
  const handleResize = () => {
    if (window.innerHeight < screen.height * 0.8) {
      setKeyboardOpen(true);
    } else {
      setKeyboardOpen(false);
    }
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages,typing]); 


  // Fetch chat history
  const getChatDetails = async () => {
    if (!user._id || !id) return;
    try {
      const chatRes = await fetchChatDetails(user._id, id);
      setReciever(chatRes?.data?.receiver?.name);
      setMessages(chatRes?.data?.messages || []);
    } catch (error) {
      console.error("Fetching chat failed", error);
    }
  };

  // handle message on change
  const handleMessageOnChange = e =>{
    e.preventDefault();
    setMessage(e.target.value)
    // typing on
    if(e.target.value === ""){
      return socket.emit('typing-stop',{ senderId: id, receiverId: user._id,typing: false })
    }
    socket.emit('typing-on',{ senderId: id, receiverId: user._id,typing: true })
  }

  const handleBlur = e =>{
    e.preventDefault();
    socket.emit('typing-stop',{ senderId: id, receiverId: user._id,typing: false })
  }

  // Send message
  const handleSendMessage = () => {
    if (message.trim() === '' || message.length < 1) return;
    const newMessage = {
      senderId: user._id,
      receiverId: id,
      message,
      timestamp: new Date().toISOString(),
      seen: false,
    };
  
    // Emit the message to the server
    socket.emit('send-message', newMessage);
    socket.emit('typing-stop',{ senderId: id, receiverId: user._id,typing: false })
    setMessage('');
  };
  
  // Manage Socket Events
  useEffect(() => {
    socket.emit("user-online", user._id);
    socket.emit('mark-seen', { senderId: id, receiverId: user._id });

    socket.on("typing-status",({senderId, receiverId,typing})=>{
      if ((senderId === id && receiverId === user._id) || (senderId === user._id && receiverId === id)) {
        setTyping(typing)
      }
    })
    
    // param id global state
    dispatch(setParamId(id))
    
    // Fetch chat history only when the receiver ID changes
    getChatDetails();
    
    // Listen for new messages
    const handleNewMessage = (newMessage) => {
      
      if ((newMessage.senderId === id && newMessage.receiverId === user._id) || (newMessage.senderId === user._id && newMessage.receiverId === id)) {
        socket.emit('mark-seen', { senderId: id, receiverId: user._id });

        // Only update messages if the user is involved
        setMessages((prev) => {
          if (!prev.some((msg) => msg._id === newMessage._id)) {
            return [...prev, newMessage];
          }
          return prev;
        });
      }
    };

    socket.on("message", handleNewMessage);

    // Listen for user status updates
    socket.on("update-user-status", (users) => setOnlineUsers(users));

    const handleSeenMessages = ({ senderId, receiverId }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
            msg.senderId === senderId && msg.receiverId === receiverId
                ? { ...msg, seen: true } 
                : msg
        )
    );
    };

    socket.on("messages-seen", handleSeenMessages);
    
    return () => {
      socket.off("message", handleNewMessage);
      socket.off("update-user-status");
      socket.off("messages-seen",handleSeenMessages);
    };
  }, [id]); // Run when receiver ID changes

  if(!user){
    return <Navigate to="/sign-in" />
  }
  return (
    <section className="flex h-screen w-screen">
      <div className="max-sm:hidden sm:block">
        <RecentChats />
      </div>
      {/* Chat screen */}
      {id ? (
        <div className="w-full sm:w-[90%] h-screen">
          {/* Top Header */}
          <header className="flex items-center gap-2 max-sm:fixed top-0 left-0 shadow-md p-2 bg-blue-200 w-full z-10">
            <Link to={"/chat"} className="text-gray-600 sm:hidden">
              <IoMdArrowBack size={24} />
            </Link>
            <span className="text-gray-400">
              <IoPersonCircleSharp size={38} />
            </span>
            {reciever && (
              <div>
                <h2 className="capitalize">{reciever}</h2>
                {!typing &&<p className="text-xs">{onlineUsers.includes(id) ? "🟢 Online" : "⚪ Offline"}</p>}
                {typing && <p className="text-xs">Typing ...</p>}
              </div>
            )}
          </header>

          {/* Chat Messages */}
          <div className="flex flex-col">
            <div
              ref={chatContainerRef}
              className={`bg-cover bg-center px-3 pb-2 pt-8 w-full chat-container transition-all duration-300 ${
                keyboardOpen ? "h-[calc(100vh-40vh)]" : "h-[calc(100vh-56px)]"
              }`}
              style={{ backgroundImage: `url(${icons.chatBg})` }}
            >
              {messages.map((msg,index) => {
                
                return (
                <div
                  key={msg._id}
                  className={`flex items-center ${
                    msg.senderId === user._id ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* msg container */}
                  <div className={`text-neutral-700 relative text-wrap max-w-sm max-sm:max-w-[180px] flex items-end gap-2 rounded-xs px-2 my-1 ${msg.senderId === user._id ? "bg-[#43fff2] rounded-br-none rounded-tr-xl" : "bg-neutral-100 rounded-bl-none rounded-tl-xl"}`}>
                    <span className="text-sm capitalize">
                    {msg.message}
                    </span>
                    <span className="text-[10px] w-12 h-4 text-nowrap">{format(msg.timestamp,"hh:mm a")}</span>
                    {msg.seen && (index === lastSeenMessageIndex) && (msg.senderId === user._id) && 
                    <span className="text-xs text-white absolute -bottom-5 right-0">seen</span>
                    }
                  </div>
                </div>
              )})}
              {typing && <TypingIndicator />}
            </div>
            {/* Message Input */}
            <div className="flex items-center border-2 border-gray-400 rounded-b-sm bg-white fixed bottom-0 w-full">
              <input
                type="text"
                value={message}
                onChange={handleMessageOnChange}
                onKeyDown={e=>e.key === 'Enter'? handleSendMessage() : null}
                placeholder="Type message here..."
                onBlur={handleBlur}
                className="outline-none md:w-[96%] w-[88%] py-3 px-2 touch-manipulation"
              />
              <button
                onClick={handleSendMessage}
                className={`cursor-pointer rounded-full h-6 w-6 touch-manipulation ${
                  message.length > 0 ? "-rotate-45" : "rotate-0"
                }`}
              >
                <IoMdSend size={30} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-[90%] bg-neutral-200">
          <img src={icons.logo} className="w-40 rounded-md" alt="" />
          <p className="text-neutral-500 py-4">
            Let's make conversation with Let's Connect.
          </p>
        </div>
      )}
    </section>
  );
};

export default ChatPage;
