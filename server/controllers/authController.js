import User from "../models/User.js";
import { sendOtpEmail } from "../utils/sendOtp.js";
import jwt from "jsonwebtoken";
import 'dotenv/config';

// Send OTP - Handles both new & existing users
export const sendOtpController = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
        // Create new user without name
        user = new User({ email });
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP

    user.name = user.name || email[0]
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // Expires in 5 min

    await user.save();
    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent successfully",name:user.name });
};

// Verify OTP - Authenticate user and set cookie
export const verifyOtpController = async (req, res) => {
    const { email, name, otp } = req.body;

    const user = await User.findOne({ email });

    if (!name || !user || user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    // Mark user as verified
    user.name = name;
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    // Set cookie with token
    res.cookie("token", token, {httpOnly: true,secure: process.env.DEV_ENV === 'production',sameSite: process.env.DEV_ENV === 'production'? 'none' :'lax',maxAge: 7 * 24 * 60 * 60 * 1000 }).json({ message: "Login successful", user, token });
};

// Logout - Clears the cookie
export const logoutController = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};
