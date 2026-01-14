
import express from "express";
import { getMe, refillCredits, resetPassword, sendOtp, signin, signup, verifyOtp } from "../controllers/authController.js";
import { userMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();





// Routes
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', userMiddleware, getMe);
router.post('/refill', userMiddleware, refillCredits);

// Password reset routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

export default router