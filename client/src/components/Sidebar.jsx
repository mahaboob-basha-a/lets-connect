import React, { use, useEffect } from 'react'
import { IoMdChatbubbles, IoIosAdd } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../server/api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../context/reducer';

const Sidebar = () => {
    const navigate = useNavigate();
    const {user} = useSelector(store=>store.chatStore);
    const dispatch = useDispatch();

    const handleLogout = async ()=>{
        try {
            await logout();
            toast.success("Logout successfully")
            localStorage.removeItem("token")
            return navigate("/sign-in")
        } catch (error) {
            console.log('logout error',error)
            toast.error("logout failed")
        }
    }

    useEffect(()=>{
        dispatch(fetchProfile());
    },[])


  return (
    <section className='max-w-10 h-screen bg-[#43fff2] flex flex-col justify-between items-center py-8'>
        {/* <img src={icons.logo} className='w-16' alt="" /> */}
        <div title='Profile' className='flex flex-col items-center gap-6'>
            {user && <span className='capitalize h-8 w-8 flex items-center justify-center text-xl font-semibold text-center rounded-full bg-white'>{user.name[0]}</span>}
        <NavLink title="Recent Chat's" to={'/chat'} >
            <IoMdChatbubbles size={28} />
        </NavLink>
        <NavLink title='New Chat' to={'/new-chat'}>
            <IoIosAdd size={40} />
        </NavLink>
        </div>
        <button title='Logout' onClick={handleLogout}>
            <CiLogout size={24} />
        </button>
    </section>
  )
}

export default Sidebar