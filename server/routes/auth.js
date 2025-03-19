import { logoutController, sendOtpController, verifyOtpController } from "../controllers/authController.js";
import express from 'express';
const router = express.Router();

// Send OTP - Handles both new & existing users
router.post("/send-otp",sendOtpController);

// Verify OTP - Authenticate user and set cookie
router.post("/verify-otp", verifyOtpController);

// Logout - Clears the cookie
router.post("/logout",logoutController);

export default router;
