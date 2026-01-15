
import express from "express";
import { getMe, refillCredits, resetPassword, sendOtp, signin, signup, verifyOtp } from "../controllers/authController.js";
import { userMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();





import { authLimiter } from '../middlewares/sanitization.js';

// Routes
router.post('/signup', authLimiter, signup);
router.post('/signin', authLimiter, signin);
router.get('/me', userMiddleware, getMe);
router.post('/refill', userMiddleware, refillCredits);

// Password reset routes
router.post('/send-otp', authLimiter, sendOtp);
router.post('/verify-otp', authLimiter, verifyOtp);
router.post('/reset-password', authLimiter, resetPassword);

export default router