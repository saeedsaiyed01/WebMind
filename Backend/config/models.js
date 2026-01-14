// config/models.js

export const SUPPORTED_MODELS = [
    {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash (Default)",
        provider: "google",
        isFree: true,
        description: "Fast and capable model by Google"
    },
    {
        id: "openai/gpt-oss-120b:free",
        name: "GPT OSS 120B (Free)",
        provider: "openrouter",
        isFree: true,
        description: "Community driven large model"
    },
    {
        id: "openai/gpt-oss-20b:free",
        name: "GPT OSS 20B (Free)",
        provider: "openrouter",
        isFree: true,
        description: "Efficient open model"
    },
    {
        id: "mistralai/devstral-2512:free",
        name: "Mistral Devstral (Free)",
        provider: "openrouter",
        isFree: true,
        description: "Experimental model by Mistral"
    }
];
