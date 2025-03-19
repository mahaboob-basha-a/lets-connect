import React, { useRef } from 'react';

const Otp = ({otp,setOtp}) => {

    const inputRefs = useRef([]);

    const handleOtpOnChange = (e, index) => {
        const value = e.target.value;

        if (!/^[0-9]?$/.test(value)) return; 

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <>
            <p className="text-sm">Enter your OTP</p>
            <div className="flex items-center gap-3">
                {otp.map((digit, indx) => (
                    <div
                        key={indx}
                        className="border-2 w-10 h-10 border-gray-400 rounded-md flex items-center justify-center"
                    >
                        <input
                            ref={(el) => (inputRefs.current[indx] = el)}
                            type="text"
                            maxLength={1}
                            className="outline-none h-6 w-6 text-center"
                            value={digit}
                            onChange={(e) => handleOtpOnChange(e, indx)}
                            onKeyDown={(e) => handleKeyDown(e, indx)}
                        />
                    </div>
                ))}
            </div>
        </>
    );
};

export default Otp;
