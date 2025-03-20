import React, { useState } from 'react'
import { icons } from '../assets/assets'
import Otp from './Otp'
import { sendOtp, verifyOtp } from '../server/api';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [email,setEmail] = useState("");
    const [name,setName] = useState("");
    const [otp, setOtp] = useState(new Array(4).fill(""));
    const [state,setState] = useState(false);
    const [sendOtpBtn,setSendOtpBtn] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleSendOtp = async e =>{
      e.preventDefault();
      if(!email || !email.endsWith("@gmail.com")){
        return toast.error("Valid Email Required")
      }
      setSendOtpBtn(true)

      try {
        const otpRes = await sendOtp(email)
        toast.success(otpRes?.data?.message)
        setName(otpRes?.data?.name || "")
        setState(true)
      } catch (error) {
        setState(false)
        setSendOtpBtn(false)
        toast.error("Otp send failed")
        console.log(error)
      }
    }

    const handleSubmit = async e => {
        e.preventDefault();

        const enteredOtp = otp.join("");
        if(enteredOtp.length<4 || !email || !email.endsWith('@gmail.com') || !name){
          return toast.error("Valid Otp or name needed")
        }
        try {
          const otpVerification = await verifyOtp(email,name,enteredOtp);
          toast.success(otpVerification.data.message)
          const payload = JSON.stringify({token:otpVerification.data.token,user:otpVerification.data.user})
          localStorage.setItem("token",payload)
          setState(false);
          setEmail("");
          setName("")
          setOtp(new Array(4).fill(""));
          return navigate("/chat")
        } catch (error) {
          toast.error(error?.response?.data?.message || "Otp verification failed")
          console.log(error.response.data.message)
        }
    };
    if(token){
      return <Navigate to={"/chat"} />
    }
  return (
    <div className='bg-gray-200 h-screen w-screen flex items-center justify-center'>
        <div className='bg-white w-sm max-sm:w-xs rounded-md py-12 flex flex-col justify-center items-center gap-8'>
            <img src={icons.logo} className='rounded-lg w-44' alt="" />
            <form className='flex flex-col space-y-3'>
                <input value={email} onChange={e=>setEmail(e.target.value)} className='outline-none border px-3 py-2 rounded-md border-gray-400' type="email" required placeholder='email@gmail.com' />
                {state ? <>
                <input value={name} onChange={e=>setName(e.target.value)} className='outline-none border px-3 py-2 rounded-md border-gray-400' type="text" required placeholder='your name' />
                  <Otp otp={otp} setOtp={setOtp} />
                  <button onClick={handleSubmit} className='py-2 bg-[#16fae9] rounded-md cursor-pointer font-medium hover:bg-[#1ebed3] transition-all duration-400'>Sign In</button>
                </> :
                  <button disabled={sendOtpBtn} onClick={handleSendOtp} className='py-2 bg-yellow-300 rounded-md cursor-pointer font-medium hover:bg-yellow-400 transition-all duration-400'>Get OTP</button>
                 }
            </form>
        </div>
    </div>
  )
}

export default SignIn