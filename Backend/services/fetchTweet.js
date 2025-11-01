// services/fetchTweet.js
import { TwitterApi } from 'twitter-api-v2';
import { TWITTER_BEARER_TOKEN } from "../config.js";

// Simple in-memory cache for tweet texts
const tweetCache = {};

/**
 * Extract tweet ID from a tweet URL.
 */
function extractTweetId(tweetUrl) {
  const match = tweetUrl.match(/status\/(\d+)/);
  return match ? match[1] : null;
}

/**
 * Fetch tweet text using Twitter API v2 with Bearer Token.
 * @param {string} tweetUrl - The tweet URL.
 * @returns {Promise<string|null>} - The tweet text or null if not found.
 */
export async function fetchTweetText(tweetUrl) {
  const tweetId = extractTweetId(tweetUrl);
  if (!tweetId) {
    console.log("Could not extract tweet ID from URL:", tweetUrl);
    return null;
  }
  
  // Return cached text if available
  if (tweetCache[tweetId]) {
    console.log("Returning cached tweet text for tweet ID:", tweetId);
    return tweetCache[tweetId];
  }
  
  if (!TWITTER_BEARER_TOKEN || TWITTER_BEARER_TOKEN === 'your_actual_bearer_token_here') {
    console.error("Twitter Bearer Token is not configured properly");
    return null;
  }
  
  try {
    // Use Bearer Token authentication (OAuth 2.0)
    const client = new TwitterApi(TWITTER_BEARER_TOKEN);
    
    console.log("Calling Twitter API for tweet ID:", tweetId);
    const tweet = await client.v2.singleTweet(tweetId, { 
      "tweet.fields": "text,created_at,author_id" 
    });
    
    const tweetText = tweet.data?.text || null;
    
    if (tweetText) {
      tweetCache[tweetId] = tweetText; // Cache the result
      console.log("✅ Tweet fetched successfully for ID:", tweetId);
    } else {
      console.log("No tweet text returned for tweet ID:", tweetId);
    }
    
    return tweetText;
  } catch (error) {
    console.error("❌ Error fetching tweet from Twitter API:", error.message);
    if (error.code === 401) {
      console.error("Auth error: Check your Twitter Bearer Token");
    }
    return null;
  }
}

/**
 * Retry wrapper with exponential backoff for fetching tweet text.
 */
export async function fetchTweetTextWithRetry(tweetUrl, retries = 3, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`Attempt ${attempt} to fetch tweet for URL: ${tweetUrl}`);
    const tweetText = await fetchTweetText(tweetUrl);
    if (tweetText) {
      return tweetText;
    }
    
    if (attempt < retries) {
      console.warn(`Attempt ${attempt} failed. Retrying in ${delay} ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  console.error(`Failed to fetch tweet after ${retries} attempts`);
  return null;
}