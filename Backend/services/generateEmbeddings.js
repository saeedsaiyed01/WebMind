// services/generateEmbeddings.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { GEMINI_API_KEY } from "../config.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Generate an embedding for given text using Gemini.
 * @param {string} text - The text to embed.
 * @returns {Promise<number[]>} - The embedding vector.
 */
export async function generateEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: "models/embedding-001" });
  const result = await model.embedContent({
    content: {
      parts: [{ text }],
    },
    taskType: "RETRIEVAL_DOCUMENT",
  });
  return result.embedding.values;
}
