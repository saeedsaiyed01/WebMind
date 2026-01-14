// controllers/chatController.js
import { deductCredits } from "../middlewares/creditMiddleware.js";
import { ContentModel } from "../models/content.model.js"; // ✅ Import for focused search
import { ConversationModel } from "../models/conversation.model.js"; // ✅ Import
import { getChatHistory, saveChatTurn } from "../services/chatHistoryService.js";
import generateAnswer from "../services/generateAnswer.js";
import searchDocuments from "../services/queryPinecone.js";

export async function Chat(req, res) {
  try {
    const { message, contentId, attachedDocumentIds } = req.body;
    let { conversationId } = req.body; // User might send existing ID
    const userId = req.userId;
    const user = req.user;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    // 1. Manage Conversation Session
    if (conversationId) {
      // Update existing conversation timestamp
      await ConversationModel.findByIdAndUpdate(conversationId, { lastMessageAt: new Date() });
    } else {
      // Create NEW Conversation
      const newConv = await ConversationModel.create({
        userId,
        title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
        lastMessageAt: new Date()
      });
      conversationId = newConv._id;
    }

    // Get chat history (scoped to conversation if possible, or simplified)
    // For RAG, we might still want recent global history or specific doc history
    // Get chat history (scoped to conversation)
    const chatHistory = await getChatHistory(userId, contentId, conversationId, 10);

    // 2. Get pineconeIds for focused search (if documents attached via @ mention)
    let pineconeIdFilter = [];
    if (attachedDocumentIds && attachedDocumentIds.length > 0) {
      const attachedDocs = await ContentModel.find({
        _id: { $in: attachedDocumentIds },
        userId // Security: ensure user owns these documents
      });

      pineconeIdFilter = attachedDocs.map(doc => doc.pineconeId);
      console.log(`Focused search: ${pineconeIdFilter.length} document(s) attached`);
    }

    // Search user memories (RAG) - focused if docs attached, otherwise searches all
    const userMemories = await searchDocuments(message, userId, 5, pineconeIdFilter);

    // Extract optional model and imageUrl from request
    const { model = "gemini-2.5-flash", imageUrl } = req.body;

    // Generate AI answer
    const answer = await generateAnswer(message, userMemories, chatHistory, model, imageUrl);

    // ✅ DEDUCT CREDITS (only after successful response)
    const creditResult = await deductCredits(userId, 1);

    // Save the chat turn with credits used AND conversationId
    await saveChatTurn(userId, contentId, conversationId, message, answer, 1);

    // Return response with credit info
    res.json({
      answer,
      conversationId, // ✅ Return this so frontend can update URL
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