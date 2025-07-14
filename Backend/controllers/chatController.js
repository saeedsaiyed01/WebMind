// Chat endpoint
import generateAnswer from "../services/generateAnswer.js";
import searchDocuments from "../services/queryPinecone.js";

export async function Chat (req, res)  {
  try {
    const { message } = req.body;
    const userId = req.userId;
    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }
    const userMemories = await searchDocuments(message, userId, 5);
    const answer = await generateAnswer(message, userMemories);
    res.json({ answer, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to generate answer" });
  }
};
