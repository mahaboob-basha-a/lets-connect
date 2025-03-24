import React, { useEffect, useState } from 'react'
import { icons } from '../assets/assets';
import { fetchRecentChats, socket } from '../server/api';
import { Link, Navigate } from 'react-router-dom';
import { IoPersonCircleSharp } from "react-icons/io5";
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';


const RecentChats = () => {
  const { user } = JSON.parse(localStorage.getItem("token"));
  const [recentChats,setRecentChats] = useState([]);
  const {paramId} = useSelector(store=>store.chatStore);

  const getRecentChats = async ()=>{
    if(!user){
      return null;
    }
    try {
      const recentChats = await fetchRecentChats();
      setRecentChats(recentChats.data || [])
    } catch (error) {
      console.log('recentChats error',error)
    }
  }

  useEffect(()=>{
    socket.emit("user-online", user._id);
    getRecentChats();
  },[paramId])

  if(!user){
    return <Navigate to={"/sign-in"} />
  }

  return (
    <section className='flex'>
      <Sidebar/>
    <div className='sm:max-w-56 h-screen max-sm:w-[90vw] shadow-md '>
        <img src={icons.logo} className='w-56 max-sm:w-full max-sm:h-20 h-14 rounded-sm' alt="" />
        <h2 className='text-xl font-bold py-3 px-2'>Recent Chat's</h2>
        {recentChats.length > 0 && <>
        {recentChats.map((recent,index)=>{

          return (
            <Link to={`/chat/${recent._id}`} key={recent._id} className="flex border rounded-md border-gray-300 my-1 gap-2 w-full py-1 items-center">
              <span className="text-gray-400">
              <IoPersonCircleSharp size={38} />
              </span>
              <div className='flex flex-col items-start'>
               <span className='text-sm font-medium capitalize text-neutral-700'>{recent.name}</span>
               <span className='text-xs text-gray-500'>{recent.email}</span>
              </div>
              
            </Link>
          )
        })}
        </>}
    </div>
</section>
  )
}

export default RecentChats;