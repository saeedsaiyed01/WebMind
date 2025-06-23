// services/queryPinecone.js
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import { PINECONE_API_KEY, PINECONE_INDEX } from "../config.js";
import { generateEmbedding } from "./generateEmbeddings.js";
dotenv.config();

const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
const indexName = PINECONE_INDEX || "your-index-name";

/**
 * Search documents in Pinecone using a query string, filtered by userId.
 * @param {string} query - The query text to search with.
 * @param {string} userId - The user ID to filter documents by.
 * @param {number} topK - Number of results to return.
 * @returns {Promise<Array>} - Matching documents.
 */
export default async function searchDocuments(query, userId, topK = 5) {
  try {
    if (!query || typeof query !== "string" || !query.trim()) {
      console.log("Search query is empty or invalid:", query);
      return [];
    }

    console.log(`Searching for: "${query}" for user: ${userId}`);
    const queryEmbedding = await generateEmbedding(query);
    const index = pinecone.index(indexName);
    const userIdString = String(userId);

    const queryResults = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
      filter: { userId: userIdString },
    });

    if (!queryResults.matches) {
      console.log("No matches found.");
      return [];
    }

    console.log(`Found ${queryResults.matches.length} matching documents for user ${userIdString}.`);

    const scoreThreshold = 0.5;
    const filteredDocs = queryResults.matches
      .filter(doc => doc.score >= scoreThreshold)
      .sort((a, b) => b.score - a.score);

    filteredDocs.forEach((doc, idx) => {
      console.log(`Filtered Match ${idx + 1}: Score = ${doc.score}`);
      console.log("Metadata:", doc.metadata);
    });

    return filteredDocs;
  } catch (error) {
    console.error("Error searching documents:", error.message);
    throw error;
  }
}
