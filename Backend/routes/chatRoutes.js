// routes/chatRoutes.js
import express from "express";
import mongoose from "mongoose";
import { Chat } from "../controllers/chatController.js";
import { userMiddleware } from "../middlewares/authMiddleware.js";
import { checkCredits } from "../middlewares/creditMiddleware.js";
import { ChatModel } from "../models/chatModel.js";
import { UserModel } from "../models/user.model.js";

const router = express.Router();

// ============================================
// MAIN CHAT ENDPOINT
// ============================================

import { chatLimiter } from "../middlewares/rateLimiter.js";

// POST /api/v1/chat - Send a message and get AI response
router.post("/chat", userMiddleware, chatLimiter, checkCredits, Chat);


// ============================================
// CREDIT MANAGEMENT ENDPOINTS
// ============================================

// GET /api/v1/chat/credits - Check remaining credits
router.get("/credits", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId).select("credits plan planExpiry");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get total chats count
    const totalChats = await ChatModel.countDocuments({ userId });

    // Get total credits used
    const creditsUsedResult = await ChatModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$creditsUsed" } } }
    ]);
    const creditsUsed = creditsUsedResult[0]?.total || 0;

    res.json({
      credits: user.credits,
      plan: user.plan,
      planExpiry: user.planExpiry,
      usage: {
        totalChats,
        creditsUsed
      }
    });
  } catch (error) {
    console.error("Get credits error:", error);
    res.status(500).json({ error: "Failed to get credit info" });
  }
});


// ============================================
// CONVERSATION SESSION ENDPOINTS (SIDEBAR)
// ============================================
import { ConversationModel } from "../models/conversation.model.js";

// GET /conversations - List user's conversations
router.get("/conversations", userMiddleware, async (req, res) => {
  try {
    const convs = await ConversationModel.find({ userId: req.userId })
      .sort({ lastMessageAt: -1 })
      .limit(50);
    res.json(convs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /conversation/:id - Get messages for a specific conversation
router.get("/conversation/:id", userMiddleware, async (req, res) => {
  try {
    const messages = await ChatModel.find({
      conversationId: req.params.id,
      userId: req.userId
    }).sort({ createdAt: 1 }); // Oldest first
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /conversation/:id
router.delete("/conversation/:id", userMiddleware, async (req, res) => {
  try {
    await ConversationModel.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    await ChatModel.deleteMany({ conversationId: req.params.id, userId: req.userId });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ============================================
// CHAT HISTORY ENDPOINTS
// ============================================

// GET /api/v1/chat/history - Get all chat history
router.get("/history", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 20, contentId } = req.query;

    // Build query
    const query = { userId };
    if (contentId) {
      query.contentId = contentId;
    }

    // Get chats
    const chats = await ChatModel.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('message response creditsUsed contentId createdAt');

    res.json({
      chats,
      total: chats.length
    });
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({ error: "Failed to get chat history" });
  }
});

// GET /api/v1/chat/history/:contentId - Get chat history for specific content
router.get("/history/:contentId", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { contentId } = req.params;
    const { limit = 50 } = req.query;

    const chats = await ChatModel.find({
      userId,
      contentId
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('message response creditsUsed createdAt');

    res.json({
      chats: chats.reverse(), // Oldest first for conversation flow
      total: chats.length
    });
  } catch (error) {
    console.error("Get content history error:", error);
    res.status(500).json({ error: "Failed to get chat history" });
  }
});


// ============================================
// STATISTICS ENDPOINT
// ============================================

// GET /api/v1/chat/stats - Get user's chat statistics
router.get("/stats", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Get user info
    const user = await UserModel.findById(userId).select("credits plan planExpiry");

    // Get chat statistics
    const stats = await ChatModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalChats: { $sum: 1 },
          totalCreditsUsed: { $sum: "$creditsUsed" }
        }
      }
    ]);

    // Get chats by date (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentChats = await ChatModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          credits: { $sum: "$creditsUsed" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      credits: {
        remaining: user.credits,
        used: stats[0]?.totalCreditsUsed || 0,
        plan: user.plan,
        planExpiry: user.planExpiry
      },
      usage: {
        totalChats: stats[0]?.totalChats || 0,
        last7Days: recentChats
      }
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Failed to get statistics" });
  }
});


// ============================================
// DELETE ENDPOINT (Optional)
// ============================================

// DELETE /api/v1/chat/:chatId - Delete a specific chat
router.delete("/:chatId", userMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;

    const chat = await ChatModel.findOneAndDelete({
      _id: chatId,
      userId: userId // Ensure user owns this chat
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json({
      success: true,
      message: "Chat deleted successfully"
    });
  } catch (error) {
    console.error("Delete chat error:", error);
    res.status(500).json({ error: "Failed to delete chat" });
  }
});

// DELETE /api/v1/chat/content/:contentId - Delete all chats for specific content
router.delete("/content/:contentId", userMiddleware, async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.userId;

    const result = await ChatModel.deleteMany({
      contentId: contentId,
      userId: userId
    });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} chats`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Delete content chats error:", error);
    res.status(500).json({ error: "Failed to delete chats" });
  }
});


export default router;  