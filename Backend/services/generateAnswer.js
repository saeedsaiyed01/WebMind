// services/generateAnswer.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Generate an answer using Gemini based on the user's query and stored memories.
 * @param {string} query - The user's question.
 * @param {Array} userMemories - Array of matched documents from Pinecone.
 * @returns {Promise<string>} - The generated answer.
 */
export async function generateAnswer(query, userMemories) {
  if (!query || typeof query !== "string" || !query.trim()) {
    throw new Error("Invalid query: Provide a valid question.");
  }

  // Use stored context if available; otherwise, it will fallback to general knowledge.
  let relevantContent = "";
  if (userMemories && userMemories.length > 0) {
    relevantContent = userMemories[0]?.metadata?.text || "";
  }

  const prompt = `
You are an AI assistant. Answer the following question based on the given context if relevant, otherwise provide an answer using your own general knowledge.

Instructions:
- Use the provided context if it is relevant.
- If the context is insufficient or missing, answer using your general knowledge.
- Do not mention whether you’re using stored context or not.
- Keep your answer short and clear.
- Avoid phrases like "Based on the context provided".

User's Question: "${query}"

Stored Information:
${relevantContent || "[No relevant stored information available]"}
  `;

  console.log("Constructed prompt:", prompt);

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent({
    contents: [{ parts: [{ text: prompt }] }],
  });

  const answer =
    result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "I'm sorry, but I couldn't generate an answer.";

  return answer;
}

export default generateAnswer;
