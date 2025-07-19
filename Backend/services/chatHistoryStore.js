// services/chatHistoryStore.js
import { ChatModel } from "../models/chatModel.js";
const chatHistories = new Map();

export default function getChatHistory(userId) {
  return chatHistories.get(userId) || [];
}

export function saveChatTurn(userId, userMessage, assistantResponse) {
  const history = chatHistories.get(userId) || [];

  history.push({ role: "user", content: userMessage });
  history.push({ role: "assistant", content: assistantResponse });

  chatHistories.set(userId, history);
}

export function clearChatHistory(userId) {
  chatHistories.delete(userId);
}

export async function getChatHistory(userId, contentId, limit = 5) {
  const chats = await ChatModel.find({ userId, contentId })
    .sort({ createdAt: -1 })
    .limit(limit);
  return chats.reverse();
}
