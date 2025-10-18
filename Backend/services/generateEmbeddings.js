import { OPENROUTER_API_KEY } from "../config.js";

export async function generateEmbedding(text) {
  try {
    // Debug: Check if API key is loaded
    console.log("OpenRouter API Key loaded:", OPENROUTER_API_KEY ? "YES" : "NO");
    console.log("API Key length:", OPENROUTER_API_KEY?.length || 0);

    const response = await fetch("https://openrouter.ai/api/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/text-embedding-3-small",
        input: text,
      }),
    });

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.data) {
      console.error("Embedding API Error:", data);
      throw new Error("Failed to generate embedding");
    }

    return data.data[0].embedding; // 🟢 Returns the array of numbers
  } catch (error) {
    console.error("Error in generateEmbedding function:", error);
    throw error;
  }
}
