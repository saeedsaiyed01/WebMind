import OpenAI from "openai";
import { OPENROUTER_API_KEY } from "../config.js";

const embeddingApiKey = OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
const embeddingModel = process.env.OPENROUTER_EMBEDDING_MODEL || "openai/text-embedding-3-small";

console.log(
  "Checking embedding API key:",
  embeddingApiKey ? `Loaded key starting with ${embeddingApiKey.substring(0, 10)}...` : "Key NOT LOADED"
);

const openRouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: embeddingApiKey,
});

/**
 * Generates an embedding for the given text using OpenRouter's OpenAI-compatible API.
 * @param {string} textToEmbed The text to embed.
 * @returns {Promise<number[]>} The embedding vector.
 */
export async function generateEmbedding(textToEmbed) {
  const input = textToEmbed.replace(/\n/g, " ");

  try {
    console.log(`Generating embedding for text: "${input.substring(0, 50)}..." using ${embeddingModel}`);

    const response = await openRouter.embeddings.create({
      model: embeddingModel,
      input,
      dimensions: 768,
    });

    if (response.data && response.data.length > 0 && response.data[0].embedding) {
      console.log(`Embedding generated successfully (dimension: ${response.data[0].embedding.length})`);
      return response.data[0].embedding;
    }

    console.error("OpenRouter response was successful but did not contain an embedding.");
    throw new Error("No embedding returned from OpenRouter.");
  } catch (error) {
    console.error("Error generating embedding from OpenRouter:");
    if (error.response) {
      console.error("Error Status:", error.response.status);
      console.error("Error Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

export default generateEmbedding;
