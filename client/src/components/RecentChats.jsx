import React, { useEffect, useState } from 'react'
import { icons } from '../assets/assets';
import { fetchRecentChats } from '../server/api';
import { Link, useParams } from 'react-router-dom';
import { IoPersonCircleSharp } from "react-icons/io5";
import { useSelector } from 'react-redux';


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
    getRecentChats();
  },[paramId])

  return (
    <div className='max-w-56 h-screen shadow-md '>
        <img src={icons.logo} className='w-56 h-14 rounded-sm' alt="" />
        <h2 className='text-xl font-bold py-3 px-2'>Recent Chat's</h2>
        {recentChats.length > 0 && <>
        {recentChats.map((recent)=>{
          console.log(recent)
          return (
            <Link className="flex border rounded-md border-gray-300 my-1 w-full py-1 items-center" to={`/chat/${recent._id}`}>
              <span className="text-gray-400">
              <IoPersonCircleSharp size={38} />
              </span>
              <div className='flex flex-col'>
               <span className='text-sm font-medium capitalize text-neutral-700'>{recent.name}</span>
               <span className='text-xs text-gray-500'>{recent.email}</span>
              </div>
              
            </Link>
          )
        })}
        </>}
    </div>
  )
}

export default RecentChats;