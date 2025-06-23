// services/extractPdfText.js
import pdfParse from "pdf-parse";

/**
 * Extract text from a PDF file buffer.
 * @param {Buffer} fileBuffer - The buffer from the uploaded PDF.
 * @returns {Promise<string>} - The extracted text.
 */
export async function extractPdfText(fileBuffer) {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    throw new Error("Failed to extract text from PDF.");
  }
}
