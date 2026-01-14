// services/queryPinecone.js
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import { PINECONE_API_KEY, PINECONE_INDEX } from "../config.js";
import generateEmbedding from "./generateEmbeddings.js";
dotenv.config();

const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
const indexName = PINECONE_INDEX || "your-index-name";

/**
 * Search documents in Pinecone using a query string, filtered by userId.
 * @param {string} query - The search query
 * @param {string} userId - User ID to filter by
 * @param {number} topK - Number of results to return
 * @param {string[]} pineconeIdFilter - Optional array of pinecone IDs to limit search scope
 */
export default async function searchDocuments(query, userId, topK = 5, pineconeIdFilter = []) {
  try {
    if (!query || typeof query !== "string" || !query.trim()) {
      return [];
    }

    const index = pinecone.index(indexName);
    const userIdString = String(userId);

    // If specific documents are attached, fetch them directly by ID
    if (pineconeIdFilter.length > 0) {
      console.log(`Focused search: fetching ${pineconeIdFilter.length} specific document(s)`);

      try {
        // Fetch vectors directly by their IDs
        const fetchResult = await index.fetch(pineconeIdFilter);

        if (!fetchResult.records || Object.keys(fetchResult.records).length === 0) {
          console.log("No matching documents found in Pinecone by ID");
          return [];
        }

        // Convert fetched records to the same format as query results
        const fetchedDocs = Object.entries(fetchResult.records).map(([id, record]) => ({
          id,
          score: 1.0, // Direct fetch means perfect match
          metadata: record.metadata
        })).filter(doc => doc.metadata?.userId === userIdString); // Security check

        console.log(`Focused fetch returned ${fetchedDocs.length} document(s)`);
        return fetchedDocs;
      } catch (fetchError) {
        console.error("Error fetching documents by ID:", fetchError.message);
        // Fall back to regular search if fetch fails
      }
    }

    // Regular vector search for all user documents
    const queryEmbedding = await generateEmbedding(query);

    const queryResults = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
      filter: { userId: userIdString },
    });

    if (!queryResults.matches) {
      return [];
    }

    const scoreThreshold = 0.5;
    const filteredDocs = queryResults.matches
      .filter(doc => doc.score >= scoreThreshold)
      .sort((a, b) => b.score - a.score);

    console.log(`Vector search returned ${filteredDocs.length} document(s)`);
    return filteredDocs;
  } catch (error) {
    console.error("Error searching documents:", error.message);
    throw error;
  }
}