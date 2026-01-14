// config.js
import dotenv from "dotenv";
dotenv.config();

export const JWT_PASSWORD = process.env.JWT_PASSWORD;
export const MONGO_URI = process.env.MONGO_URI;

export const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
export const PINECONE_INDEX = process.env.PINECONE_INDEX;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Google OAuth
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:8000/api/v1/auth/google/callback";

// Twitter credentials
export const TWITTER_APP_KEY = process.env.TWITTER_APP_KEY;
export const TWITTER_APP_SECRET = process.env.TWITTER_APP_SECRET;
export const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
export const TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET;
export const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

// Email configuration
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = process.env.EMAIL_PORT || 587;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER;