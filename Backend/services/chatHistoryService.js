import { ChatModel } from "../models/chatModel.js";
export async function saveChatTurn(userId, contentId, userMessage, assistantResponse) {
  const doc = {
    userId,
    message: userMessage,
    response: assistantResponse
  };
  if (contentId) doc.contentId = contentId;
  await ChatModel.create(doc);
}

// Get last N messages for the user, optionally filtered by contentId
export async function getChatHistory(userId, contentId, limit = 5) {
  let query = { userId };
  if (contentId) {
    query.contentId = contentId;
  }
  const chats = await ChatModel.find(query)
    .sort({ createdAt: -1 })
    .limit(limit);
  return chats.reverse();
}
