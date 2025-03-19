import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASS
    }
});

export const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Your OTP for Let's Connect",
        html: `<p>Your OTP is: <b>${otp}</b> It will expire in 5 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);
};
