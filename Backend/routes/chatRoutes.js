// routes/chatRoutes.js
import express from "express";
import { Chat } from "../controllers/chatController.js";
import { userMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/v1/chat
router.post("/chat", userMiddleware, Chat);

export default router;
