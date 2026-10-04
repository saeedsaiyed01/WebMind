// controllers/chatController.js
import { deductCredits } from "../middlewares/creditMiddleware.js";
import { ContentModel } from "../models/content.model.js"; // ✅ Import for focused search
import { ConversationModel } from "../models/conversation.model.js"; // ✅ Import
import { getChatHistory, saveChatTurn } from "../services/chatHistoryService.js";
import generateAnswer from "../services/generateAnswer.js";
import searchDocuments from "../services/queryPinecone.js";

function beginChatStream(res) {
  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");
  if (typeof res.flushHeaders === "function") res.flushHeaders();

  return (event) => {
    if (!res.writableEnded) res.write(`${JSON.stringify(event)}\n`);
  };
}

export async function Chat(req, res) {
  const { message, contentId, attachedDocumentIds } = req.body;
  let { conversationId } = req.body;
  const userId = req.userId;

  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  const send = beginChatStream(res);

  try {
    send({ type: "phase", phase: "working" });

    if (conversationId) {
      await ConversationModel.findByIdAndUpdate(conversationId, { lastMessageAt: new Date() });
    } else {
      const newConv = await ConversationModel.create({
        userId,
        title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
        lastMessageAt: new Date()
      });
      conversationId = newConv._id;
    }

    const chatHistory = await getChatHistory(userId, contentId, conversationId, 10);

    let pineconeIdFilter = [];
    if (attachedDocumentIds && attachedDocumentIds.length > 0) {
      const attachedDocs = await ContentModel.find({
        _id: { $in: attachedDocumentIds },
        userId
      });

      pineconeIdFilter = attachedDocs.map(doc => doc.pineconeId);
      console.log(`Focused search: ${pineconeIdFilter.length} document(s) attached`);
    }

    send({ type: "phase", phase: "searching" });
    const userMemories = await searchDocuments(message, userId, 5, pineconeIdFilter);

    const { model = "gemini-2.5-flash", imageUrl } = req.body;

    send({ type: "phase", phase: "solving" });
    const answer = await generateAnswer(message, userMemories, chatHistory, model, imageUrl);

    const creditResult = await deductCredits(userId, 1);
    await saveChatTurn(userId, contentId, conversationId, message, answer, 1);

    send({
      type: "result",
      answer,
      conversationId,
      timestamp: new Date().toISOString(),
      creditsUsed: 1,
      remainingCredits: creditResult.remainingCredits
    });
    res.end();
  } catch (error) {
    console.error("Chat error:", error);

    const payload = error.message === "Insufficient credits"
      ? { type: "error", error: "Insufficient credits", needsUpgrade: true }
      : { type: "error", error: "Failed to generate answer" };

    try {
      send(payload);
      res.end();
    } catch (writeError) {
      console.error("Failed to write chat error event:", writeError);
      if (!res.headersSent) {
        res.status(500).json({ error: payload.error });
      }
    }
  }
}