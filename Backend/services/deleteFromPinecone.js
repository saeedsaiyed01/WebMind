// services/deleteFromPinecone.js
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import { PINECONE_API_KEY, PINECONE_INDEX } from "../config.js";
dotenv.config();

const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
// Initialize the index without a separate host value:
const index = pinecone.index(PINECONE_INDEX);

/**
 * Delete a document from Pinecone using its document ID (pineconeId).
 * @param {string} documentId - The unique ID of the document to delete.
 */
export async function deleteDocumentFromPinecone(documentId) {
  try {
    // Use the new deletion method (deleteOne) if supported:
    await index.deleteOne(documentId);
    console.log(`Document ${documentId} deleted successfully from Pinecone.`);
  } catch (error) {
    console.error("Error deleting document from Pinecone:", error);
    throw error;
  }
}
