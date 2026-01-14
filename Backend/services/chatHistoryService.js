// services/chatHistoryService.js
import { ChatModel } from "../models/chatModel.js";
// Update your saveChatTurn function to accept credits
export async function saveChatTurn(userId, contentId, conversationId, message, response, creditsUsed = 1) {
  try {
    const chat = await ChatModel.create({
      userId,
      contentId: contentId || null,
      conversationId: conversationId || null,
      message,
      response,
      creditsUsed
    });

    console.log(`✅ Chat saved for user ${userId}, Conv: ${conversationId}`);
    return chat;
  } catch (error) {
    console.error("Error saving chat turn:", error);
    throw error;
  }
}

// Get chat history (keep your existing function)
export async function getChatHistory(userId, contentId, conversationId, limit = 10) {
  try {
    const query = { userId };

    // If conversationId is provided, filter STRICTLY by it
    if (conversationId) {
      query.conversationId = conversationId;
    }
    // Otherwise fallback to contentId (legacy/document chat)
    else if (contentId) {
      query.contentId = contentId;
    }

    const history = await ChatModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('message response createdAt');

    return history.reverse(); // Oldest first
  } catch (error) {
    console.error("Error getting chat history:", error);
    return [];
  }
}