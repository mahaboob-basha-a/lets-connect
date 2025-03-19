import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { fetchProfile } from '../context/reducer';
import Sidebar from './Sidebar';
import RecentChats from './RecentChats';
import { icons } from '../assets/assets';

const Home = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token")

  useEffect(()=>{
    
  },[])

  if(!token){
    return <Navigate to="/sign-in" />
  }

  return (
    <div className='flex'>
      <Sidebar />
      <RecentChats />
      <div className='flex flex-col justify-center items-center w-[90%] bg-neutral-200'>
        <img src={icons.logo} className='w-40 rounded-md' alt="" />
        <p className='text-neutral-500 py-4'>Let's make conversation with let's connect.</p>
      </div>
    </div>
  )
}

export default Home;