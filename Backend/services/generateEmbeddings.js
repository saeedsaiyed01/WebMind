import OpenAI from 'openai';

console.log("Checking OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? `Loaded key starting with ${process.env.OPENAI_API_KEY.substring(0, 10)}...` : "Key NOT LOADED");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates an embedding for the given text using OpenAI.
 * @param {string} textToEmbed The text to embed.
 * @returns {Promise<number[]>} The embedding vector.
 */
export async function generateEmbedding(textToEmbed) {
  const input = textToEmbed.replace(/\n/g, ' ');

  try {
    console.log(`🔍 Generating embedding for text: "${input.substring(0, 50)}..."`);
    
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: input,
      dimensions: 768,
    });

    if (response.data && response.data.length > 0 && response.data[0].embedding) {
      console.log(`✅ Embedding generated successfully (dimension: ${response.data[0].embedding.length})`);
      return response.data[0].embedding;
    } else {
      console.error("OpenAI response was successful but did not contain an embedding.");
      throw new Error("No embedding returned from OpenAI.");
    }

  } catch (error) {
    console.error("Error generating embedding from OpenAI:");
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