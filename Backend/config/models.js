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
        id: "z-ai/glm-4.5-air:free",
        name: "GLM 4.5 Air (Free)",
        provider: "openrouter",
        isFree: true,
        description: "Lightweight MoE model by Z.ai with 131K context"
    }
];
