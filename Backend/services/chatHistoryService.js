// services/chatHistoryService.js
import { ChatModel } from "../models/chatModel.js";
// Update your saveChatTurn function to accept credits
export async function saveChatTurn(userId, contentId, message, response, creditsUsed = 1) {
  try {
    await ChatModel.create({
      userId,
      contentId: contentId || null,
      message,
      response,
      creditsUsed // ✅ ADD THIS
    });
    
    console.log(`✅ Chat saved for user ${userId}`);
  } catch (error) {
    console.error("Error saving chat turn:", error);
    throw error;
  }
}

// Get chat history (keep your existing function)
export async function getChatHistory(userId, contentId, limit = 5) {
  try {
    const query = { userId };
    if (contentId) {
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