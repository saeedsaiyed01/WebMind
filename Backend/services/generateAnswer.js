import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import OpenAI from "openai";
import { GEMINI_API_KEY, OPENROUTER_API_KEY } from "../config.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const openRouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
});

/**
 * Generate an answer using Gemini or OpenRouter based on the user's query and stored memories.
 * @param {string} query - The user's question.
 * @param {Array} userMemories - Array of matched documents from Pinecone.
 * @param {Array} chatHistory - Previous chat history.
 * @param {string} model - The model to use (default: gemini-2.5-flash).
 * @param {string} imageUrl - Optional image URL for multimodal input.
 * @returns {Promise<string>} - The generated answer.
 */
export async function generateAnswer(query, userMemories, chatHistory = [], model = "gemini-2.5-flash", imageUrl = null) {
  if (!query || typeof query !== "string" || !query.trim()) {
    throw new Error("Invalid query: Provide a valid question.");
  }

  // Construct Context string
  let relevantContent = "";
  if (userMemories && userMemories.length > 0) {
    relevantContent = userMemories.map(m => m.metadata?.text).join("\n\n");
  }

  const systemInstructions = `You are an AI assistant. Answer the user's question based on the provided context if relevant, otherwise use your general knowledge.
- Context: ${relevantContent ? "Below is the relevant information found in the user's documents." : "No specific document context available."}
- ${relevantContent || ""}
- Instructions: Be concise, accurate, and helpful. Do not mention "context provided" unless necessary.
`;

  console.log("Using Model:", model);

  try {
    // ---------------------------------------------------------
    // STRATEGY 1: GOOGLE GENERATIVE AI (Native SDK)
    // ---------------------------------------------------------
    if (model.includes("gemini") && !model.includes("openrouter")) { // Simple heuristic
      const genModel = genAI.getGenerativeModel({ model: model.replace("google/", "") }); // handling prefixes

      let promptParts = [query];

      // Format history for Gemini (Text Prompt)
      const historyText = chatHistory.map(turn => `User: ${turn.message}\nAI: ${turn.response}`).join("\n");
      const fullPrompt = `${systemInstructions}\n\nChat History:\n${historyText}\n\nUser: ${query}`;

      // Handle Image...
      // ...

      const result = await genModel.generateContent(fullPrompt);
      return result.response.text();
    }

    // ---------------------------------------------------------
    // STRATEGY 2: OPENROUTER (OpenAI Compatible)
    // ---------------------------------------------------------

    // Flatten history turns into message list
    const historyMessages = [];
    chatHistory.forEach(turn => {
      if (turn.message) historyMessages.push({ role: "user", content: turn.message });
      if (turn.response) historyMessages.push({ role: "assistant", content: turn.response });
    });

    const messages = [
      { role: "system", content: systemInstructions },
      ...historyMessages,
      { role: "user", content: [] }
    ];

    // Prepare User Message Content (Multimodal support)
    const userContent = [{ type: "text", text: query }];
    if (imageUrl) {
      userContent.push({
        type: "image_url",
        image_url: { url: imageUrl }
      });
    }
    messages[messages.length - 1].content = userContent;

    const completion = await openRouter.chat.completions.create({
      model: model,
      messages: messages,
    });

    return completion.choices[0]?.message?.content || "No response generated.";

  } catch (error) {
    console.error("Generate Answer Error:", error);
    return "Sorry, I encountered an error generating the response.";
  }
}

export default generateAnswer;
