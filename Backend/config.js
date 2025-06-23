// config.js
import dotenv from "dotenv";
dotenv.config();

export const JWT_PASSWORD = process.env.JWT_PASSWORD;
export const MONGO_URI = process.env.MONGO_URI;

export const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
export const PINECONE_INDEX = process.env.PINECONE_INDEX;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Twitter credentials
export const TWITTER_APP_KEY = process.env.TWITTER_APP_KEY;
export const TWITTER_APP_SECRET = process.env.TWITTER_APP_SECRET;
export const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
export const TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET;
