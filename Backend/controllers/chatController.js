// controllers/chatController.js
import { deductCredits } from "../middlewares/creditMiddleware.js";
import { getChatHistory, saveChatTurn } from "../services/chatHistoryService.js";
import generateAnswer from "../services/generateAnswer.js";
import searchDocuments from "../services/queryPinecone.js";

export async function Chat(req, res) {
  try {
    const { message, contentId } = req.body;
    const userId = req.userId;
    const user = req.user; // From checkCredits middleware
    
    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    // Get chat history
    let chatHistory;
    if (contentId) {
      chatHistory = await getChatHistory(userId, contentId, 5);
    } else {
      chatHistory = await getChatHistory(userId, null, 5);
    }

    // Search user memories
    const userMemories = await searchDocuments(message, userId, 5);

    // Generate AI answer
    const answer = await generateAnswer(message, userMemories, chatHistory);

    // ✅ DEDUCT CREDITS (only after successful response)
    const creditResult = await deductCredits(userId, 1);

    // Save the chat turn with credits used
    await saveChatTurn(userId, contentId, message, answer, 1); // Pass credits used

    // Return response with credit info
    res.json({ 
      answer, 
      timestamp: new Date().toISOString(),
      creditsUsed: 1,
      remainingCredits: creditResult.remainingCredits
    });

  } catch (error) {
    console.error("Chat error:", error);
    
    // Handle specific errors
    if (error.message === "Insufficient credits") {
      return res.status(403).json({ 
        error: "Insufficient credits",
        needsUpgrade: true 
      });
    }

    res.status(500).json({ error: "Failed to generate answer" });
  }
}