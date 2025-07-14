
import express from "express";
import { getMe, signin, signup } from "../controllers/authController.js";
import { userMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();





// Routes
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', userMiddleware, getMe);

export default router