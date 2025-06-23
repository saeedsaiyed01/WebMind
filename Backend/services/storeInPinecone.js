// services/storeInPinecone.js
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import { PINECONE_API_KEY, PINECONE_INDEX } from "../config.js";
import { generateEmbedding } from "./generateEmbeddings.js";
dotenv.config();

const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });

/**
 * Upsert a document into Pinecone.
 * @param {string} id - Unique ID for the document.
 * @param {string} text - The actual text content (tweet text, note, etc.).
 * @param {string} sourceType - The type of memory (e.g., "tweet").
 * @param {object} extraMetadata - Extra metadata (e.g., URL, timestamp).
 * @param {string} userId - The ID of the user.
 */
export async function storeDocument(id, text, sourceType, extraMetadata, userId) {
  const embedding = await generateEmbedding(text);
  const index = pinecone.index(PINECONE_INDEX);

  const metadata = {
    text, // Actual content for AI to use.
    sourceType,
    userId: String(userId),
    ...extraMetadata,
  };

  await index.upsert([
    {
      id,
      values: embedding,
      metadata,
    },
  ]);

  console.log(`Document ${id} stored successfully for user: ${userId}.`);
}
