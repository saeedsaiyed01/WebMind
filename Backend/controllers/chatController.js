// Chat endpoint
import { getChatHistory, saveChatTurn } from "../services/chatHistoryService.js";
import generateAnswer from "../services/generateAnswer.js";
import searchDocuments from "../services/queryPinecone.js";

export async function Chat(req, res) {
  try {
    const { message, contentId } = req.body;
    const userId = req.userId;
    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }
    let chatHistory;
    if (contentId) {
      chatHistory = await getChatHistory(userId, contentId, 5);
    } else {
      chatHistory = await getChatHistory(userId, null, 5); // Or a different function for general history
    }
    const userMemories = await searchDocuments(message, userId, 5);

    const answer = await generateAnswer(message, userMemories, chatHistory);

    // Save the chat turn
    await saveChatTurn(userId, contentId, message, answer);

    res.json({ answer, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to generate answer" });
  }
}
